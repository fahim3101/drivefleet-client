import { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import toast from "react-hot-toast";
import { FaCar, FaBars, FaTimes, FaHeart } from "react-icons/fa";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    await logOut();
    toast.success("Logged out successfully!");
    setDropdown(false);
    setMobileOpen(false);
  };

  const linkClass = ({ isActive }) =>
    `transition-colors font-medium ${
      isActive ? "text-primary" : "text-gray-300 hover:text-primary"
    }`;

  return (
    <nav className="bg-[#16213E]/95 backdrop-blur-sm sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <FaCar className="text-primary text-2xl" />
          <span>Drive<span className="text-primary">Fleet</span></span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/explore" className={linkClass}>Explore Cars</NavLink>
          <NavLink to="/wishlist" className={linkClass}>
            <span className="flex items-center gap-1">
              <FaHeart className="text-xs" /> Wishlist
            </span>
          </NavLink>
          {user && <NavLink to="/add-car" className={linkClass}>Add Car</NavLink>}
          {user && (
            <NavLink to="/admin" className={linkClass}>
              Admin
            </NavLink>
          )}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="relative" ref={dropRef}>
              <img
                src={user.photoURL || "https://i.ibb.co/MBtjqXQ/no-avatar.gif"}
                alt={user.displayName || "User"}
                title={user.displayName || "User"}
                className="w-10 h-10 rounded-full cursor-pointer border-2 border-primary object-cover"
                onClick={() => setDropdown(!dropdown)}
              />
              {dropdown && (
                <div className="absolute right-0 mt-3 w-56 bg-[#16213E] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="font-semibold text-sm truncate">{user.displayName}</p>
                    <p className="text-gray-500 text-xs truncate">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link to="/my-bookings" onClick={() => setDropdown(false)}
                      className="block px-4 py-2.5 text-sm hover:bg-primary/20 transition-colors">
                      📋 My Bookings
                    </Link>
                    <Link to="/my-cars" onClick={() => setDropdown(false)}
                      className="block px-4 py-2.5 text-sm hover:bg-primary/20 transition-colors">
                      🚗 My Added Cars
                    </Link>
                    <Link to="/add-car" onClick={() => setDropdown(false)}
                      className="block px-4 py-2.5 text-sm hover:bg-primary/20 transition-colors">
                      ➕ Add Car
                    </Link>
                    <Link to="/admin" onClick={() => setDropdown(false)}
                      className="block px-4 py-2.5 text-sm hover:bg-primary/20 transition-colors">
                      📊 Admin Dashboard
                    </Link>
                  </div>
                  <div className="border-t border-white/10 py-1">
                    <button onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                      🚪 Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-primary">Login</Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white text-xl"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#16213E] border-t border-white/10 px-4 py-4 flex flex-col gap-4">
          <NavLink to="/" end className={linkClass} onClick={() => setMobileOpen(false)}>Home</NavLink>
          <NavLink to="/explore" className={linkClass} onClick={() => setMobileOpen(false)}>Explore Cars</NavLink>
          <NavLink to="/wishlist" className={linkClass} onClick={() => setMobileOpen(false)}>
            Wishlist
          </NavLink>
          {user && (
            <>
              <NavLink to="/add-car" className={linkClass} onClick={() => setMobileOpen(false)}>Add Car</NavLink>
              <NavLink to="/admin" className={linkClass} onClick={() => setMobileOpen(false)}>Admin</NavLink>
              <NavLink to="/my-bookings" className={linkClass} onClick={() => setMobileOpen(false)}>My Bookings</NavLink>
              <NavLink to="/my-cars" className={linkClass} onClick={() => setMobileOpen(false)}>My Added Cars</NavLink>
              <button onClick={handleLogout} className="text-red-400 font-medium text-left">Logout</button>
            </>
          )}
          {!user && <Link to="/login" className="btn-primary w-fit" onClick={() => setMobileOpen(false)}>Login</Link>}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
