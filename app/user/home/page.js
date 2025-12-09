"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedClient from "../../components/ProtectedClient";
import { apiGet, apiPost } from "../../lib/api";

export default function UserHome() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("name");
  const [filterCategory, setFilterCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderQty, setOrderQty] = useState(1);
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    apiGet('/api/products')
      .then(data => {
        if (!mounted) return;
        const mapped = (Array.isArray(data) ? data : []).map(p => ({
          id: p.productId ?? p.id,
          name: p.name,
          category: p.category,
          price: p.price,
          stock: p.stockLevel ?? p.stock ?? 0,
          description: p.description,
          image: p.imageUrl || null
        }));
        setProducts(mapped);
      })
      .catch(err => { 
        console.error(err); 
        if (mounted) setError(err.message || String(err)); 
      })
      .finally(() => { 
        if (mounted) setLoading(false); 
      });
    return () => { mounted = false; };
  }, []);

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  
  const filteredProducts = products
    .filter(p => 
      (filterCategory === "" || p.category === filterCategory) &&
      (searchTerm === "" || 
       p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase())))
    )
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      return a.name.localeCompare(b.name);
    });

  const openOrderModal = (product) => {
    setSelectedProduct(product);
    setOrderQty(1);
    setShowModal(true);
  };

  // Function to get appropriate icon based on product
  const getProductIcon = (name, category) => {
    const lowerName = name.toLowerCase();
    const lowerCategory = category.toLowerCase();
    
    // Operating Systems Icons
    if (lowerCategory.includes('operating system') || lowerName.includes('sentora')) {
      if (lowerName.includes('4.4') || lowerName.includes('4.5')) {
        // Server/Enterprise OS
        return (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
          </svg>
        );
      } else if (lowerName.includes('4.6') || lowerName.includes('4.7')) {
        // Cloud/Container OS
        return (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
        );
      } else {
        // Advanced/Future OS
        return (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        );
      }
    }
    
    // Database Products
    if (lowerCategory.includes('database') || lowerName.includes('sql') || lowerName.includes('db')) {
      return (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      );
    }
    
    // Security Products
    if (lowerCategory.includes('security') || lowerName.includes('firewall') || lowerName.includes('protect')) {
      return (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      );
    }
    
    // Network/Cloud Products
    if (lowerCategory.includes('network') || lowerCategory.includes('cloud') || lowerName.includes('azure') || lowerName.includes('aws')) {
      return (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    }
    
    // Development Tools
    if (lowerCategory.includes('development') || lowerCategory.includes('programming') || lowerName.includes('code') || lowerName.includes('dev')) {
      return (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      );
    }
    
    // Analytics/AI Products
    if (lowerCategory.includes('analytics') || lowerCategory.includes('ai') || lowerName.includes('ml') || lowerName.includes('intelligence')) {
      return (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    }
    
    // Default tech icon
    return (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    );
  };

  const handlePlaceOrder = async () => {
    if (!selectedProduct) {
      alert('No product selected');
      return;
    }

    // Convert values to numbers
    const quantity = Number(orderQty);
    const stock = Number(selectedProduct.stock);
    
    if (isNaN(quantity) || quantity <= 0) {
      alert('Please enter a valid quantity');
      return;
    }
    
    if (quantity > stock) {
      alert(`Only ${stock} units available`);
      return;
    }
    
    setOrdering(true);
    try {
      // Get user data from localStorage
      const rawUser = typeof window !== 'undefined' && localStorage.getItem('user');
      if (!rawUser) {
        router.push('/auth');
        return;
      }

      let user;
      try {
        user = JSON.parse(rawUser);
      } catch (e) {
        console.error('Error parsing user data:', e);
        localStorage.removeItem('user');
        router.push('/auth');
        return;
      }

      console.log('Raw stored user object:', user);
      const isDevelopment = process.env.NODE_ENV === 'development';
      let userId = user?.id;
      
      if (isDevelopment && !userId) {
        // Use a known test user ID for development
        userId = 1; // Make sure this ID exists in your database
        console.warn('Using test user ID for development:', userId);
      }

      if (!userId) {
        console.error('No user ID found in user data:', user);
        alert('Invalid user session. Please log in again.');
        router.push('/auth');
        return;
      }

      console.log('Placing order with:', { 
        userId, 
        productId: selectedProduct.id, 
        quantity 
      });

      const response = await apiGet(`/api/products?t=${Date.now()}`);
      console.log('Raw backend response:', response);
      const orderResponse = await apiPost('/api/orders', { 
        user_id: Number(userId), 
        product_id: Number(selectedProduct.id), 
        quantity: quantity 
      });

      console.log('Order response:', orderResponse);
      console.log('Order response:', response);
      
      // Optimistic update
      setProducts(prev => prev.map(p => 
        p.id === selectedProduct.id 
          ? { ...p, stock: Math.max(0, stock - quantity) } 
          : p
      ));
      
      setShowModal(false);
      alert('✓ Order placed successfully!');
    } catch (err) {
      console.error('Order placement error:', {
        message: err.message,
        status: err.status,
        data: err.data,
        stack: err.stack
      });
      
      let errorMessage = '❌ Failed to place order: ';
      if (err.status === 401 || err.status === 403) {
        errorMessage += 'Please log in to place an order.';
        router.push('/auth');
      } else if (err.data?.error) {
        // Handle user not found error specifically
        if (err.data.error.includes('User not found')) {
          errorMessage += 'Invalid user session. Please log in again.';
          localStorage.removeItem('user');
          router.push('/auth');
        } else {
          errorMessage += err.data.error;
        }
      } else {
        errorMessage += err.message || 'Unknown error occurred';
      }
      
      alert(errorMessage);
    } finally {
      setOrdering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading products: {error}
        </div>
      </div>
    );
  }

  return (
    <ProtectedClient allowedRoles={["ROLE_USER"]}>
      <div className="min-h-screen bg-slate-950 text-white px-4 py-8">
        {/* Search and Filter */}
        <div className="mb-10 space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search OS versions..."
              className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-indigo-400/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="w-full md:w-48 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-indigo-400/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="" className="text-gray-900">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category} className="text-gray-900">
                  {category}
                </option>
              ))}
            </select>
            <select
              className="w-full md:w-48 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-indigo-400/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name" className="text-gray-900">Sort by Name</option>
              <option value="price-low" className="text-gray-900">Price: Low to High</option>
              <option value="price-high" className="text-gray-900">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="group frosted-card rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl hover:border-indigo-400/30 hover:shadow-indigo-500/20 transition-all duration-500 hover:scale-105 card-hover"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="h-32 bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-2xl flex items-center justify-center mb-4 group-hover:from-indigo-800/50 group-hover:to-fuchsia-800/50 transition-all duration-300">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 flex items-center justify-center">
                    {getProductIcon(product.name, product.category)}
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-white">{product.name}</h3>
                <p className="text-sm text-slate-300">{product.category}</p>
                <p className="text-2xl font-bold text-indigo-300">
                  ${product.price.toFixed(2)}
                </p>
                <p className="text-sm text-slate-400 line-clamp-2">
                  {product.description || 'No description available'}
                </p>
                <div className="flex justify-between items-center pt-2">
                  <span
                    className={`text-sm font-medium ${
                      product.stock > 0 ? 'text-emerald-300' : 'text-rose-300'
                    }`}
                  >
                    {product.stock > 0
                      ? `${product.stock} licenses available`
                      : 'Out of licenses'}
                  </span>
                  <button
                    onClick={() => openOrderModal(product)}
                    disabled={product.stock === 0}
                    className={`btn-primary rounded-2xl px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] shadow-lg transition-all duration-300 ${
                      product.stock > 0
                        ? 'bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-orange-400 text-white hover:scale-105 hover:shadow-xl'
                        : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {product.stock > 0 ? (
                      <span className="flex items-center gap-2">
                        Deploy Now
                        <svg className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    ) : (
                      'No Licenses'
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Modal */}
        {showModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-xl font-bold mb-4 text-white">Place Order</h3>
              <div className="mb-4">
                <p className="font-medium text-white">{selectedProduct.name}</p>
                <p className="text-slate-300">${selectedProduct.price.toFixed(2)} each</p>
                <p className="text-sm text-slate-400">
                  Available: {selectedProduct.stock} units
                </p>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Quantity
                </label>
                <div className="flex items-center">
                  <button
                    onClick={() => setOrderQty(Math.max(1, orderQty - 1))}
                    className="px-3 py-1 bg-slate-700 text-white rounded-l hover:bg-slate-600 transition-colors"
                    disabled={orderQty <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={selectedProduct.stock}
                    value={orderQty}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10) || 1;
                      setOrderQty(Math.min(Math.max(1, value), selectedProduct.stock));
                    }}
                    className="w-20 px-3 py-1 text-center bg-slate-800 text-white border border-slate-600 focus:border-indigo-400 focus:outline-none"
                  />
                  <button
                    onClick={() => setOrderQty(Math.min(selectedProduct.stock, orderQty + 1))}
                    className="px-3 py-1 bg-slate-700 text-white rounded-r hover:bg-slate-600 transition-colors"
                    disabled={orderQty >= selectedProduct.stock}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="mb-4 p-3 bg-slate-800 rounded-lg">
                <p className="text-sm text-slate-300">
                  Total: <span className="font-bold text-white">${(selectedProduct.price * orderQty).toFixed(2)}</span>
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors"
                  disabled={ordering}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePlaceOrder}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-orange-400 text-white rounded-lg hover:scale-105 transition-all duration-300 font-semibold"
                  disabled={ordering}
                >
                  {ordering ? 'Placing Order...' : 'Deploy Now'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedClient>
  );
}
