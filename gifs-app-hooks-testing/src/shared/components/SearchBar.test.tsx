import { describe, expect, test, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
    const placeholder = 'Search...';

    test('should create the search component', () => {
        const { container } = render(<SearchBar placeholder={placeholder} onSearch={() => { }} />);
        expect(container).toMatchSnapshot();
        expect(screen.getByRole('textbox')).toBeDefined();
        expect(screen.getByRole('button')).toBeDefined();
    });

    test('should display the correct placeholder', () => {
        const { container } = render(<SearchBar placeholder={placeholder} onSearch={() => { }} />);
        expect(container).toMatchSnapshot();
        expect(screen.getByPlaceholderText(placeholder)).toBeDefined();
    });

    test('should call onSearch with the correct value after 700ms', async () => {
        const onSearchMock = vi.fn();

        render(<SearchBar placeholder={placeholder} onSearch={onSearchMock} />);

        const input = screen.getByRole('textbox') as HTMLInputElement;

        fireEvent.change(input, { target: { value: 'dragon ball' } });

        await waitFor(() => {
            expect(onSearchMock).toHaveBeenCalledTimes(1);
            expect(onSearchMock).toHaveBeenCalledWith('dragon ball');
        });
    });

    test('should call only once with the last value (debouce)', async () => {
        const onSearchMock = vi.fn();
        render(<SearchBar placeholder={placeholder} onSearch={onSearchMock} />);

        const input = screen.getByRole('textbox') as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'drag' } });
        fireEvent.change(input, { target: { value: 'dragon' } });
        fireEvent.change(input, { target: { value: 'dragon ball' } });

        await waitFor(() => {
            expect(onSearchMock).toHaveBeenCalledTimes(1);
            expect(onSearchMock).toHaveBeenCalledWith('dragon ball');
        });
    });

    test('should call onSearch when button clicked with the input value', () => {
        const onSearchMock = vi.fn();
        render(<SearchBar placeholder={placeholder} onSearch={onSearchMock} />);

        const input = screen.getByRole('textbox') as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'dragon ball' } });

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(onSearchMock).toHaveBeenCalledTimes(1);
        expect(onSearchMock).toHaveBeenCalledWith('dragon ball');
    });
});