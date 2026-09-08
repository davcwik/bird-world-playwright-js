import { test, expect } from '../../utils/PageFixtures';



test.describe('API - Login', { tag: ['@platform-api', '@feature-login'] }, () => {

  test('Login API returns correct response for Subscriber successful login @priority-critical', async ({ apiBase }) => {
 
    // test data
    const payload = {
      log: process.env.SUBSCRIBER_USER_EMAIL!, // the ! is used to tell TypeScript that this value will not be null or undefined
      pwd: process.env.SUBSCRIBER_USER_PASSWORD!,
      "wp-submit": "Log In",
      testcookie: "1",
      redirect_to: "/wp-admin/profile.php",
    }

    // Sets the wordpress_test_cookie in the shared apiBase session, without it the login will fail
    await apiBase.sendHttpRequestAsType("GET", "/wp-login.php");

    // Execute POST with maxRedirects: 0
    const response = await apiBase.sendFormDataHttpRequest(
      "POST", 
      "/wp-login.php", 
      payload, 
      { maxRedirects: 0 } // Custom flag to stop at 302, without it response will follow the redirect and return 200 OK instead of 302
    );

    expect(response.statusCode, "Status code is 302").toBe(302);
    expect(response.headers['set-cookie'], "The 'wordpress_logged_in_' cookie is present in the Cookie Header").toContain("wordpress_logged_in_");
    expect(response.headers['location'], "The response has the value '/wp-admin/profile.php' present in the Location Header").toContain("/wp-admin/profile.php");

  }); // end test


    test('Login API returns correct response for Subscriber unsuccessful login invalid password @priority-critical', async ({ apiBase }) => {
 
    // test data
    const payload = {
      log: process.env.SUBSCRIBER_USER_EMAIL!, // the ! is used to tell TypeScript that this value will not be null or undefined
      pwd: "InVaLidPw",
      "wp-submit": "Log In",
      testcookie: "1",
      redirect_to: "/wp-admin/profile.php",
    }

    // Sets the wordpress_test_cookie in the shared apiBase session
    await apiBase.sendHttpRequestAsType("GET", "/wp-login.php");

    const response = await apiBase.sendFormDataHttpRequest("POST", "/wp-login.php", payload);

    expect(response.statusCode, "Status code is 200").toBe(200);
    expect(response.headers['set-cookie'], "The 'wordpress_logged_in_' cookie is not present in the Cookie Header").not.toContain("wordpress_logged_in_");
    expect(response.responseData, "The response body contains the text 'id=\"login_error\"'").toContain('id="login_error"');

  }); // end test

    test('Login API returns correct response for Subscriber unsuccessful login invalid username @priority-critical', async ({ apiBase }) => {
 
    // test data
    const payload = {
      log: "InVaLiDUsEr", // the ! is used to tell TypeScript that this value will not be null or undefined
      pwd: process.env.SUBSCRIBER_USER_PASSWORD!,
      "wp-submit": "Log In",
      testcookie: "1",
      redirect_to: "/wp-admin/profile.php",
    }

    // Sets the wordpress_test_cookie in the shared apiBase session
    await apiBase.sendHttpRequestAsType("GET", "/wp-login.php");

    const response = await apiBase.sendFormDataHttpRequest("POST", "/wp-login.php", payload);

    expect(response.statusCode, "Status code is 200").toBe(200);
    expect(response.headers['set-cookie'], "The 'wordpress_logged_in_' cookie is not present in the Cookie Header").not.toContain("wordpress_logged_in_");
    expect(response.responseData, "The response body contains the text 'id=\"login_error\"'").toContain('id="login_error"');
    expect(response.responseData, "The response body contains the text 'Incorrect Username or Password'").toContain('Incorrect Username or Password');

    
  }); // end test


});