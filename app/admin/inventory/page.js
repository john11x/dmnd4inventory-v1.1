"use client";

import { useEffect, useState } from "react";
import ProtectedClient from "../../components/ProtectedClient";
import { apiGet, apiPut } from "../../lib/api";

function getStockLevel(stock, threshold) {
  if (stock === 0) return { color: "bg-red-100 border-red-600", status: "CRITICAL" };
  if (stock <= threshold) return { color: "bg-yellow-100 border-yellow-600", status: "LOW" };
  return { color: "bg-green-100 border-green-600", status: "HEALTHY" };
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    apiGet('/api/products')
      .then(data => {
        if (!mounted) return;
        // map to inventory shape
        const mapped = (Array.isArray(data) ? data : []).map(p => ({
          id: p.productId ?? p.id,
          name: p.name,
          stock: p.stockLevel ?? p.stock ?? 0,
          threshold: 10,
          reorderLevel: 20
        }));
        setInventory(mapped);
      })
      .catch(err => { console.error(err); if (mounted) setError(err.message); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRestock = async (id) => {
    const quantity = prompt("Enter restock quantity:");
    if (quantity) {
      try {
        const newStock = inventory.find(i => i.id === id).stock + parseInt(quantity);
        await apiPut(`/api/products/${id}`, { stockLevel: newStock });
        setInventory(inventory.map(item =>
          item.id === id ? { ...item, stock: newStock } : item
        ));
        alert(`Restocked ${quantity} units`);
      } catch (err) {
        alert('Failed to restock: ' + (err.message || err));
      }
    }
  };

  return (
    <ProtectedClient allowedRoles={["ROLE_ADMIN"]}>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>

        {/* Search */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Inventory Grid */}
        <div className="grid gap-4">
          {loading ? (
            <div className="p-6">Loading inventory...</div>
          ) : error ? (
            <div className="p-6 text-red-600">Error: {error}</div>
          ) : (
            filteredInventory.map(item => {
              const { color, status } = getStockLevel(item.stock, item.threshold);
              return (
                <div key={item.id} className={`${color} p-4 rounded border-l-4`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold">{item.name}</h3>
                      <p className="text-sm text-gray-700">
                        Stock: <span className="font-bold">{item.stock}</span> / 
                        Threshold: <span className="font-bold">{item.threshold}</span> / 
                        Reorder Level: <span className="font-bold">{item.reorderLevel}</span>
                      </p>
                      <p className={`text-sm font-bold ${status === "CRITICAL" ? "text-red-600" : status === "LOW" ? "text-yellow-600" : "text-green-600"}`}>
                        Status: {status}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRestock(item.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Restock Now
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </ProtectedClient>
  );
}
