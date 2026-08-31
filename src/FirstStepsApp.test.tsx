import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { FirstStepsApp } from './FirstStepsApp';

const mockItemCounter = vi.fn((props: unknown) => {
  return (
    <div data-testid="item-counter" ></div>
  );
});

vi.mock('./shopping-cart/ItemCounter', () => ({
  ItemCounter: (props: unknown) => mockItemCounter(props),
}));

// vi.mock('./shopping-cart/ItemCounter', () => ({
//   ItemCounter: (props: unknown) => (
//     <div data-testid="item-counter">  </div>
//   ),
// }));

describe('FirstStepsApp', () => {

  beforeEach(() => {
    mockItemCounter.mockClear();
  });

  test('should match snapshot', () => {
    render(<FirstStepsApp />);
    const { container } = render(<FirstStepsApp />);
    expect(container).toMatchSnapshot();
  });

  test('should render the correct number of ItemCounter components', () => {
    render(<FirstStepsApp />);
    const ItemCounter = screen.getAllByTestId('item-counter');
    expect(ItemCounter.length).toBe(3);
  });

  test('should render ItemCounter with correct props', () => {
    render(<FirstStepsApp />);
    expect(mockItemCounter).toHaveBeenCalledTimes(3);
    expect(mockItemCounter).toHaveBeenCalledWith({
      name: 'Nintendo Switch 2',
      quantity: 1
    });
    expect(mockItemCounter).toHaveBeenCalledWith({
      name: 'Super Smash',
      quantity: 5
    });
    expect(mockItemCounter).toHaveBeenCalledWith({
      name: 'Pro Controller',
      quantity: 2
    });

    // screen.debug();
  });
});
