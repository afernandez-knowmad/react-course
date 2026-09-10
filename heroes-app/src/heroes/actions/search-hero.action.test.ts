import { describe, expect, test, beforeEach, afterEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import type { Hero } from '../types/hero.interface';
import { heroApi } from '../api/hero.api';
import { searchHeroesAction } from './search-hero.action';

const BASE_URL = import.meta.env.VITE_API_URL;
const FULL_URL = `${BASE_URL}/api/heroes/search`;

const buildHero = (overrides: Partial<Hero> = {}): Hero => ({
    id: '1',
    name: 'Batman',
    slug: 'batman',
    alias: 'The Dark Knight',
    powers: ['martial arts'],
    description: 'Gotham vigilante',
    strength: 80,
    intelligence: 100,
    speed: 50,
    durability: 85,
    team: 'Justice League',
    image: 'heroes/batman.jpg',
    firstAppearance: '1939',
    status: 'active',
    category: 'hero',
    universe: 'DC',
    ...overrides,
});

describe('searchHeroesAction', () => {
    let mock: MockAdapter;

    beforeEach(() => {
        // Mock the heroApi instance directly (axios.create instances are not intercepted by MockAdapter(axios))
        mock = new MockAdapter(heroApi);
    });

    afterEach(() => {
        mock.restore();
    });

    test('should return an empty array without calling the API when no options are provided', async () => {
        const result = await searchHeroesAction({});

        expect(result).toEqual([]);
        expect(mock.history.get).toHaveLength(0);
    });

    test('should return an empty array when all options are empty strings/undefined', async () => {
        const result = await searchHeroesAction({
            name: '',
            team: '',
            category: '',
            universe: '',
            status: '',
            strength: '',
        });

        expect(result).toEqual([]);
        expect(mock.history.get).toHaveLength(0);
    });

    test('should GET "/search" with the provided name param', async () => {
        mock.onGet(FULL_URL).reply((config) => {
            expect(config.params).toMatchObject({ name: 'batman' });
            return [200, []];
        });

        await searchHeroesAction({ name: 'batman' });

        expect(mock.history.get).toHaveLength(1);
        expect(mock.history.get[0].url).toBe('/search');
    });

    test('should send all provided filters as query params', async () => {
        mock.onGet(FULL_URL).reply((config) => {
            expect(config.params).toEqual({
                name: 'spider',
                team: 'Avengers',
                category: 'hero',
                universe: 'Marvel',
                status: 'active',
                strength: '90',
            });
            return [200, []];
        });

        await searchHeroesAction({
            name: 'spider',
            team: 'Avengers',
            category: 'hero',
            universe: 'Marvel',
            status: 'active',
            strength: '90',
        });
    });

    test('should prefix every hero image with the VITE_API_URL', async () => {
        const heroes = [buildHero({ image: 'heroes/spiderman.jpg' })];
        mock.onGet(FULL_URL).reply(200, heroes);

        const result = await searchHeroesAction({ name: 'spider' });

        expect(result).toHaveLength(1);
        expect(result[0].image).toBe(`${BASE_URL}/images/heroes/spiderman.jpg`);
    });

    test('should preserve every other field on the returned heroes', async () => {
        const hero = buildHero({ name: 'Wonder Woman', universe: 'DC' });
        mock.onGet(FULL_URL).reply(200, [hero]);

        const [result] = await searchHeroesAction({ name: 'wonder' });

        expect(result.id).toBe(hero.id);
        expect(result.name).toBe(hero.name);
        expect(result.universe).toBe(hero.universe);
        expect(result.powers).toEqual(hero.powers);
    });

    test('should propagate errors thrown by the server', async () => {
        mock.onGet(FULL_URL).reply(500, { message: 'Request failed' });

        await expect(searchHeroesAction({ name: 'batman' })).rejects.toThrow();
    });
});
