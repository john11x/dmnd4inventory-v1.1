"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedClient from "../../components/ProtectedClient";
import { apiGet } from "../../lib/api";

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    
    const fetchData = async () => {
      try {
        if (!mounted) return;
        
        // Fetch orders and products in parallel
        const [orderData, productData] = await Promise.all([
          apiGet('/api/orders'),
          apiGet('/api/products')
        ]);
        
        // Create product lookup map
        const productMap = {};
        (Array.isArray(productData) ? productData : []).forEach(p => {
          productMap[p.productId ?? p.id] = p;
        });
        
        setOrders(Array.isArray(orderData) ? orderData : []);
        setProducts(productMap);
        
      } catch (err) {
        console.error('Failed to fetch data:', err);
        if (mounted) setError(err.message || 'Failed to load orders');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    
    fetchData();
    return () => { mounted = false; };
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
          {error}
        </div>
      </div>
    );
  }

  return (
    <ProtectedClient allowedRoles={["ROLE_USER"]}>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">You haven't placed any orders yet.</p>
            <button
              onClick={() => router.push('/user/home')}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, orderIndex) => {
              // Find the product to get price info
              const product = products[order.productId] || {};
              const price = product.price || 0;
              
              return (
                <div key={order.id || orderIndex} className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                    <div>
                      <span className="font-medium">Order #{order.id || 'Unknown'}</span>
                      <span className="ml-4 text-sm text-gray-500">{order.timestamp ? new Date(order.timestamp).toLocaleDateString() : 'No date'}</span>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status || 'pending')}`}
                    >
                      {order.status || 'Pending'}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{order.productName || 'Unknown Product'}</p>
                          <p className="text-sm text-gray-500">
                            Qty: {order.quantity || 1}
                          </p>
                        </div>
                        <p className="font-medium">${price.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        1 item
                      </span>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-lg font-bold">${(price * (order.quantity || 1)).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ProtectedClient>
  );
}
