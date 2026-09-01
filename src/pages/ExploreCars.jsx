import { useEffect, useState } from "react";
import api from "../api/axios";
import CarCard from "../components/CarCard";
import { CardGridSkeleton } from "../components/Skeleton";
import { FaSearch, FaCar, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const carTypes = ["all", "SUV", "Sedan", "Hatchback", "Luxury", "Sports", "Truck", "Van", "Electric"];
const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
];

const ExploreCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [type, setType] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(t);
  }, [search]);

  const fetchCars = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/cars", {
        params: { search: debouncedSearch, type, sort, page, limit: 9 },
      });
      if (Array.isArray(res.data)) {
        setCars(res.data);
        setTotal(res.data.length);
        setTotalPages(1);
      } else {
        setCars(res.data.cars || []);
        setTotal(res.data.total || 0);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load cars");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [debouncedSearch, type, sort, page]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, type, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Explore <span className="text-primary">All Cars</span>
        </h1>
        <p className="text-gray-400 text-lg">Find the perfect vehicle for every occasion</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-10">
        <div className="flex gap-2 flex-1 relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by car name..."
            className="input-field flex-1 pl-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="input-field lg:w-48" value={type} onChange={(e) => setType(e.target.value)}>
          {carTypes.map((t) => (
            <option key={t} value={t}>
              {t === "all" ? "All Types" : t}
            </option>
          ))}
        </select>
        <select className="input-field lg:w-48" value={sort} onChange={(e) => setSort(e.target.value)}>
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {!loading && total > 0 && (
        <p className="text-gray-500 text-sm mb-6">
          Showing <span className="text-primary font-semibold">{cars.length}</span> of{" "}
          <span className="text-primary font-semibold">{total}</span> cars {debouncedSearch && `for "${debouncedSearch}"`}
        </p>
      )}

      {loading ? (
        <CardGridSkeleton count={9} />
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={fetchCars} className="btn-primary">
            Retry
          </button>
        </div>
      ) : cars.length === 0 ? (
        <div className="text-center py-24">
          <FaCar className="text-6xl text-gray-700 mx-auto mb-4" />
          <p className="text-xl text-gray-500">No cars found matching your criteria.</p>
          <p className="text-gray-600 mt-2">Try a different search or filter.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-3 bg-[#16213E] border border-white/10 rounded-lg disabled:opacity-40 hover:border-primary/50 transition-colors"
              >
                <FaChevronLeft />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(Math.max(0, page - 3), Math.min(totalPages, page + 2))
                .map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      n === page ? "bg-primary text-white" : "bg-[#16213E] border border-white/10 hover:border-primary/50"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-3 bg-[#16213E] border border-white/10 rounded-lg disabled:opacity-40 hover:border-primary/50 transition-colors"
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExploreCars;
