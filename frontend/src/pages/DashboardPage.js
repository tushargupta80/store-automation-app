import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { API_URL } = useAuth();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/dashboard/summary`);
        setSummary(res.data);
      } catch (err) {
        console.error('Dashboard error:', err);
      }
    };
    fetchSummary();
  }, [API_URL]); // ✅ add API_URL here

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>

      {!summary ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow p-6 rounded">
            <h3 className="text-lg font-semibold text-gray-700">Today's Revenue</h3>
            <p className="text-2xl font-bold mt-2 text-green-600">₹ {summary.todayRevenue}</p>
          </div>

          <div className="bg-white shadow p-6 rounded">
            <h3 className="text-lg font-semibold text-gray-700">Today's Orders</h3>
            <p className="text-2xl font-bold mt-2">{summary.todayOrders}</p>
          </div>

          <div className="bg-white shadow p-6 rounded">
            <h3 className="text-lg font-semibold text-gray-700">Low Stock Items</h3>
            <p className="text-2xl font-bold mt-2 text-red-500">{summary.lowStockCount}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
