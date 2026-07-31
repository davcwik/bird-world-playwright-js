import { APIRequestContext, APIResponse, test } from '@playwright/test';
import { EnvFileReader } from '../utils/EnvFileReader';


/**
* Interface representing the returned payload from methods below
* Exported so other files can reference the type if needed
*/
export interface ApiResponseData<T = any> {
  statusCode: number;
  responseData: T;
}

    
export class ApiBase {
    
  ///////////////
  // VARIABLES //
  ///////////////
    
  protected request: APIRequestContext;

    
  /////////////////
  // CONSTRUCTOR //
  /////////////////
    
  constructor(request: APIRequestContext) {
    this.request = request;
  }
    
      
  ///////////////
  // FUNCTIONS //
  ///////////////
    
  /**
   * Send REST JSON API requests (GET, POST, PUT, DELETE)
   * Can also be used for requests without any payload
   * Automatically serializes payload to JSON and parses response as JSON
   * @param httpMethod - GET, POST, etc.
   * @param path - endpoint path (do not include domain)
   * @param payload - JSON payload
   * @returns - response data and status code
   */
  public async sendJsonHttpRequest<T = any>(httpMethod: string, path: string, payload?: Record<string, any>): Promise<ApiResponseData<T>> {
    return await test.step(`Send Json request ${httpMethod.toUpperCase()} ${path}`, async () => {
      const requestOptions = payload ? { data: payload } : undefined;
      const response = await this.sendHttpRequestAsType(httpMethod, path, requestOptions);

      return {
        statusCode: response.status(),
        responseData: await response.json(),
      };
    });      
  }  


  /**
   * For legacy Wordpress endpoints (ex. /wp-login.php) that have a Form Data payload (Form-encoded key-value pairs (`application/x-www-form-urlencoded`))
   * Always returns raw text/HTML
   * @param httpMethod - GET, POST, etc.
   * @param path - endpoint path (do not include domain)
   * @param payload - Form Data payload
   * @returns - response data and status code
   */
  public async sendFormDataHttpRequest(httpMethod: string, path: string, payload: Record<string, string>): Promise<ApiResponseData<string>> {
    return await test.step(`Send Form Data request ${httpMethod.toUpperCase()} ${path}`, async () => {
      const response: APIResponse = await this.sendHttpRequestAsType(httpMethod, path, { form: payload });
      return {
        statusCode: response.status(),
        responseData: await response.text(),
      };
    });        
  }


  /**
   * 
   * @param httpMethod - GET, POST, etc.
   * @param endpointURL - full url including domain (https://example.com/login)
   * @param requestOptions - Optional Playwright request configuration object. Can contain:
   *  - `data`: JSON body payload for REST endpoints
   *  - `form`: Form Data payload (Form-encoded key-value pairs (`application/x-www-form-urlencoded`))
   *  - `headers`: Custom HTTP headers (e.g., authorization tokens)
   *  - `params`: URL query string parameters
   *  - `timeout`: Request timeout in milliseconds
   * @returns - Promise resolving to Playwright's raw APIResponse object
   */
  async sendHttpRequestAsType(httpMethod: string, endpointURL:string, requestOptions?: Record<string, any>): Promise<APIResponse> {
    switch (httpMethod.toUpperCase()) {
      case 'GET':
        return await this.request.get(endpointURL, requestOptions);
      case 'POST':
        return await this.request.post(endpointURL, requestOptions);
      case 'PUT':
        return await this.request.put(endpointURL, requestOptions);
      case 'DELETE':
        return await this.request.delete(endpointURL, requestOptions);
      default:
        throw new Error(`Unknown request type: ${httpMethod}`);
    }
  }

  
  /**
   * constructs the full endpoint url for the provided path using BASE_URL from the environment file
   * @param path - the path without the base URL (ex. /wp-json/wp/v2/posts)
   * @return - the full url (BASE_URL + path)
  */
  public constructEndpointURL(path: string) {
    return EnvFileReader.getProperty("BASE_URL") + path;
  }
    
    
}