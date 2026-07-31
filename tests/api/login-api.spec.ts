import { test, expect } from '../../utils/PageFixtures';



test.describe('API - Login', { tag: ['@platform-api', '@feature-login'] }, () => {

  test('POST /wp-login.php for valid credentials returns 200 response code @priority-critical', async ({ apiBase }) => {
 
    // test data
    const payload = {
      log: "subscriber_user_username",
      pwd: "subscriber_user_password",
      "wp-submit": "Log In",
    };

    // send request and verify response
    const response = await apiBase.sendFormDataHttpRequest("POST", "/wp-login.php", payload);
    expect(response.statusCode, "Status code is 200").toBe(200);

  }); // end test


});