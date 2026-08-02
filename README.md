Local Runner Requirements: To execute these tests, ensure Node.js and Playwright browsers are installed locally, as the ephemeral runner uses the host machine's environment.

Although the python script for parse and save to db will only run for test runs launched from Github Actions, it is recommended that you install a python venv locally on your laptop in the project's root directory and activate it anytime you are working with a python script in the IDE. This will prevent error notifications (red squiggle underlines) in your python script files.

1. Navigate to project root directory
2. (first time only) Create a virtual environment: python3 -m venv .venv
3. To activate: source .venv/bin/activate
4. To deactivate: deactivate

If you are not working with any python script files in the IDE, no need to activate it.
