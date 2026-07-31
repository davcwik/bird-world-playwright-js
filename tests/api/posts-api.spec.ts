import { test, expect } from '../../utils/PageFixtures';



test.describe('API - Posts', { tag: ['@platform-api', '@feature-posts'] }, () => {

  test('GET /posts returns 200 response code @priority-critical', async ({ apiBase }) => {
    const response = await apiBase.sendJsonHttpRequest("GET", "/wp-json/wp/v2/posts");
    expect(response.statusCode, "Status code is 200").toBe(200);
  }); // end test


  test('GET /posts/{id} for valid id returns expected post data and property types @priority-critical', async ({ apiBase }) => {
    const response = await apiBase.sendJsonHttpRequest("GET", "/wp-json/wp/v2/posts/1");
    expect(response.statusCode, "Status code is 200").toBe(200);
    expect(response.responseData, "Response has property: id").toHaveProperty("id");
    expect(response.responseData.id, "Property 'id' has value: 1").toBe(1);
    expect(typeof response.responseData.id, "Property 'id' has type: number").toBe("number");
    expect(Number.isInteger(response.responseData.id), "Property 'id' has 'number' type: Integer").toBe(true);  
  }); // end test


  test('GET /posts/{id} for invalid id returns expected post data and property types @priority-high', async ({ apiBase }) => {

    const response = await apiBase.sendJsonHttpRequest("GET", "/wp-json/wp/v2/posts/2");
    expect(response.statusCode).toBe(404);

    expect(response.responseData, "Response has property: code").toHaveProperty("code");
    expect(response.responseData.code, "Property 'code' has value: rest_post_invalid_id").toBe("rest_post_invalid_id");
    expect(typeof response.responseData.code, "Property 'code' has type: string").toBe("string");

    expect(response.responseData, "Response has property: message").toHaveProperty("message");
    expect(response.responseData.message, "Property 'message' has value: Invalid post ID.").toBe("Invalid post ID.");
    expect(typeof response.responseData.message, "Property 'message' has type: string").toBe("string");

  }); // end test


});