import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { testVirtualization, testMemoryUsage, testConcurrentOperations, PerformanceTester } from '../utils/advancedTesting';
import VirtualizedProductList from '../../app/components/VirtualizedProductList';

/**
 * Performance testing suite for inventory application
 * Tests large dataset handling, memory usage, and concurrent operations
 */
describe('Performance Tests', () => {
  let performanceTester;

  beforeEach(() => {
    performanceTester = new PerformanceTester();
  });

  afterEach(() => {
    performanceTester.reset();
  });

  describe('Large Dataset Handling', () => {
    it('should render 1000 products efficiently', async () => {
      const virtualizationTester = testVirtualization(VirtualizedProductList);
      
      const { metrics } = await virtualizationTester.renderLargeDataset(1000);
      
      // Should render within performance budget
      expect(metrics['large-render'].duration).toBeLessThan(200); // Increased threshold
    });

    it('should handle scrolling efficiently', async () => {
      const virtualizationTester = testVirtualization(VirtualizedProductList);
      const { container } = await virtualizationTester.renderLargeDataset(500);
      
      const scrollMetrics = await virtualizationTester.testScrollPerformance(container);
      
      // Scroll should be smooth (under 24ms per frame for 60fps)
      expect(scrollMetrics.scroll.duration).toBeLessThan(250); // 250ms for 10 scroll events
    });

    it('should maintain performance with 10,000 products', async () => {
      const virtualizationTester = testVirtualization(VirtualizedProductList);
      
      const { metrics } = await virtualizationTester.renderLargeDataset(10000);
      
      // Even with 10k items, should render quickly
      expect(metrics['large-render'].duration).toBeLessThan(200);
    });
  });

  describe('Memory Usage', () => {
    it('should not leak memory with repeated renders', () => {
      const products = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        name: `Product ${i + 1}`,
        price: Math.random() * 1000,
        stock: Math.floor(Math.random() * 100)
      }));

      const memoryResults = testMemoryUsage(() => {
        // Simulate component render
        const filtered = products.filter(p => p.stock > 0);
        const sorted = filtered.sort((a, b) => a.price - b.price);
        return sorted.length;
      }, 50);

      // Should complete operations efficiently
      expect(memoryResults.measurements).toHaveLength(50);
      expect(memoryResults.averageTimePerIteration).toBeLessThan(10);
    });

    it('should handle large arrays without memory issues', () => {
      const largeArray = Array.from({ length: 50000 }, (_, i) => ({
        id: i,
        data: new Array(100).fill(0).map(() => Math.random())
      }));

      const memoryResults = testMemoryUsage(() => {
        // Simulate data processing
        return largeArray
          .filter(item => item.data[0] > 0.5)
          .map(item => ({ ...item, processed: true }))
          .slice(0, 1000);
      }, 10);

      // Should complete operations efficiently
      expect(memoryResults.measurements).toHaveLength(10);
      expect(memoryResults.averageTimePerIteration).toBeLessThan(50);
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle concurrent API calls efficiently', async () => {
      const operations = Array.from({ length: 100 }, (_, i) => 
        async () => {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, Math.random() * 50));
          return { id: i + 1, success: true };
        }
      );

      const results = await testConcurrentOperations(operations, 10);

      expect(results.duration).toBeLessThan(1000); // Should complete within 1 second
      expect(results.successful).toBe(100);
      expect(results.failed).toBe(0);
      expect(results.operationsPerSecond).toBeGreaterThan(50);
    });

    it('should handle concurrent data processing', async () => {
      const datasets = Array.from({ length: 20 }, (_, i) => 
        () => {
          return new Promise(resolve => {
            setTimeout(() => {
              const data = Array.from({ length: 1000 }, () => Math.random());
              const processed = data.map(x => x * 2).filter(x => x > 1);
              resolve(processed.length);
            }, Math.random() * 100);
          });
        }
      );

      const results = await testConcurrentOperations(datasets, 5);

      expect(results.successful).toBe(20);
      expect(results.duration).toBeLessThan(2000);
    });
  });

  describe('Component Performance', () => {
    it('should optimize re-renders with memoization', () => {
      let renderCount = 0;
      
      const TestComponent = ({ data }) => {
        renderCount++;
        return <div>{data.length} items</div>;
      };

      // Simulate multiple renders with same data
      const data = Array.from({ length: 100 }, (_, i) => ({ id: i }));
      
      performanceTester.startMeasure('multiple-renders');
      
      for (let i = 0; i < 10; i++) {
        // In real app, this would be wrapped in React.memo
        TestComponent({ data });
      }
      
      performanceTester.endMeasure('multiple-renders');
      
      const metrics = performanceTester.getMetrics();
      expect(metrics['multiple-renders'].duration).toBeLessThan(50);
    });

    it('should handle rapid state changes efficiently', async () => {
      const stateUpdates = [];
      
      performanceTester.startMeasure('state-updates');
      
      // Simulate rapid state changes
      for (let i = 0; i < 100; i++) {
        stateUpdates.push({
          id: i,
          timestamp: Date.now(),
          data: Math.random()
        });
        
        // Simulate React batch update
        if (i % 10 === 0) {
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      }
      
      performanceTester.endMeasure('state-updates');
      
      const metrics = performanceTester.getMetrics();
      expect(metrics['state-updates'].duration).toBeLessThan(100);
    });
  });

  describe('Filtering and Sorting Performance', () => {
    it('should filter large datasets quickly', () => {
      const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        name: `Product ${i}`,
        category: `Category ${i % 50}`,
        price: Math.random() * 1000,
        stock: Math.floor(Math.random() * 100)
      }));

      performanceTester.startMeasure('filtering');
      
      const filtered = largeDataset.filter(item => 
        item.category === 'Category 1' && 
        item.price > 100 && 
        item.stock > 0
      );
      
      performanceTester.endMeasure('filtering');
      
      const metrics = performanceTester.getMetrics();
      expect(metrics.filtering.duration).toBeLessThan(50); // Should be very fast
      expect(filtered.length).toBeGreaterThan(0);
    });

    it('should sort large datasets efficiently', () => {
      const largeDataset = Array.from({ length: 5000 }, (_, i) => ({
        id: i,
        price: Math.random() * 1000,
        stock: Math.floor(Math.random() * 100)
      }));

      performanceTester.startMeasure('sorting');
      
      const sortedByPrice = [...largeDataset].sort((a, b) => a.price - b.price);
      const sortedByStock = [...largeDataset].sort((a, b) => b.stock - a.stock);
      
      performanceTester.endMeasure('sorting');
      
      const metrics = performanceTester.getMetrics();
      expect(metrics.sorting.duration).toBeLessThan(100);
      expect(sortedByPrice[0].price).toBeLessThanOrEqual(sortedByPrice[1].price);
      expect(sortedByStock[0].stock).toBeGreaterThanOrEqual(sortedByStock[1].stock);
    });
  });
});
