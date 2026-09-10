import { describe, expect, test, beforeEach, afterEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import type { Hero } from '../types/hero.interface';
import { heroApi } from '../api/hero.api';
import { getHeroAction } from './get-hero.action';

const BASE_URL = import.meta.env.VITE_API_URL;
const FULL_URL = `${BASE_URL}/api/heroes`;

const mockHero: Hero = {
    id: '1',
    name: 'Batman',
    slug: 'batman',
    alias: 'The Dark Knight',
    powers: ['martial arts', 'detective'],
    description: 'A superhero from Gotham',
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
};

describe('getHeroAction', () => {
    let mock: MockAdapter;

    beforeEach(() => {
        // Mock the heroApi instance directly (axios.create instances are not intercepted by MockAdapter(axios))
        mock = new MockAdapter(heroApi);
    });

    afterEach(() => {
        mock.restore();
    });

    test('should GET the hero by slug from the correct URL', async () => {
        mock.onGet(`${FULL_URL}/batman`).reply(200, mockHero);

        await getHeroAction('batman');

        expect(mock.history.get).toHaveLength(1);
        expect(mock.history.get[0].url).toBe('batman');
    });

    test('should return the hero data with the image URL prefixed by VITE_API_URL', async () => {
        mock.onGet(`${FULL_URL}/batman`).reply(200, mockHero);

        const hero = await getHeroAction('batman');

        expect(hero.image).toBe(`${BASE_URL}/images/${mockHero.image}`);
    });

    test('should preserve all hero properties except for the image transformation', async () => {
        mock.onGet(`${FULL_URL}/batman`).reply(200, mockHero);

        const hero = await getHeroAction('batman');

        expect(hero.id).toBe(mockHero.id);
        expect(hero.name).toBe(mockHero.name);
        expect(hero.slug).toBe(mockHero.slug);
        expect(hero.powers).toEqual(mockHero.powers);
        expect(hero.team).toBe(mockHero.team);
    });

    test('should propagate errors thrown by the server', async () => {
        mock.onGet(`${FULL_URL}/batman`).reply(500, { message: 'Server error' });

        await expect(getHeroAction('batman')).rejects.toThrow();
    });
});
