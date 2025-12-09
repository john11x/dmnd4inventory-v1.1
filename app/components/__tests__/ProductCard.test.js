import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductCard from '../ProductCard.js';

describe('ProductCard Component', () => {
  const mockProduct = {
    id: 1,
    name: 'Test Product',
    category: 'Electronics',
    price: 29.99,
    stock: 50,
    imageUrl: 'https://example.com/image.jpg'
  };

  const mockOnAddToCart = jest.fn();

  beforeEach(() => {
    mockOnAddToCart.mockClear();
  });

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
  });

  it('renders placeholder when no image is available', () => {
    const productWithoutImage = { ...mockProduct, imageUrl: null };
    render(<ProductCard product={productWithoutImage} onAddToCart={mockOnAddToCart} />);
    
    expect(screen.getByText('No image available')).toBeInTheDocument();
  });

  it('renders image when imageUrl is provided', () => {
    render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />);
    
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('alt', 'Test Product');
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('initializes quantity to 1', () => {
    render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />);
    
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('increments quantity when + button is clicked', async () => {
    const user = userEvent.setup();
    render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />);
    
    const incrementButton = screen.getByText('+');
    await user.click(incrementButton);
    
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('decrements quantity when - button is clicked', async () => {
    const user = userEvent.setup();
    render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />);
    
    // First increment to 2
    const incrementButton = screen.getByText('+');
    await user.click(incrementButton);
    expect(screen.getByText('2')).toBeInTheDocument();
    
    // Then decrement back to 1
    const decrementButton = screen.getByText('-');
    await user.click(decrementButton);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('does not allow quantity to go below 1', async () => {
    const user = userEvent.setup();
    render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />);
    
    const decrementButton = screen.getByText('-');
    await user.click(decrementButton);
    await user.click(decrementButton);
    
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('calls onAddToCart with correct product and quantity when Add to Cart is clicked', async () => {
    const user = userEvent.setup();
    render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />);
    
    // Increment quantity to 3
    const incrementButton = screen.getByText('+');
    await user.click(incrementButton);
    await user.click(incrementButton);
    
    // Click Add to Cart
    const addToCartButton = screen.getByText('Add to Cart');
    await user.click(addToCartButton);
    
    expect(mockOnAddToCart).toHaveBeenCalledWith(mockProduct, 3);
    expect(mockOnAddToCart).toHaveBeenCalledTimes(1);
  });

  it('calls onAddToCart with quantity 1 when no quantity changes made', async () => {
    const user = userEvent.setup();
    render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />);
    
    const addToCartButton = screen.getByText('Add to Cart');
    await user.click(addToCartButton);
    
    expect(mockOnAddToCart).toHaveBeenCalledWith(mockProduct, 1);
  });

  it('formats price correctly with 2 decimal places', () => {
    const productWithTrailingZeros = { ...mockProduct, price: 29 };
    render(<ProductCard product={productWithTrailingZeros} onAddToCart={mockOnAddToCart} />);
    
    expect(screen.getByText('$29.00')).toBeInTheDocument();
  });

  it('handles high quantity values correctly', async () => {
    const user = userEvent.setup();
    render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />);
    
    const incrementButton = screen.getByText('+');
    
    // Click 10 times to get to 11
    for (let i = 0; i < 10; i++) {
      await user.click(incrementButton);
    }
    
    expect(screen.getByText('11')).toBeInTheDocument();
    
    const addToCartButton = screen.getByText('Add to Cart');
    await user.click(addToCartButton);
    
    expect(mockOnAddToCart).toHaveBeenCalledWith(mockProduct, 11);
  });

  it('has proper CSS classes and structure', () => {
    const { container } = render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />);
    
    expect(container.firstChild).toHaveClass('bg-white', 'rounded-lg', 'shadow-md', 'overflow-hidden');
    
    // Check quantity controls
    const quantityControls = container.querySelector('.flex.items-center.border.rounded');
    expect(quantityControls).toBeInTheDocument();
    
    // Check add to cart button
    const addToCartButton = screen.getByText('Add to Cart');
    expect(addToCartButton).toHaveClass('bg-blue-600', 'text-white', 'px-4', 'py-2', 'rounded');
  });
});
