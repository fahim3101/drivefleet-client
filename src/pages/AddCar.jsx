import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../providers/AuthProvider";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const carTypes = ["SUV", "Sedan", "Hatchback", "Luxury", "Sports", "Truck", "Van", "Electric"];

const AddCar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    carName: "",
    dailyRentPrice: "",
    carType: "SUV",
    imageUrl: "",
    seatCapacity: "",
    pickupLocation: "",
    description: "",
    availabilityStatus: "Available",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Number(form.dailyRentPrice) <= 0) {
      toast.error("Daily price must be greater than 0");
      return;
    }
    if (Number(form.seatCapacity) < 1) {
      toast.error("Seat capacity must be at least 1");
      return;
    }
    setLoading(true);
    try {
      await api.post("/cars", {
        ...form,
        dailyRentPrice: Number(form.dailyRentPrice),
        seatCapacity: Number(form.seatCapacity),
        ownerName: user.displayName,
        ownerPhoto: user.photoURL,
      });
      toast.success("Car added successfully! 🚗");
      navigate("/my-cars");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add car. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3">
          Add Your <span className="text-primary">Car</span>
        </h1>
        <p className="text-gray-400">List your vehicle and start earning today</p>
      </div>

      <form onSubmit={handleSubmit} className="card-dark p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Car Name */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Car Name *</label>
            <input
              type="text"
              name="carName"
              placeholder="e.g. Toyota Land Cruiser"
              required
              className="input-field"
              value={form.carName}
              onChange={handleChange}
            />
          </div>

          {/* Daily Rent Price */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Daily Rent Price ($) *</label>
            <input
              type="number"
              name="dailyRentPrice"
              placeholder="e.g. 80"
              required
              min="1"
              className="input-field"
              value={form.dailyRentPrice}
              onChange={handleChange}
            />
          </div>

          {/* Car Type */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Car Type *</label>
            <select
              name="carType"
              className="input-field"
              value={form.carType}
              onChange={handleChange}
            >
              {carTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Seat Capacity */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Seat Capacity *</label>
            <input
              type="number"
              name="seatCapacity"
              placeholder="e.g. 5"
              required
              min="1"
              max="20"
              className="input-field"
              value={form.seatCapacity}
              onChange={handleChange}
            />
          </div>

          {/* Pickup Location */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Pickup Location *</label>
            <input
              type="text"
              name="pickupLocation"
              placeholder="e.g. Dhaka, Bangladesh"
              required
              className="input-field"
              value={form.pickupLocation}
              onChange={handleChange}
            />
          </div>

          {/* Availability */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Availability Status *</label>
            <select
              name="availabilityStatus"
              className="input-field"
              value={form.availabilityStatus}
              onChange={handleChange}
            >
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
            </select>
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Image URL *</label>
          <input
            type="url"
            name="imageUrl"
            placeholder="https://i.ibb.co/... (upload to imgbb.com)"
            required
            className="input-field"
            value={form.imageUrl}
            onChange={handleChange}
          />
          <p className="text-xs text-gray-600 mt-1.5">
            Upload your car image to{" "}
            <a
              href="https://imgbb.com"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              imgbb.com
            </a>{" "}
            and paste the direct link here
          </p>
        </div>

        {/* Image Preview */}
        {form.imageUrl && (
          <div className="rounded-xl overflow-hidden h-48 border border-white/10">
            <img
              src={form.imageUrl}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => (e.target.style.display = "none")}
            />
          </div>
        )}

        {/* Description */}
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Description</label>
          <textarea
            name="description"
            rows={4}
            placeholder="Describe your car — features, condition, special notes..."
            className="input-field resize-none"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="btn-primary w-full py-4 text-lg"
          disabled={loading}
        >
          {loading ? "Adding Car..." : "Add Car to DriveFleet"}
        </button>
      </form>
    </div>
  );
};

export default AddCar;
