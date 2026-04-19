import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const NewSalePage = () => {
  const { API_URL } = useAuth();
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [message, setMessage] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products`);
      setProducts(res.data);
    } catch (error) {
      console.error('Get products error:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, []);

  const addItem = () => {
    if (!selectedProductId) return;
    const prod = products.find((p) => p._id === selectedProductId);
    if (!prod) return;

    const existing = items.find((i) => i.productId === prod._id);
    if (existing) {
      setItems((prev) =>
        prev.map((i) =>
          i.productId === prod._id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      );
    } else {
      setItems((prev) => [
        ...prev,
        {
          productId: prod._id,
          name: prod.name,
          price: prod.sellingPrice,
          quantity,
        },
      ]);
    }
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((i) => i.productId !== id));
  };

  const subtotal = items.reduce(
    (sum, it) => sum + it.price * it.quantity,
    0
  );

  const grandTotal = subtotal - Number(discount || 0) + Number(tax || 0);

  const handleCreateSale = async () => {
    if (items.length === 0) {
      alert('No items in bill');
      return;
    }
    try {
      const res = await axios.post(`${API_URL}/api/sales`, {
        items,
        discount: Number(discount || 0),
        tax: Number(tax || 0),
        paymentMode: 'cash',
      });
      setMessage(`Sale created with Bill No: ${res.data.billNo}`);
      setItems([]);
      setDiscount(0);
      setTax(0);
      setSelectedProductId('');
      setQuantity(1);
    } catch (error) {
      console.error('Create sale error:', error);
      alert(error?.response?.data?.message || 'Error creating sale');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-xl font-bold mb-4">New Sale</h2>

      {message && (
        <p className="mb-4 bg-green-100 text-green-700 border border-green-300 px-3 py-2 rounded">
          {message}
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side: add items */}
        <div className="bg-white shadow rounded p-4 lg:col-span-2">
          <h3 className="font-semibold mb-3">Add Items</h3>

          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="border rounded px-3 py-2 w-full md:w-1/2"
            >
              <option value="">Select Product</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} (₹{p.sellingPrice}) – Stock: {p.stockQty}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value) || 1)}
              className="border rounded px-3 py-2 w-full md:w-24"
            />
            <button
              onClick={addItem}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Add Item
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-3 py-2">Product</th>
                  <th className="px-3 py-2">Price (₹)</th>
                  <th className="px-3 py-2">Qty</th>
                  <th className="px-3 py-2">Line Total (₹)</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.productId} className="border-t hover:bg-gray-50">
                    <td className="px-3 py-2">{it.name}</td>
                    <td className="px-3 py-2">{it.price}</td>
                    <td className="px-3 py-2">{it.quantity}</td>
                    <td className="px-3 py-2">{it.price * it.quantity}</td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => removeItem(it.productId)}
                        className="text-red-600 hover:underline text-xs"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td className="px-3 py-4 text-center text-gray-500" colSpan={5}>
                      No items added
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right side: totals */}
        <div className="bg-white shadow rounded p-4">
          <h3 className="font-semibold mb-3">Bill Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹ {subtotal}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Discount:</span>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="border rounded px-2 py-1 w-24 text-right"
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Tax:</span>
              <input
                type="number"
                value={tax}
                onChange={(e) => setTax(e.target.value)}
                className="border rounded px-2 py-1 w-24 text-right"
              />
            </div>
            <div className="flex justify-between font-semibold border-t pt-2 mt-2">
              <span>Grand Total:</span>
              <span>₹ {grandTotal}</span>
            </div>
            <button
              onClick={handleCreateSale}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded mt-4"
            >
              Create Sale
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewSalePage;
