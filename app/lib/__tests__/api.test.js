import { 
  apiGet, 
  apiPost, 
  apiPut, 
  apiDelete, 
  apiPredict, 
  apiPredictBatch 
} from '../api.js';

// Mock fetch globally
global.fetch = jest.fn();

// Mock console methods to avoid noise in tests
const originalConsoleError = console.error;
const originalConsoleLog = console.log;

// Mock window.location for API tests that need it
const mockLocation = {
  href: 'http://localhost:3000',
  pathname: '/',
  search: '',
  hash: '',
};

beforeEach(() => {
  fetch.mockClear();
  console.error = jest.fn();
  console.log = jest.fn();
  
  // Mock localStorage and window.location
  if (typeof window !== 'undefined') {
    // Only delete and redefine if it exists
    try {
      delete window.location;
      Object.defineProperty(window, 'location', {
        value: mockLocation,
        writable: true,
        configurable: true,
      });
    } catch (e) {
      // If deletion fails, just assign the mock
      window.location = mockLocation;
    }
  }
  localStorage.clear();
});

afterEach(() => {
  console.error = originalConsoleError;
  console.log = originalConsoleLog;
});

describe('API Utility Functions', () => {
  describe('safeFetch (via apiGet)', () => {
    it('should make successful GET request', async () => {
      const mockData = { id: 1, name: 'Test Product' };
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        text: async () => JSON.stringify(mockData)
      });

      const result = await apiGet('/api/products/1');
      
      expect(fetch).toHaveBeenCalledWith(
        '/api/products/1',
        expect.objectContaining({
          credentials: 'include',
          mode: 'cors',
          cache: 'no-store'
        })
      );
      expect(result).toEqual(mockData);
    });

    it('should handle 401 Unauthorized response', async () => {
      // Mock AbortController to prevent timeout issues
      const mockAbortController = {
        signal: {},
        abort: jest.fn()
      };
      global.AbortController = jest.fn(() => mockAbortController);

      const mockResponse = {
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        text: async () => '',
        headers: new Headers({ 'content-type': 'application/json' })
      };
      
      fetch.mockResolvedValueOnce(mockResponse);

      await expect(apiGet('/api/protected')).rejects.toThrow('Network error: Could not connect to the server. Please try again later.');
    });

    it('should handle network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

      await expect(apiGet('/api/products')).rejects.toThrow('Unable to connect to the server. Please make sure the backend is running and accessible.');
    });

    it('should handle timeout errors', async () => {
      fetch.mockImplementationOnce(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => reject(new DOMException('AbortError', 'AbortError')), 100);
        });
      });

      await expect(apiGet('/api/slow')).rejects.toThrow('Network error: Could not connect to the server. Please try again later.');
    });

    it('should handle non-JSON responses', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'text/plain' }),
        text: async () => 'Plain text response'
      });

      const result = await apiGet('/api/text');
      expect(result).toBe('Plain text response');
    });

    it('should handle malformed JSON', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        text: async () => '{ invalid json }'
      });

      await expect(apiGet('/api/malformed')).rejects.toThrow('Network error: Could not connect to the server. Please try again later.');
    });
  });

  describe('apiPost', () => {
    it('should make successful POST request', async () => {
      const postData = { name: 'New Product', price: 29.99 };
      const responseData = { id: 2, ...postData };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        headers: new Headers({ 'content-type': 'application/json' }),
        text: async () => JSON.stringify(responseData)
      });

      const result = await apiPost('/api/products', postData);
      
      expect(fetch).toHaveBeenCalledWith(
        '/api/products',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData)
        })
      );
      expect(result).toEqual(responseData);
    });

    it('should handle POST errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        headers: new Headers({ 'content-type': 'application/json' }),
        text: async () => JSON.stringify({ error: 'Invalid product data' })
      });

      await expect(apiPost('/api/products', {})).rejects.toThrow('Invalid product data');
    });
  });

  describe('apiPut', () => {
    it('should make successful PUT request', async () => {
      const updateData = { name: 'Updated Product', price: 39.99 };
      const responseData = { id: 1, ...updateData };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        text: async () => JSON.stringify(responseData)
      });

      const result = await apiPut('/api/products/1', updateData);
      
      expect(fetch).toHaveBeenCalledWith(
        '/api/products/1',
        expect.objectContaining({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        })
      );
      expect(result).toEqual(responseData);
    });
  });

  describe('apiDelete', () => {
    it('should make successful DELETE request', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
        headers: new Headers(),
        text: async () => ''
      });

      const result = await apiDelete('/api/products/1');
      
      expect(fetch).toHaveBeenCalledWith(
        '/api/products/1',
        expect.objectContaining({
          method: 'DELETE'
        })
      );
      expect(result).toBeNull();
    });
  });

  describe('apiPredict', () => {
    it('should make prediction request with correct parameters', async () => {
      const mockPrediction = { demand: 25, productId: 1 };
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockPrediction
      });

      const result = await apiPredict(1, 50, 29.99);
      
      expect(fetch).toHaveBeenCalledWith(
        '/api/predict/1?currentStock=50&price=29.99',
        expect.objectContaining({
          credentials: 'include',
          mode: 'cors'
        })
      );
      expect(result).toEqual(mockPrediction);
    });

    it('should handle prediction errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      await expect(apiPredict(1, 50, 29.99)).rejects.toThrow('Internal Server Error');
    });
  });

  describe('apiPredictBatch', () => {
    it('should handle successful batch predictions', async () => {
      const products = [
        { id: 1, stock: 50, price: 29.99 },
        { id: 2, stock: 25, price: 19.99 }
      ];
      
      // Mock individual apiPredict calls
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ demand: 25 })
      });
      
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ demand: 15 })
      });

      const results = await apiPredictBatch(products);
      
      expect(results).toHaveLength(2);
      expect(results[0]).toEqual({ productId: 1, demand: 25, error: false });
      expect(results[1]).toEqual({ productId: 2, demand: 15, error: false });
    });

    it('should handle partial failures in batch predictions', async () => {
      const products = [
        { id: 1, stock: 50, price: 29.99 },
        { id: 2, stock: 25, price: 19.99 }
      ];
      
      // Mock one success and one failure
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ demand: 25 })
      });
      
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      const results = await apiPredictBatch(products);
      
      expect(results).toHaveLength(2);
      expect(results[0]).toEqual({ productId: 1, demand: 25, error: false });
      expect(results[1]).toEqual({ productId: 2, demand: 0, error: true });
    });

    it('should handle empty products array', async () => {
      const results = await apiPredictBatch([]);
      expect(results).toHaveLength(0);
    });
  });
});
