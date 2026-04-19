import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const SalesHistoryPage = () => {
  const { API_URL } = useAuth();
  const [sales, setSales] = useState([]);

  const fetchSales = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/sales`);
      setSales(res.data);
    } catch (error) {
      console.error('Get sales error:', error);
    }
  };

  useEffect(() => {
    fetchSales();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-xl font-bold mb-4">Sales History</h2>

      <div className="bg-white shadow rounded p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-3 py-2">Bill No</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Items</th>
                <th className="px-3 py-2">Grand Total</th>
                <th className="px-3 py-2">Payment Mode</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s) => (
                <tr key={s._id} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-2">{s.billNo}</td>
                  <td className="px-3 py-2">
                    {new Date(s.createdAt).toLocaleString()}
                  </td>
                  <td className="px-3 py-2">
                    {s.items.map((it) => (
                      <div key={it._id}>
                        {it.name} x {it.quantity}
                      </div>
                    ))}
                  </td>
                  <td className="px-3 py-2">₹ {s.grandTotal}</td>
                  <td className="px-3 py-2 uppercase text-xs">{s.paymentMode}</td>
                </tr>
              ))}
              {sales.length === 0 && (
                <tr>
                  <td className="px-3 py-4 text-center text-gray-500" colSpan={5}>
                    No sales yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesHistoryPage;
