import { describe, expect, test, vi, afterEach } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import {
    MemoryRouter,
    Route,
    Routes,
    useSearchParams,
} from 'react-router';

// Mocks ---------------------------------------------------------------------

// We don't render the real icons; they aren't the subject under test.
vi.mock('lucide-react', () => ({
    ChevronLeft: () => <span data-testid="chevron-left" />,
    ChevronRight: () => <span data-testid="chevron-right" />,
}));

import { CustomPagination } from './CustomPagination';

// Helpers -------------------------------------------------------------------

/**
 * Small companion component used to read the current `page` search param so
 * the test can assert that clicks actually updated the URL via
 * `setSearchParams`.
 */
const PageProbe = () => {
    const [params] = useSearchParams();
    return (
        <span data-testid="probe-page">{params.get('page') ?? '1'}</span>
    );
};

const renderPagination = (totalPages: number, initialPage = '1') =>
    render(
        <MemoryRouter initialEntries={[`/?page=${initialPage}`]}>
            <Routes>
                <Route
                    path="/"
                    element={
                        <>
                            <CustomPagination totalPages={totalPages} />
                            <PageProbe />
                        </>
                    }
                />
            </Routes>
        </MemoryRouter>
    );

/**
 * Returns the page-number button (1..N), skipping the prev/next buttons.
 */
const getPageButton = (page: number) => {
    const buttons = screen.getAllByRole('button', { name: String(page) });
    expect(buttons.length).toBeGreaterThan(0);
    return buttons[0];
};

// Helpers ------------------------------------------------------------------

/**
 * Returns whether the given button is rendered with the HTML `disabled`
 * attribute. We avoid `toBeDisabled()` because the project doesn't load
 * `@testing-library/jest-dom/vitest` and that matcher isn't registered here.
 */
const isDisabled = (el: HTMLElement) => el.hasAttribute('disabled');

// Tests ---------------------------------------------------------------------

describe('CustomPagination', () => {
    afterEach(() => {
        cleanup();
    });

    // ---- Rendering -------------------------------------------------------

    test('should render one page button per total page', () => {
        renderPagination(5);

        // 5 numbered buttons + prev + next = 7 total
        expect(screen.getByRole('button', { name: 'Anteriores' })).toBeDefined();
        expect(screen.getByRole('button', { name: 'Siguientes' })).toBeDefined();
        for (let i = 1; i <= 5; i++) {
            expect(screen.getByRole('button', { name: String(i) })).toBeDefined();
        }
        expect(screen.getAllByRole('button').length).toBe(7);
    });

    test('should default to page 1 when no `page` search param is provided', () => {
        // Bypass the helper to assert the fallback path (no `page` in URL).
        render(
            <MemoryRouter initialEntries={['/']}>
                <CustomPagination totalPages={3} />
            </MemoryRouter>
        );

        // Page 1 must be active (default variant), pages 2 and 3 outline.
        const page1 = getPageButton(1);
        expect(page1.className).toContain('bg-primary');
    });

    // ---- Active page styling --------------------------------------------

    test('should mark the current page with the default (active) variant', () => {
        renderPagination(5, '3');

        const page3 = getPageButton(3);
        // `default` variant adds `bg-primary`.
        expect(page3.className).toContain('bg-primary');

        // Other pages stay with the outline variant.
        const page1 = getPageButton(1);
        expect(page1.className).not.toContain('bg-primary');
    });

    // ---- Navigation clicks ----------------------------------------------

    test('should update `page` in the URL when a numbered button is clicked', () => {
        renderPagination(5, '1');

        // Sanity: probe starts at "1".
        expect(screen.getByTestId('probe-page').textContent).toBe('1');

        fireEvent.click(getPageButton(3));

        expect(screen.getByTestId('probe-page').textContent).toBe('3');
    });

    test('should move to the next page when "Siguientes" is clicked', () => {
        renderPagination(5, '2');

        fireEvent.click(screen.getByRole('button', { name: 'Siguientes' }));

        expect(screen.getByTestId('probe-page').textContent).toBe('3');
    });

    test('should move to the previous page when "Anteriores" is clicked', () => {
        renderPagination(5, '3');

        fireEvent.click(screen.getByRole('button', { name: 'Anteriores' }));

        expect(screen.getByTestId('probe-page').textContent).toBe('2');
    });

    // ---- Out-of-range guards --------------------------------------------

    test('should NOT change page when "Anteriores" is clicked on page 1', () => {
        renderPagination(5, '1');

        fireEvent.click(screen.getByRole('button', { name: 'Anteriores' }));

        // Guarded by `handlePageChange` (page < 1) AND by `disabled`.
        expect(screen.getByTestId('probe-page').textContent).toBe('1');
    });

    test('should NOT change page when "Siguientes" is clicked on the last page', () => {
        renderPagination(5, '5');

        fireEvent.click(screen.getByRole('button', { name: 'Siguientes' }));

        expect(screen.getByTestId('probe-page').textContent).toBe('5');
    });

    // ---- Disabled state --------------------------------------------------

    test('should disable "Anteriores" on page 1', () => {
        renderPagination(5, '1');

        expect(isDisabled(screen.getByRole('button', { name: 'Anteriores' }))).toBe(true);
    });

    test('should disable "Siguientes" on the last page', () => {
        renderPagination(5, '5');

        expect(isDisabled(screen.getByRole('button', { name: 'Siguientes' }))).toBe(true);
    });

    test('should enable both navigation buttons on a middle page', () => {
        renderPagination(5, '3');

        expect(isDisabled(screen.getByRole('button', { name: 'Anteriores' }))).toBe(false);
        expect(isDisabled(screen.getByRole('button', { name: 'Siguientes' }))).toBe(false);
    });

    // ---- Edge cases ------------------------------------------------------

    test('should NOT mark any page as active when `page` search param is not a number', () => {
        // The component computes:
        //   `const page = isNaN(+queryPage) ? '1' : +queryPage;`
        // When the param is non-numeric, `page` is the STRING `'1'`, so the
        // strict `page === index + 1` comparison (number vs string) never
        // holds and no numbered button is highlighted. This test pins that
        // behavior so any future fix to use `Number(...)` will surface here.
        render(
            <MemoryRouter initialEntries={['/?page=abc']}>
                <CustomPagination totalPages={5} />
            </MemoryRouter>
        );

        for (let i = 1; i <= 5; i++) {
            expect(getPageButton(i).className).not.toContain('bg-primary');
        }

        // "Anteriores" stays disabled because `page === 1` is also false
        // (string vs number), but the disabled attr is wired to that strict
        // equality — see the source. We just assert no error is thrown.
        expect(screen.getByRole('button', { name: 'Anteriores' })).toBeDefined();
    });

    test('should render zero numbered buttons when totalPages is 0', () => {
        renderPagination(0);

        // Still renders prev/next but no numbered buttons in between.
        expect(screen.getAllByRole('button').length).toBe(2);
        // Both buttons render with `page === 1 ... page === totalPages`
        // checks. With totalPages=0 and page=1 (default), neither equality
        // holds, so neither is disabled. Pinning the rendered surface here.
        expect(screen.getByRole('button', { name: 'Anteriores' })).toBeDefined();
        expect(screen.getByRole('button', { name: 'Siguientes' })).toBeDefined();
    });
});
