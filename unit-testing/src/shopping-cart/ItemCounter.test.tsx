import { describe, expect, test } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { ItemCounter } from './ItemCounter';

describe('ItemCounter', () => {

  test('should render with default values', () => {
    render(<ItemCounter name='Test Item' />);

    expect(screen.getByText('Test Item')).toBeDefined();
    expect(screen.getByText('Test Item')).not.toBeNull();
  });

  test('should render with quantity', () => {
    const name = 'Test Item';
    const quantity = 5;

    render(<ItemCounter name={name} quantity={quantity} />);

    expect(screen.getByText(quantity)).toBeDefined();
  });

  test('should increase count when +1 button is clicked', () => {
    // const name = 'Test Item';
    // const quantity = 5;

    render(<ItemCounter name={'Test item'} quantity={1} />);

    const [addButton] = screen.getAllByRole('button');

    fireEvent.click(addButton);

    expect(screen.getByText('2')).toBeDefined();
  });

  test('should decrease count when -1 button is clicked', () => {
    render(<ItemCounter name={'Test item'} quantity={3} />);

    const [subtractButton] = screen.getAllByRole('button', { name: '-1' });
    fireEvent.click(subtractButton);

    expect(screen.getByText('2')).toBeDefined();
  });

  test('should NOT decrease count when quantity is 1 and -1 button is clicked', () => {
    render(<ItemCounter name={'Test item'} quantity={1} />);

    const [subtractButton] = screen.getAllByRole('button', { name: '-1' });
    fireEvent.click(subtractButton);

    expect(screen.getByText('1')).toBeDefined();
  });

  test('should change to red when count is 1', () => {
    const quantity = 1;
    const name = 'Test item';

    render(<ItemCounter name={name} quantity={quantity} />);

    const itemText = screen.getByText(name);
    expect(itemText.style.color).toBe('red');
  });
});
