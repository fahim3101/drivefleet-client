import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../providers/AuthProvider";
import toast from "react-hot-toast";
import { FaLock, FaShieldAlt } from "react-icons/fa";

const AdminLogin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login first with admin email");
      navigate("/login");
      return;
    }
    if (user.email !== adminEmail) {
      toast.error(`Access denied. Admin email is ${adminEmail}`);
      return;
    }
    setLoading(true);
    try {
      await api.post("/admin/login", { password });
      toast.success("Admin verified! Redirecting...");
      navigate("/admin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid admin password");
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <FaLock className="text-5xl text-primary mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-3">Admin Access</h1>
        <p className="text-gray-400 mb-6">Please login first with admin account</p>
        <Link to="/login" className="btn-primary">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FaShieldAlt className="text-3xl text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Admin <span className="text-primary">Login</span>
          </h1>
          <p className="text-gray-400 text-sm">
            Logged in as <span className="text-primary font-medium">{user.email}</span>
          </p>
          {user.email !== adminEmail && <p className="text-red-400 text-xs mt-2">⚠️ This email is not whitelisted. Admin email: {adminEmail}</p>}
        </div>

        <form onSubmit={handleSubmit} className="card-dark p-8 space-y-6">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Admin Password *</label>
            <input type="password" className="input-field" placeholder="Enter Admin@123" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <p className="text-xs text-gray-600 mt-2">Hint: Admin@123 (change in server .env ADMIN_PASS)</p>
          </div>

          <button type="submit" className="btn-primary w-full py-3.5" disabled={loading}>
            {loading ? "Verifying..." : "Verify Admin"}
          </button>

          <div className="text-center text-sm text-gray-500">
            <Link to="/admin" className="text-primary hover:underline">
              → Back to Dashboard
            </Link>
          </div>
        </form>

        <div className="mt-6 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-sm text-yellow-400">
          <p className="font-medium mb-1">How it works:</p>
          <ul className="list-disc list-inside space-y-1 text-xs text-gray-400">
            <li>Step 1: Login with whitelisted email ({adminEmail})</li>
            <li>Step 2: Enter admin password to get adminToken cookie</li>
            <li>Step 3: Access /admin stats (requires both)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
