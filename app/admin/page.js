"use client";
import { useEffect, useState } from "react";
import { apiGet, apiDelete } from "@/app/lib/api";
import Link from "next/link";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");

  async function load() {
    try {
      const res = await apiGet("/products");
      setProducts(res?.data || res || []);
    } catch (e) {
      // fallback demo
      setProducts([
        { _id: "p1", name: "Laptop", price: 999, stock: 45, category: "Electronics", image: "/laptop.jpg" },
        { _id: "p2", name: "Mouse", price: 25, stock: 3, category: "Accessories", image: "/mouse.jpg" },
        { _id: "p3", name: "Monitor", price: 299, stock: 12, category: "Electronics", image: "/monitor.jpg" }
      ]);
    }
  }

  useEffect(() => { load(); }, []);

  function filtered() {
    return products.filter(p =>
      (!q || p.name.toLowerCase().includes(q.toLowerCase())) &&
      (!category || p.category === category)
    );
  }

  async function handleDelete(id) {
    if (!confirm("Delete product?")) return;
    try { await apiDelete(`/products/${id}`); } catch {}
    load();
  }

  const cats = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

  return (
    <div className="flex">
      <div className="w-64 p-6 bg-gray-100">
        <h2 className="font-bold mb-4">Products</h2>
        <Link href="/admin/products/create" className="bg-blue-600 text-white px-3 py-2 rounded mb-4 inline-block">+ Add</Link>
        <div className="mt-4">
          <input placeholder="Search" value={q} onChange={e => setQ(e.target.value)} className="w-full border p-2 mb-2" />
          <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border p-2">
            <option value="">All categories</option>
            {cats.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <main className="flex-1 p-6">
        <table className="w-full border">
          <thead className="bg-gray-50">
            <tr><th className="p-2">Name</th><th className="p-2">Category</th><th className="p-2">Price</th><th className="p-2">Stock</th><th className="p-2">Actions</th></tr>
          </thead>
          <tbody>
            {filtered().map(p => (
              <tr key={p._id} className="border-b">
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.category}</td>
                <td className="p-2">${p.price}</td>
                <td className={`p-2 ${p.stock<=5?'text-red-600':p.stock<=15?'text-yellow-600':'text-green-600'}`}>{p.stock}</td>
                <td className="p-2 flex gap-2">
                  <Link href={`/admin/products/${p._id}/edit`} className="text-blue-600">Edit</Link>
                  <button onClick={() => handleDelete(p._id)} className="text-red-600">Delete</button>
                  <button onClick={() => { /* restock quick action */ }} className="text-green-600">Restock</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
