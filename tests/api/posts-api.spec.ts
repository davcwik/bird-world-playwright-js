import { test, expect } from '../../utils/PageFixtures';



test.describe('API - Posts', { tag: ['@platform-api', '@feature-login'] }, () => {

  test('GET /posts returns 200 response code @priority-critical', async ({ apiBase }) => {
    const response = await apiBase.sendHttpRequestNoPayload("GET", "/wp-json/wp/v2/posts");
    expect(response.statusCode).toBe(200);
  });

  test('GET /posts/{id} for valid id returns expected post data and property types @priority-critical', async ({ apiBase }) => {

    const response = await apiBase.sendHttpRequestNoPayload("GET", "/wp-json/wp/v2/posts/1");
    expect(response.statusCode).toBe(200);

    expect(response.responseData).toHaveProperty("id");
    expect(response.responseData.id).toBe(1);
    expect(typeof response.responseData.id).toBe("number");
    expect(Number.isInteger(response.responseData.id)).toBe(true);  

  });  

    test('GET /posts/{id} for invalid id returns expected post data and property types @priority-high', async ({ apiBase }) => {

    const response = await apiBase.sendHttpRequestNoPayload("GET", "/wp-json/wp/v2/posts/2");
    expect(response.statusCode).toBe(404);

    expect(response.responseData).toHaveProperty("code");
    expect(response.responseData.code).toBe("rest_post_invalid_id");
    expect(typeof response.responseData.id).toBe("string");

    expect(response.responseData).toHaveProperty("message");
    expect(response.responseData.code).toBe("Invalid post ID.");
    expect(typeof response.responseData.id).toBe("string");

  }); 


});

  //   When A: I send a request to the following API endpoint path:
  //   | Request Type | Path                   |
  //   | GET          | /wp-json/wp/v2/posts/2 |
  // Then A: The API endpoint returns a 404 status code
  // And A: The JSON response contains the following data:
  //   | Key     | Value                | Type   |
  //   | code    | rest_post_invalid_id | string |
  //   | message | Invalid post ID.     | string |