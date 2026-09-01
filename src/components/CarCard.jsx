import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaUsers, FaStar, FaHeart, FaRegHeart } from "react-icons/fa";

const CarCard = ({ car }) => {
  const {
    _id,
    carName,
    dailyRentPrice,
    carType,
    imageUrl,
    seatCapacity,
    pickupLocation,
    availabilityStatus,
    bookingCount,
  } = car;

  const [wishlisted, setWishlisted] = useState(false);
  const fallback = "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600";

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishlisted(list.includes(_id));
  }, [_id]);

  const toggleWishlist = (e) => {
    e.preventDefault();
    const list = JSON.parse(localStorage.getItem("wishlist") || "[]");
    let updated;
    if (list.includes(_id)) updated = list.filter((id) => id !== _id);
    else updated = [...list, _id];
    localStorage.setItem("wishlist", JSON.stringify(updated));
    setWishlisted(!wishlisted);
  };

  return (
    <div className="card-dark overflow-hidden group flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden h-48 flex-shrink-0">
        <img
          src={imageUrl || fallback}
          alt={carName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => (e.target.src = fallback)}
          loading="lazy"
        />
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              availabilityStatus === "Available" ? "bg-green-500/90 text-white" : "bg-red-500/90 text-white"
            }`}
          >
            {availabilityStatus}
          </span>
        </div>
        {/* Bookings */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 text-xs flex items-center gap-1">
          <FaStar className="text-yellow-400" />
          <span>{bookingCount || 0}</span>
        </div>
        {/* Wishlist */}
        <button
          onClick={toggleWishlist}
          className="absolute bottom-3 right-3 w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
          title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {wishlisted ? <FaHeart className="text-primary text-sm" /> : <FaRegHeart className="text-white text-sm" />}
        </button>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-md w-fit">
          {carType}
        </span>
        <h3 className="text-lg font-semibold mt-2 mb-3 line-clamp-1">{carName}</h3>

        <div className="flex items-center justify-between text-gray-400 text-sm mb-4">
          <span className="flex items-center gap-1.5">
            <FaUsers className="text-primary" />
            {seatCapacity} Seats
          </span>
          <span className="flex items-center gap-1.5">
            <FaMapMarkerAlt className="text-primary" />
            {pickupLocation}
          </span>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-2xl font-bold text-primary">${dailyRentPrice}</span>
            <span className="text-gray-500 text-sm">/day</span>
          </div>
          <Link to={`/cars/${_id}`} className="btn-primary text-sm py-2 px-4">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
