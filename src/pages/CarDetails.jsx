import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../providers/AuthProvider";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import { FaMapMarkerAlt, FaUsers, FaCar, FaStar, FaTimes, FaCheckCircle, FaTrash } from "react-icons/fa";

const fallbackImg = "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600";

const CarDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ driverNeeded: "No", specialNote: "", startDate: "", endDate: "", paymentMethod: "Bkash" });
  const [booking, setBooking] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    api
      .get(`/cars/${id}`)
      .then((res) => {
        setCar(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const fetchReviews = () => {
    api
      .get(`/reviews/${id}`)
      .then((res) => {
        setReviews(res.data.reviews || []);
        setAvgRating(res.data.avg);
        setReviewCount(res.data.count || 0);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to review");
    if (!reviewForm.comment.trim()) return toast.error("Please write a comment");
    setSubmittingReview(true);
    try {
      await api.post("/reviews", {
        carId: id,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
        userName: user.displayName || user.email,
        userPhoto: user.photoURL || "",
      });
      toast.success("Review submitted!");
      setReviewForm({ rating: 5, comment: "" });
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    }
    setSubmittingReview(false);
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await api.delete(`/reviews/${reviewId}`);
      toast.success("Review deleted");
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const calcDays = () => {
    if (!form.startDate || !form.endDate) return 1;
    const s = new Date(form.startDate);
    const e = new Date(form.endDate);
    if (isNaN(s) || isNaN(e) || e <= s) return 1;
    return Math.ceil((e - s) / (1000 * 60 * 60 * 24));
  };

  const days = calcDays();
  const perDay = car ? car.dailyRentPrice + (form.driverNeeded === "Yes" ? 20 : 0) : 0;
  const totalPrice = perDay * days;
  const isOwnCar = user && car && car.ownerEmail === user.email;

  const handleBook = async () => {
    if (!user) {
      toast.error("Please login to book a car");
      return;
    }
    if (isOwnCar) {
      toast.error("You cannot book your own car");
      return;
    }
    if (form.startDate && form.endDate && new Date(form.endDate) <= new Date(form.startDate)) {
      toast.error("End date must be after start date");
      return;
    }
    if (!form.startDate || !form.endDate) {
      toast.error("Please select start and end dates");
      return;
    }
    setBooking(true);
    await new Promise((r) => setTimeout(r, 800));
    try {
      await api.post("/bookings", {
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
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
        totalPrice,
        paymentMethod: form.paymentMethod,
        paymentStatus: "paid",
        transactionId: `mock_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      });
      toast.success(`🎉 Payment via ${form.paymentMethod} successful! Booking confirmed. Email sent to ${user.email}`);
      setModal(false);
      setCar((prev) => ({ ...prev, bookingCount: (prev.bookingCount || 0) + 1 }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed. Please try again.");
    }
    setBooking(false);
  };

  if (loading) return <Spinner />;
  if (!car)
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-xl mb-4">Car not found</p>
        <Link to="/explore" className="btn-primary">
          Explore Cars
        </Link>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="rounded-2xl overflow-hidden border border-white/10 h-80">
            <img src={car.imageUrl || fallbackImg} alt={car.carName} className="w-full h-full object-cover" onError={(e) => (e.target.src = fallbackImg)} />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {["Air Conditioning", "GPS Navigation", "Bluetooth Audio", "USB Charging"].map((f) => (
              <div key={f} className="flex items-center gap-2 bg-[#16213E] rounded-lg px-4 py-3 border border-white/10 text-sm text-gray-400">
                <FaCheckCircle className="text-primary text-xs" />
                {f}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs text-primary font-medium bg-primary/10 px-3 py-1 rounded-full">{car.carType}</span>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${car.availabilityStatus === "Available" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>{car.availabilityStatus}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-2">{car.carName}</h1>

          <div className="flex items-center gap-1 text-yellow-400 mb-6">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <FaStar key={i} className={`text-sm ${avgRating && i < Math.round(avgRating) ? "" : "opacity-30"}`} />
              ))}
            <span className="text-gray-400 text-sm ml-2">
              {avgRating ? `${avgRating} (${reviewCount} reviews)` : `${car.bookingCount || 0} bookings`}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {[
              [FaUsers, "Seat Capacity", `${car.seatCapacity} Seats`],
              [FaMapMarkerAlt, "Pickup Location", car.pickupLocation],
              [FaCar, "Car Type", car.carType],
            ].map(([Icon, label, val]) => (
              <div key={label} className="bg-[#16213E] rounded-xl p-4 border border-white/10">
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

          <p className="text-gray-400 leading-relaxed mb-4">{car.description}</p>
          {car.ownerEmail && <p className="text-xs text-gray-500 mb-8">Owner: {car.ownerName || car.ownerEmail}</p>}

          {isOwnCar ? (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-center text-yellow-400 text-sm">This is your own car. You cannot book it.</div>
          ) : (
            <button
              onClick={() => {
                if (!user) {
                  toast.error("Please login to book");
                  return;
                }
                setModal(true);
              }}
              disabled={car.availabilityStatus !== "Available"}
              className={`w-full py-4 rounded-xl text-lg font-semibold transition-all ${car.availabilityStatus === "Available" ? "bg-primary hover:bg-red-700 text-white" : "bg-gray-700 text-gray-500 cursor-not-allowed"}`}
            >
              {car.availabilityStatus === "Available" ? "Book Now" : "Currently Unavailable"}
            </button>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 border-t border-white/10 pt-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FaStar className="text-yellow-400" /> Reviews {avgRating && <span className="text-primary">({avgRating}★)</span>}
            <span className="text-gray-500 text-sm font-normal">{reviewCount} reviews</span>
          </h2>
        </div>

        {/* Review Form */}
        {user ? (
          <form onSubmit={handleReviewSubmit} className="card-dark p-6 mb-8">
            <h3 className="font-semibold mb-4">Write a Review</h3>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-gray-400">Rating:</span>
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: n })} className={n <= reviewForm.rating ? "text-yellow-400" : "text-gray-600"}>
                  <FaStar />
                </button>
              ))}
              <span className="text-sm text-primary ml-2">{reviewForm.rating} / 5</span>
            </div>
            <textarea
              className="input-field resize-none"
              rows={3}
              placeholder="Share your experience with this car..."
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              required
            />
            <button type="submit" className="btn-primary mt-4" disabled={submittingReview}>
              {submittingReview ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        ) : (
          <div className="card-dark p-6 mb-8 text-center text-gray-400">
            <p>Please <Link to="/login" className="text-primary hover:underline">login</Link> to write a review.</p>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map((r) => (
              <div key={r._id} className="card-dark p-5">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <img src={r.userPhoto || "https://i.ibb.co/MBtjqXQ/no-avatar.gif"} alt={r.userName} className="w-9 h-9 rounded-full object-cover border border-white/10" />
                    <div>
                      <p className="font-semibold text-sm">{r.userName}</p>
                      <p className="text-gray-500 text-xs">{new Date(r.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5 text-yellow-400 text-xs">
                      {Array(r.rating)
                        .fill(0)
                        .map((_, i) => (
                          <FaStar key={i} />
                        ))}
                    </div>
                    {user?.email === r.userEmail && (
                      <button onClick={() => handleDeleteReview(r._id)} className="text-red-400 hover:text-red-300 p-1" title="Delete review">
                        <FaTrash className="text-xs" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{r.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 px-4">
          <div className="bg-[#16213E] rounded-2xl border border-white/10 p-8 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold">Book {car.carName}</h2>
                <p className="text-gray-500 text-sm">${car.dailyRentPrice}/day {form.driverNeeded === "Yes" && "+ $20 driver"}</p>
              </div>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-white">
                <FaTimes size={20} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Start Date</label>
                  <input type="date" className="input-field" value={form.startDate} min={new Date().toISOString().split("T")[0]} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">End Date</label>
                  <input type="date" className="input-field" value={form.endDate} min={form.startDate || new Date().toISOString().split("T")[0]} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
                </div>
              </div>
              {form.startDate && form.endDate && <p className="text-xs text-primary">{days} day(s) selected</p>}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Driver Needed?</label>
                <select className="input-field" value={form.driverNeeded} onChange={(e) => setForm({ ...form, driverNeeded: e.target.value })}>
                  <option value="No">No — I'll drive myself</option>
                  <option value="Yes">Yes — I need a driver (+$20/day)</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Payment Method *</label>
                <select className="input-field" value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}>
                  <option value="Bkash">bKash (Mock)</option>
                  <option value="Nagad">Nagad (Mock)</option>
                  <option value="Card">Card (Mock)</option>
                  <option value="Cash">Cash on Pickup</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Mock payment — no real money charged. Choose any method.</p>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Special Note (optional)</label>
                <textarea className="input-field resize-none" rows={3} placeholder="Any special requirements..." value={form.specialNote} onChange={(e) => setForm({ ...form, specialNote: e.target.value })} />
              </div>
            </div>

            <div className="bg-[#0f0f1a] rounded-xl p-4 mb-6 border border-white/5">
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>Daily Rate × {days} day(s)</span>
                <span>${car.dailyRentPrice} × {days}</span>
              </div>
              {form.driverNeeded === "Yes" && (
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>Driver Fee × {days}</span>
                  <span>$20 × {days}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-white pt-2 border-t border-white/10 mt-2">
                <span>Total</span>
                <span className="text-primary">${totalPrice}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setModal(false)} className="btn-outline flex-1">
                Cancel
              </button>
              <button onClick={handleBook} className="btn-primary flex-1" disabled={booking}>
                {booking ? "Booking..." : `Confirm $${totalPrice}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarDetails;
