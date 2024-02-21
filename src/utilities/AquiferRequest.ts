// Importing node-fetch to use fetch in a Node.js environment
import fetch, { Headers, RequestInit } from 'node-fetch';
import 'dotenv/config';
import { getDecodedKey } from '.';

export type searchParams = {
    query?: string,
    bookCode?: string,
    startChapter?: number,
    endChapter?: number,
    startVerse?: number,
    endVerse?: number,
    languageId?: number,
    languageCode?: string,
    resourceType?: string,
    limit?: number,
    offset?: number,
};

export class Aquifer {
    private baseUrl: string = 'https://api.aquifer.bible';
    private static apiKey: string = getDecodedKey();

    constructor() { }
    private async makeRequest(endpoint: string, params: any = {}, method: string = 'GET'): Promise<any> {
        const url = new URL(`${this.baseUrl}${endpoint}`);
        const headers = new Headers();

        if (method === 'GET') {
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        }

        console.log('url:', url.toString());

        const requestOptions = {
            method,
            headers: { 'api-key': Aquifer.apiKey },
            body: method !== 'GET' ? JSON.stringify(params) : undefined,
        };

        console.log('requestOptions:');
        console.log({ requestOptions });

        try {
            const response = await fetch(url.toString(), requestOptions);
            if (!response.ok) {
                // throw new Error(`HTTP error! status: ${response.status}`);
                return {};
            }
            return await response.json();
        } catch (error) {
            console.error('Request failed:', error);
            // throw error;
            return {};
        }
    }

    public searchResources(params: searchParams): Promise<any> {
        console.log('searchResources params:', params);
        return this.makeRequest('/resources/search', params);
    }

    public getResource(contentId: number): Promise<any> {
        return this.makeRequest(`/resources/${contentId}`);
    }

    public getLanguages(): Promise<any> {
        return this.makeRequest('/languages');
    }

    public getLanguageResourceCounts(bookCode: string, params: {
        startChapter?: number,
        endChapter?: number,
        startVerse?: number,
        endVerse?: number,
    }): Promise<any> {
        return this.makeRequest('/languages/available-resources', { bookCode, ...params });
    }

    public getBibleBooks(): Promise<any> {
        return this.makeRequest('/bible-books');
    }


}