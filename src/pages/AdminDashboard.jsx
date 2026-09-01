import { useEffect, useState } from "react";
import api from "../api/axios";
import Spinner from "../components/Spinner";
import { FaCar, FaCalendarCheck, FaDollarSign, FaCheckCircle, FaTimesCircle, FaChartBar, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/admin/stats")
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to load stats. Login required.");
        setLoading(false);
      });
  }, []);

  if (loading) return <Spinner />;
  if (error)
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-red-400 text-lg mb-4">{error}</p>
        <Link to="/login" className="btn-primary">
          Login to view Dashboard
        </Link>
      </div>
    );

  const { totalCars, totalBookings, availableCars, unavailableCars, recentCars, recentBookings, carsByType, totalRevenue } = stats;

  const statCards = [
    { icon: FaCar, label: "Total Cars", value: totalCars, color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    { icon: FaCheckCircle, label: "Available", value: availableCars, color: "bg-green-500/20 text-green-400 border-green-500/30" },
    { icon: FaTimesCircle, label: "Unavailable", value: unavailableCars, color: "bg-red-500/20 text-red-400 border-red-500/30" },
    { icon: FaCalendarCheck, label: "Total Bookings", value: totalBookings, color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
    { icon: FaDollarSign, label: "Revenue", value: `$${totalRevenue}`, color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
    { icon: FaUsers, label: "Car Types", value: carsByType.length, color: "bg-pink-500/20 text-pink-400 border-pink-500/30" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3 flex items-center justify-center gap-3">
          <FaChartBar className="text-primary" /> Admin <span className="text-primary">Dashboard</span>
        </h1>
        <p className="text-gray-400">Overview of your DriveFleet platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {statCards.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className={`rounded-xl border p-6 flex items-center gap-4 ${color} bg-[#16213E]/50 border-white/10`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${color}`}>
              <Icon className="text-xl" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">{label}</p>
              <p className="text-2xl font-bold text-white">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Cars by Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="card-dark p-6">
          <h3 className="text-xl font-bold mb-4">Cars by Type</h3>
          <div className="space-y-3">
            {carsByType.map((c) => (
              <div key={c._id} className="flex items-center justify-between bg-[#0f0f1a] rounded-lg px-4 py-3 border border-white/5">
                <span className="font-medium">{c._id || "Unknown"}</span>
                <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-bold">{c.count}</span>
              </div>
            ))}
            {carsByType.length === 0 && <p className="text-gray-500">No data</p>}
          </div>
        </div>

        <div className="card-dark p-6">
          <h3 className="text-xl font-bold mb-4">Monthly Bookings (last 6)</h3>
          {stats.monthlyBookings?.length ? (
            <div className="space-y-3">
              {stats.monthlyBookings.map((m) => (
                <div key={m._id} className="flex items-center gap-3">
                  <span className="text-sm text-gray-400 w-20">{m._id}</span>
                  <div className="flex-1 bg-[#0f0f1a] rounded-full h-6 overflow-hidden border border-white/10">
                    <div className="bg-primary h-full rounded-full flex items-center justify-end pr-2 text-xs font-bold" style={{ width: `${Math.min(100, (m.count / Math.max(...stats.monthlyBookings.map((x) => x.count), 1)) * 100)}%` }}>
                      {m.count}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No booking data</p>
          )}
        </div>
      </div>

      {/* Recent Cars & Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card-dark p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Recent Cars</h3>
            <Link to="/explore" className="text-primary text-sm hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentCars.map((car) => (
              <div key={car._id} className="flex items-center gap-3 bg-[#0f0f1a] rounded-lg p-3 border border-white/5 hover:border-primary/30 transition-colors">
                <img src={car.imageUrl} alt={car.carName} className="w-16 h-12 object-cover rounded-lg" onError={(e) => (e.target.src = "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600")} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{car.carName}</p>
                  <p className="text-gray-500 text-xs">
                    {car.carType} • ${car.dailyRentPrice}/day
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${car.availabilityStatus === "Available" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>{car.availabilityStatus}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card-dark p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Recent Bookings</h3>
            <Link to="/my-bookings" className="text-primary text-sm hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentBookings.map((b) => (
              <div key={b._id} className="flex items-center gap-3 bg-[#0f0f1a] rounded-lg p-3 border border-white/5">
                <img src={b.carImage} alt={b.carName} className="w-16 h-12 object-cover rounded-lg" onError={(e) => (e.target.src = "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600")} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{b.carName}</p>
                  <p className="text-gray-500 text-xs truncate">
                    {b.userEmail} • {b.driverNeeded} driver
                  </p>
                </div>
                <span className="text-primary font-bold text-sm">${b.totalPrice || b.dailyRentPrice}</span>
              </div>
            ))}
            {recentBookings.length === 0 && <p className="text-gray-500">No bookings yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
