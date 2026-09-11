import { describe, expect, test, beforeEach, afterEach, vi } from 'vitest';
import { act, renderHook, type RenderHookOptions } from '@testing-library/react';
import { useContext, type PropsWithChildren } from 'react';

import type { Hero } from '../types/hero.interface';
import {
    FavoriteHeroContext,
    FavoriteHeroProvider,
    getFavoritesFromLocalStorage,
} from './FavoriteHeroContext';

// Test fixtures ----------------------------------------------------------------

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

const mockHero2: Hero = {
    ...mockHero,
    id: '2',
    name: 'Superman',
    slug: 'superman',
    alias: 'Man of Steel',
};

// Helpers ----------------------------------------------------------------------

/**
 * Hook used inside the provider to expose the context value to the test.
 * Throws when used outside the provider so a missing wrapper is caught loudly.
 */
const useFavoriteHeroContext = () => useContext(FavoriteHeroContext);

/**
 * Each test gets its own provider so cached state never leaks between cases.
 */
const buildWrapper = (): RenderHookOptions<unknown>['wrapper'] => {
    return ({ children }: PropsWithChildren) => (
        <FavoriteHeroProvider>{children}</FavoriteHeroProvider>
    );
};

// localStorage helpers ---------------------------------------------------------

/**
 * Replace the global `localStorage` with a clean in-memory mock that matches
 * the small surface area the provider actually uses (getItem, setItem,
 * removeItem, clear).
 */
const buildLocalStorageMock = () => {
    let store: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => (key in store ? store[key] : null)),
        setItem: vi.fn((key: string, value: string) => {
            store[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
            delete store[key];
        }),
        clear: vi.fn(() => {
            store = {};
        }),
        key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
        get length() {
            return Object.keys(store).length;
        },
    };
};

// Tests -----------------------------------------------------------------------

describe('getFavoritesFromLocalStorage', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test('should return an empty array when there are no favorites in localStorage', () => {
        expect(getFavoritesFromLocalStorage()).toEqual([]);
    });

    test('should return parsed favorites from localStorage', () => {
        const stored = [mockHero, mockHero2];
        localStorage.setItem('favorites', JSON.stringify(stored));

        expect(getFavoritesFromLocalStorage()).toEqual(stored);
    });

    test('should read the value from the "favorites" key', () => {
        const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');

        getFavoritesFromLocalStorage();

        expect(getItemSpy).toHaveBeenCalledWith('favorites');
    });
});

describe('FavoriteHeroProvider', () => {
    let localStorageMock: ReturnType<typeof buildLocalStorageMock>;

    beforeEach(() => {
        localStorageMock = buildLocalStorageMock();
        vi.stubGlobal('localStorage', localStorageMock);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    test('should initialize with an empty list when localStorage is empty', () => {
        const { result } = renderHook(() => useFavoriteHeroContext(), {
            wrapper: buildWrapper(),
        });

        expect(result.current.favorites).toEqual([]);
        expect(result.current.favoriteCount).toBe(0);
        expect(result.current.isFavorite(mockHero)).toBe(false);
    });

    test('should hydrate favorites from localStorage on mount', () => {
        const stored = [mockHero];
        localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(stored));

        const { result } = renderHook(() => useFavoriteHeroContext(), {
            wrapper: buildWrapper(),
        });

        expect(result.current.favorites).toEqual(stored);
        expect(result.current.favoriteCount).toBe(stored.length);
        expect(result.current.isFavorite(mockHero)).toBe(true);
    });

    test('should add a hero to favorites when toggleFavorite is called', () => {
        const { result } = renderHook(() => useFavoriteHeroContext(), {
            wrapper: buildWrapper(),
        });

        act(() => {
            result.current.toggleFavorite(mockHero);
        });

        expect(result.current.favorites).toEqual([mockHero]);
        expect(result.current.favoriteCount).toBe(1);
        expect(result.current.isFavorite(mockHero)).toBe(true);
    });

    test('should remove a hero from favorites when toggleFavorite is called twice', () => {
        const { result } = renderHook(() => useFavoriteHeroContext(), {
            wrapper: buildWrapper(),
        });

        act(() => {
            result.current.toggleFavorite(mockHero);
        });
        expect(result.current.isFavorite(mockHero)).toBe(true);

        act(() => {
            result.current.toggleFavorite(mockHero);
        });
        expect(result.current.favorites).toEqual([]);
        expect(result.current.favoriteCount).toBe(0);
        expect(result.current.isFavorite(mockHero)).toBe(false);
    });

    test('should support multiple distinct favorites without duplicates', () => {
        const { result } = renderHook(() => useFavoriteHeroContext(), {
            wrapper: buildWrapper(),
        });

        act(() => {
            result.current.toggleFavorite(mockHero);
        });
        act(() => {
            result.current.toggleFavorite(mockHero2);
        });

        expect(result.current.favoriteCount).toBe(2);
        expect(result.current.favorites).toEqual([mockHero, mockHero2]);
        expect(result.current.isFavorite(mockHero)).toBe(true);
        expect(result.current.isFavorite(mockHero2)).toBe(true);
    });

    test('should persist favorites to localStorage after every change', () => {
        const { result } = renderHook(() => useFavoriteHeroContext(), {
            wrapper: buildWrapper(),
        });

        act(() => {
            result.current.toggleFavorite(mockHero);
        });

        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            'favorites',
            JSON.stringify([mockHero])
        );

        act(() => {
            result.current.toggleFavorite(mockHero2);
        });

        expect(localStorageMock.setItem).toHaveBeenLastCalledWith(
            'favorites',
            JSON.stringify([mockHero, mockHero2])
        );

        act(() => {
            result.current.toggleFavorite(mockHero);
        });

        expect(localStorageMock.setItem).toHaveBeenLastCalledWith(
            'favorites',
            JSON.stringify([mockHero2])
        );
    });

    test('isFavorite should be referentially stable across re-renders', () => {
        const { result, rerender } = renderHook(() => useFavoriteHeroContext(), {
            wrapper: buildWrapper(),
        });

        const firstRef = result.current.isFavorite;

        rerender();

        expect(result.current.isFavorite).toBe(firstRef);
    });

    test('isFavorite should return false for an unknown hero', () => {
        const { result } = renderHook(() => useFavoriteHeroContext(), {
            wrapper: buildWrapper(),
        });

        expect(result.current.isFavorite(mockHero)).toBe(false);
    });
});
