import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../providers/AuthProvider";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import { FaTrash, FaCar, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const fallbackImg = "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600";

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const fetchBookings = () => {
    if (!user?.email) return;
    setLoading(true);
    api
      .get("/bookings", { params: { email: user.email } })
      .then((res) => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, [user?.email]);

  const handleDelete = async () => {
    try {
      await api.delete(`/bookings/${deleteId}`);
      toast.success("Booking cancelled successfully!");
      setDeleteId(null);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Cancellation failed. Please try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3">
          My <span className="text-primary">Bookings</span>
        </h1>
        <p className="text-gray-400">Track and manage your car reservations</p>
      </div>

      {loading ? (
        <Spinner />
      ) : bookings.length === 0 ? (
        <div className="text-center py-24">
          <FaCar className="text-6xl text-gray-700 mx-auto mb-4" />
          <p className="text-xl text-gray-500 mb-2">No bookings yet</p>
          <p className="text-gray-600 mb-8">Explore cars and make your first booking!</p>
          <Link to="/explore" className="btn-primary">Explore Cars</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((b) => (
            <div key={b._id} className="card-dark overflow-hidden flex flex-col">
              {/* Car Image */}
              <div className="relative h-44 overflow-hidden flex-shrink-0">
                <img
                  src={b.carImage || fallbackImg}
                  alt={b.carName}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target.src = fallbackImg)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-3 left-3 text-xs bg-primary/90 text-white px-2 py-1 rounded-full font-medium">
                  {b.carType}
                </span>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-semibold mb-3">{b.carName}</h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <FaMapMarkerAlt className="text-primary flex-shrink-0" />
                    <span>{b.pickupLocation}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <FaCalendarAlt className="text-primary flex-shrink-0" />
                    <span>
                      Booked: {new Date(b.bookingDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </span>
                  </div>
                  {b.startDate && b.endDate && (
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <FaCalendarAlt className="text-green-400 flex-shrink-0" />
                      <span>
                        {new Date(b.startDate).toLocaleDateString()} → {new Date(b.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center bg-[#0f0f1a] rounded-lg px-4 py-3 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Driver</p>
                    <p className="text-sm font-medium">{b.driverNeeded}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{b.totalPrice ? "Total" : "Rate"}</p>
                    <p className="text-primary font-bold">{b.totalPrice ? `$${b.totalPrice}` : `$${b.dailyRentPrice}/day`}</p>
                  </div>
                </div>

                {b.specialNote && (
                  <p className="text-xs text-gray-500 italic mb-4 line-clamp-2">
                    Note: "{b.specialNote}"
                  </p>
                )}

                <button
                  onClick={() => setDeleteId(b._id)}
                  className="mt-auto w-full flex items-center justify-center gap-2 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-medium"
                >
                  <FaTrash className="text-xs" />
                  Cancel Booking
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Confirm Cancel Modal ──────────────────────── */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 px-4">
          <div className="bg-[#16213E] rounded-2xl border border-white/10 p-8 w-full max-w-sm text-center shadow-2xl">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTrash className="text-2xl text-red-400" />
            </div>
            <h2 className="text-xl font-bold mb-2">Cancel Booking?</h2>
            <p className="text-gray-400 mb-6 text-sm">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="btn-outline flex-1"
              >
                Keep It
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-lg transition-colors"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
