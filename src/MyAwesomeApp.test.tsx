import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MyAwesomeApp } from './MyAwesomeApp';

describe('MyAwesomeApp', () => {
  test('should render firstName and lastName with querySelector', () => {
    const { container } = render(<MyAwesomeApp />);
    screen.debug();
    // expect(container).toHaveTextContent('Alex');
    // expect(container).toHaveTextContent('Fernandez');
    const h1Element = container.querySelector('h1');
    const h3Element = container.querySelector('h3');
    // expect(h1Element).toBe('Alex'); // Este fallara porque el h1 tiene un espacio antes y después del nombre, por lo que no es exactamente igual a 'Alex'
    expect(h1Element?.innerHTML).toContain('Alex'); // Este si pasa el test
    expect(h3Element?.innerHTML).toContain('Fernandez'); // Este si pasa el test
  });

  test('should render firstName and lastName with testId', () => {
    render(<MyAwesomeApp />);
    screen.debug();
    // const h1Element = screen.getByRole('heading', { level: 1 });
    // console.log("🚀 ~ h1Element:", h1Element)
   const h1Element = screen.getByTestId('first-name');
    expect(h1Element?.innerHTML).toContain('Alex'); // Este si pasa el test
  });

  test('should render firstName and lastName snapshot', () => {
    render(<MyAwesomeApp />);
    const { container } = render(<MyAwesomeApp />);
    expect(container).toMatchSnapshot();
  });
});
  