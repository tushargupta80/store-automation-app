import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/products', label: 'Products' },
    { to: '/sales/new', label: 'New Sale' },
    { to: '/sales', label: 'Sales History' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex md:flex-col w-64 bg-gray-900 text-gray-100">
        <div className="h-16 flex items-center justify-center border-b border-gray-700">
          <span className="text-lg font-bold">Store Automation</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block px-3 py-2 rounded text-sm ${
                  isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-700 text-xs text-gray-300">
          <div className="mb-2">
            Logged in as:
            <div className="font-semibold text-white">
              {user?.name || 'User'} ({user?.role})
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-1.5 rounded text-sm"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Sidebar (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-40"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Panel */}
          <aside className="relative z-50 w-64 bg-gray-900 text-gray-100 flex flex-col">
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700">
              <span className="text-lg font-bold">Store Automation</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-300 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-1">
              {menuItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded text-sm ${
                      isActive
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="p-3 border-t border-gray-700 text-xs text-gray-300">
              <div className="mb-2">
                Logged in as:
                <div className="font-semibold text-white">
                  {user?.name || 'User'} ({user?.role})
                </div>
              </div>
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  handleLogout();
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-1.5 rounded text-sm"
              >
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-16 bg-white shadow flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-gray-700 border rounded px-2 py-1"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>
            <h1 className="text-lg font-semibold text-gray-800">
              {/** Optional dynamic title */}
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-3 text-sm text-gray-600">
            <span>{user?.email}</span>
            <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs uppercase">
              {user?.role}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
