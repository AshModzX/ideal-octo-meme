'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Category, Product } from '@/lib/types';
import Image from 'next/image';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    description: '',
    imageUrl: '',
    categoryId: '',
  });
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const sessionRes = await fetch('/api/categories');
    if (sessionRes.status === 401) {
      router.push('/admin/login');
    } else {
      setIsLoggedIn(true);
      await fetchData();
    }
  }

  async function fetchData() {
    const [catsRes, prodsRes] = await Promise.all([
      fetch('/api/categories'),
      fetch('/api/products'),
    ]);
    setCategories(await catsRes.json());
    setProducts(await prodsRes.json());
  }

  async function handleLogout() {
    await fetch('/api/login', { method: 'DELETE' });
    router.push('/admin/login');
  }

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCategoryName }),
    });
    setNewCategoryName('');
    await fetchData();
  }

  async function handleUpdateCategory() {
    if (!editingCategory) return;
    await fetch('/api/categories', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingCategory.id, name: editingCategoryName }),
    });
    setEditingCategory(null);
    setEditingCategoryName('');
    await fetchData();
  }

  async function handleDeleteCategory(id: string) {
    if (!confirm('Are you sure you want to delete this category and all its products?')) return;
    await fetch('/api/categories', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    await fetchData();
  }

  async function handleImageUpload(file: File, productId: string) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    await fetch('/api/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: productId, imageUrl: data.url }),
    });
    await fetchData();
  }

  async function handleUpdateProduct() {
    if (!editingProduct) return;
    await fetch('/api/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingProduct.id, ...editingProduct }),
    });
    setEditingProduct(null);
    await fetchData();
  }

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct),
    });
    setNewProduct({ name: '', price: 0, description: '', imageUrl: '', categoryId: '' });
    await fetchData();
  }

  async function handleDeleteProduct(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    await fetch('/api/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    await fetchData();
  }

  const filteredProducts = selectedCategory
    ? products.filter(p => p.categoryId === selectedCategory)
    : products;

  if (isLoggedIn === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-bold mb-4 text-gray-900">Categories</h2>
              
              <form onSubmit={handleAddCategory} className="mb-6">
                <input
                  type="text"
                  placeholder="New category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                />
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  Add Category
                </button>
              </form>

              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg ${
                    !selectedCategory ? 'bg-amber-100 text-amber-900' : 'hover:bg-gray-100'
                  }`}
                >
                  All Products
                </button>
                {categories.map((cat) => (
                  <div key={cat.id} className="space-y-1">
                    {editingCategory?.id === cat.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editingCategoryName}
                          onChange={(e) => setEditingCategoryName(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                        />
                        <button
                          onClick={handleUpdateCategory}
                          className="bg-blue-600 text-white px-3 py-2 rounded-lg"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => setEditingCategory(null)}
                          className="bg-gray-400 text-white px-3 py-2 rounded-lg"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`flex-1 text-left px-3 py-2 rounded-lg ${
                            selectedCategory === cat.id ? 'bg-amber-100 text-amber-900' : 'hover:bg-gray-100'
                          }`}
                        >
                          {cat.name}
                        </button>
                        <button
                          onClick={() => {
                            setEditingCategory(cat);
                            setEditingCategoryName(cat.name);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          🗑
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <h2 className="text-lg font-bold mb-4 text-gray-900">Add New Product</h2>
              <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Product name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
                <select
                  value={newProduct.categoryId}
                  onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Image URL"
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                />
                <textarea
                  placeholder="Description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                  required
                />
                <button
                  type="submit"
                  className="md:col-span-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  Add Product
                </button>
              </form>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-bold mb-4 text-gray-900">Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="relative h-48">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      <label className="absolute inset-0 cursor-pointer bg-black bg-opacity-0 hover:bg-opacity-30 flex items-center justify-center transition-all">
                        <span className="text-white opacity-0 hover:opacity-100 font-semibold">
                          Change Image
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file, product.id);
                          }}
                        />
                      </label>
                    </div>
                    <div className="p-4">
                      {editingProduct?.id === product.id ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editingProduct.name}
                            onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                          />
                          <input
                            type="number"
                            value={editingProduct.price}
                            onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                          />
                          <textarea
                            value={editingProduct.description}
                            onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                            rows={2}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={handleUpdateProduct}
                              className="flex-1 bg-blue-600 text-white py-1 rounded"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingProduct(null)}
                              className="flex-1 bg-gray-400 text-white py-1 rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h3 className="font-semibold text-gray-900">{product.name}</h3>
                          <p className="text-amber-800 font-bold">Rs. {product.price}</p>
                          <p className="text-gray-600 text-sm mt-1">{product.description}</p>
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => setEditingProduct(product)}
                              className="flex-1 bg-blue-600 text-white py-1 rounded text-sm hover:bg-blue-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="flex-1 bg-red-600 text-white py-1 rounded text-sm hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
