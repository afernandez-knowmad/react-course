import { describe, expect, test, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useGifs } from './useGifs';
import { act } from 'react';
import * as gifActions from '../actions/get-gifs-by-query.actions';

describe('useGifs', () => {

    test('should return default values and methods', () => {
        const { result } = renderHook(() => useGifs());

        expect(result.current.gifs.length).toBe(0);
        expect(result.current.previousTerms.length).toBe(3);
        expect(result.current.handleSearch).toBeDefined();
        expect(result.current.handleTermClicked).toBeDefined();
    });

    test('should return a list of gifs when handleSearch is called', async () => {
        const { result } = renderHook(() => useGifs());

        await act(async () => {
            await result.current.handleSearch('dragon ball');
        });

        expect(result.current.gifs.length).toBe(10);

    });

    test('should return a list of gifs when handleTermClicked is called', async () => {
        const { result } = renderHook(() => useGifs());

        await act(async () => {
            await result.current.handleTermClicked('dragon ball');
        });

        expect(result.current.gifs.length).toBe(10);
    });

    test('should return a list of gifs from cache', async () => {
        const { result } = renderHook(() => useGifs());

        await act(async () => {
            await result.current.handleTermClicked('dragon ball');
        });

        expect(result.current.gifs.length).toBe(10);

        vi.spyOn(gifActions, 'getGifsByQuery').mockRejectedValue(
            new Error('API call should not be made when term is cached')
        );

        await act(async () => {
            await result.current.handleTermClicked('dragon ball');
        });

        expect(result.current.gifs.length).toBe(10);
    });

    test('should return no more than 8 previous terms', async () => {
        const { result } = renderHook(() => useGifs());

        vi.spyOn(gifActions, 'getGifsByQuery').mockResolvedValue([]);

        await act(async () => {
            await result.current.handleSearch('dragon ball');
        });
        await act(async () => {
            await result.current.handleSearch('dragon ball-1');
        });
        await act(async () => {
            await result.current.handleSearch('dragon ball-2');
        });
        await act(async () => {
            await result.current.handleSearch('dragon ball-3');
        });
        await act(async () => {
            await result.current.handleSearch('dragon ball-4');
        });
        await act(async () => {
            await result.current.handleSearch('dragon ball-5');
        });
        await act(async () => {
            await result.current.handleSearch('dragon ball-6');
        });
        await act(async () => {
            await result.current.handleSearch('dragon ball-7');
        });
        await act(async () => {
            await result.current.handleSearch('dragon ball-8');
        });
        await act(async () => {
            await result.current.handleSearch('dragon ball-9');
        });
        await act(async () => {
            await result.current.handleSearch('dragon ball-10');
        });

        console.log("🚀 ~ result.current.previousTerms:", result.current.previousTerms)
        expect(result.current.previousTerms.length).toBe(8);
    });
});