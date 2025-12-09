"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedClient from "../../components/ProtectedClient";
import { apiGet, apiPost } from "../../lib/api";

export default function ProductDetailPage({ params }) {
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    apiGet(`/api/products/${params.id}`)
      .then(p => {
        if (!mounted) return;
        const mapped = {
          id: p.productId ?? p.id,
          name: p.name,
          category: p.category,
          price: p.price,
          stock: p.stockLevel ?? p.stock ?? 0,
          description: p.description ?? p.desc ?? '',
          image: p.image ?? '�',
          rating: p.rating ?? null,
          reviews: p.reviews ?? 0
        };
        setProduct(mapped);
      })
      .catch(err => { console.error(err); setError(err.message || String(err)); })
      .finally(() => setLoading(false));
    return () => { mounted = false; };
  }, [params.id]);

  const handlePlaceOrder = async () => {
    const prod = product;
    if (!prod) return;
    if (quantity > prod.stock) {
      alert(`Only ${prod.stock} units available`);
      return;
    }

    // try to read user id from localStorage (AuthProvider persists user there)
    let rawUser = null;
    try { rawUser = typeof window !== 'undefined' && localStorage.getItem('user'); } catch (e) { /* ignore */ }
    const parsed = rawUser ? JSON.parse(rawUser) : null;
    const userId = parsed?.id ?? parsed?.userId ?? 1; // fallback to 1 for dev

    try {
      const res = await apiPost('/api/orders', { user_id: userId, product_id: prod.id, quantity });
      // apiPost throws on non-ok; if successful, res is parsed body
      alert('Order placed successfully');
      router.push('/user/order');
    } catch (e) {
      console.error('Order failed', e);
      alert('Failed to place order: ' + (e.message || e));
    }
  };

  if (loading) return <ProtectedClient allowedRoles={["ROLE_USER"]}><div className="p-6">Loading product...</div></ProtectedClient>;
  if (error) return <ProtectedClient allowedRoles={["ROLE_USER"]}><div className="p-6 text-red-600">Error: {error}</div></ProtectedClient>;

  return (
    <ProtectedClient allowedRoles={["ROLE_USER"]}>
      <div className="p-6 bg-gray-50 min-h-screen">
        <button
          onClick={() => router.back()}
          className="mb-6 px-4 py-2 border rounded hover:bg-gray-100"
        >
          ← Back
        </button>

        <div className="bg-white rounded shadow p-8 max-w-3xl">
          <div className="grid grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="flex items-center justify-center">
              <div className="text-9xl">{product.image}</div>
            </div>

            {/* Product Details */}
            <div>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <p className="text-gray-600 mb-2">Category: {product.category}</p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-yellow-500">{product.rating ? '★★★★☆' : ''}</span>
                <span className="text-sm text-gray-600">({product.reviews} reviews)</span>
              </div>

              {/* Price */}
              <p className="text-4xl font-bold text-blue-600 mb-4">${product.price}</p>

              {/* Stock */}
              <div className="mb-6 p-3 bg-gray-100 rounded">
                <p className={`font-bold ${product.stock > 10 ? "text-green-600" : "text-red-600"}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of Stock"}
                </p>
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-6">{product.description}</p>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-bold mb-2">Quantity:</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="border p-2 rounded w-20 text-center"
                    min="1"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={product.stock === 0}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded text-lg font-bold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedClient>
  );
}
