export class EnvFileReader {

/**
   * Retrieves an environment variable. 
   * If the key exists, returns the value. 
   * If the key does not exist, returns the key itself as a fallback
   */
  static getProperty(key: string): string {
    return process.env[key] ?? key;
  }


}