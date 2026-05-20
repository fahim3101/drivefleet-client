import { Link } from "react-router-dom";
import { FaCar } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center text-center px-4">
      <div>
        <FaCar className="text-9xl text-primary/20 mx-auto mb-6 animate-bounce" />
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          Oops! Wrong Turn
        </h2>
        <p className="text-gray-400 mb-10 max-w-md mx-auto text-lg leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Let's
          get you back on track!
        </p>
        <Link to="/" className="btn-primary text-lg px-10 py-4">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
