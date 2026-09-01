import { describe, expect, test } from 'vitest';
import { add, divide, multiply, subtract } from './math.helper';

describe('Math Helpers', () => {
  test('should add two numbers correctly', () => {
    expect(add(2, 3)).toBe(5);
  });

  test('should subtract two numbers correctly', () => {
    expect(subtract(5, 3)).toBe(2);
  });

  test('should multiply two numbers correctly', () => {
    expect(multiply(2, 3)).toBe(6);
  });

  test('should divide two numbers correctly', () => {
    expect(divide(6, 3)).toBe(2);
  });
});
