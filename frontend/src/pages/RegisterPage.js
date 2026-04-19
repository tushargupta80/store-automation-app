import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "cashier"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      await register(formData.name, formData.email, formData.password, formData.role);
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md border border-gray-200">

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Create New Account
        </h2>

        {/* Error Message */}
        {error && (
          <p className="bg-red-100 text-red-700 p-2 rounded mb-4 border border-red-300 text-sm">
            {error}
          </p>
        )}

        {/* Form */}
        <form onSubmit={submitHandler} className="space-y-5">

          {/* Name Field */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              minLength="6"
            />
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              minLength="6"
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Role</label>
            <select
              name="role"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="cashier">Cashier</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-2 font-semibold rounded-lg shadow-sm transition"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Link to Login */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;