import { describe, expect, test, vi } from 'vitest';
import { screen, render, fireEvent } from '@testing-library/react';
import { MyCounterApp } from './MyCounterApp';

const handleAddMock = vi.fn();
const handleSubtractMock = vi.fn();
const handleResetMock = vi.fn();

vi.mock('../hooks/useCounter', () => ({
    useCounter: () => ({
        counter: 7,
        handleAdd: handleAddMock,
        handleSubtract: handleSubtractMock,
        handleReset: handleResetMock,
    }),
}));


describe('MyCounterApp2', () => {

    test('should render the counter with initial value', () => {
        render(<MyCounterApp />);

        screen.debug();
        expect(screen.getByRole('heading', { level: 1 }).innerHTML).toContain('Counter: 7');
        expect(screen.getByRole('button', { name: '+1' }).innerHTML).toBeDefined();
        expect(screen.getByRole('button', { name: '-1' }).innerHTML).toBeDefined();
        expect(screen.getByRole('button', { name: 'Reset' }).innerHTML).toBeDefined();
    });

    test('should call handleAdd when +1 button is clicked', () => {
        render(<MyCounterApp />);

        const button = screen.getByRole('button', { name: '+1' });
        fireEvent.click(button);

        expect(handleAddMock).toHaveBeenCalled();
    });
});
