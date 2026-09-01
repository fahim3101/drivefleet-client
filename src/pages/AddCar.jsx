import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../providers/AuthProvider";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { uploadImageToImgBB } from "../utils/imageUpload";
import { FaUpload, FaLink } from "react-icons/fa";

const carTypes = ["SUV", "Sedan", "Hatchback", "Luxury", "Sports", "Truck", "Van", "Electric"];

const AddCar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageMode, setImageMode] = useState("upload"); // upload | url
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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    setUploading(true);
    try {
      const url = await uploadImageToImgBB(file);
      setForm((prev) => ({ ...prev, imageUrl: url }));
      toast.success("Image uploaded successfully!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

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

        {/* Image Upload */}
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Car Image *</label>
          <div className="flex gap-2 mb-3">
            <button type="button" onClick={() => setImageMode("upload")} className={`flex-1 py-2.5 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 transition-colors ${imageMode === "upload" ? "bg-primary border-primary text-white" : "border-white/20 text-gray-400 hover:border-primary/50"}`}>
              <FaUpload /> Upload File
            </button>
            <button type="button" onClick={() => setImageMode("url")} className={`flex-1 py-2.5 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 transition-colors ${imageMode === "url" ? "bg-primary border-primary text-white" : "border-white/20 text-gray-400 hover:border-primary/50"}`}>
              <FaLink /> Image URL
            </button>
          </div>

          {imageMode === "upload" ? (
            <div>
              <label className="w-full bg-[#0f0f1a] border-2 border-dashed border-white/20 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                <FaUpload className="text-3xl text-primary mb-2" />
                <p className="text-sm text-gray-400 mb-1">{uploading ? "Uploading..." : "Click to upload or drag image here"}</p>
                <p className="text-xs text-gray-600">PNG, JPG up to 5MB</p>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
              </label>
              {uploading && <div className="mt-3 w-full bg-white/10 rounded-full h-2 overflow-hidden"><div className="bg-primary h-full animate-pulse w-full"></div></div>}
              {!import.meta.env.VITE_IMGBB_API_KEY && <p className="text-xs text-yellow-500 mt-2">⚠️ Set VITE_IMGBB_API_KEY in .env to enable direct upload, or use Image URL mode.</p>}
            </div>
          ) : (
            <div>
              <input type="url" name="imageUrl" placeholder="https://i.ibb.co/... or any image link" required={imageMode === "url"} className="input-field" value={form.imageUrl} onChange={handleChange} />
              <p className="text-xs text-gray-600 mt-1.5">Paste direct image link (imgbb, cloudinary, etc.)</p>
            </div>
          )}

          {/* Hidden input to keep form.imageUrl required for submit */}
          {imageMode === "upload" && <input type="hidden" required={!form.imageUrl} value={form.imageUrl} onChange={() => {}} />}
          {!form.imageUrl && imageMode === "upload" && <p className="text-xs text-red-400 mt-2">Please upload an image first</p>}
        </div>

        {/* Image Preview */}
        {form.imageUrl && (
          <div className="rounded-xl overflow-hidden h-48 border border-white/10 relative">
            <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.target.style.display = "none")} />
            <button type="button" onClick={() => setForm({ ...form, imageUrl: "" })} className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-500/80">×</button>
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

        <button type="submit" className="btn-primary w-full py-4 text-lg" disabled={loading || uploading || !form.imageUrl}>
          {uploading ? "Uploading Image..." : loading ? "Adding Car..." : "Add Car to DriveFleet"}
        </button>
      </form>
    </div>
  );
};

export default AddCar;
