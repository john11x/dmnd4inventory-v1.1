// Base URL is empty since we're using Next.js rewrites that already include /api
const BASE_URL = '';
const REQUEST_TIMEOUT = 30000; // 30 seconds for ML predictions

// Default headers for all requests
const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Cache-Control': 'no-cache, no-store, must-revalidate'
};

/**
 * Enhanced fetch wrapper with timeout and better error handling
 */
async function safeFetch(url, opts = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    // Ensure URL is properly formatted
    const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    
    const options = {
      credentials: 'include',
      mode: 'cors',
      headers: { 
        ...defaultHeaders, 
        ...(opts.headers || {}),
      },
      signal: controller.signal,
      ...opts,
    };

    console.log(`[API] ${options.method || 'GET'} ${fullUrl}`, { options });
    
    let res;
    try {
      res = await fetch(fullUrl, options);
      
      // Handle 401 Unauthorized
      if (res.status === 401) {
        // Clear any invalid auth state
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
          if (window.location.pathname !== '/auth') {
            window.location.href = '/auth';
          }
        }
        throw new Error('Session expired. Please log in again.');
      }
      
    } catch (networkError) {
      console.error('[API] Network error:', networkError);
      throw new Error(networkError.message || 'Unable to connect to the server. Please check your network connection and try again.');
    }
    
    clearTimeout(timeoutId);

    // Handle empty responses
    const contentType = res.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    let data;
    
    try {
      const text = await res.text();
      data = text && isJson ? JSON.parse(text) : text;
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
      throw new Error('Invalid response from server');
    }

    if (!res.ok) {
      console.error('API Error Response:', {
        status: res.status,
        statusText: res.statusText,
        url: res.url,
        headers: Object.fromEntries(res.headers.entries()),
        data: data
      });
      
      const error = new Error(data?.message || data?.error || res.statusText || 'Request failed');
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data || null;
  } catch (err) {
    clearTimeout(timeoutId);
    
    if (err.name === 'AbortError') {
      const error = new Error('Request timed out. The server is taking too long to respond.');
      error.status = 408;
      throw error;
    }
    
    // If it's already an error with status, just rethrow
    if (err.status) throw err;
    
    // Handle network errors
    if (err.message.includes('Failed to fetch')) {
      const error = new Error('Unable to connect to the server. Please make sure the backend is running and accessible.');
      error.status = 503;
      throw error;
    }
    
    console.error(`API call failed for ${url}:`, err);
    throw err;
  }
}

export async function apiGet(path) {
  try {
    // Ensure path starts with a slash and preserve /api prefix so Next.js rewrites work
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const url = `${BASE_URL}${normalizedPath}`;
    
    console.log(`[apiGet] Making request to: ${url}`);
    return await safeFetch(url, { 
      cache: "no-store",
      credentials: 'include'
    });
  } catch (error) {
    console.error(`GET request to ${path} failed:`, error);
    // Enhance the error with more context
    if (!error.status) {
      error.status = 500;
      error.message = 'Network error: Could not connect to the server. Please try again later.';
    }
    throw error;
  }
}

export async function apiPost(path, data) {
  try {
    const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
    return await safeFetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error(`POST request to ${path} failed:`, error);
    throw error;
  }
}

export async function apiPut(path, data) {
  try {
    const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
    return await safeFetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error(`PUT request to ${path} failed:`, error);
    throw error;
  }
}

export async function apiDelete(path) {
  try {
    const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
    return await safeFetch(url, { method: "DELETE" });
  } catch (error) {
    console.error(`DELETE request to ${path} failed:`, error);
    throw error;
  }
}

export async function apiPredict(productId, currentStock, price) {
  try {
    const params = new URLSearchParams({
      currentStock: currentStock.toString(),
      price: price.toString()
    });
    const url = `/api/predict/${productId}?${params}`;

    const options = {
      credentials: 'include',
      mode: 'cors',
      headers: { ...defaultHeaders },
    };

    console.log(`[apiPredict] Making request to: ${url}`);
    const res = await fetch(url.startsWith('http') ? url : `${BASE_URL}${url}`, options);

    if (!res.ok) {
      const err = new Error(res.statusText || 'Prediction request failed');
      err.status = res.status;
      throw err;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Prediction request for product ${productId} failed:`, error);
    throw error;
  }
}

export async function apiPredictBatch(products) {
  try {
    const predictions = await Promise.allSettled(
      products.map(product => 
        apiPredict(product.id, product.stock, product.price)
          .catch(error => {
            console.error(`Failed to predict demand for product ${product.id}:`, error);
            return { demand: 0, error: true };
          })
      )
    );
    
    return predictions.map((result, index) => ({
      productId: products[index].id,
      demand: result.status === 'fulfilled' ? (result.value?.demand || result.value?.predictedDemand || 0) : 0,
      error: result.status === 'rejected' || result.value?.error || false
    }));
  } catch (error) {
    console.error('Batch prediction failed:', error);
    throw error;
  }
}
