import { EnvFileReader } from '../../utils/EnvFileReader';
import { test, expect } from '../../utils/PageFixtures';



test.describe('API - Posts', { tag: ['@platform-api', '@feature-posts'] }, () => {

  test('GET All Posts returns correct response code @priority-critical', async ({ apiBase }) => {
    const response = await apiBase.sendJsonHttpRequest("GET", "/wp-json/wp/v2/posts");
    expect(response.statusCode, "Status code is 200").toBe(200);
  }); // end test


  test('GET Post by Valid Id returns expected response data @priority-critical', async ({ apiBase }) => {
    const response = await apiBase.sendJsonHttpRequest("GET", "/wp-json/wp/v2/posts/1");
    expect(response.statusCode, "Status code is 200").toBe(200);

    expect(response.responseData.id, "Property 'id' has value: 1").toBe(1);
    expect(typeof response.responseData.id, "Property 'id' has type: number").toBe("number");
    expect(Number.isInteger(response.responseData.id), "Property 'id' has 'number' type: Integer").toBe(true);  

    expect(response.responseData.title.rendered, "Property 'title.rendered' has value: Hello world!").toBe("Hello world!");
    expect(typeof response.responseData.title.rendered, "Property 'title.rendered' has type: string").toBe("string");

  }); // end test


  test('GET Post by Invalid Id returns expected response data @priority-high', async ({ apiBase }) => {

    const response = await apiBase.sendJsonHttpRequest("GET", "/wp-json/wp/v2/posts/2");
    expect(response.statusCode).toBe(404);

    expect(response.responseData.code, "Property 'code' has value: rest_post_invalid_id").toBe("rest_post_invalid_id");
    expect(typeof response.responseData.code, "Property 'code' has type: string").toBe("string");

    expect(response.responseData.message, "Property 'message' has value: Invalid post ID.").toBe("Invalid post ID.");
    expect(typeof response.responseData.message, "Property 'message' has type: string").toBe("string");

  }); // end test


  test('POST Publish Blog post returns 201 @priority-critical @dave', async ({ apiBase, request }) => {

    const endpoint = '/wp-json/wp/v2/posts';
    const payload = {
      title: 'Cucumber Test Post',
      content: 'This is a Cucumber test post.',
      status: 'publish',
    };

    // 1. Generate the standard HTTP Basic Auth token
    const username = EnvFileReader.getProperty('ADMIN_USER_NAME');
    const password = EnvFileReader.getProperty('ADMIN_USER_APP_PASSWORD');
    const auth = Buffer.from(`${username}:${password}`).toString('base64');

    // 2. Pass the token directly into the allowed 'headers' property
    const response = await request.post(endpoint, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      data: payload,
    });

    if (response.status() !== 201) {
      console.error(`Test failed with status ${response.status()}. Server response:`, await response.text());
    }

    expect(response.status()).toBe(201);

    const responseBody = await response.json();
    expect(responseBody.title.rendered).toBe('Cucumber Test Post');

  }); // end test


});