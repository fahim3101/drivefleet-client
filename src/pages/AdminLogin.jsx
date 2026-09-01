import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import { FaShieldAlt } from "react-icons/fa";

const ADMIN_EMAIL = "fr87817833@gmail.com";
const ADMIN_PASS = "admin123";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASS) {
      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("adminEmail", email);
      // Also set server cookie for /admin/stats (optional, for API auth)
      try {
        await api.post("/admin/direct-login", { email, password });
      } catch {}
      toast.success("Admin login successful!");
      navigate("/admin");
    } else {
      toast.error("Invalid admin email or password");
    }
  };

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
          <p className="text-gray-400 text-sm">Only admin can access dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="card-dark p-8 space-y-5">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Admin Email *</label>
            <input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="fr87817833@gmail.com" />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Admin Password *</label>
            <input type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="admin123" />
            <p className="text-xs text-gray-600 mt-2">Demo: fr87817833@gmail.com / admin123</p>
          </div>
          <button type="submit" className="btn-primary w-full py-3.5">
            Login as Admin
          </button>
          <div className="text-center text-sm text-gray-500">
            <Link to="/" className="text-primary hover:underline">
              ← Back to Home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
