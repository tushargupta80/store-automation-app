import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ProductsPage = () => {
  const { API_URL, user } = useAuth();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    sku: '',
    category: '',
    costPrice: '',
    sellingPrice: '',
    stockQty: '',
    unit: 'pcs',
  });
  const [search, setSearch] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products`, {
        params: search ? { search } : {},
      });
      setProducts(res.data);
    } catch (error) {
      console.error('Get products error:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/products`, {
        ...form,
        costPrice: Number(form.costPrice),
        sellingPrice: Number(form.sellingPrice),
        stockQty: Number(form.stockQty),
      });
      setForm({
        name: '',
        sku: '',
        category: '',
        costPrice: '',
        sellingPrice: '',
        stockQty: '',
        unit: 'pcs',
      });
      fetchProducts();
    } catch (error) {
      console.error('Create product error:', error);
      alert(error?.response?.data?.message || 'Error creating product');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`${API_URL}/api/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error('Delete product error:', error);
      alert('Error deleting product');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-xl font-bold mb-4">Products</h2>

      {/* Search + Refresh */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <input
          placeholder="Search by name, SKU, or category"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-80"
        />
        <button
          onClick={fetchProducts}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Product Form */}
        {user?.role === 'admin' && (
          <div className="bg-white shadow rounded p-4 lg:col-span-1">
            <h3 className="font-semibold mb-3">Add New Product</h3>
            <form onSubmit={handleCreate} className="space-y-2">
              <input
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              />
              <input
                name="sku"
                placeholder="SKU"
                value={form.sku}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
              <input
                name="category"
                placeholder="Category"
                value={form.category}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
              <input
                name="costPrice"
                type="number"
                placeholder="Cost Price"
                value={form.costPrice}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
              <input
                name="sellingPrice"
                type="number"
                placeholder="Selling Price"
                value={form.sellingPrice}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
              <input
                name="stockQty"
                type="number"
                placeholder="Stock Qty"
                value={form.stockQty}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
              <input
                name="unit"
                placeholder="Unit (e.g., pcs)"
                value={form.unit}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded mt-2"
              >
                Create Product
              </button>
            </form>
          </div>
        )}

        {/* Products Table */}
        <div
          className={
            user?.role === 'admin'
              ? 'bg-white shadow rounded p-4 lg:col-span-2'
              : 'bg-white shadow rounded p-4 lg:col-span-3'
          }
        >
          <h3 className="font-semibold mb-3">Product List</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">SKU</th>
                  <th className="px-3 py-2">Category</th>
                  <th className="px-3 py-2">Selling Price</th>
                  <th className="px-3 py-2">Stock</th>
                  <th className="px-3 py-2">Unit</th>
                  {user?.role === 'admin' && <th className="px-3 py-2">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-t hover:bg-gray-50">
                    <td className="px-3 py-2">{p.name}</td>
                    <td className="px-3 py-2">{p.sku}</td>
                    <td className="px-3 py-2">{p.category}</td>
                    <td className="px-3 py-2">₹ {p.sellingPrice}</td>
                    <td className="px-3 py-2">{p.stockQty}</td>
                    <td className="px-3 py-2">{p.unit}</td>
                    {user?.role === 'admin' && (
                      <td className="px-3 py-2">
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="text-red-600 hover:underline text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td className="px-3 py-4 text-center text-gray-500" colSpan={7}>
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
