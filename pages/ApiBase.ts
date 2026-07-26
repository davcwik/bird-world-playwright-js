import { APIRequestContext, APIResponse } from '@playwright/test';
import { EnvFileReader } from '../utils/EnvFileReader';


/**
* Interface representing the returned payload from methods below
* Exported so other files can reference the type if needed
*/
export interface ApiResponseData {
  statusCode: number;
  responseData: any;
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
  * Sends an HTTP request with NO PAYLOAD
  * @param myRequestType - the endpoint request type (typically GET)
  * @param myPath - the API endpoint path without the base URL (ex. /wp-json/wp/v2/posts)
  * @return - the response status code and response data
  */  
  async sendHttpRequestNoPayload(myRequestType: string, myPath: string): Promise<ApiResponseData> {
    
    // send request and get response
    const myEndpointURL = this.constructEndpointURL(myPath);
    const response = await this.sendHttpRequestAsType(myRequestType, myPath);
    
    // parse response body
    let responseData: any;
    try {
      responseData = await response.json();
    } catch {
      responseData = await response.text();
    }

    // return response data
    return {
      statusCode: response.status(),
      responseData: responseData,
    }

  }

  
  async sendHttpRequestAsType(myRequestType: string, myEndpointURL:string): Promise<APIResponse> {
      switch (myRequestType.toUpperCase()) {
    case 'GET':
      return await this.request.get(myEndpointURL);
      break;
    case 'POST':
      return await this.request.post(myEndpointURL);
      break;
    case 'PUT':
      return await this.request.put(myEndpointURL);
      break;
    case 'DELETE':
      return await this.request.delete(myEndpointURL);
      break;
    default:
      throw new Error(`Unknown request type: ${myRequestType}`);
      }
  }

  /**
  * constructs the full endpoint url for the provided path
  * @param myPath - the path without the base URL (ex. /wp-json/wp/v2/posts)
  * @return - the full url (baseURL + path)
  */
  public constructEndpointURL(myPath: string) {
    return EnvFileReader.getProperty("BASE_URL") + myPath;
  }
    
    
    }