import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { apiGet, apiPost } from '../../app/lib/api.js';

// Mock the API module
jest.mock('../../app/lib/api.js');

// Mock Next.js router and components
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => <img {...props} />,
}));

// Mock AuthProvider
jest.mock('../../app/providers/AuthProvider.jsx', () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
  AuthContext: React.createContext({
    user: { id: 1, name: 'Test User', role: 'ROLE_USER' },
  }),
}));

// Mock ProtectedClient to bypass auth
jest.mock('../../app/components/ProtectedClient.jsx', () => {
  return function MockProtectedClient({ children }) {
    return <div>{children}</div>;
  };
});

// Import the real UserHome component
import UserHome from '../../app/user/home/page.js';

// Mock localStorage for user authentication
const mockLocalStorage = {
  getItem: jest.fn(() => JSON.stringify({ id: 1, name: 'Test User', role: 'ROLE_USER' })),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock alert
global.alert = jest.fn();

describe('Integration Tests - Real User Home Workflow', () => {
  const mockProducts = [
    { id: 1, name: 'Laptop', price: 999.99, stock: 50, category: 'Electronics', description: 'High-performance laptop' },
    { id: 2, name: 'Mouse', price: 29.99, stock: 5, category: 'Accessories', description: 'Wireless mouse' },
    { id: 3, name: 'Keyboard', price: 79.99, stock: 0, category: 'Accessories', description: 'Mechanical keyboard' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    apiGet.mockResolvedValue(mockProducts);
    apiPost.mockResolvedValue({ success: true, orderId: 12345 });
  });

  it('should load and display products correctly', async () => {
    render(<UserHome />);

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
      expect(screen.getByText('Mouse')).toBeInTheDocument();
      expect(screen.getByText('Keyboard')).toBeInTheDocument();
    });

    // Verify product details are displayed
    expect(screen.getByText('High-performance laptop')).toBeInTheDocument();
    expect(screen.getByText('Wireless mouse')).toBeInTheDocument();
    expect(screen.getByText('Mechanical keyboard')).toBeInTheDocument();

    // Verify stock information
    expect(screen.getByText('50 licenses available')).toBeInTheDocument();
    expect(screen.getByText('5 licenses available')).toBeInTheDocument();
    expect(screen.getByText('Out of licenses')).toBeInTheDocument();
  });

  it('should complete full ordering workflow', async () => {
    const user = userEvent.setup();
    render(<UserHome />);

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
    });

    // Click "Deploy Now" on laptop
    const laptopDeployButton = screen.getAllByText('Deploy Now')[0];
    await user.click(laptopDeployButton);

    // Wait for modal to open
    await waitFor(() => {
      expect(screen.getByText('Place Order')).toBeInTheDocument();
    });

    // Verify modal content - check within the modal context
    const modal = screen.getByText('Place Order').closest('div');
    expect(modal).toHaveTextContent('Laptop');
    expect(modal).toHaveTextContent('999.99'); // Price without $ symbol
    expect(modal).toHaveTextContent('Available: 50 units');

    // Change quantity to 2
    const incrementButton = screen.getByText('+');
    await user.click(incrementButton);

    // Verify total is updated
    expect(modal).toHaveTextContent('Total: $1999.98');

    // Place order - find the correct button in the modal (the one with "Deploy Now" text)
    const allButtons = modal.querySelectorAll('button');
    const deployButton = Array.from(allButtons).find(btn => btn.textContent.includes('Deploy Now'));
    await user.click(deployButton);

    // Verify API was called
    expect(apiPost).toHaveBeenCalledWith('/api/orders', {
      product_id: 1,
      quantity: 2,
      user_id: 1
    });

    // Modal should close
    await waitFor(() => {
      expect(screen.queryByText('Place Order')).not.toBeInTheDocument();
    });
  });

  it('should handle out of stock products correctly', async () => {
    render(<UserHome />);

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText('Keyboard')).toBeInTheDocument();
    });

    // Find the keyboard card (out of stock) - use a different approach
    const keyboardElement = screen.getByText('Keyboard');
    const keyboardCard = keyboardElement.closest('.group');
    const noLicensesButton = keyboardCard.querySelector('button:disabled');

    expect(noLicensesButton).toHaveTextContent('No Licenses');
    expect(noLicensesButton).toBeDisabled();
  });

  it('should prevent quantity from going below 1', async () => {
    const user = userEvent.setup();
    render(<UserHome />);

    // Wait for products to load and open modal
    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
    });

    const laptopDeployButton = screen.getAllByText('Deploy Now')[0];
    await user.click(laptopDeployButton);

    // Try to decrement below 1
    const decrementButton = screen.getByText('-');
    expect(decrementButton).toBeDisabled();

    // Quantity should remain 1
    expect(screen.getByDisplayValue('1')).toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    const user = userEvent.setup();
    apiPost.mockRejectedValue(new Error('Backend unavailable'));

    render(<UserHome />);

    // Wait for products to load and open modal
    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
    });

    const laptopDeployButton = screen.getAllByText('Deploy Now')[0];
    await user.click(laptopDeployButton);

    // Place order - use the modal's Deploy Now button (within modal context)
    await waitFor(() => {
      expect(screen.getByText('Place Order')).toBeInTheDocument();
    });
    
    const modal = screen.getByText('Place Order').closest('div');
    const allButtons = modal.querySelectorAll('button');
    const modalDeployButton = Array.from(allButtons).find(btn => btn.textContent.includes('Deploy Now'));
    await user.click(modalDeployButton);

    // Should still attempt the API call
    expect(apiPost).toHaveBeenCalledWith('/api/orders', {
      product_id: 1,
      quantity: 1,
      user_id: 1
    });
  });

  it('should filter and sort products correctly', async () => {
    const user = userEvent.setup();
    render(<UserHome />);

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
    });

    // Filter by Electronics category
    const categoryFilter = screen.getByDisplayValue('All Categories');
    await user.selectOptions(categoryFilter, 'Electronics');

    // Should only show Laptop
    expect(screen.getByText('Laptop')).toBeInTheDocument();
    expect(screen.queryByText('Mouse')).not.toBeInTheDocument();
    expect(screen.queryByText('Keyboard')).not.toBeInTheDocument();

    // Reset filter to see all products
    await user.selectOptions(categoryFilter, 'All Categories');

    // Sort by price low to high
    const sortFilter = screen.getByDisplayValue('Sort by Name');
    await user.selectOptions(sortFilter, 'Price: Low to High');

    // Should show Mouse first (lowest price: $29.99)
    const productNames = screen.getAllByText(/Mouse|Laptop|Keyboard/);
    expect(productNames[0]).toHaveTextContent('Mouse');
    expect(productNames[1]).toHaveTextContent('Keyboard');
    expect(productNames[2]).toHaveTextContent('Laptop');
  });
});
