"use client";
import { useState } from "react";

export default function ProductSearch({ onChange, placeholder = "Search products..." }) {
  const [q, setQ] = useState("");
  function handle(e) {
    const v = e.target.value;
    setQ(v);
    onChange(v);
  }
  return (
    <input
      value={q}
      onChange={handle}
      placeholder={placeholder}
      className="w-full border p-2 rounded mb-4"
    />
  );
}
