import { Link } from "react-router-dom";
import { FaCar, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

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
          <div className="flex flex-col gap-2 text-sm text-gray-400">
            <span>📍 Dhaka, Bangladesh</span>
            <span>📞 +880 1700-000000</span>
            <span>✉️ support@drivefleet.com</span>
            <span>🕐 Mon–Sat, 9am–6pm</span>
          </div>
        </div>

        {/* Social */}
        <div>
          <h4 className="font-semibold mb-4 text-white">Follow Us</h4>
          <div className="flex gap-3">
            {[
              { icon: FaFacebook, href: "#" },
              { icon: FaXTwitter, href: "#" },
              { icon: FaInstagram, href: "#" },
              { icon: FaLinkedin, href: "#" },
            ].map(({ icon: Icon, href }, i) => (
              <a
                key={i}
                href={href}
                className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/50 transition-all"
              >
                <Icon />
              </a>
            ))}
          </div>
          <p className="text-gray-600 text-xs mt-4">
            Stay updated with our latest offers and fleet additions.
          </p>
        </div>
      </div>

      <div className="border-t border-white/5 text-center text-gray-600 text-sm py-4">
        © {new Date().getFullYear()} DriveFleet. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
