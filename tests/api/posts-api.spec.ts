import { test, expect } from '../../utils/PageFixtures';



test.describe('API - Posts', { tag: ['@platform-api', '@feature-login'] }, () => {

  test('GET /posts returns 200 response code @priority-critical', async ({ apiBase }) => {
    const response = await apiBase.sendHttpRequestNoPayload("GET", "/wp-json/wp/v2/posts");
    expect(response.statusCode).toBe(200);
  }); // end test


  test('GET /posts/{id} for valid id returns expected post data and property types @priority-critical', async ({ apiBase }) => {
    const response = await apiBase.sendHttpRequestNoPayload("GET", "/wp-json/wp/v2/posts/1");
    expect(response.statusCode).toBe(200);
    expect(response.responseData).toHaveProperty("id");
    expect(response.responseData.id).toBe(1);
    expect(typeof response.responseData.id).toBe("number");
    expect(Number.isInteger(response.responseData.id)).toBe(true);  
  }); // end test


    test('GET /posts/{id} for invalid id returns expected post data and property types @priority-high', async ({ apiBase }) => {

    const response = await apiBase.sendHttpRequestNoPayload("GET", "/wp-json/wp/v2/posts/2");
    expect(response.statusCode).toBe(404);

    expect(response.responseData).toHaveProperty("code");
    expect(response.responseData.code).toBe("rest_post_invalid_id");
    expect(typeof response.responseData.code).toBe("string");

    expect(response.responseData).toHaveProperty("message");
    expect(response.responseData.message).toBe("Invalid post ID.");
    expect(typeof response.responseData.message).toBe("string");
    
  }); // end test


});