import json
import os
import sys
from pathlib import Path
from dotenv import load_dotenv
import psycopg2
from psycopg2.extras import execute_values
from datetime import datetime, timezone


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
load_dotenv(dotenv_path=env_path, override=True)
print(f"Successfully loaded environment configuration from: {env_filename}")


############################
## DATABASE CONFIGURATION ##
############################

DB_CONFIG = {
    "dbname": os.getenv("DB_NAME"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "host": os.getenv("DB_HOST"),
    "port": os.getenv("DB_PORT"),
}

# verify keys are populated from the env file
required_keys = ["dbname", "user", "password", "host", "port"]
missing_keys = [key for key in required_keys if not DB_CONFIG[key]]

if missing_keys:
    print(
        f"ERROR: Missing database variables in {env_filename}: "
        f"{', '.join(missing_keys)}"
    )
    sys.exit(1)


def parse_and_save_playwright_results():

    #############################################
    ## EXTRACT TEST RUN DATA FROM RESULTS JSON ##
    #############################################

    # initialize variables with default values for a "no tests run" scenario
    total_tests = 0
    passed_tests = 0
    failed_tests = 0
    execution_time_ms = 0
    overall_result = "NO TESTS RUN"
    started_at_utc = datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S') # Fallback to current utc time if file is empty

    json_file_path = "results.json"

    if not os.path.exists(json_file_path):
        print(f"ERROR: Expected test results file not found at '{json_file_path}'.")
        sys.exit(1)

    json_data = []
    if os.path.exists(json_file_path) and os.path.getsize(json_file_path) > 0:
        with open(json_file_path, 'r') as file:
            try:
                json_data = json.load(file)
            except json.JSONDecodeError:
                print("ERROR: Failed to parse results.json file. File might be corrupted or empty.")
                sys.exit(1)        

    json_results = json_data.get("stats", {})


    # extract start time
    # if json_results is empty, we skip parsing and keep our default "NO TESTS RUN" values
    # otherwise extract the start timestamp
    if not json_results:
        print(f"Notice: No results discovered in {json_file_path}. Processing as an empty run.")
    else:
        try:
            raw_timestamp = json_results.get("startTime") # ex. "2026-06-12T18:25:00.123Z"
            utc_dt = datetime.fromisoformat(raw_timestamp.replace("Z", "+00:00")) # Convert to format (YYYY-MM-DD HH:MM:SS), replace 'Z' with UTC offset
            started_at_utc = utc_dt.strftime('%Y-%m-%d %H:%M:%S')
            print(f"Test run start time is {started_at_utc} UTC")
        except (IndexError, KeyError) as e:
            print(f"Error parsing timestamp from results.json file: {e}")
            raise # Fallback or exit if the JSON is empty/malformed


    # extract tests statuses
    passed_tests = json_results.get("expected")
    failed_tests = json_results.get("unexpected")
    total_tests = passed_tests + failed_tests
    if total_tests == 0:
        overall_result = "NO TESTS RUN"
    elif failed_tests > 0:
        overall_result = "FAILED"
    else:
        overall_result = "PASSED"

    # extract execution time
    if "duration" in json_results:
        execution_time_ms = int(json_results.get("duration", 0))
    else:
        execution_time_ms = None


    ########################################
    ## EXTRACT DATA FROM OS ENV VARIABLES ##
    ########################################

    environment = os.getenv("ENV")
    browser = os.getenv("BROWSER")
    github_workflow_name = os.getenv("GITHUB_WORKFLOW_NAME")
    github_build_number = os.getenv("GITHUB_RUN_NUMBER")
    playwright_tags = os.getenv("TEST_RUN_TAGS")

    print(f"Environment: {environment}")
    print(f"Browser: {browser}")
    print(f"Github Job Name : {github_workflow_name}")
    print(f"Github Build Number: {github_build_number}")
    print(f"Playwright Tags: {playwright_tags}")


    ######################
    ## SAVE TO DATABASE ##
    ######################
    try:
        connection = psycopg2.connect(**DB_CONFIG)
        cursor = connection.cursor()

        ##########################
        ### SAVE TEST RUN DATA ###
        ##########################

        test_run_query = """
            INSERT INTO test_runs (
                browser, environment, github_workflow_name, github_build_number, playwright_tags,
                total_tests, passed_tests, failed_tests, overall_result, started_at_utc, execution_time_ms
            ) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) 
            RETURNING id;
        """

        test_run_data = (
            browser, environment, github_workflow_name, github_build_number, playwright_tags,
            total_tests, passed_tests, failed_tests, overall_result,
            started_at_utc, execution_time_ms
        )

        test_run_id = None

        try:
            cursor.execute(test_run_query, test_run_data)
            test_run_id = cursor.fetchone()[0] # save for later
            connection.commit()
        except Exception as e:
            connection.rollback()
            print(f"An error occurred while saving test run data to database: {e}")

        if test_run_id:
            # Continue saving child test results linked to this test_run_id
            print(f"Successfully saved Test Run data to database (ID: {test_run_id}). Proceeding with saving of Test Case results and Failed Step data...")
        else:
            print("Skipping scenario insertion because test_run_id was not generated.")



        #########################################################
        ### SAVE TEST CASE RESULTS and TEST STEP RESULTS DATA ###
        #########################################################

        json_suites = json_data.get("suites", [])
        
        for suite in json_suites:
            process_suite(cursor, suite, test_run_id, connection)

        connection.commit()
        print("All test execution data successfully logged to database.")

    except Exception as e:
        if 'conn' in locals() and connection:
            connection.rollback()
        print(f"Database insertion failed: {e}")
        sys.exit(1)
    finally:
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'conn' in locals() and connection:
            connection.close()


def process_suite(cursor, suite, test_run_id, connection, spec_file=None):

    # Playwright root suite has file path in location/title
    current_spec_file = suite.get("file") or spec_file

    # Loop thru suite and save each spec (aka test case) test result
    for spec in suite.get("specs", []):
        suite_name = suite.get("title") or current_spec_file or spec_file or "Suite Name Not Found" # ex. desktop/login.spec.ts
        test_name = spec.get("title", "") # ex. Login Success and Logout happy path (user email) @priority-critical
        tags_list = spec.get("tags", [])
        tags_str = ",".join(tags_list) if tags_list else None # ex. "@platform-desktop,@feature-login,@priority-critical"

        for test in spec.get("tests", []):
            results = test.get("results", [])
            if not results:
                continue
            
            # Use the latest execution result (handles retries)
            last_result = results[-1]
            status = last_result.get("status", "unknown").upper()
            duration_sec = int(last_result.get("duration", 0) / 1000)

            # Insert into test_results
            test_case_query = """
                INSERT INTO test_results (
                    test_run_id, suite_name, test_name, status, duration_seconds, tags
                ) 
                VALUES (%s, %s, %s, %s, %s, %s) 
                RETURNING id;
            """

            test_case_data = (test_run_id, suite_name, test_name, status, duration_sec, tags_str)

            test_result_id = None

            try:
                cursor.execute(test_case_query, test_case_data)
                test_result_id = cursor.fetchone()[0] # save for later
            except Exception as e:
                connection.rollback()
                print(f"An error occurred while saving test result for test case '{test_name}': {e}")
                continue # skip step processing if inserting the test case failed
            

            # Parse steps (including user test.step blocks inside Page Objects)
            raw_steps = last_result.get("steps", [])
            parse_and_insert_failed_steps(cursor, test_result_id, raw_steps)

    # Recurse through nested suites (e.g. test.describe blocks)s
    for child_suite in suite.get("suites", []):
        process_suite(cursor, child_suite, test_run_id, connection, current_spec_file)


def extract_failed_steps(steps, test_result_id):

    failed_records = []

    for step in steps:

        # only save if the step has an error (aka has failed)
        error_obj = step.get("error")
        if error_obj:
            step_name = step.get("title", "Step Name not found")
            step_status = "FAILED"
            
            if isinstance(error_obj, dict):
                error_msg = error_obj.get("message") or str(error_obj)
            else:
                error_msg = str(error_obj)

            # Check 'attachments' array for screenshots
            screenshot_path = None
            for attachment in step.get("attachments", []):
                if "screenshot" in attachment.get("name", "").lower():
                    screenshot_path = attachment.get("path")

            failed_records.append((
                test_result_id,
                step_name,
                step_status,
                error_msg,
                screenshot_path
            ))

        # Recurse into nested child steps
        if step.get("steps"):
            failed_records.extend(extract_failed_steps(step["steps"], test_result_id))

    return failed_records


def parse_and_insert_failed_steps(cursor, test_result_id, raw_steps, last_result_error=None):

    # get failed step records
    failed_step_records = extract_failed_steps(raw_steps, test_result_id)

    # Fallback if test failed overall but no specific step node was flagged with an error
    if not failed_step_records and last_result_error:
        if isinstance(last_result_error, dict):
            fallback_msg = last_result_error.get("message") or str(last_result_error)
        else:
            fallback_msg = str(last_result_error)

        failed_step_records.append((
            test_result_id,
            "Step Name not found",
            "FAILED",
            fallback_msg,
            "Screenshot Path not found"
        ))

    # if failed records exist then save to db
    if failed_step_records:
        failed_steps_query = """
            INSERT INTO test_step_results (
                test_result_id, step_name, step_status, error_message, screenshot_path
            ) 
            VALUES %s;
        """

        try:
            execute_values(cursor, failed_steps_query, failed_step_records)
            print(f"  └─ Inserted {len(failed_step_records)} failed step(s) for test_result_id: {test_result_id}")
        except Exception as e:
            cursor.connection.rollback()
            print(f"  └─ ❌ Failed to insert step results for test_result_id {test_result_id}: {e}")


def main():
    parse_and_save_playwright_results()


if __name__ == "__main__":
    main()