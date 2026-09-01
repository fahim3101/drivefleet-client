import { useEffect, useState } from "react";
import api from "../api/axios";
import CarCard from "../components/CarCard";
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";
import { FaHeart, FaTrash } from "react-icons/fa";

const Wishlist = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlistCars = async () => {
    const ids = JSON.parse(localStorage.getItem("wishlist") || "[]");
    if (ids.length === 0) {
      setCars([]);
      setLoading(false);
      return;
    }
    try {
      // Fetch all cars and filter by wishlist ids (since server has no batch endpoint)
      // Use /cars with large limit then filter client side; for scale, add server batch endpoint later
      const res = await api.get("/cars", { params: { limit: 50 } });
      const all = Array.isArray(res.data) ? res.data : res.data.cars || [];
      const filtered = all.filter((c) => ids.includes(c._id));
      // For ids not in first 50, fetch individually
      const missing = ids.filter((id) => !filtered.some((c) => c._id === id));
      if (missing.length > 0) {
        const fetched = await Promise.all(missing.map((id) => api.get(`/cars/${id}`).then((r) => r.data).catch(() => null)));
        filtered.push(...fetched.filter(Boolean));
      }
      setCars(filtered);
    } catch {
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlistCars();
    const handler = () => fetchWishlistCars();
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const clearWishlist = () => {
    localStorage.removeItem("wishlist");
    setCars([]);
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3 flex items-center justify-center gap-3">
          <FaHeart className="text-primary" /> My <span className="text-primary">Wishlist</span>
        </h1>
        <p className="text-gray-400">Your favourite cars saved for later</p>
      </div>

      {cars.length === 0 ? (
        <div className="text-center py-24">
          <FaHeart className="text-6xl text-gray-700 mx-auto mb-4" />
          <p className="text-xl text-gray-500 mb-2">Your wishlist is empty</p>
          <p className="text-gray-600 mb-8">Tap the heart on any car to save it here</p>
          <Link to="/explore" className="btn-primary">
            Explore Cars
          </Link>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-500 text-sm">
              <span className="text-primary font-semibold">{cars.length}</span> saved cars
            </p>
            <button onClick={clearWishlist} className="text-sm text-red-400 hover:text-red-300 flex items-center gap-2">
              <FaTrash /> Clear All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Wishlist;
