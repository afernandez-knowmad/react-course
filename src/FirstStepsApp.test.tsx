import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { FirstStepsApp } from './FirstStepsApp';

describe('FirstStepsApp', () => {

  test('should match snapshot', () => {
    render(<FirstStepsApp />);
    const { container } = render(<FirstStepsApp />);
    expect(container).toMatchSnapshot();
  });
});
