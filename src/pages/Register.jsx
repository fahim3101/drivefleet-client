import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import toast from "react-hot-toast";
import { FaCar, FaGoogle } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Register = () => {
  const { createUser, googleSignIn, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    photoUrl: "",
    password: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [passError, setPassError] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (pass) => {
    if (pass.length < 6) return "Password must be at least 6 characters long";
    if (!/[A-Z]/.test(pass)) return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(pass)) return "Password must contain at least one lowercase letter";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validatePassword(form.password);
    if (error) { setPassError(error); return; }
    setPassError("");
    setLoading(true);
    try {
      await createUser(form.email, form.password);
      await updateUserProfile(form.name, form.photoUrl);
      toast.success("Registration successful! Welcome to DriveFleet 🚗");
      navigate("/");
    } catch (err) {
      const msg =
        err.code === "auth/email-already-in-use"
          ? "This email is already registered. Please login."
          : "Registration failed. Please try again.";
      toast.error(msg);
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    try {
      await googleSignIn();
      toast.success("Welcome to DriveFleet! 🚗");
      navigate("/");
    } catch {
      toast.error("Google sign-in failed. Please try again.");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold mb-4">
            <FaCar className="text-primary" />
            Drive<span className="text-primary">Fleet</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-gray-400">Join DriveFleet and start your journey</p>
        </div>

        <div className="card-dark p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Full Name *</label>
              <input
                type="text"
                className="input-field"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Email Address *</label>
              <input
                type="email"
                className="input-field"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            {/* Photo URL */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Photo URL (optional)</label>
              <input
                type="url"
                className="input-field"
                placeholder="https://your-photo-url.com"
                value={form.photoUrl}
                onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Password *</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  className={`input-field pr-12 ${passError ? "border-red-500" : ""}`}
                  placeholder="Min. 6 chars, upper & lowercase"
                  value={form.password}
                  onChange={(e) => {
                    setForm({ ...form, password: e.target.value });
                    setPassError("");
                  }}
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {passError && (
                <p className="text-red-400 text-xs mt-1.5">{passError}</p>
              )}
              <ul className="text-xs text-gray-600 mt-2 space-y-0.5 list-disc list-inside">
                <li>At least 6 characters</li>
                <li>At least one uppercase letter (A-Z)</li>
                <li>At least one lowercase letter (a-z)</li>
              </ul>
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-3.5 text-base"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <hr className="flex-1 border-white/10" />
            <span className="text-gray-500 text-sm">or</span>
            <hr className="flex-1 border-white/10" />
          </div>

          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 border border-white/20 rounded-xl py-3.5 hover:bg-white/5 transition-colors font-medium"
          >
            <FaGoogle className="text-red-400" />
            Continue with Google
          </button>

          <p className="text-center text-gray-400 mt-6 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
