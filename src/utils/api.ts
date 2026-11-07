import { API_URL } from "../config/constants";

export interface IApiOptions {
  baseUrl: string;
  headers: {
        "Content-Type": string;
    };
}

export class Api {
  private baseUrl: string;
  private headers: {
        "Content-Type": string;
    };

  constructor(options: IApiOptions) {
    this.baseUrl = options.baseUrl;
    this.headers = options.headers;
  }

  private async request<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      return await response.json() as T;
    }

    return null as T;
  }
}

export const api = new Api({
  baseUrl: API_URL,
  headers: {
        "Content-Type": "application/json"
    }
});
