import { useEffect, useState } from "react";
import axios from "axios";
import CarCard from "../components/CarCard";
import Spinner from "../components/Spinner";
import { FaSearch, FaCar } from "react-icons/fa";

const carTypes = ["all", "SUV", "Sedan", "Hatchback", "Luxury", "Sports", "Truck", "Van"];

const ExploreCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");

  const fetchCars = (searchVal = search, typeVal = type) => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/cars`, {
        params: { search: searchVal, type: typeVal },
      })
      .then((res) => {
        setCars(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchCars();
  }, [type]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCars();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Explore <span className="text-primary">All Cars</span>
        </h1>
        <p className="text-gray-400 text-lg">
          Find the perfect vehicle for every occasion
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <input
            type="text"
            placeholder="Search by car name..."
            className="input-field flex-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn-primary px-5">
            <FaSearch />
          </button>
        </form>
        <select
          className="input-field md:w-52"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          {carTypes.map((t) => (
            <option key={t} value={t}>
              {t === "all" ? "All Types" : t}
            </option>
          ))}
        </select>
      </div>

      {/* Results */}
      {loading ? (
        <Spinner />
      ) : cars.length === 0 ? (
        <div className="text-center py-24">
          <FaCar className="text-6xl text-gray-700 mx-auto mb-4" />
          <p className="text-xl text-gray-500">No cars found matching your criteria.</p>
          <p className="text-gray-600 mt-2">Try a different search or filter.</p>
        </div>
      ) : (
        <>
          <p className="text-gray-500 text-sm mb-6">
            Showing <span className="text-primary font-semibold">{cars.length}</span> cars
          </p>
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

export default ExploreCars;
