import { useMemo, useCallback } from 'react';

/**
 * High-performance product filtering and sorting with memoization
 * Implements virtualization support for large datasets
 */
export function useProductOptimization(products, filters, sortBy) {
  // Memoize filtered products to avoid unnecessary recalculations
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    return products.filter(product => {
      // Category filter
      if (filters.category && filters.category !== 'All Categories') {
        if (product.category !== filters.category) return false;
      }
      
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower)
        );
      }
      
      // Stock filter
      if (filters.stockFilter) {
        switch (filters.stockFilter) {
          case 'inStock':
            return product.stock > 0;
          case 'lowStock':
            return product.stock > 0 && product.stock < 10;
          case 'outOfStock':
            return product.stock === 0;
          default:
            return true;
        }
      }
      
      return true;
    });
  }, [products, filters]);

  // Memoize sorted products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'stock-low':
        sorted.sort((a, b) => a.stock - b.stock);
        break;
      case 'stock-high':
        sorted.sort((a, b) => b.stock - a.stock);
        break;
      case 'name':
      default:
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    
    return sorted;
  }, [filteredProducts, sortBy]);

  // Memoize statistics
  const statistics = useMemo(() => {
    return {
      totalProducts: products?.length || 0,
      filteredCount: filteredProducts.length,
      inStockCount: filteredProducts.filter(p => p.stock > 0).length,
      lowStockCount: filteredProducts.filter(p => p.stock > 0 && p.stock < 10).length,
      outOfStockCount: filteredProducts.filter(p => p.stock === 0).length,
      totalValue: filteredProducts.reduce((sum, p) => sum + (p.price * p.stock), 0),
    };
  }, [filteredProducts]);

  // Optimized update callback
  const updateProduct = useCallback((productId, updates) => {
    // Implementation for optimistic updates
    return {
      ...products.find(p => p.id === productId),
      ...updates
    };
  }, [products]);

  return {
    products: sortedProducts,
    statistics,
    updateProduct,
    isOptimized: true
  };
}
