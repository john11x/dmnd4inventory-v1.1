import { POST, GET } from '../route.js';

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data, options) => ({
      data,
      status: options?.status || 200,
      headers: new Headers({ 'content-type': 'application/json' })
    })
  }
}));

// Mock global fetch
global.fetch = jest.fn();

describe('Orders API Route', () => {
  beforeEach(() => {
    fetch.mockClear();
    console.error = jest.fn();
    console.log = jest.fn();
  });

  describe('POST /api/orders', () => {
    it('should forward order request to Java backend successfully', async () => {
      const mockRequestBody = {
        product_id: 1,
        quantity: 5
      };

      const mockBackendResponse = {
        id: 123,
        userId: 6,
        productId: 1,
        quantity: 5,
        status: 'PENDING',
        orderDate: new Date().toISOString()
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => mockBackendResponse
      });

      const mockRequest = {
        json: async () => mockRequestBody
      };

      const response = await POST(mockRequest);
      const data = response.data;

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/orders',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: 6,
            product_id: 1,
            quantity: 5
          })
        })
      );

      expect(response.status).toBe(200);
      expect(data).toEqual(mockBackendResponse);
    });

    it('should return demo mode response when backend fails', async () => {
      const mockRequestBody = {
        product_id: 1,
        quantity: 5
      };

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Database connection failed' })
      });

      const mockRequest = {
        json: async () => mockRequestBody
      };

      const response = await POST(mockRequest);
      const data = response.data;

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Order placed successfully (demo mode)');
      expect(typeof data.orderId).toBe('number');
      expect(data.orderId).toBeGreaterThanOrEqual(0);
      expect(data.orderId).toBeLessThan(10000);
    });

    it('should handle backend error with invalid JSON response', async () => {
      const mockRequestBody = {
        product_id: 1,
        quantity: 5
      };

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => {
          throw new Error('Invalid JSON');
        }
      });

      const mockRequest = {
        json: async () => mockRequestBody
      };

      const response = await POST(mockRequest);
      const data = response.data;

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Order placed successfully (demo mode)');
    });

    it('should handle network errors with fallback to demo mode', async () => {
      const mockRequestBody = {
        product_id: 1,
        quantity: 5
      };

      fetch.mockRejectedValueOnce(new Error('Network error'));

      const mockRequest = {
        json: async () => mockRequestBody
      };

      const response = await POST(mockRequest);
      const data = response.data;

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Order placed successfully (demo mode)');
      expect(console.error).toHaveBeenCalledWith('Order API error:', expect.any(Error));
    });

    it('should handle invalid JSON in request body', async () => {
      const mockRequest = {
        json: async () => {
          throw new Error('Invalid JSON');
        }
      };

      const response = await POST(mockRequest);
      const data = response.data;

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Order placed successfully (demo mode)');
      expect(console.error).toHaveBeenCalledWith('Order API error:', expect.any(Error));
    });

    it('should always use userId 6 for demo purposes', async () => {
      const mockRequestBody = {
        product_id: 2,
        quantity: 10
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({ id: 456 })
      });

      const mockRequest = {
        json: async () => mockRequestBody
      };

      await POST(mockRequest);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/orders',
        expect.objectContaining({
          body: JSON.stringify({
            user_id: 6, // Always 6
            product_id: 2,
            quantity: 10
          })
        })
      );
    });

    it('should log order placement details', async () => {
      const mockRequestBody = {
        product_id: 1,
        quantity: 5
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({ id: 123 })
      });

      const mockRequest = {
        json: async () => mockRequestBody
      };

      await POST(mockRequest);

      expect(console.log).toHaveBeenCalledWith('Placing order for user:', 6, 'product:', 1);
    });
  });

  describe('GET /api/orders', () => {
    it('should retrieve orders from Java backend successfully', async () => {
      const mockBackendOrders = [
        {
          id: 1,
          userId: 6,
          productId: 1,
          quantity: 5,
          status: 'COMPLETED',
          orderDate: new Date().toISOString()
        },
        {
          id: 2,
          userId: 6,
          productId: 2,
          quantity: 3,
          status: 'PENDING',
          orderDate: new Date().toISOString()
        }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockBackendOrders
      });

      const response = await GET();
      const data = response.data;

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/orders',
        expect.objectContaining({
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
      );

      expect(response.status).toBe(200);
      expect(data).toEqual(mockBackendOrders);
    });

    it('should return error response when backend fails', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      const response = await GET();
      const data = response.data;

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to retrieve orders');
    });

    it('should return mock orders when network error occurs', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const response = await GET();
      const data = response.data;

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(1);
      expect(data[0]).toMatchObject({
        id: 1,
        userId: 1,
        productId: 1,
        quantity: 5,
        status: 'COMPLETED'
      });
      expect(data[0].orderDate).toBeDefined();
      expect(console.error).toHaveBeenCalledWith('Get orders error:', expect.any(Error));
    });

    it('should return mock orders with proper structure', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const response = await GET();
      const data = response.data;

      expect(Array.isArray(data)).toBe(true);
      expect(data[0]).toHaveProperty('id');
      expect(data[0]).toHaveProperty('userId');
      expect(data[0]).toHaveProperty('productId');
      expect(data[0]).toHaveProperty('quantity');
      expect(data[0]).toHaveProperty('status');
      expect(data[0]).toHaveProperty('orderDate');
      expect(typeof data[0].orderDate).toBe('string');
    });

    it('should handle backend response with invalid JSON', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => {
          throw new Error('Invalid JSON');
        }
      });

      const response = await GET();
      const data = response.data;

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to retrieve orders');
    });
  });
});
