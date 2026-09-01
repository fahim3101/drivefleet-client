import { useEffect, useState } from "react";
import api from "../api/axios";
import Spinner from "../components/Spinner";
import { FaCar, FaCalendarCheck, FaDollarSign, FaCheckCircle, FaTimesCircle, FaChartBar, FaUsers, FaSignOutAlt, FaTrash, FaSearch, FaStar, FaEye, FaExchangeAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import toast from "react-hot-toast";

const tabs = [
  { id: "overview", label: "Overview", icon: FaChartBar },
  { id: "cars", label: "All Cars", icon: FaCar },
  { id: "bookings", label: "All Bookings", icon: FaCalendarCheck },
  { id: "reviews", label: "Reviews", icon: FaStar },
  { id: "users", label: "Users", icon: FaUsers },
];

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isAdminClient = localStorage.getItem("isAdmin") === "true";

  // Tab data
  const [cars, setCars] = useState([]);
  const [carsSearch, setCarsSearch] = useState("");
  const [carsLoading, setCarsLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null); // {type, id, name}

  useEffect(() => {
    if (!isAdminClient) {
      setLoading(false);
      setError("Admin login required. Please login with admin email/pass.");
      return;
    }
    api.get("/admin/stats").then((res) => { setStats(res.data); setLoading(false); }).catch((err) => { setError(err.response?.data?.message || "Failed to load stats."); setLoading(false); });
  }, [isAdminClient]);

  const fetchCars = async () => {
    setCarsLoading(true);
    try { const res = await api.get("/admin/cars", { params: { search: carsSearch, limit: 50 } }); setCars(res.data.cars || res.data); } catch { toast.error("Failed to load cars"); } setCarsLoading(false);
  };
  const fetchBookings = async () => {
    setBookingsLoading(true);
    try { const res = await api.get("/admin/bookings"); setBookings(res.data); } catch { toast.error("Failed to load bookings"); } setBookingsLoading(false);
  };
  const fetchReviews = async () => {
    setReviewsLoading(true);
    try { const res = await api.get("/admin/reviews"); setReviews(res.data); } catch { toast.error("Failed to load reviews"); } setReviewsLoading(false);
  };
  const fetchUsers = async () => {
    setUsersLoading(true);
    try { const res = await api.get("/admin/users"); setUsers(res.data); } catch { toast.error("Failed to load users"); } setUsersLoading(false);
  };

  useEffect(() => {
    if (activeTab === "cars") fetchCars();
    if (activeTab === "bookings") fetchBookings();
    if (activeTab === "reviews") fetchReviews();
    if (activeTab === "users") fetchUsers();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "cars") {
      const t = setTimeout(fetchCars, 400);
      return () => clearTimeout(t);
    }
  }, [carsSearch]);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const { type, id } = confirmDelete;
    try {
      if (type === "car") { await api.delete(`/admin/cars/${id}`); toast.success("Car deleted by admin"); fetchCars(); if (stats) setStats({ ...stats, totalCars: stats.totalCars - 1 }); }
      if (type === "booking") { await api.delete(`/admin/bookings/${id}`); toast.success("Booking removed"); fetchBookings(); }
      if (type === "review") { await api.delete(`/admin/reviews/${id}`); toast.success("Review deleted"); fetchReviews(); }
    } catch (err) { toast.error(err.response?.data?.message || "Delete failed"); }
    setConfirmDelete(null);
  };

  const handleToggle = async (carId) => {
    try { const res = await api.put(`/admin/cars/${carId}/toggle`); toast.success(`Car now ${res.data.newStatus}`); fetchCars(); } catch { toast.error("Toggle failed"); }
  };

  const handleAdminLogout = async () => {
    localStorage.removeItem("isAdmin"); localStorage.removeItem("adminEmail");
    try { await api.post("/admin/logout", {}); } catch {}
    toast.success("Admin logged out"); navigate("/admin/login");
  };

  if (loading) return <Spinner />;
  if (error) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4"><FaChartBar className="text-2xl text-red-400" /></div>
      <p className="text-red-400 text-lg mb-2">{error}</p>
      <p className="text-gray-500 text-sm mb-6">Your email: {user?.email || "not logged in"} | isAdmin: {String(isAdminClient)}</p>
      <div className="flex gap-3 justify-center"><Link to="/admin/login" className="btn-primary">Admin Login</Link><Link to="/" className="btn-outline">Home</Link></div>
    </div>
  );

  const statCards = stats ? [
    { icon: FaCar, label: "Total Cars", value: stats.totalCars, color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    { icon: FaCheckCircle, label: "Available", value: stats.availableCars, color: "bg-green-500/20 text-green-400 border-green-500/30" },
    { icon: FaTimesCircle, label: "Unavailable", value: stats.unavailableCars, color: "bg-red-500/20 text-red-400 border-red-500/30" },
    { icon: FaCalendarCheck, label: "Total Bookings", value: stats.totalBookings, color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
    { icon: FaDollarSign, label: "Revenue", value: `$${stats.totalRevenue}`, color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
    { icon: FaUsers, label: "Car Types", value: stats.carsByType.length, color: "bg-pink-500/20 text-pink-400 border-pink-500/30" },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/20 via-[#16213E] to-primary/10 rounded-2xl border border-primary/20 p-8 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
        <div className="relative flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3"><FaChartBar className="text-primary" /> Admin <span className="text-primary">Control Center</span></h1>
            <p className="text-gray-400 mt-2">Full platform control — delete spam, manage all records — <span className="text-primary font-medium">{localStorage.getItem("adminEmail") || user?.email}</span></p>
          </div>
          <button onClick={handleAdminLogout} className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors"><FaSignOutAlt /> Logout</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 bg-[#16213E] p-2 rounded-xl border border-white/10 w-fit">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)} className={`px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all ${activeTab === id ? "bg-primary text-white shadow-lg" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
            <Icon className="text-sm" /> {label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "overview" && stats && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {statCards.map(({ icon: Icon, label, value, color }) => (
              <div key={label} className={`rounded-xl border p-6 flex items-center gap-4 ${color} bg-[#16213E]/50 border-white/10 backdrop-blur-sm`}>
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center border ${color} bg-[#0f0f1a]`}><Icon className="text-xl" /></div>
                <div><p className="text-gray-400 text-sm">{label}</p><p className="text-2xl font-bold text-white">{value}</p></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="card-dark p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><FaCar className="text-primary" /> Cars by Type</h3>
              <div className="space-y-3">{stats.carsByType.map((c) => (<div key={c._id} className="flex items-center justify-between bg-[#0f0f1a] rounded-xl px-4 py-3 border border-white/5 hover:border-primary/20 transition-colors"><span className="font-medium">{c._id || "Unknown"}</span><span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-bold">{c.count}</span></div>))}</div>
            </div>
            <div className="card-dark p-6">
              <h3 className="text-lg font-bold mb-4">Monthly Bookings</h3>
              {stats.monthlyBookings?.length ? <div className="space-y-3">{stats.monthlyBookings.map((m) => (<div key={m._id} className="flex items-center gap-3"><span className="text-sm text-gray-400 w-20">{m._id}</span><div className="flex-1 bg-[#0f0f1a] rounded-full h-6 overflow-hidden border border-white/10"><div className="bg-gradient-to-r from-primary to-red-400 h-full rounded-full flex items-center justify-end pr-2 text-xs font-bold text-white" style={{ width: `${Math.min(100, (m.count / Math.max(...stats.monthlyBookings.map((x) => x.count), 1)) * 100)}%` }}>{m.count}</div></div></div>))}</div> : <p className="text-gray-500">No data</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card-dark p-6">
              <h3 className="font-bold mb-4 flex justify-between">Recent Cars <button onClick={() => setActiveTab("cars")} className="text-primary text-xs hover:underline">Manage →</button></h3>
              <div className="space-y-3">{stats.recentCars.map((car) => (<div key={car._id} className="flex items-center gap-3 bg-[#0f0f1a] rounded-xl p-3 border border-white/5"><img src={car.imageUrl} alt={car.carName} className="w-16 h-12 object-cover rounded-lg" /><div className="flex-1 min-w-0"><p className="font-semibold text-sm truncate">{car.carName}</p><p className="text-gray-500 text-xs truncate flex items-center gap-1"><FaEnvelope className="text-[10px]" />{car.ownerEmail}</p></div><span className={`text-xs px-2 py-1 rounded-full font-medium ${car.availabilityStatus === "Available" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>{car.availabilityStatus}</span></div>))}</div>
            </div>
            <div className="card-dark p-6">
              <h3 className="font-bold mb-4 flex justify-between">Recent Bookings <button onClick={() => setActiveTab("bookings")} className="text-primary text-xs hover:underline">Manage →</button></h3>
              <div className="space-y-3">{stats.recentBookings.map((b) => (<div key={b._id} className="flex items-center gap-3 bg-[#0f0f1a] rounded-xl p-3 border border-white/5"><img src={b.carImage} alt={b.carName} className="w-16 h-12 object-cover rounded-lg" /><div className="flex-1 min-w-0"><p className="font-semibold text-sm truncate">{b.carName}</p><p className="text-gray-500 text-xs truncate">{b.userEmail}</p></div><span className="text-primary font-bold text-sm">${b.totalPrice || b.dailyRentPrice}</span></div>))}</div>
            </div>
          </div>
        </>
      )}

      {/* Cars Tab */}
      {activeTab === "cars" && (
        <div className="card-dark p-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2"><FaCar className="text-primary" /> All Cars <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs">{cars.length}</span></h3>
            <div className="relative flex-1 md:max-w-sm">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
              <input type="text" placeholder="Search by car name..." className="input-field pl-10" value={carsSearch} onChange={(e) => setCarsSearch(e.target.value)} />
            </div>
          </div>
          {carsLoading ? <Spinner /> : cars.length === 0 ? <p className="text-center text-gray-500 py-12">No cars found</p> : (
            <div className="space-y-3">
              {cars.map((car) => (
                <div key={car._id} className="bg-[#0f0f1a] rounded-xl p-4 border border-white/5 hover:border-primary/20 transition-all flex flex-col md:flex-row gap-4">
                  <img src={car.imageUrl} alt={car.carName} className="w-full md:w-32 h-24 object-cover rounded-xl flex-shrink-0" onError={(e) => e.target.src = "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600"} />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4 className="font-bold">{car.carName}</h4>
                      <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">{car.carType}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${car.availabilityStatus === "Available" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>{car.availabilityStatus}</span>
                    </div>
                    <p className="text-gray-500 text-xs flex items-center gap-1"><FaEnvelope className="text-[10px]" />{car.ownerEmail} • <FaMapMarkerAlt className="text-primary text-[10px]" />{car.pickupLocation} • ${car.dailyRentPrice}/day • {car.bookingCount || 0} bookings</p>
                    <p className="text-gray-400 text-sm mt-2 line-clamp-1">{car.description || "No description"}</p>
                  </div>
                  <div className="flex md:flex-col gap-2 justify-end">
                    <button onClick={() => window.open(`/cars/${car._id}`, "_blank")} className="flex-1 md:flex-none p-2.5 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/30 flex items-center justify-center gap-1 text-sm"><FaEye /> View</button>
                    <button onClick={() => handleToggle(car._id)} className="flex-1 md:flex-none p-2.5 bg-yellow-500/20 text-yellow-400 rounded-xl hover:bg-yellow-500/30 flex items-center justify-center gap-1 text-sm"><FaExchangeAlt /> Toggle</button>
                    <button onClick={() => setConfirmDelete({ type: "car", id: car._id, name: car.carName })} className="flex-1 md:flex-none p-2.5 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 flex items-center justify-center gap-1 text-sm"><FaTrash /> Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === "bookings" && (
        <div className="card-dark p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><FaCalendarCheck className="text-primary" /> All Bookings <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs">{bookings.length}</span></h3>
          {bookingsLoading ? <Spinner /> : bookings.length === 0 ? <p className="text-center text-gray-500 py-12">No bookings</p> : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-gray-400 text-xs border-b border-white/10"><tr><th className="pb-3 px-2">Car</th><th className="pb-3 px-2">User</th><th className="pb-3 px-2">Dates</th><th className="pb-3 px-2">Total</th><th className="pb-3 px-2">Action</th></tr></thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-2"><div className="flex items-center gap-2"><img src={b.carImage} alt={b.carName} className="w-12 h-8 object-cover rounded" /><div><p className="font-semibold text-sm">{b.carName}</p><p className="text-gray-500 text-xs">{b.carType}</p></div></div></td>
                      <td className="py-3 px-2"><p className="text-sm">{b.userName || b.userEmail}</p><p className="text-gray-500 text-xs">{b.userEmail}</p></td>
                      <td className="py-3 px-2 text-xs text-gray-400">{b.startDate ? `${new Date(b.startDate).toLocaleDateString()} → ${new Date(b.endDate).toLocaleDateString()}` : new Date(b.bookingDate).toLocaleDateString()}</td>
                      <td className="py-3 px-2 font-bold text-primary">${b.totalPrice || b.dailyRentPrice}</td>
                      <td className="py-3 px-2"><button onClick={() => setConfirmDelete({ type: "booking", id: b._id, name: b.carName })} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"><FaTrash /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === "reviews" && (
        <div className="card-dark p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><FaStar className="text-yellow-400" /> All Reviews <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs">{reviews.length}</span></h3>
          {reviewsLoading ? <Spinner /> : reviews.length === 0 ? <p className="text-center text-gray-500 py-12">No reviews</p> : (
            <div className="space-y-3">
              {reviews.map((r) => (
                <div key={r._id} className="bg-[#0f0f1a] rounded-xl p-4 border border-white/5 flex justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1"><span className="font-semibold text-sm">{r.userName}</span><span className="text-gray-500 text-xs">{r.userEmail}</span><span className="flex gap-0.5 text-yellow-400 text-xs">{Array(r.rating).fill(0).map((_, i) => <FaStar key={i} />)}</span></div>
                    <p className="text-gray-300 text-sm">{r.comment}</p>
                    <p className="text-gray-600 text-xs mt-1">{r.carName} • {new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => setConfirmDelete({ type: "review", id: r._id, name: `Review by ${r.userName}` })} className="p-2.5 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 h-fit"><FaTrash /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="card-dark p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><FaUsers className="text-primary" /> All Users <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs">{users.length}</span></h3>
          {usersLoading ? <Spinner /> : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-gray-400 text-xs border-b border-white/10"><tr><th className="pb-3 px-2">Email</th><th className="pb-3 px-2">Cars</th><th className="pb-3 px-2">Bookings</th><th className="pb-3 px-2">Reviews</th><th className="pb-3 px-2">Total Activity</th></tr></thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.email} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-2 font-medium text-sm flex items-center gap-2"><FaEnvelope className="text-primary text-xs" />{u.email}</td>
                      <td className="py-3 px-2"><span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs">{u.carCount}</span></td>
                      <td className="py-3 px-2"><span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full text-xs">{u.bookingCount}</span></td>
                      <td className="py-3 px-2"><span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs">{u.reviewCount}</span></td>
                      <td className="py-3 px-2"><span className={`px-2 py-1 rounded-full text-xs font-bold ${u.total > 5 ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}>{u.total}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <div className="bg-[#16213E] rounded-2xl border border-white/10 p-8 w-full max-w-sm text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4"><FaTrash className="text-2xl text-red-400" /></div>
            <h3 className="text-xl font-bold mb-2">Delete {confirmDelete.type}?</h3>
            <p className="text-gray-400 text-sm mb-6">"{confirmDelete.name}" will be permanently removed. This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="btn-outline flex-1">Cancel</button>
              <button onClick={handleDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-xl">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
