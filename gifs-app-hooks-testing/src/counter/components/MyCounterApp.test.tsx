import { describe, expect, test } from 'vitest';
import { screen, render, fireEvent } from '@testing-library/react';
import { MyCounterApp } from './MyCounterApp';

describe('MyCounterApp', () => {

    test('should render the counter with initial value', () => {
        render(<MyCounterApp />);

        screen.debug();
        expect(screen.getByRole('heading', { level: 1 }).innerHTML).toContain('Counter: 7');
        expect(screen.getByRole('button', { name: '+1' }).innerHTML).toBeDefined();
        expect(screen.getByRole('button', { name: '-1' }).innerHTML).toBeDefined();
        expect(screen.getByRole('button', { name: 'Reset' }).innerHTML).toBeDefined();
    });

    test('should increment the counter when +1 button is clicked', () => {
        render(<MyCounterApp />);

        const incrementButton = screen.getByRole('button', { name: '+1' });
        fireEvent.click(incrementButton);

        expect(screen.getByRole('heading', { level: 1 }).innerHTML).toContain('Counter: 8');
    });

    test('should decrement the counter when -1 button is clicked', () => {
        render(<MyCounterApp />);
        const decrementButton = screen.getByRole('button', { name: '-1' });
        fireEvent.click(decrementButton);

        expect(screen.getByRole('heading', { level: 1 }).innerHTML).toContain('Counter: 6');
    });

    test('should reset the counter when Reset button is clicked', () => {
        render(<MyCounterApp />);
        const incrementButton = screen.getByRole('button', { name: '+1' });
        const resetButton = screen.getByRole('button', { name: 'Reset' });

        fireEvent.click(incrementButton);
        fireEvent.click(incrementButton);
        expect(screen.getByRole('heading', { level: 1 }).innerHTML).toContain('Counter: 9');
        fireEvent.click(resetButton);
        expect(screen.getByRole('heading', { level: 1 }).innerHTML).toContain('Counter: 7');
    });

});
