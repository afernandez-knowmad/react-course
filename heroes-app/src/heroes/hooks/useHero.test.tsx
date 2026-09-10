import { describe, expect, test, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, type RenderHookOptions } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import type { PropsWithChildren } from 'react';

import { TanStackCustomProvider } from '../test-utils/tanstack-custom-provider';
import type { Hero } from '../types/hero.interface';
import { heroApi } from '../api/hero.api';
import { useHero } from './useHero';

const BASE_URL = import.meta.env.VITE_API_URL;
const FULL_URL = `${BASE_URL}/api/heroes`;

// NB: `getHeroAction` rewrites `image` to `${BASE_URL}/images/${image}` so the
// mock below uses the *raw* shape the API would return; the hook will hand
// back the transformed object.
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

/**
 * Each test gets its own TanStackCustomProvider (and therefore its own
 * QueryClient) so cached data never leaks between cases.
 */
const buildWrapper = (): RenderHookOptions<unknown>['wrapper'] => {
    return ({ children }: PropsWithChildren) => (
        <TanStackCustomProvider>{children}</TanStackCustomProvider>
    );
};

describe('useHero', () => {
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
        mock.onGet(`${FULL_URL}/batman`).reply(200, mockHero);

        const { result } = renderHook(() => useHero('batman'), {
            wrapper: buildWrapper(),
        });

        expect(result.current.isLoading).toBe(true);
        expect(result.current.isFetching).toBe(true);
        expect(result.current.data).toBeUndefined();
        expect(result.current.isError).toBe(false);
    });

    test('should fetch the hero by slug and resolve successfully', async () => {
        mock.onGet(`${FULL_URL}/batman`).reply(200, mockHero);

        const { result } = renderHook(() => useHero('batman'), {
            wrapper: buildWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.data).toBeDefined();
        // getHeroAction transforms the image URL, so the hook receives the prefix.
        expect(result.current.data?.image).toBe(`${BASE_URL}/images/${mockHero.image}`);
        expect(result.current.data?.name).toBe(mockHero.name);
        expect(result.current.data?.slug).toBe(mockHero.slug);
        expect(result.current.data?.team).toBe(mockHero.team);
    });

    test('should call GET with the provided slug exactly once', async () => {
        mock.onGet(`${FULL_URL}/batman`).reply(200, mockHero);

        const { result } = renderHook(() => useHero('batman'), {
            wrapper: buildWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(mock.history.get).toHaveLength(1);
        expect(mock.history.get[0].url).toBe('batman');
    });

    test('should expose the error state when the hero is not found (404)', async () => {
        mock.onGet(`${FULL_URL}/unknown`).reply(404, { message: 'Not found' });

        const { result } = renderHook(() => useHero('unknown'), {
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

    test('should expose the error state when the server fails (500)', async () => {
        mock.onGet(`${FULL_URL}/batman`).reply(500, { message: 'Server error' });

        const { result } = renderHook(() => useHero('batman'), {
            wrapper: buildWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(result.current.data).toBeUndefined();
        expect(result.current.error).toBeDefined();
    });
});
