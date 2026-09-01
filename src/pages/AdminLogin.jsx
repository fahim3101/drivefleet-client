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
  const [directEmail, setDirectEmail] = useState("fr87817833@gmail.com");
  const [directPass, setDirectPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("direct"); // direct | firebase

  const adminEmailEnv = import.meta.env.VITE_ADMIN_EMAIL || "fr87817833@gmail.com";
  const allowedEmails = adminEmailEnv.split(",").map((e) => e.trim().toLowerCase());
  const isWhitelisted = user && allowedEmails.includes(user.email?.toLowerCase());

  const handleFirebaseSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login first with admin email");
      navigate("/login");
      return;
    }
    if (!isWhitelisted) {
      toast.error(`Access denied. Allowed: ${adminEmailEnv}`);
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

  const handleDirectSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/admin/direct-login", { email: directEmail, password: directPass });
      toast.success("Direct admin login successful! Redirecting...");
      navigate("/admin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid admin credentials");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FaShieldAlt className="text-3xl text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Admin <span className="text-primary">Login</span>
          </h1>
          <p className="text-gray-400 text-sm">Firebase ছাড়াই সরাসরি admin login</p>
        </div>

        <div className="flex gap-2 mb-6">
          <button onClick={() => setMode("direct")} className={`flex-1 py-2.5 rounded-lg border text-sm font-medium ${mode === "direct" ? "bg-primary border-primary text-white" : "border-white/20 text-gray-400"}`}>
            Direct Login
          </button>
          <button onClick={() => setMode("firebase")} className={`flex-1 py-2.5 rounded-lg border text-sm font-medium ${mode === "firebase" ? "bg-primary border-primary text-white" : "border-white/20 text-gray-400"}`}>
            Firebase + Pass
          </button>
        </div>

        {mode === "direct" ? (
          <form onSubmit={handleDirectSubmit} className="card-dark p-8 space-y-5">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-xs text-green-400">
              ✅ Firebase lagbe na — সরাসরি <b>fr87817833@gmail.com / admin123</b> দিয়ে login
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Admin Email *</label>
              <input type="email" className="input-field" value={directEmail} onChange={(e) => setDirectEmail(e.target.value)} required placeholder="fr87817833@gmail.com" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Admin Password *</label>
              <input type="password" className="input-field" value={directPass} onChange={(e) => setDirectPass(e.target.value)} required placeholder="admin123" />
            </div>
            <button type="submit" className="btn-primary w-full py-3.5" disabled={loading}>
              {loading ? "Verifying..." : "Direct Login"}
            </button>
            <p className="text-xs text-gray-600 text-center">Server ADMIN_EMAIL + ADMIN_PASS diye verify hobe</p>
          </form>
        ) : (
          <>
            {!user ? (
              <div className="card-dark p-8 text-center">
                <FaLock className="text-3xl text-primary mx-auto mb-3" />
                <p className="text-gray-400 mb-4">Firebase login required for this mode</p>
                <Link to="/login" className="btn-primary w-full">
                  Go to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleFirebaseSubmit} className="card-dark p-8 space-y-6">
                <p className="text-gray-400 text-sm text-center">
                  Logged in as <span className="text-primary font-medium">{user.email}</span>
                </p>
                {!isWhitelisted && <p className="text-red-400 text-xs text-center">⚠️ Not whitelisted. Allowed: {adminEmailEnv}</p>}
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Admin Password *</label>
                  <input type="password" className="input-field" placeholder="Enter admin123" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn-primary w-full py-3.5" disabled={loading}>
                  {loading ? "Verifying..." : "Verify Admin"}
                </button>
              </form>
            )}
          </>
        )}

        <div className="mt-6 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-sm text-yellow-400">
          <p className="font-medium mb-1">How it works:</p>
          <ul className="list-disc list-inside space-y-1 text-xs text-gray-400">
            <li>Direct: email + pass → server sets token + adminToken cookies</li>
            <li>Firebase: login → admin password → adminToken</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
