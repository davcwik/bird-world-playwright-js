import json
import os
import sys
from pathlib import Path
from dotenv import load_dotenv
import psycopg2
from psycopg2.extras import execute_values


#####################################################
## ONLY SAVE TO DB IF LAUNCHED FROM GITHUB ACTIONS ##
#####################################################

# GITHUB_ACTIONS variable only exists in Github Actions and automatically has value "true"
# if running locally on laptop, the variable does not exist so os.getenv("GITHUB_ACTIONS") will return "None"
is_github_run = os.getenv("GITHUB_ACTIONS") == "true"

if not is_github_run:
    print("Notice: Test run was executed locally on laptop. Results will not be saved to database.")
    sys.exit(0) 


###################################
## LOAD ENV FILE FOR CURRENT ENV ##
###################################

current_env = os.getenv("ENV")

# if ENV var is not found ("None") or if value is empty string (""), end script and exit 
if not current_env:
    print("ERROR: Invalid value provided for environment. Unable to load environment file.")
    sys.exit(1)

# construct env file path (ex. .env.production)
env_filename = f".env.{current_env}"
env_path = Path(__file__).parent / env_filename

# verify the file exists
if not env_path.exists():
    print(
        f'ERROR: Environment file not found at expected path: "{env_path}". '
        f'Tip: Verify that the env file decryption step successfully executed and outputted the file to the correct directory.'
    )
    sys.exit(1)

# load environment variables
load_dotenv(dotenv_path=env_path)
print(f"Successfully loaded environment configuration from: {env_filename}")


# ------------------------------------------------------------------
# DATABASE CONFIGURATION
# ------------------------------------------------------------------
DB_CONFIG = {
    "dbname": os.getenv("DB_NAME"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "host": os.getenv("DB_HOST"),
    "port": os.getenv("DB_PORT", "5432"),
}

# 6. Verify all required database keys were populated from the env file
required_keys = ["dbname", "user", "password", "host"]
missing_keys = [key for key in required_keys if not DB_CONFIG[key]]

if missing_keys:
    print(
        f"CRITICAL CONFIG ERROR: Missing database variables in {env_filename}: "
        f"{', '.join(missing_keys)}"
    )
    sys.exit(1)


##################################
## PARSE RESULTS AND SAVE TO DB ##
##################################    

JSON_REPORT_PATH = "results.json"

def parse_and_log_results():
    if not os.path.exists(JSON_REPORT_PATH):
        print(f"Error: {JSON_REPORT_PATH} not found.")
        sys.exit(1)

    with open(JSON_REPORT_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    ###########################
    ### parse test run data ###
    ###########################

    stats = data.get("stats", {})
    environment = os.getenv("TEST_ENV")
    browser = os.getenv("BROWSER")
    ci_build = os.getenv("GITHUB_RUN_NUMBER", "Local Run")

    passed_count = stats.get("expected", 0)
    failed_count = stats.get("unexpected", 0)
    skipped_count = stats.get("skipped", 0)
    total_tests = passed_count + failed_count + skipped_count
    run_status = "PASSED" if failed_count == 0 else "FAILED"

    # Convert start time / duration (Playwright outputs duration in ms)
    duration_seconds = int(stats.get("duration", 0) / 1000)

    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()

        # -------------------------------------------------------------
        # Step A: Insert into test_runs
        # -------------------------------------------------------------
        insert_run_query = """
            INSERT INTO test_runs (
                environment, browser, ci_build_number, total_tests, 
                passed_tests, failed_tests, skipped_tests, status, duration_seconds
            ) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) 
            RETURNING id;
        """
        cursor.execute(
            insert_run_query,
            (
                environment,
                browser,
                ci_build,
                total_tests,
                passed_count,
                failed_count,
                skipped_count,
                run_status,
                duration_seconds,
            ),
        )
        test_run_id = cursor.fetchone()[0]
        print(f"Successfully created test_run record with ID: {test_run_id}")

        # -------------------------------------------------------------
        # Step B: Traverse suites and insert into test_results & test_step_results
        # -------------------------------------------------------------
        suites = data.get("suites", [])
        
        for suite in suites:
            process_suite(cursor, suite, test_run_id)

        conn.commit()
        print("All test execution data successfully logged to PostgreSQL!")

    except Exception as e:
        if 'conn' in locals() and conn:
            conn.rollback()
        print(f"Database insertion failed: {e}")
        sys.exit(1)
    finally:
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'conn' in locals() and conn:
            conn.close()


def process_suite(cursor, suite, test_run_id, spec_file=None):
    """Recursively parses Playwright suites, specs, and nested steps."""
    # Playwright root suite has file path in location/title
    current_file = suite.get("file") or spec_file or suite.get("title", "")

    # Process spec entries in this suite
    for spec in suite.get("specs", []):
        spec_file_name = current_file
        test_name = spec.get("title", "")
        tags_list = spec.get("tags", [])
        tags_str = ",".join(tags_list) if tags_list else None

        for test in spec.get("tests", []):
            results = test.get("results", [])
            if not results:
                continue
            
            # Use the latest execution result (handles retries)
            last_result = results[-1]
            status = last_result.get("status", "unknown").upper()
            duration_sec = int(last_result.get("duration", 0) / 1000)

            # Insert into test_results
            insert_test_query = """
                INSERT INTO test_results (
                    test_run_id, spec_file_name, test_name, status, duration_seconds, tags
                ) 
                VALUES (%s, %s, %s, %s, %s, %s) 
                RETURNING id;
            """
            cursor.execute(
                insert_test_query,
                (test_run_id, spec_file_name, test_name, status, duration_sec, tags_str),
            )
            test_result_id = cursor.fetchone()[0]

            # Parse steps (including user test.step blocks inside Page Objects)
            raw_steps = last_result.get("steps", [])
            parse_and_insert_steps(cursor, test_result_id, raw_steps)

    # Recurse through nested suites (e.g. test.describe blocks)
    for child_suite in suite.get("suites", []):
        process_suite(cursor, child_suite, test_run_id, current_file)


def parse_and_insert_steps(cursor, test_result_id, steps):
    """Parses test.step execution nodes and logs them to test_step_results."""
    step_records = []

    for step in steps:
        category = step.get("category", "")
        # Playwright tags user-defined test.step blocks with category="test.step"
        if category == "test.step":
            step_name = step.get("title", "Unnamed Step")
            step_status = "PASSED" if not step.get("error") else "FAILED"
            
            # Extract error message if the step failed
            error_msg = None
            if step.get("error"):
                error_msg = step["error"].get("message") or str(step["error"])

            # Extract screenshot attachment path if present
            screenshot_path = None
            for snippet in step.get("snippet", []):
                if "screenshot" in snippet.get("title", "").lower():
                    screenshot_path = snippet.get("path")

            step_records.append((
                test_result_id,
                step_name,
                step_status,
                error_msg,
                screenshot_path
            ))

            # Recurse into nested steps inside this step if any exist
            if step.get("steps"):
                parse_and_insert_steps(cursor, test_result_id, step["steps"])

    if step_records:
        insert_steps_query = """
            INSERT INTO test_step_results (
                test_result_id, step_name, step_status, error_message, screenshot_path
            ) 
            VALUES %s;
        """
        execute_values(cursor, insert_steps_query, step_records)


if __name__ == "__main__":
    parse_and_save_playwright_results.py()