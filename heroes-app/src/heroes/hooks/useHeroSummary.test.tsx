import { describe, expect, test, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, type RenderHookOptions } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import type { PropsWithChildren } from 'react';

import { TanStackCustomProvider } from '../test-utils/tanstack-custom-provider';
import type { Hero } from '../types/hero.interface';
import type { SummaryResponse } from '../types/get-summary.response';
import { heroApi } from '../api/hero.api';
import { useHeroSummary } from './useHeroSummary';

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

/**
 * Each test gets its own TanStackCustomProvider (and therefore its own
 * QueryClient) so cached data never leaks between cases.
 */
const buildWrapper = (): RenderHookOptions<unknown>['wrapper'] => {
    return ({ children }: PropsWithChildren) => (
        <TanStackCustomProvider>{children}</TanStackCustomProvider>
    );
};

describe('useHeroSummary', () => {
    let mock: MockAdapter;

    beforeEach(() => {
        // Mock the heroApi instance directly (axios.create instances are
        // not intercepted by MockAdapter(axios)).
        mock = new MockAdapter(heroApi);
    });

    afterEach(() => {
        mock.restore();
    });

    test('should start in loading state with no data', () => {
        mock.onGet(FULL_URL).reply(200, mockSummary);

        const { result } = renderHook(() => useHeroSummary(), {
            wrapper: buildWrapper(),
        });

        expect(result.current.isLoading).toBe(true);
        expect(result.current.isFetching).toBe(true);
        expect(result.current.data).toBeUndefined();
        expect(result.current.isError).toBe(false);
    });

    test('should fetch summary data and resolve successfully', async () => {
        mock.onGet(FULL_URL).reply(200, mockSummary);

        const { result } = renderHook(() => useHeroSummary(), {
            wrapper: buildWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.data).toEqual(mockSummary);
        expect(result.current.data?.totalHeroes).toBe(50);
        expect(result.current.data?.heroCount).toBe(30);
        expect(result.current.data?.villainCount).toBe(20);
        expect(result.current.data?.strongestHero).toEqual(mockHero);
        expect(result.current.data?.smartestHero).toEqual(mockHero);
    });

    test('should call GET /summary exactly once', async () => {
        mock.onGet(FULL_URL).reply(200, mockSummary);

        const { result } = renderHook(() => useHeroSummary(), {
            wrapper: buildWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(mock.history.get).toHaveLength(1);
        expect(mock.history.get[0].url).toBe('/summary');
    });

    test('should expose the error state when the request fails', async () => {
        mock.onGet(FULL_URL).reply(500, { message: 'Internal Server Error' });

        const { result } = renderHook(() => useHeroSummary(), {
            wrapper: buildWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.isSuccess).toBe(false);
        expect(result.current.data).toBeUndefined();
        expect(result.current.error).toBeDefined();
    });
});
