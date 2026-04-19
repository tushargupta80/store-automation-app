import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md border border-gray-200">
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Store Automation – Login
        </h2>

        {/* Error Message */}
        {error && (
          <p className="bg-red-100 text-red-700 p-2 rounded mb-4 border border-red-300 text-sm">
            {error}
          </p>
        )}

        {/* Form */}
        <form onSubmit={submitHandler} className="space-y-5">
          
          {/* Email Field */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 font-semibold rounded-lg shadow-sm transition"
          >
            Login
          </button>
        </form>

        {/* Link to Register */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
              Create New Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
