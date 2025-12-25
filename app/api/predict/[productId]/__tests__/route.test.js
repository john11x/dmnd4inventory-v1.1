import { GET } from '../route.js';

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

describe('Prediction API Route', () => {
  let mockRequest;
  let mockParams;

  beforeEach(() => {
    mockParams = { productId: '123' };
  });

  describe('GET /api/predict/[productId]', () => {
    it('should return high demand for out of stock items', async () => {
      mockRequest = {
        url: 'http://localhost:3000/api/predict/123?currentStock=0&price=29.99'
      };

      const response = await GET(mockRequest, { params: mockParams });
      const data = response.data;

      expect(response.status).toBe(200);
      expect(data.demand).toBe(Math.ceil(50 * (1000 / 29.99)));
      expect(data.productId).toBe(123);
      expect(data.method).toBe('fallback');
      expect(data.stockLevel).toBe(0);
      expect(data.price).toBe(29.99);
    });

    it('should return moderate demand for low stock items', async () => {
      mockRequest = {
        url: 'http://localhost:3000/api/predict/123?currentStock=5&price=19.99'
      };

      const response = await GET(mockRequest, { params: mockParams });
      const data = response.data;

      expect(response.status).toBe(200);
      expect(data.demand).toBe(Math.ceil(20 * (1000 / 19.99)));
      expect(data.stockLevel).toBe(5);
    });

    it('should return low demand for high stock items', async () => {
      mockRequest = {
        url: 'http://localhost:3000/api/predict/123?currentStock=250&price=49.99'
      };

      const response = await GET(mockRequest, { params: mockParams });
      const data = response.data;

      expect(response.status).toBe(200);
      expect(data.demand).toBe(Math.ceil(5 * (1000 / 49.99)));
      expect(data.stockLevel).toBe(250);
    });

    it('should return baseline demand for normal stock items', async () => {
      mockRequest = {
        url: 'http://localhost:3000/api/predict/123?currentStock=50&price=39.99'
      };

      const response = await GET(mockRequest, { params: mockParams });
      const data = response.data;

      expect(response.status).toBe(200);
      expect(data.demand).toBe(Math.ceil(15 * (1000 / 39.99)));
      expect(data.stockLevel).toBe(50);
    });

    it('should handle edge case of zero price', async () => {
      mockRequest = {
        url: 'http://localhost:3000/api/predict/123?currentStock=10&price=0'
      };

      const response = await GET(mockRequest, { params: mockParams });
      const data = response.data;

      expect(response.status).toBe(200);
      expect(data.demand).toBe(Math.ceil(15 * (1000 / 1))); // stock=10 is normal stock, not low stock
      expect(data.price).toBe(0);
    });

    it('should return 400 error when currentStock is missing', async () => {
      mockRequest = {
        url: 'http://localhost:3000/api/predict/123?price=29.99'
      };

      const response = await GET(mockRequest, { params: mockParams });

      expect(response.status).toBe(400);
      expect(response.data.error).toBe('Missing required parameters: currentStock and price');
    });

    it('should return 400 error when price is missing', async () => {
      mockRequest = {
        url: 'http://localhost:3000/api/predict/123?currentStock=10'
      };

      const response = await GET(mockRequest, { params: mockParams });

      expect(response.status).toBe(400);
      expect(response.data.error).toBe('Missing required parameters: currentStock and price');
    });

    it('should return 400 error when both parameters are missing', async () => {
      mockRequest = {
        url: 'http://localhost:3000/api/predict/123'
      };

      const response = await GET(mockRequest, { params: mockParams });

      expect(response.status).toBe(400);
      expect(response.data.error).toBe('Missing required parameters: currentStock and price');
    });

    it('should handle string parameters correctly', async () => {
      mockRequest = {
        url: 'http://localhost:3000/api/predict/123?currentStock=15&price=25.50'
      };

      const response = await GET(mockRequest, { params: mockParams });
      const data = response.data;

      expect(response.status).toBe(200);
      expect(data.stockLevel).toBe(15);
      expect(data.price).toBe(25.5);
    });

    it('should handle very high prices', async () => {
      mockRequest = {
        url: 'http://localhost:3000/api/predict/123?currentStock=50&price=999.99'
      };

      const response = await GET(mockRequest, { params: mockParams });
      const data = response.data;

      expect(response.status).toBe(200);
      expect(data.demand).toBe(Math.ceil(15 * (1000 / 999.99)));
      expect(data.price).toBe(999.99);
    });

    it('should handle boundary stock level of exactly 10', async () => {
      mockRequest = {
        url: 'http://localhost:3000/api/predict/123?currentStock=10&price=29.99'
      };

      const response = await GET(mockRequest, { params: mockParams });
      const data = response.data;

      expect(response.status).toBe(200);
      expect(data.demand).toBe(Math.ceil(15 * (1000 / 29.99))); // stock=10 is normal stock, not low stock
      expect(data.stockLevel).toBe(10);
    });

    it('should handle boundary stock level of exactly 200', async () => {
      mockRequest = {
        url: 'http://localhost:3000/api/predict/123?currentStock=200&price=29.99'
      };

      const response = await GET(mockRequest, { params: mockParams });
      const data = response.data;

      expect(response.status).toBe(200);
      expect(data.demand).toBe(Math.ceil(15 * (1000 / 29.99))); // Should use normal stock formula
      expect(data.stockLevel).toBe(200);
    });

    it('should convert productId to integer', async () => {
      mockRequest = {
        url: 'http://localhost:3000/api/predict/123?currentStock=50&price=29.99'
      };

      const response = await GET(mockRequest, { params: mockParams });
      const data = response.data;

      expect(response.status).toBe(200);
      expect(data.productId).toBe(123); // Should be number, not string
    });

    it('should handle negative stock values', async () => {
      mockRequest = {
        url: 'http://localhost:3000/api/predict/123?currentStock=-5&price=29.99'
      };

      const response = await GET(mockRequest, { params: mockParams });
      const data = response.data;

      expect(response.status).toBe(200);
      expect(data.stockLevel).toBe(-5);
      expect(data.demand).toBe(Math.ceil(20 * (1000 / 29.99))); // negative stock (< 10) uses low stock formula
    });

    it('should handle decimal stock values', async () => {
      mockRequest = {
        url: 'http://localhost:3000/api/predict/123?currentStock=7.5&price=29.99'
      };

      const response = await GET(mockRequest, { params: mockParams });
      const data = response.data;

      expect(response.status).toBe(200);
      expect(data.stockLevel).toBe(7.5);
      expect(data.demand).toBe(Math.ceil(20 * (1000 / 29.99))); // Should use low stock formula
    });
  });
});
