import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../providers/AuthProvider";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import {
  FaMapMarkerAlt,
  FaUsers,
  FaCar,
  FaStar,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";

const CarDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ driverNeeded: "No", specialNote: "" });
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/cars/${id}`)
      .then((res) => {
        setCar(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleBook = async () => {
    if (!user) {
      toast.error("Please login to book a car");
      return;
    }
    setBooking(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/bookings`,
        {
          carId: car._id,
          carName: car.carName,
          carImage: car.imageUrl,
          carType: car.carType,
          dailyRentPrice: car.dailyRentPrice,
          pickupLocation: car.pickupLocation,
          userEmail: user.email,
          userName: user.displayName,
          driverNeeded: form.driverNeeded,
          specialNote: form.specialNote,
        },
        { withCredentials: true }
      );
      toast.success("🎉 Car booked successfully!");
      setModal(false);
      setCar((prev) => ({
        ...prev,
        bookingCount: (prev.bookingCount || 0) + 1,
      }));
    } catch {
      toast.error("Booking failed. Please try again.");
    }
    setBooking(false);
  };

  if (loading) return <Spinner />;
  if (!car)
    return (
      <div className="text-center py-20 text-gray-400 text-xl">
        Car not found
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* Image */}
        <div>
          <div className="rounded-2xl overflow-hidden border border-white/10 h-80">
            <img
              src={car.imageUrl}
              alt={car.carName}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Features */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            {[
              "Air Conditioning",
              "GPS Navigation",
              "Bluetooth Audio",
              "USB Charging",
            ].map((f) => (
              <div
                key={f}
                className="flex items-center gap-2 bg-[#16213E] rounded-lg px-4 py-3 border border-white/10 text-sm text-gray-400"
              >
                <FaCheckCircle className="text-primary text-xs" />
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs text-primary font-medium bg-primary/10 px-3 py-1 rounded-full">
              {car.carType}
            </span>
            <span
              className={`text-xs px-3 py-1 rounded-full font-medium ${
                car.availabilityStatus === "Available"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {car.availabilityStatus}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-2">{car.carName}</h1>

          <div className="flex items-center gap-1 text-yellow-400 mb-6">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <FaStar key={i} className="text-sm" />
              ))}
            <span className="text-gray-400 text-sm ml-2">
              ({car.bookingCount || 0} bookings)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {[
              [FaUsers, "Seat Capacity", `${car.seatCapacity} Seats`],
              [FaMapMarkerAlt, "Pickup Location", car.pickupLocation],
              [FaCar, "Car Type", car.carType],
            ].map(([Icon, label, val]) => (
              <div
                key={label}
                className="bg-[#16213E] rounded-xl p-4 border border-white/10"
              >
                <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                  <Icon className="text-primary" />
                  {label}
                </div>
                <div className="font-semibold text-sm">{val}</div>
              </div>
            ))}
            <div className="bg-[#16213E] rounded-xl p-4 border border-white/10">
              <div className="text-gray-500 text-xs mb-1">Daily Rate</div>
              <div className="text-2xl font-bold text-primary">
                ${car.dailyRentPrice}
                <span className="text-gray-500 text-sm font-normal">/day</span>
              </div>
            </div>
          </div>

          <p className="text-gray-400 leading-relaxed mb-8">{car.description}</p>

          <button
            onClick={() => setModal(true)}
            disabled={car.availabilityStatus !== "Available"}
            className={`w-full py-4 rounded-xl text-lg font-semibold transition-all ${
              car.availabilityStatus === "Available"
                ? "bg-primary hover:bg-red-700 text-white"
                : "bg-gray-700 text-gray-500 cursor-not-allowed"
            }`}
          >
            {car.availabilityStatus === "Available"
              ? "Book Now"
              : "Currently Unavailable"}
          </button>
        </div>
      </div>

      {/* Booking Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 px-4">
          <div className="bg-[#16213E] rounded-2xl border border-white/10 p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold">Book {car.carName}</h2>
                <p className="text-gray-500 text-sm">${car.dailyRentPrice}/day</p>
              </div>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-white">
                <FaTimes size={20} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">
                  Driver Needed?
                </label>
                <select
                  className="input-field"
                  value={form.driverNeeded}
                  onChange={(e) =>
                    setForm({ ...form, driverNeeded: e.target.value })
                  }
                >
                  <option value="No">No — I'll drive myself</option>
                  <option value="Yes">Yes — I need a driver (+$20/day)</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">
                  Special Note (optional)
                </label>
                <textarea
                  className="input-field resize-none"
                  rows={3}
                  placeholder="Any special requirements or notes..."
                  value={form.specialNote}
                  onChange={(e) =>
                    setForm({ ...form, specialNote: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="bg-[#0f0f1a] rounded-xl p-4 mb-6 border border-white/5">
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>Daily Rate</span>
                <span>${car.dailyRentPrice}</span>
              </div>
              {form.driverNeeded === "Yes" && (
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>Driver Fee</span>
                  <span>$20</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-white pt-2 border-t border-white/10 mt-2">
                <span>Total/day</span>
                <span className="text-primary">
                  ${form.driverNeeded === "Yes" ? car.dailyRentPrice + 20 : car.dailyRentPrice}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setModal(false)}
                className="btn-outline flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleBook}
                className="btn-primary flex-1"
                disabled={booking}
              >
                {booking ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarDetails;
