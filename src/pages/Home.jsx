import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import CarCard from "../components/CarCard";
import { CardGridSkeleton } from "../components/Skeleton";
import { FaShieldAlt, FaHeadset, FaMapMarked, FaStar, FaChevronRight } from "react-icons/fa";
import { useTheme } from "../providers/ThemeProvider";

const Home = () => {
  const { theme } = useTheme();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCars = () => {
    setLoading(true);
    setError("");
    api
      .get("/cars/latest")
      .then((res) => {
        setCars(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load cars");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return (
    <div>
      {/* ── Banner ───────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f1a] via-[#1a0a22] to-[#0a0f1a]" />
        <div
          className="absolute inset-0 opacity-15 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1a] via-transparent to-transparent" />

        {/* Content */}
        <div className="relative text-center px-4 max-w-4xl mx-auto z-10">
          <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-5 py-2 text-sm text-primary mb-8 font-medium">
            <FaStar className="text-xs" />
            Premium Car Rental Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight text-white">
            Drive Your <span className="text-primary">Dream</span>
            <br />
            <span className="text-white">Car Today</span>
          </h1>

          <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Explore hundreds of premium vehicles. Book instantly, drive confidently.
            Your perfect ride is just a click away.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/explore" className="btn-primary text-lg px-10 py-3.5 flex items-center gap-2 justify-center">
              Explore Cars <FaChevronRight className="text-sm" />
            </Link>
            <Link to="/add-car" className="btn-outline text-lg px-10 py-3.5">
              List Your Car
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-10 mt-16">
            {[
              ["500+", "Cars Available"],
              ["10K+", "Happy Customers"],
              ["50+", "Locations"],
            ].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">{num}</div>
                <div className="text-gray-300 text-sm mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Available Cars ───────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Available <span className="text-primary">Cars</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Our latest fleet of premium vehicles ready for your next adventure
          </p>
        </div>

        {loading ? (
          <CardGridSkeleton count={6} />
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <button onClick={fetchCars} className="btn-primary">
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/explore" className="btn-outline text-base px-10">
            View All Cars
          </Link>
        </div>
      </section>

      {/* ── Why Choose Us ────────────────────────────────── */}
      <section className={theme === "light" ? "bg-white py-20 border-y border-slate-200" : "bg-[#16213E]/40 py-20 border-y border-white/5"}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === "light" ? "text-slate-900" : "text-white"}`}>
              Why Choose <span className="text-primary">DriveFleet</span>
            </h2>
            <p className={theme === "light" ? "text-slate-600" : "text-gray-400"}>We offer more than just a car rental service</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FaShieldAlt,
                title: "Fully Insured",
                desc: "Every vehicle comes with comprehensive insurance coverage for your complete peace of mind on every trip.",
              },
              {
                icon: FaHeadset,
                title: "24/7 Support",
                desc: "Our dedicated support team is available round the clock to assist you anytime, anywhere you need help.",
              },
              {
                icon: FaMapMarked,
                title: "50+ Locations",
                desc: "Pick up and drop off at over 50 convenient locations across the country. We're always nearby.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card-dark p-8 text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Icon className="text-3xl text-primary" />
                </div>
                <h3 className={`text-xl font-semibold mb-3 ${theme === "light" ? "text-slate-900" : "text-white"}`}>{title}</h3>
                <p className={theme === "light" ? "text-slate-600 leading-relaxed" : "text-gray-400 leading-relaxed"}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === "light" ? "text-slate-900" : "text-white"}`}>
            What Our <span className="text-primary">Clients Say</span>
          </h2>
          <p className={theme === "light" ? "text-slate-600" : "text-gray-400"}>Thousands of happy customers trust DriveFleet</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Rahim Uddin",
              role: "Business Traveler",
              avatar: "https://i.pravatar.cc/60?img=11",
              text: "DriveFleet made my business trip completely seamless. The car was spotless, booking was instant, and the team was incredibly helpful!",
              rating: 5,
            },
            {
              name: "Priya Sharma",
              role: "Tourist",
              avatar: "https://i.pravatar.cc/60?img=25",
              text: "Excellent service! Picked up from the airport, car was in great condition. Would absolutely recommend to anyone visiting the city.",
              rating: 5,
            },
            {
              name: "Karim Hassan",
              role: "Car Owner",
              avatar: "https://i.pravatar.cc/60?img=33",
              text: "I listed my car on DriveFleet and started earning within the first week. The platform is super easy to use. Amazing experience!",
              rating: 5,
            },
          ].map(({ name, role, avatar, text, rating }) => (
            <div key={name} className="card-dark p-6">
              <div className="flex gap-1 mb-4">
                {Array(rating)
                  .fill(0)
                  .map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-sm" />
                  ))}
              </div>
              <p className={`mb-5 leading-relaxed text-sm italic ${theme === "light" ? "text-slate-700" : "text-gray-300"}`}>"{text}"</p>
              <div className="flex items-center gap-3">
                <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover border-2 border-primary/30" />
                <div>
                  <div className={`font-semibold text-sm ${theme === "light" ? "text-slate-900" : "text-white"}`}>{name}</div>
                  <div className={theme === "light" ? "text-slate-500 text-xs" : "text-gray-500 text-xs"}>{role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────── */}
      <section className={theme === "light" ? "bg-gradient-to-r from-red-50 via-red-100/50 to-red-50 border-y border-red-200 py-16" : "bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border-y border-primary/20 py-16"}>
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === "light" ? "text-slate-900" : "text-white"}`}>Ready to Hit the Road?</h2>
          <p className={`mb-8 text-lg ${theme === "light" ? "text-slate-600" : "text-gray-400"}`}>Join thousands of satisfied customers and book your dream car today.</p>
          <Link to="/explore" className="btn-primary text-lg px-12 py-4">
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
