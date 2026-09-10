
import { describe, expect, test } from 'vitest';
import { heroApi } from './hero.api';

describe('HeroApi', () => {
    test('should be configured as an axios instance', () => {
        expect(heroApi).toBeDefined();
        expect(heroApi.defaults).toBeDefined();
        expect(heroApi.interceptors).toBeDefined();
        expect(heroApi.interceptors.request).toBeDefined();
        expect(heroApi.interceptors.response).toBeDefined();

        expect(typeof heroApi.get).toBe('function');
        expect(typeof heroApi.post).toBe('function');
        expect(typeof heroApi.put).toBe('function');
        expect(typeof heroApi.delete).toBe('function');
        expect(typeof heroApi.patch).toBe('function');
    });

    test('should have a baseURL that ends with /api/heroes', () => {
        expect(heroApi.defaults.baseURL).toMatch(/\/api\/heroes$/);
    });

    test('should build baseURL from the VITE_API_URL environment variable', () => {
        const apiUrl = import.meta.env.VITE_API_URL;

        // sanity check: env var must be defined, otherwise baseURL would be "undefined/api/heroes"
        expect(apiUrl).toBeTruthy();

        expect(heroApi.defaults.baseURL).toBe(`${apiUrl}/api/heroes`);
    });
});