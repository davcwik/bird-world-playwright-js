import { test, expect } from '../../utils/PageFixtures';



test.describe('API - Login', { tag: ['@platform-api', '@feature-login'] }, () => {

  test('Posts API returns correct response code @priority-critical', async ({ apiBase }) => {

    const response = await apiBase.sendHttpRequestNoPayload("GET", "/wp-json/wp/v2/posts");
    expect(response.statusCode).toBe(200);

  }); // end test



});