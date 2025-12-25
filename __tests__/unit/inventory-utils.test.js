/**
 * Unit tests for inventory utility functions
 * @module __tests__/unit/inventory-utils.test
 */

/**
 * Calculates reorder recommendations for inventory items
 * @param {Array} products - Array of product objects
 * @returns {Array} Array of reorder recommendations
 */
function calculateReorderRecommendations(products) {
  return products.map(product => {
    const daysOfStock = product.stock / (product.dailyUsage || 1);
    const reorderPoint = (product.leadTime || 0) * (product.dailyUsage || 0) * 1.5; // 50% safety buffer
    const reorderQuantity = Math.max(
      ((product.leadTime || 0) * (product.dailyUsage || 0) * 2) - product.stock,
      0
    );
    
    return {
      productId: product.id,
      productName: product.name,
      currentStock: product.stock,
      reorderNeeded: product.stock <= reorderPoint,
      reorderPoint: Math.ceil(reorderPoint),
      reorderQuantity: Math.ceil(reorderQuantity),
      estimatedStockoutInDays: Math.floor(daysOfStock)
    };
  });
}

describe('Inventory Utility Functions', () => {
  describe('calculateReorderRecommendations', () => {
    it('should calculate correct reorder points', () => {
      const products = [
        { id: 1, name: 'Laptop', stock: 5, leadTime: 7, dailyUsage: 2 },
        { id: 2, name: 'Mouse', stock: 20, leadTime: 3, dailyUsage: 1 }
      ];

      const recommendations = calculateReorderRecommendations(products);
      
      // Laptop: 7 days lead time * 2 daily usage * 1.5 = 21 reorder point
      expect(recommendations[0].reorderPoint).toBe(21);
      expect(recommendations[0].reorderNeeded).toBe(true);
      
      // Mouse: 3 days * 1 daily usage * 1.5 = 4.5 (ceiled to 5) reorder point
      expect(recommendations[1].reorderPoint).toBe(5);
      expect(recommendations[1].reorderNeeded).toBe(false);
    });

    it('should calculate correct reorder quantities', () => {
      const products = [
        { id: 1, name: 'Laptop', stock: 5, leadTime: 7, dailyUsage: 2 },
        { id: 2, name: 'Monitor', stock: 3, leadTime: 5, dailyUsage: 1 }
      ];

      const recommendations = calculateReorderRecommendations(products);
      
      // Laptop: (7 * 2 * 2) - 5 = 23
      expect(recommendations[0].reorderQuantity).toBe(23);
      
      // Monitor: (5 * 1 * 2) - 3 = 7
      expect(recommendations[1].reorderQuantity).toBe(7);
    });

    it('should handle zero or missing values', () => {
      const products = [
        { id: 1, name: 'Keyboard', stock: 0, leadTime: 0, dailyUsage: 0 },
        { id: 2, name: 'Mousepad', stock: 10 } // Missing leadTime and dailyUsage
      ];

      const recommendations = calculateReorderRecommendations(products);
      
      // Should handle division by zero and missing values
      expect(recommendations[0].reorderPoint).toBe(0);
      expect(recommendations[0].reorderNeeded).toBe(true);
      
      expect(recommendations[1].reorderPoint).toBe(0);
      expect(recommendations[1].reorderNeeded).toBe(false);
    });
  });

  describe('Inventory Optimization', () => {
    /**
     * Implements the Economic Order Quantity (EOQ) model
     * @param {number} demand - Annual demand quantity
     * @param {number} setupCost - Cost per order
     * @param {number} holdingCost - Annual holding cost per unit
     * @returns {Object} EOQ and related metrics
     */
    function calculateEOQ(demand, setupCost, holdingCost) {
      if (demand <= 0 || setupCost <= 0 || holdingCost <= 0) {
        throw new Error('All parameters must be positive numbers');
      }
      
      const eoq = Math.sqrt((2 * demand * setupCost) / holdingCost);
      const ordersPerYear = demand / eoq;
      const timeBetweenOrders = 365 / ordersPerYear;
      
      return {
        eoq: Math.ceil(eoq),
        ordersPerYear: Math.round(ordersPerYear * 100) / 100,
        timeBetweenOrders: Math.round(timeBetweenOrders * 10) / 10 // Round to 1 decimal
      };
    }

    it('should calculate EOQ correctly', () => {
      // Test case 1
      const result1 = calculateEOQ(1000, 10, 0.5);
      expect(result1.eoq).toBe(200);
      expect(result1.ordersPerYear).toBeCloseTo(5, 2); // Allow 2 decimal places of precision
      expect(result1.timeBetweenOrders).toBeCloseTo(73, 0); // Allow integer comparison
      
      // Test case 2
      const result2 = calculateEOQ(500, 25, 5);
      expect(result2.eoq).toBe(71);
      expect(result2.ordersPerYear).toBeCloseTo(7.07, 2); // Allow 2 decimal places of precision
      expect(result2.timeBetweenOrders).toBeCloseTo(51.6, 1); // Allow 1 decimal place of precision
    });

    it('should throw error for invalid inputs', () => {
      expect(() => calculateEOQ(0, 10, 5)).toThrow('All parameters must be positive numbers');
      expect(() => calculateEOQ(100, -1, 5)).toThrow('All parameters must be positive numbers');
      expect(() => calculateEOQ(100, 10, 0)).toThrow('All parameters must be positive numbers');
    });
  });
});
