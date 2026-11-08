import { API_URL, PAGE_SIZE } from "../config/constants";
import type { PokemonListResponse } from "../types/types";

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

  getPokemonList(
    offset = 0,
    limit = PAGE_SIZE,
  ): Promise<PokemonListResponse> {
    const url = new URL('pokemon', this.baseUrl);
    url.searchParams.set('offset', String(offset));
    url.searchParams.set('limit', String(limit));

    return this.request<PokemonListResponse>(url.toString());
  }
}

export const api = new Api({
  baseUrl: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});
