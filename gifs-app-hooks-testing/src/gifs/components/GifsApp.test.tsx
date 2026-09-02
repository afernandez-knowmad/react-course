


import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GifsApp } from './GifsApp';

describe('GifsApp', () => {
    test('should match snapshot', () => {
        const { container } = render(<GifsApp />);
        expect(container).toMatchSnapshot();
    });


});
