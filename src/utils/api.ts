import { API_URL, PAGE_SIZE } from "../config/constants";
import type { PokemonDetail, PokemonListResponse } from "../types/types";

export interface IApiOptions {
  baseUrl: string;
  headers: {
    "Content-Type": string;
  };
}

export class Api {
  private baseUrl: string;
  readonly headers: {
    "Content-Type": string;
  };

  constructor(options: IApiOptions) {
    this.baseUrl = options.baseUrl;
    this.headers = options.headers;
  }

  private async request<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.headers,
        ...options?.headers,
      },
    });

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

  getPokemonDetail(nameOrUrl: string): Promise<PokemonDetail> {
    const url = nameOrUrl.startsWith('http')
      ? nameOrUrl
      : new URL(
        `pokemon/${encodeURIComponent(nameOrUrl.toLowerCase())}`,
        this.baseUrl,
      ).toString();

    return this.request<PokemonDetail>(url);
  }

  getPokemonByName(name: string): Promise<PokemonDetail> {
    const normalizedName = name.trim().toLowerCase();

    return this.getPokemonDetail(normalizedName);
  }

  async getPokemonDetails(
    offset = 0,
    limit = PAGE_SIZE,
  ): Promise<PokemonDetail[]> {
    const list = await this.getPokemonList(offset, limit);

    return Promise.all(
      list.results.map(({ url }) => this.getPokemonDetail(url)),
    );
  }

  async getPokemonPage(
    offset = 0,
    limit = PAGE_SIZE,
  ): Promise<{ results: PokemonDetail[]; next: string | null }> {
    const list = await this.getPokemonList(offset, limit);
    const results = await Promise.all(
      list.results.map(({ url }) => this.getPokemonDetail(url)),
    );

    return { results, next: list.next };
  }
}

export const api = new Api({
  baseUrl: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});
