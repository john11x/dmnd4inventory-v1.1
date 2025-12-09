import { render, screen } from '@testing-library/react';
import Navbar from '../Navbar.js';

// Mock Next.js components
jest.mock('next/link', () => {
  return ({ href, children, className }) => {
    return <a href={href} className={className}>{children}</a>;
  };
});

jest.mock('next/navigation', () => ({
  usePathname: jest.fn()
}));

const { usePathname } = require('next/navigation');

describe('Navbar Component', () => {
  beforeEach(() => {
    usePathname.mockClear();
  });

  it('renders the navigation structure correctly', () => {
    usePathname.mockReturnValue('/');
    
    render(<Navbar />);
    
    expect(screen.getByText('Inventory System')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('My Orders')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
  });

  it('shows Home link as active when on /user/home page', () => {
    usePathname.mockReturnValue('/user/home');
    
    render(<Navbar />);
    
    const homeLink = screen.getByText('Home');
    expect(homeLink).toHaveClass('text-blue-600', 'border-b-2', 'border-blue-600');
  });

  it('shows My Orders link as active when on /user/order page', () => {
    usePathname.mockReturnValue('/user/order');
    
    render(<Navbar />);
    
    const ordersLink = screen.getByText('My Orders');
    expect(ordersLink).toHaveClass('text-blue-600', 'border-b-2', 'border-blue-600');
  });

  it('shows Home link as inactive when on other pages', () => {
    usePathname.mockReturnValue('/user/product/1');
    
    render(<Navbar />);
    
    const homeLink = screen.getByText('Home');
    expect(homeLink).toHaveClass('text-gray-600', 'hover:text-blue-600');
    expect(homeLink).not.toHaveClass('text-blue-600');
  });

  it('shows My Orders link as inactive when on other pages', () => {
    usePathname.mockReturnValue('/user/home');
    
    render(<Navbar />);
    
    const ordersLink = screen.getByText('My Orders');
    expect(ordersLink).toHaveClass('text-gray-600', 'hover:text-blue-600');
    expect(ordersLink).not.toHaveClass('text-blue-600');
  });

  it('renders cart icon with badge showing 0', () => {
    usePathname.mockReturnValue('/');
    
    render(<Navbar />);
    
    const cartBadge = screen.getByText('0');
    expect(cartBadge).toBeInTheDocument();
    expect(cartBadge).toHaveClass('bg-red-500', 'text-white', 'text-xs', 'rounded-full');
  });

  it('renders user avatar with initial U', () => {
    usePathname.mockReturnValue('/');
    
    render(<Navbar />);
    
    const userAvatar = screen.getByText('U');
    expect(userAvatar).toBeInTheDocument();
    expect(userAvatar).toHaveClass('text-sm', 'font-medium', 'text-gray-700');
  });

  it('has correct link hrefs', () => {
    usePathname.mockReturnValue('/');
    
    render(<Navbar />);
    
    const homeLink = screen.getByText('Home').closest('a');
    expect(homeLink).toHaveAttribute('href', '/user/home');
    
    const ordersLink = screen.getByText('My Orders').closest('a');
    expect(ordersLink).toHaveAttribute('href', '/user/order');
    
    const brandLink = screen.getByText('Inventory System').closest('a');
    expect(brandLink).toHaveAttribute('href', '/');
    
    // Find cart link by its href attribute
    const cartLink = document.querySelector('a[href="/cart"]');
    expect(cartLink).toBeInTheDocument();
  });

  it('applies correct CSS classes to main navigation', () => {
    usePathname.mockReturnValue('/');
    
    const { container } = render(<Navbar />);
    
    expect(container.querySelector('nav')).toHaveClass('bg-white', 'shadow-md');
    
    const containerDiv = container.querySelector('.container');
    expect(containerDiv).toHaveClass('mx-auto', 'px-4', 'py-3', 'flex', 'justify-between', 'items-center');
  });

  it('shows both navigation links in desktop view', () => {
    usePathname.mockReturnValue('/');
    
    const { container } = render(<Navbar />);
    
    // Check if navigation links exist by their text content and href attributes
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('My Orders')).toBeInTheDocument();
    
    const homeLink = screen.getByText('Home').closest('a');
    const ordersLink = screen.getByText('My Orders').closest('a');
    
    expect(homeLink).toHaveAttribute('href', '/user/home');
    expect(ordersLink).toHaveAttribute('href', '/user/order');
  });

  it('renders cart SVG icon', () => {
    usePathname.mockReturnValue('/');
    
    const { container } = render(<Navbar />);
    
    const cartIcon = container.querySelector('svg');
    expect(cartIcon).toBeInTheDocument();
    expect(cartIcon).toHaveAttribute('fill', 'none');
    expect(cartIcon).toHaveAttribute('viewBox', '0 0 24 24');
  });

  it('has user button with focus styles', () => {
    usePathname.mockReturnValue('/');
    
    render(<Navbar />);
    
    const userButton = screen.getByRole('button');
    expect(userButton).toHaveClass('flex', 'items-center', 'space-x-2', 'focus:outline-none');
  });
});
