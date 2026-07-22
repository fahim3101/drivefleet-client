import { Link } from "react-router-dom";
import { FaCar, FaFacebook, FaInstagram, FaLinkedin, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#0a0a14] border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 text-xl font-bold mb-4">
            <FaCar className="text-primary" />
            <span>Drive<span className="text-primary">Fleet</span></span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            Premium car rental at your fingertips. Explore, book, and drive your dream vehicle today.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/" className="text-gray-400 hover:text-primary transition-colors">Home</Link>
            <Link to="/explore" className="text-gray-400 hover:text-primary transition-colors">Explore Cars</Link>
            <Link to="/add-car" className="text-gray-400 hover:text-primary transition-colors">Add Car</Link>
            <Link to="/my-bookings" className="text-gray-400 hover:text-primary transition-colors">My Bookings</Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-4 text-white">Contact Us</h4>
          <div className="flex flex-col gap-3 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <FaPhoneAlt className="text-primary text-xs" />
              <a
                href="tel:+8801818858015"
                className="hover:text-primary transition-colors"
              >
                +880 1818-858015
              </a>
            </span>
            <span className="flex items-center gap-2">
              <FaEnvelope className="text-primary text-xs" />
              <a
                href="mailto:fahimrana3101@gmail.com"
                className="hover:text-primary transition-colors break-all"
              >
                fahimrana3101@gmail.com
              </a>
            </span>
            <span>📍 Dhaka, Bangladesh</span>
            <span>🕐 Available 24/7</span>
          </div>
        </div>

        {/* Social */}
        <div>
          <h4 className="font-semibold mb-4 text-white">Follow Me</h4>
          <div className="flex gap-3">
            <a
              href="https://www.linkedin.com/in/fahim-rana/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/50 transition-all"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://www.facebook.com/fahim2855"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/50 transition-all"
            >
              <FaFacebook />
            </a>
            <a
              href="https://www.instagram.com/_fahiiiim_/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/50 transition-all"
            >
              <FaInstagram />
            </a>
          </div>
          <p className="text-gray-600 text-xs mt-4">
            Stay connected for the latest fleet updates and offers.
          </p>
        </div>
      </div>

      <div className="border-t border-white/5 text-center text-gray-600 text-sm py-4">
        © {new Date().getFullYear()} DriveFleet. Built with ❤️ by{" "}
        <a
          href="https://github.com/fahim3101"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Fahim Rana
        </a>
        . All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
