import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../../app/components/ErrorBoundary';

// Test component that throws an error
const ErrorComponent = () => {
  throw new Error('Test Error');
};

describe('ErrorBoundary Component', () => {
  // Suppress console.error for this test file
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  it('displays fallback UI when error is thrown', () => {
    render(
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <ErrorComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('calls onError callback when error occurs', () => {
    const mockOnError = jest.fn();
    render(
      <ErrorBoundary fallback={<div>Error</div>} onError={mockOnError}>
        <ErrorComponent />
      </ErrorBoundary>
    );
    expect(mockOnError).toHaveBeenCalledWith(expect.any(Error), expect.any(Object));
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary fallback={<div>Error</div>}>
        <div>Child Component</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Child Component')).toBeInTheDocument();
  });
});
