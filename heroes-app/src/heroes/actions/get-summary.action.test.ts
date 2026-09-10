import { describe, expect, test, beforeEach, afterEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import type { SummaryResponse } from '../types/get-summary.response';
import type { Hero } from '../types/hero.interface';
import { heroApi } from '../api/hero.api';
import { getSummaryAction } from './get-summary.action';

const BASE_URL = import.meta.env.VITE_API_URL;
const FULL_URL = `${BASE_URL}/api/heroes/summary`;

const mockHero: Hero = {
    id: '1',
    name: 'Hulk',
    slug: 'hulk',
    alias: 'The Incredible Hulk',
    powers: ['super strength'],
    description: 'Gamma-powered hero',
    strength: 100,
    intelligence: 60,
    speed: 50,
    durability: 100,
    team: 'Avengers',
    image: 'heroes/hulk.jpg',
    firstAppearance: '1962',
    status: 'active',
    category: 'hero',
    universe: 'Marvel',
};

const mockSummary: SummaryResponse = {
    totalHeroes: 50,
    strongestHero: mockHero,
    smartestHero: mockHero,
    heroCount: 30,
    villainCount: 20,
};

describe('getSummaryAction', () => {
    let mock: MockAdapter;

    beforeEach(() => {
        // Mock the heroApi instance directly (axios.create instances are not intercepted by MockAdapter(axios))
        mock = new MockAdapter(heroApi);
    });

    afterEach(() => {
        mock.restore();
    });

    test('should GET "/summary"', async () => {
        mock.onGet(FULL_URL).reply(200, mockSummary);

        await getSummaryAction();

        expect(mock.history.get).toHaveLength(1);
        expect(mock.history.get[0].url).toBe('/summary');
    });

    test('should return the summary data as-is', async () => {
        mock.onGet(FULL_URL).reply(200, mockSummary);

        const summary = await getSummaryAction();

        expect(summary).toEqual(mockSummary);
        expect(summary.totalHeroes).toBe(50);
        expect(summary.strongestHero).toEqual(mockHero);
        expect(summary.smartestHero).toEqual(mockHero);
        expect(summary.heroCount).toBe(30);
        expect(summary.villainCount).toBe(20);
    });

    test('should propagate errors thrown by the server', async () => {
        mock.onGet(FULL_URL).reply(500, { message: 'Internal Server Error' });

        await expect(getSummaryAction()).rejects.toThrow();
    });
});
