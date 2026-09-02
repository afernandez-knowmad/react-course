


import { describe, expect, test } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
    const { result } = renderHook(() => useCounter());
    test('should initialize counter with default value = 7', () => {
        expect(result.current.counter).toBe(7);
    });

    test('should initialize counter with provided value', () => {
        const initialValue = 10;
        const { result } = renderHook(() => useCounter(initialValue));
        expect(result.current.counter).toBe(initialValue);
    });

    test('should increment counter when handleAdd is called', () => {
        const { result } = renderHook(() => useCounter(7));
        act(() => {
            result.current.handleAdd();
        });
        expect(result.current.counter).toBe(8);
    });

    test('should decrement counter when handleSubtract is called', () => {
        const { result } = renderHook(() => useCounter(7));
        act(() => {
            result.current.handleSubtract();
        });
        expect(result.current.counter).toBe(6);
    });

    test('should reset counter when handleReset is called', () => {
        const { result } = renderHook(() => useCounter());
        act(() => {
            result.current.handleAdd();
            result.current.handleAdd();
        });
        expect(result.current.counter).toBe(9);

        act(() => {
            result.current.handleAdd();
            result.current.handleAdd();
            result.current.handleReset();
        });
        expect(result.current.counter).toBe(7);
    });
});
