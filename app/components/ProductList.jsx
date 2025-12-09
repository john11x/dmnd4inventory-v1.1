"use client";

import ProductCard from "./ProductCard";

export default function ProductList({ products = [], onOrder }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((p) => (
        <ProductCard key={p.id || p._id} product={p} onOrder={onOrder} />
      ))}
    </div>
  );
}
