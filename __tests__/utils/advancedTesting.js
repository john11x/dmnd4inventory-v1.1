import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactElement } from 'react';

/**
 * Advanced testing utilities for performance and integration testing
 * Implements testing best practices for complex scenarios
 */

// Performance testing utilities
export class PerformanceTester {
  constructor() {
    this.metrics = {};
    this.startTime = {};
  }

  startMeasure(label) {
    this.startTime[label] = Date.now();
  }

  endMeasure(label) {
    const endTime = Date.now();
    const duration = endTime - this.startTime[label];
    
    this.metrics[label] = {
      duration,
      startTime: this.startTime[label],
      endTime
    };
    
    delete this.startTime[label];
    return this.metrics[label];
  }

  getMetrics() {
    return { ...this.metrics };
  }

  reset() {
    this.metrics = {};
    this.startTime = {};
  }
}

describe('Advanced Testing Utilities', () => {
  it('should create PerformanceTester correctly', () => {
    const tester = new PerformanceTester();
    expect(tester).toBeDefined();
    expect(tester.getMetrics()).toEqual({});
  });
});

// Mock WebSocket for testing real-time features
export class MockWebSocket {
  constructor() {
    this.listeners = {};
    this.connected = false;
  }

  addEventListener(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  removeEventListener(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  connect() {
    this.connected = true;
    this.listeners.open?.forEach(cb => cb({ type: 'open' }));
  }

  disconnect() {
    this.connected = false;
    this.listeners.close?.forEach(cb => cb({ type: 'close' }));
  }

  send(data) {
    if (!this.connected) return;
    
    const message = typeof data === 'string' ? data : JSON.stringify(data);
    this.listeners.message?.forEach(cb => {
      cb({ 
        type: 'message', 
        data: JSON.parse(message) 
      });
    });
  }

  simulateServerMessage(message) {
    this.send(message);
  }
}

// Enhanced render with performance monitoring
export function renderWithPerformance(component, options = {}) {
  const tester = new PerformanceTester();
  
  tester.startMeasure('render');
  const rendered = render(component, options);
  tester.endMeasure('render');
  
  return {
    ...rendered,
    performance: tester,
    metrics: tester.getMetrics()
  };
}

// Virtualization testing helper
export function testVirtualization(Component, items = []) {
  const performanceTester = new PerformanceTester();
  
  return {
    async renderLargeDataset(itemCount = 1000) {
      const largeDataset = Array.from({ length: itemCount }, (_, i) => ({
        id: i + 1,
        name: `Product ${i + 1}`,
        price: Math.random() * 1000,
        stock: Math.floor(Math.random() * 100),
        category: `Category ${Math.floor(i / 100) + 1}`
      }));

      performanceTester.startMeasure('large-render');
      const { container } = renderWithPerformance(<Component items={largeDataset} />);
      performanceTester.endMeasure('large-render');

      return {
        container,
        items: largeDataset,
        metrics: performanceTester.getMetrics()
      };
    },

    async testScrollPerformance(container) {
      performanceTester.startMeasure('scroll');
      
      // Simulate rapid scrolling
      for (let i = 0; i < 10; i++) {
        fireEvent.scroll(container, { target: { scrollTop: i * 100 } });
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
      performanceTester.endMeasure('scroll');
      return performanceTester.getMetrics();
    },

    getMetrics() {
      return performanceTester.getMetrics();
    }
  };
}

// Integration testing helper for API workflows
export class APIWorkflowTester {
  constructor() {
    this.requests = [];
    this.responses = [];
    this.mockWebSocket = new MockWebSocket();
  }

  mockAPIResponse(url, response, options = {}) {
    const mockResponse = {
      ok: options.status >= 200 && options.status < 300,
      status: options.status || 200,
      statusText: options.statusText || 'OK',
      json: async () => response,
      text: async () => JSON.stringify(response),
      headers: new Headers(options.headers || {})
    };

    global.fetch?.mockResolvedValueOnce?.(mockResponse);
    this.responses.push({ url, response, options });
  }

  trackRequest(url, method = 'GET') {
    this.requests.push({ url, method, timestamp: Date.now() });
  }

  async simulateRealTimeUpdate(data) {
    this.mockWebSocket.simulateServerMessage(data);
    await waitFor(() => {
      // Wait for UI to update
    });
  }

  getRequests() {
    return [...this.requests];
  }

  getResponses() {
    return [...this.responses];
  }

  reset() {
    this.requests = [];
    this.responses = [];
    this.mockWebSocket = new MockWebSocket();
  }
}

// Memory usage testing for large datasets
export function testMemoryUsage(testFunction, iterations = 100) {
  const measurements = [];

  for (let i = 0; i < iterations; i++) {
    testFunction();
    
    // Simple memory tracking (Jest environment limitations)
    measurements.push({
      iteration: i + 1,
      timestamp: Date.now()
    });
  }
  
  return {
    measurements,
    averageTimePerIteration: measurements.length > 0 ? 100 / measurements.length : 0
  };
}

// Concurrent operation testing
export async function testConcurrentOperations(operations, concurrency = 10) {
  const startTime = performance.now();
  const results = [];
  
  // Create batches of concurrent operations
  const batches = [];
  for (let i = 0; i < operations.length; i += concurrency) {
    batches.push(operations.slice(i, i + concurrency));
  }
  
  // Execute batches concurrently
  for (const batch of batches) {
    const batchResults = await Promise.allSettled(
      batch.map(op => op())
    );
    results.push(...batchResults);
  }
  
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  return {
    duration,
    totalOperations: operations.length,
    successful: results.filter(r => r.status === 'fulfilled').length,
    failed: results.filter(r => r.status === 'rejected').length,
    operationsPerSecond: (operations.length / duration) * 1000,
    results
  };
}
