'use client';

import { useState, useEffect } from 'react';
import { Category, Product } from '@/lib/types';
import Image from 'next/image';

interface Props {
  searchParams: { category?: string };
}

export default function ProductsPage({ searchParams }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.category || null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function fetchData() {
      const [catsRes, prodsRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/products'),
      ]);
      const cats = await catsRes.json();
      const prods = await prodsRes.json();
      setCategories(cats);
      setProducts(prods);
    }
    fetchData();
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter(p => p.categoryId === selectedCategory)
    : products;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">Our Products</h1>
      
      <div className="mb-8 flex flex-wrap gap-4 justify-center">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-6 py-2 rounded-full font-medium transition-colors ${
            !selectedCategory
              ? 'bg-amber-800 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Products
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              selectedCategory === cat.id
                ? 'bg-amber-800 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => setSelectedProduct(product)}
          >
            <div className="relative h-64">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
              <p className="text-xl font-bold text-amber-800">Rs. {product.price}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
              >
                ✕
              </button>
              <div className="h-80 relative">
                <Image
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  fill
                  className="object-cover rounded-t-2xl"
                />
              </div>
            </div>
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedProduct.name}</h2>
              <p className="text-2xl font-bold text-amber-800 mb-4">Rs. {selectedProduct.price}</p>
              <p className="text-gray-600 leading-relaxed">{selectedProduct.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
