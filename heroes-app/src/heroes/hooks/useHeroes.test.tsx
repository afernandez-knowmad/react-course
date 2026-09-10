import { describe, expect, test, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, type RenderHookOptions } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import type { PropsWithChildren } from 'react';

import { TanStackCustomProvider } from '../test-utils/tanstack-custom-provider';
import type { Hero } from '../types/hero.interface';
import type { HeroresResponse } from '../types/get-heroes.response';
import { heroApi } from '../api/hero.api';
import { useHeroes } from './useHeroes';

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

/**
 * Each test gets its own TanStackCustomProvider (and therefore its own
 * QueryClient) so cached data never leaks between cases.
 */
const buildWrapper = (): RenderHookOptions<unknown>['wrapper'] => {
    return ({ children }: PropsWithChildren) => (
        <TanStackCustomProvider>{children}</TanStackCustomProvider>
    );
};

describe('useHeroes', () => {
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
        mock.onGet(FULL_URL).reply(200, buildMockResponse());

        const { result } = renderHook(() => useHeroes(1, 6, 'all'), {
            wrapper: buildWrapper(),
        });

        expect(result.current.isLoading).toBe(true);
        expect(result.current.isFetching).toBe(true);
        expect(result.current.data).toBeUndefined();
        expect(result.current.isError).toBe(false);
    });

    test('should fetch heroes for page 1 with default limit=6 and category="all"', async () => {
        mock.onGet(FULL_URL).reply((config) => {
            expect(config.params).toEqual({
                limit: 6,
                page: 1,
                offset: 0,
                category: 'all',
            });
            return [200, buildMockResponse()];
        });

        const { result } = renderHook(() => useHeroes(1, 6), {
            wrapper: buildWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.data?.total).toBe(1);
        expect(result.current.data?.pages).toBe(1);
        expect(result.current.data?.heroes).toHaveLength(1);
    });

    test('should pass the correct pagination params to the API', async () => {
        mock.onGet(FULL_URL).reply((config) => {
            expect(config.params).toEqual({
                limit: 10,
                page: 2,
                offset: 10, // (2 - 1) * 10
                category: 'villain',
            });
            return [200, buildMockResponse()];
        });

        const { result } = renderHook(() => useHeroes(2, 10, 'villain'), {
            wrapper: buildWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(mock.history.get).toHaveLength(1);
    });

    test('should prefix every hero image with the VITE_API_URL', async () => {
        mock.onGet(FULL_URL).reply(200, buildMockResponse({
            heroes: [mockHero, { ...mockHero, id: '2', slug: 'superman-2', image: 'heroes/superman2.jpg' }],
        }));

        const { result } = renderHook(() => useHeroes(1, 6), {
            wrapper: buildWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.data?.heroes).toHaveLength(2);
        result.current.data?.heroes.forEach((hero) => {
            expect(hero.image.startsWith(`${BASE_URL}/images/`)).toBe(true);
        });
    });

    test('should preserve total and pages from the API response', async () => {
        mock.onGet(FULL_URL).reply(200, buildMockResponse({ total: 42, pages: 7 }));

        const { result } = renderHook(() => useHeroes(1, 6), {
            wrapper: buildWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.data?.total).toBe(42);
        expect(result.current.data?.pages).toBe(7);
    });

    test('should return an empty heroes array when the API returns none', async () => {
        mock.onGet(FULL_URL).reply(200, buildMockResponse({ heroes: [] }));

        const { result } = renderHook(() => useHeroes(1, 6), {
            wrapper: buildWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.data?.heroes).toEqual([]);
    });

    test('should expose the error state when the request fails', async () => {
        mock.onGet(FULL_URL).reply(500, { message: 'Internal Server Error' });

        const { result } = renderHook(() => useHeroes(1, 6), {
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
