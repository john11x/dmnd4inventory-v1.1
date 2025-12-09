'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ProductCard({ product, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="bg-gray-200 h-48 flex items-center justify-center">
        {product.imageUrl ? (
          <Image 
            src={product.imageUrl} 
            alt={product.name}
            width={200}
            height={200}
            className="object-cover h-full w-full"
          />
        ) : (
          <span className="text-gray-400">No image available</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{product.category}</p>
        <p className="text-lg font-bold text-blue-600 mb-3">${product.price.toFixed(2)}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center border rounded">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
            >
              -
            </button>
            <span className="px-3">{quantity}</span>
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
            >
              +
            </button>
          </div>
          
          <button 
            onClick={() => onAddToCart(product, quantity)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
