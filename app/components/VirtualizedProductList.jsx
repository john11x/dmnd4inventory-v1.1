import React, { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { useProductOptimization } from '../hooks/useProductOptimization';

/**
 * Virtualized product list for handling large datasets efficiently
 * Implements react-window for performance optimization
 */
const VirtualizedProductList = ({ 
  products = [], 
  filters = {}, 
  sortBy = 'name',
  onProductSelect,
  height = 600,
  itemHeight = 120 
}) => {
  const { products: optimizedProducts, statistics } = useProductOptimization(
    products, 
    filters, 
    sortBy
  );

  // Memoize item renderer to prevent unnecessary re-renders
  const ProductItem = useMemo(() => {
    return ({ index, style }) => {
      const product = optimizedProducts[index];
      
      return (
        <div 
          style={style}
          className="border-b border-gray-200 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
          onClick={() => onProductSelect?.(product)}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{product.description}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm font-medium text-blue-600">
                  ${product.price.toFixed(2)}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  product.stock === 0 
                    ? 'bg-red-100 text-red-800' 
                    : product.stock < 10 
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                }`}>
                  {product.stock === 0 
                    ? 'Out of Stock' 
                    : product.stock < 10 
                      ? `Low Stock (${product.stock})`
                      : `${product.stock} in stock`
                  }
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500">{product.category}</span>
            </div>
          </div>
        </div>
      );
    };
  }, [optimizedProducts, onProductSelect]);

  // Memoize list items
  const listItems = useMemo(() => {
    return optimizedProducts.map((product, index) => ({
      key: product.id,
      index
    }));
  }, [optimizedProducts]);

  if (optimizedProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <div className="text-lg font-medium">No products found</div>
        <div className="text-sm mt-2">Try adjusting your filters</div>
      </div>
    );
  }

  return (
    <div className="virtualized-product-list">
      {/* Statistics Bar */}
      <div className="bg-gray-50 p-4 border-b border-gray-200 mb-4">
        <div className="flex justify-between items-center text-sm">
          <span>Showing {statistics.filteredCount} of {statistics.totalProducts} products</span>
          <div className="flex gap-4">
            <span className="text-green-600">
              {statistics.inStockCount} in stock
            </span>
            <span className="text-yellow-600">
              {statistics.lowStockCount} low stock
            </span>
            <span className="text-red-600">
              {statistics.outOfStockCount} out of stock
            </span>
          </div>
        </div>
      </div>

      {/* Virtualized List */}
      <List
        height={height}
        itemCount={optimizedProducts.length}
        itemSize={itemHeight}
        itemData={listItems}
      >
        {({ index, style }) => {
          const product = optimizedProducts[index];
          return (
            <div style={style}>
              <ProductItem index={index} />
            </div>
          );
        }}
      </List>
    </div>
  );
};

export default VirtualizedProductList;
