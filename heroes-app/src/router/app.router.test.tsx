import { describe, expect, test, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
    createMemoryRouter,
    RouterProvider,
    type InitialEntry,
} from 'react-router';
import { act, render, screen, waitFor } from '@testing-library/react';
import type { PropsWithChildren } from 'react';

import { FavoriteHeroProvider } from '@/heroes/context/FavoriteHeroContext';

// ---- Mocks ----------------------------------------------------------------
//
// Mock the data hooks so route components don't trigger network requests
// (we are not testing the hooks here, only the routing wiring).

vi.mock('@/heroes/hooks/useHeroes', () => ({
    useHeroes: vi.fn(() => ({
        data: undefined,
        isLoading: false,
        isError: false,
    })),
}));

vi.mock('@/heroes/hooks/useHeroSummary', () => ({
    useHeroSummary: vi.fn(() => ({
        data: undefined,
        isLoading: false,
        isError: false,
    })),
}));

vi.mock('@/heroes/hooks/useHero', () => ({
    useHero: vi.fn(() => ({
        data: undefined,
        isLoading: false,
        isError: false,
    })),
}));

// Replace the lazy SearchPage so we don't depend on dynamic import mechanics.
// Also we render a stable marker that the tests can assert against.
vi.mock('@/heroes/pages/search/SearchPage', () => ({
    default: () => <div>Search Page Mock</div>,
}));

// Replace the network action used by SearchPage with a no-op so any stray
// code path can't blow up the test.
vi.mock('@/heroes/actions/search-hero.action', () => ({
    searchHeroesAction: vi.fn().mockResolvedValue([]),
}));

// ---- Router config (mirrors src/router/app.router.tsx) -------------------

// We rebuild the route tree here instead of importing `appRouter` because
// `createBrowserRouter` produces a router tied to the real `window` history,
// which cannot be controlled from jsdom. Using `createMemoryRouter` lets each
// test start from any initial URL while reusing the same route structure.
import { AdminLayout } from '@/admin/layouts/AdminLayout';
import { AdminPage } from '@/admin/pages/AdminPage';
import { HeroesLayout } from '@/heroes/layouts/HeroesLayout';
import { HeroPage } from '@/heroes/pages/hero/HeroPage';
import { HomePage } from '@/heroes/pages/home/HomePage';
import SearchPageMock from '@/heroes/pages/search/SearchPage';

const buildRouter = (initialEntries: InitialEntry[]) =>
    createMemoryRouter(
        [
            {
                path: '/',
                element: <HeroesLayout />,
                children: [
                    { index: true, element: <HomePage /> },
                    { path: 'heroes/:idSlug', element: <HeroPage /> },
                    { path: 'search', element: <SearchPageMock /> },
                    {
                        path: '*',
                        element: (
                            <>
                                <h1>Page not found</h1>
                                <a href="/">Back to heroes list</a>
                            </>
                        ),
                    },
                ],
            },
            {
                path: '/admin',
                element: <AdminLayout />,
                children: [{ index: true, element: <AdminPage /> }],
            },
        ],
        { initialEntries }
    );

// ---- Test wrapper ---------------------------------------------------------

/**
 * Each test gets its own QueryClient (no `retry`, isolated cache) and a
 * fresh `FavoriteHeroProvider`. `initialEntries` controls the URL the
 * memory router starts at.
 */
const renderAt = (initialEntries: InitialEntry[]) => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });

    const router = buildRouter(initialEntries);

    const utils = render(
        <QueryClientProvider client={queryClient}>
            <FavoriteHeroProvider>
                <RouterProvider router={router} />
            </FavoriteHeroProvider>
        </QueryClientProvider>
    );

    return { ...utils, router, queryClient };
};

// ---- Tests ----------------------------------------------------------------

describe('appRouter', () => {
    test('should render the home page for the "/" index route', async () => {
        renderAt(['/']);

        // HomePage's jumbotron title is unique to that route.
        expect(
            await screen.findByText('Universo de SuperHéroes')
        ).toBeDefined();

        // HeroesLayout always renders the shared menu. "Inicio" also appears
        // in the breadcrumbs so we assert presence via `queryAllByText`.
        expect(screen.queryAllByText('Inicio').length).toBeGreaterThan(0);
        expect(screen.getByText('Buscar superhéroes')).toBeDefined();
    });

    test('should render the hero detail page for "/heroes/:idSlug"', async () => {
        renderAt(['/heroes/batman']);

        // HeroPage renders the "Loading..." placeholder while the (mocked)
        // hook has no data.
        expect(await screen.findByText('Loading...')).toBeDefined();

        // The shared layout is still rendered around the nested route.
        expect(screen.getByText('Inicio')).toBeDefined();
    });

    test('should render the search page for "/search"', async () => {
        renderAt(['/search']);

        expect(await screen.findByText('Search Page Mock')).toBeDefined();
        expect(screen.getByText('Buscar superhéroes')).toBeDefined();
    });

    test('should render the admin layout + page for "/admin"', async () => {
        renderAt(['/admin']);

        expect(await screen.findByText('AdminPage')).toBeDefined();
        // AdminLayout must not leak the HeroesLayout menu.
        expect(screen.queryByText('Buscar superhéroes')).toBeNull();
    });

    test('should render the "Page not found" fallback for unknown routes', async () => {
        renderAt(['/this-route-does-not-exist']);

        expect(await screen.findByText('Page not found')).toBeDefined();
        expect(screen.getByText('Back to heroes list')).toBeDefined();
    });

    test('should navigate from "/" to "/search" when the user clicks the menu link', async () => {
        renderAt(['/']);

        // Wait for the home route to render before interacting.
        await screen.findByText('Universo de SuperHéroes');

        await act(async () => {
            screen.getByText('Buscar superhéroes').click();
        });

        await waitFor(() => {
            expect(screen.queryByText('Search Page Mock')).not.toBeNull();
        });
    });
});
