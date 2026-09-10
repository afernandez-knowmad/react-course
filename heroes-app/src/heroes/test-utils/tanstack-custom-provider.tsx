import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type PropsWithChildren } from 'react';

interface Props {
    /**
     * Optional QueryClient. If omitted, the provider creates a fresh one
     * so each provider instance is isolated (useful in tests).
     */
    client?: QueryClient;
}

/**
 * Reusable wrapper that exposes a `QueryClient` to its children.
 *
 * Used mainly in tests via `renderHook(() => ..., { wrapper })` to keep
 * every test isolated while sharing a single helper across the suite.
 *
 * Disables retries by default so error scenarios can be asserted on
 * deterministically (3 retries in tests would slow them down and could
 * mask real bugs).
 */
export const TanStackCustomProvider = ({ children, client }: PropsWithChildren<Props>) => {
    // useState's lazy initializer guarantees the QueryClient is built
    // exactly once per provider instance (avoids re-creating it on
    // re-renders, which would discard the cache).
    const [queryClient] = useState(
        () =>
            client ??
            new QueryClient({
                defaultOptions: {
                    queries: {
                        retry: false,
                    },
                },
            })
    );

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
