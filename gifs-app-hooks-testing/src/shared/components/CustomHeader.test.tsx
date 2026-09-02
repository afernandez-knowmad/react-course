


import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CustomHeader } from './CustomHeader';

describe('CustomHeader', () => {

    const title = 'Test Title';
    const subtitle = 'Test Description';

    test('should render the title correctly', () => {
        const { container } = render(<CustomHeader title={title} />);
        expect(screen.getByText(title)).toBeDefined();
        expect(container).toMatchSnapshot();
    });

    test('should render the subtitle when provided', () => {
        const { container } = render(
            <CustomHeader title={title} subtitle={subtitle} />
        );

        expect(screen.getByText(subtitle)).toBeDefined();
        expect(screen.getByRole('paragraph')).toBeDefined();
        expect(screen.getByRole('paragraph').innerHTML).toBe(subtitle);
        expect(container).toMatchSnapshot();
    });

    test('should NOT render the subtitle when NOT provided', () => {
        const { container } = render(
            <CustomHeader title={title} />
        );
        const divElement = container.querySelector('.content-center');
        const h1 = divElement?.querySelector('h1');
        expect(h1?.innerHTML).toBe(title);

        const p = divElement?.querySelector('p');
        expect(p).toBeNull();
    });
});
