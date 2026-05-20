import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../providers/AuthProvider";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import { FaEdit, FaTrash, FaTimes, FaCar } from "react-icons/fa";
import { Link } from "react-router-dom";

const carTypes = ["SUV", "Sedan", "Hatchback", "Luxury", "Sports", "Truck", "Van"];

const MyAddedCars = () => {
  const { user } = useAuth();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editCar, setEditCar] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchCars = () => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/my-cars`, {
        params: { email: user.email },
        withCredentials: true,
      })
      .then((res) => {
        setCars(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/cars/${editCar._id}`,
        editCar,
        { withCredentials: true }
      );
      toast.success("Car updated successfully!");
      setEditCar(null);
      fetchCars();
    } catch {
      toast.error("Update failed. Please try again.");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/cars/${deleteId}`,
        { withCredentials: true }
      );
      toast.success("Car deleted successfully!");
      setDeleteId(null);
      fetchCars();
    } catch {
      toast.error("Delete failed. Please try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3">
          My Added <span className="text-primary">Cars</span>
        </h1>
        <p className="text-gray-400">Manage your listed vehicles</p>
      </div>

      {loading ? (
        <Spinner />
      ) : cars.length === 0 ? (
        <div className="text-center py-24">
          <FaCar className="text-6xl text-gray-700 mx-auto mb-4" />
          <p className="text-xl text-gray-500 mb-2">You haven't listed any cars yet</p>
          <p className="text-gray-600 mb-8">Start earning by adding your first car</p>
          <Link to="/add-car" className="btn-primary">Add Your First Car</Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left">
            <thead className="bg-[#16213E]">
              <tr className="text-gray-400 text-sm">
                <th className="px-6 py-4">Car</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Price/Day</th>
                <th className="px-6 py-4">Bookings</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car, i) => (
                <tr
                  key={car._id}
                  className={`border-t border-white/5 hover:bg-white/3 transition-colors ${
                    i % 2 === 0 ? "bg-[#0f0f1a]" : "bg-[#16213E]/30"
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={car.imageUrl}
                        alt={car.carName}
                        className="w-16 h-11 object-cover rounded-lg flex-shrink-0"
                      />
                      <div>
                        <p className="font-semibold text-sm">{car.carName}</p>
                        <p className="text-gray-500 text-xs">{car.pickupLocation}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{car.carType}</td>
                  <td className="px-6 py-4 text-primary font-bold">${car.dailyRentPrice}</td>
                  <td className="px-6 py-4 text-gray-300">{car.bookingCount || 0}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                        car.availabilityStatus === "Available"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {car.availabilityStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditCar({ ...car })}
                        className="p-2.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => setDeleteId(car._id)}
                        className="p-2.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Edit Modal ─────────────────────────────────── */}
      {editCar && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 px-4">
          <div className="bg-[#16213E] rounded-2xl border border-white/10 p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Update Car</h2>
              <button onClick={() => setEditCar(null)} className="text-gray-400 hover:text-white">
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Daily Price ($)</label>
                <input
                  type="number"
                  className="input-field"
                  value={editCar.dailyRentPrice || ""}
                  onChange={(e) =>
                    setEditCar({ ...editCar, dailyRentPrice: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Image URL</label>
                <input
                  type="url"
                  className="input-field"
                  value={editCar.imageUrl || ""}
                  onChange={(e) =>
                    setEditCar({ ...editCar, imageUrl: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Pickup Location</label>
                <input
                  type="text"
                  className="input-field"
                  value={editCar.pickupLocation || ""}
                  onChange={(e) =>
                    setEditCar({ ...editCar, pickupLocation: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Car Type</label>
                <select
                  className="input-field"
                  value={editCar.carType}
                  onChange={(e) =>
                    setEditCar({ ...editCar, carType: e.target.value })
                  }
                >
                  {carTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Availability</label>
                <select
                  className="input-field"
                  value={editCar.availabilityStatus}
                  onChange={(e) =>
                    setEditCar({ ...editCar, availabilityStatus: e.target.value })
                  }
                >
                  <option value="Available">Available</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Description</label>
                <textarea
                  className="input-field resize-none"
                  rows={3}
                  value={editCar.description || ""}
                  onChange={(e) =>
                    setEditCar({ ...editCar, description: e.target.value })
                  }
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditCar(null)}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Modal ───────────────────────────────── */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 px-4">
          <div className="bg-[#16213E] rounded-2xl border border-white/10 p-8 w-full max-w-sm text-center shadow-2xl">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTrash className="text-2xl text-red-400" />
            </div>
            <h2 className="text-xl font-bold mb-2">Delete Car?</h2>
            <p className="text-gray-400 mb-6 text-sm">
              This action cannot be undone. The car listing will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="btn-outline flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAddedCars;
