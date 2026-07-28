import { test, expect } from '../../utils/PageFixtures';



test.describe('API - Login', { tag: ['@platform-api', '@feature-login'] }, () => {

  test('POST /wp-login.php for valid credentials returns 200 response code @priority-critical', async ({ apiBase }) => {
 
    // test data
    const loginFormData = {
      log: "subscriber_user_username",
      pwd: "subscriber_user_password",
      "wp-submit": "Log In",
    };

    // send request and verify response
    const response = await apiBase.sendHttpRequestFormData("POST", "/wp-login.php", loginFormData);
    expect([200]).toContain(response.statusCode);

  }); // end test


});