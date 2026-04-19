import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import NewSalePage from './pages/NewSalePage';
import SalesHistoryPage from './pages/SalesHistoryPage';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

function App() {
  const { user } = useAuth();

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          }
        />

        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected + wrapped in sidebar layout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Layout>
                <ProductsPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/sales/new"
          element={
            <ProtectedRoute>
              <Layout>
                <NewSalePage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/sales"
          element={
            <ProtectedRoute>
              <Layout>
                <SalesHistoryPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<div className="p-6">404 - Not found</div>} />
      </Routes>
    </>
  );
}

export default App;
