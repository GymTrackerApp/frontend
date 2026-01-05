import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router";

const Header = () => {
  return (
    <div className="flex justify-between items-center bg-components-main text-white py-2 px-3 border-b border-b-gray-500">
      <Link
        to="/"
        className="text-xl font-extrabold hover:text-indigo-100 transition-colors"
      >
        <h1>Gym Tracker</h1>
      </Link>
      <Link to="/profile" className="hover:opacity-80">
        <FaUserCircle className="text-2xl" />
      </Link>
    </div>
  );
};

export default Header;
