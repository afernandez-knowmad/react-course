import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render, screen, type RenderOptions } from '@testing-library/react';
import type { PropsWithChildren } from 'react';

import type { Hero } from '../types/hero.interface';

// ---- Mocks ----------------------------------------------------------------
//
// We mock the data hook because HeroStats is a presentational component and
// we don't want to depend on the network here. We *do* use the real
// FavoriteHeroProvider so the favoriteCount integration is exercised too.

const useHeroSummaryMock = vi.fn();

vi.mock('../hooks/useHeroSummary', () => ({
    useHeroSummary: () => useHeroSummaryMock(),
}));

// ---- Fixtures -------------------------------------------------------------

const strongestHero: Hero = {
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

const smartestHero: Hero = {
    ...strongestHero,
    id: '2',
    name: 'Batman',
    slug: 'batman',
    alias: 'The Dark Knight',
    intelligence: 100,
    strength: 80,
};

const mockSummary = {
    totalHeroes: 50,
    strongestHero,
    smartestHero,
    heroCount: 30,
    villainCount: 20,
};

// Lazy-import after the mock is registered so the module picks up the stub.
import { HeroStats } from './HeroStats';
import { FavoriteHeroProvider } from '../context/FavoriteHeroContext';

// ---- Helpers --------------------------------------------------------------

/**
 * Wrapper that gives HeroStats access to the FavoriteHeroContext it relies on.
 * Each call creates a fresh provider so state never leaks between tests.
 */
const renderStats = (ui: React.ReactNode, options?: RenderOptions) =>
    render(ui, {
        wrapper: ({ children }: PropsWithChildren) => (
            <FavoriteHeroProvider>{children}</FavoriteHeroProvider>
        ),
        ...options,
    });

/**
 * Pre-seeds `localStorage.favorites` so the `FavoriteHeroProvider` hydrates
 * the desired state on mount. This is more reliable than toggling from a
 * test harness because the provider hydrates the initial state in a single
 * synchronous render (no stale-closure races between consecutive toggles).
 *
 * Must be called *before* rendering the component under test.
 */
const seedFavorites = (heroes: Hero[]) => {
    localStorage.setItem('favorites', JSON.stringify(heroes));
};

/**
 * Asserts that some element within the document contains the given text
 * after normalizing whitespace. Useful when JSX splits text across multiple
 * nodes (e.g. `{value}% of total`).
 */
const expectTextInDocument = (text: string) => {
    const all = document.body.textContent ?? '';
    expect(all).toContain(text);
};

// ---- Tests ----------------------------------------------------------------

describe('HeroStats', () => {
    beforeEach(() => {
        // Clean localStorage so FavoriteHeroProvider starts with an empty list
        // each test (it hydrates from `favorites` on mount). Without this,
        // favorites seeded in one test leak into the next via the same
        // window-scoped storage.
        localStorage.clear();

        // Default mock: full payload. Individual tests override via
        // `useHeroSummaryMock.mockReturnValueOnce` when they need a custom shape.
        useHeroSummaryMock.mockReturnValue({
            data: mockSummary,
            isLoading: false,
            isError: false,
        });
    });

    test('should render all four stat card titles', () => {
        renderStats(<HeroStats />);

        expect(screen.getByText('Total de personajes')).toBeDefined();
        expect(screen.getByText('Favoritos')).toBeDefined();
        expect(screen.getByText('Fuerte')).toBeDefined();
        expect(screen.getByText('Inteligente')).toBeDefined();
    });

    test('should display the totals, hero count and villain count from the summary', () => {
        renderStats(<HeroStats />);

        expect(screen.getByText('50')).toBeDefined();
        expect(screen.getByText('30 Heroes')).toBeDefined();
        expect(screen.getByText('20 Villains')).toBeDefined();
    });

    test('should display the strongest and smartest hero aliases', () => {
        renderStats(<HeroStats />);

        // Two different aliases are shown — getAllByText to assert both copies
        // are present without coupling to a specific DOM order.
        expect(screen.getAllByText('The Incredible Hulk').length).toBeGreaterThan(0);
        expect(screen.getAllByText('The Dark Knight').length).toBeGreaterThan(0);
    });

    test('should display strength and intelligence values from the summary', () => {
        renderStats(<HeroStats />);

        // Strength: 100 / 10
        expect(screen.getByText(/Strength:\s*100\s*\/\s*10/)).toBeDefined();
        // Intelligence: 100 / 10
        expect(screen.getByText(/Intelligence:\s*100\s*\/\s*10/)).toBeDefined();
    });

    test('should show 0% of total when there are no favorites', () => {
        renderStats(<HeroStats />);

        // `% of total` is broken across multiple text nodes by the JSX
        // (`{favoritePercentage}% of total`), so we fall back to scanning
        // the document's text content.
        expectTextInDocument('0% of total');
    });

    test('should compute favoritePercentage against totalHeroes when there are favorites', () => {
        // 2 favorites / 50 total = 4% -> "4% of total"
        seedFavorites([strongestHero, smartestHero]);

        renderStats(<HeroStats />);

        expectTextInDocument('4% of total');
    });

    test('should render the favorite count number inside the Favoritos card', () => {
        seedFavorites([strongestHero]);

        renderStats(<HeroStats />);

        // The Favoritos card shows the count. We locate the card by its
        // title to keep the assertion scoped.
        const favoritesCard = screen
            .getByText('Favoritos')
            .closest('[data-slot="card"]') as HTMLElement | null;
        expect(favoritesCard).not.toBeNull();
        expect(favoritesCard?.textContent).toContain('1');
    });

    test('should render zeros when totalHeroes is 0 and there are no favorites', () => {
        // Component uses `?? 0` and a ternary guard before dividing, so it
        // must not throw NaN/Infinity when summary is empty AND there are
        // no favorites. NB: HeroStats reads `summaryResponse?.strongestHero.alias`,
        // so `data` cannot be fully undefined here — we keep the hero fields
        // populated and only zero out the counters.
        useHeroSummaryMock.mockReturnValueOnce({
            data: {
                ...mockSummary,
                totalHeroes: 0,
                heroCount: 0,
                villainCount: 0,
            },
            isLoading: false,
            isError: false,
        });

        renderStats(<HeroStats />);

        expect(screen.getByText('0 Heroes')).toBeDefined();
        expect(screen.getByText('0 Villains')).toBeDefined();
        // 0 favorites / 0 total: the ternary `favoriteCount ? ... : 0` short-
        // circuits because favoriteCount is 0, so the displayed value is "0%".
        expectTextInDocument('0% of total');
    });
});
