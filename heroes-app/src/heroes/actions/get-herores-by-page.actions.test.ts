import { describe, expect, test, beforeEach, afterEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import type { HeroresResponse } from '../types/get-heroes.response';
import type { Hero } from '../types/hero.interface';
import { heroApi } from '../api/hero.api';
import { getHeroesByPageAction } from './get-herores-by-page.actions';

const BASE_URL = import.meta.env.VITE_API_URL;
const FULL_URL = `${BASE_URL}/api/heroes/`;

const mockHero: Hero = {
    id: '1',
    name: 'Superman',
    slug: 'superman',
    alias: 'Man of Steel',
    powers: ['flight', 'super strength'],
    description: 'Kryptonian hero',
    strength: 100,
    intelligence: 90,
    speed: 100,
    durability: 100,
    team: 'Justice League',
    image: 'heroes/superman.jpg',
    firstAppearance: '1938',
    status: 'active',
    category: 'hero',
    universe: 'DC',
};

const buildMockResponse = (overrides: Partial<HeroresResponse> = {}): HeroresResponse => ({
    total: 1,
    pages: 1,
    heroes: [mockHero],
    ...overrides,
});

describe('getHeroesByPageAction', () => {
    let mock: MockAdapter;

    beforeEach(() => {
        // Mock the heroApi instance directly (axios.create instances are not intercepted by MockAdapter(axios))
        mock = new MockAdapter(heroApi);
    });

    afterEach(() => {
        mock.restore();
    });

    test('should GET "/" with correct params (page, limit, offset, category)', async () => {
        mock.onGet(FULL_URL).reply((config) => {
            expect(config.params).toEqual({
                limit: 6,
                page: 2,
                offset: 6, // (2 - 1) * 6
                category: 'hero',
            });
            return [200, buildMockResponse()];
        });

        await getHeroesByPageAction(2, 6, 'hero');

        expect(mock.history.get).toHaveLength(1);
    });

    test('should use default limit=6 and category="all" when not provided', async () => {
        mock.onGet(FULL_URL).reply((config) => {
            expect(config.params).toEqual({
                limit: 6,
                page: 1,
                offset: 0,
                category: 'all',
            });
            return [200, buildMockResponse()];
        });

        await getHeroesByPageAction(1);
    });

    test('should normalize page=NaN to page=1', async () => {
        mock.onGet(FULL_URL).reply((config) => {
            expect(config.params).toEqual({
                limit: 6,
                page: 1,
                offset: 0,
                category: 'all',
            });
            return [200, buildMockResponse()];
        });

        await getHeroesByPageAction(NaN as unknown as number, 6, 'all');
    });

    test('should normalize limit=NaN to limit=1', async () => {
        mock.onGet(FULL_URL).reply((config) => {
            expect(config.params).toEqual({
                limit: 1,
                page: 2,
                offset: 1, // (2 - 1) * 1
                category: 'all',
            });
            return [200, buildMockResponse()];
        });

        await getHeroesByPageAction(2, NaN as unknown as number, 'all');
    });

    test('should prefix each hero image with the VITE_API_URL', async () => {
        mock.onGet(FULL_URL).reply(200, buildMockResponse());

        const result = await getHeroesByPageAction(1);

        expect(result.heroes).toHaveLength(1);
        expect(result.heroes[0].image).toBe(`${BASE_URL}/images/${mockHero.image}`);
    });

    test('should preserve total and pages from the API response', async () => {
        mock.onGet(FULL_URL).reply(200, buildMockResponse({ total: 42, pages: 7 }));

        const result = await getHeroesByPageAction(1);

        expect(result.total).toBe(42);
        expect(result.pages).toBe(7);
    });

    test('should return an empty heroes array when API returns none', async () => {
        mock.onGet(FULL_URL).reply(200, buildMockResponse({ heroes: [] }));

        const result = await getHeroesByPageAction(1);

        expect(result.heroes).toEqual([]);
        expect(result.total).toBe(1);
        expect(result.pages).toBe(1);
    });
});
