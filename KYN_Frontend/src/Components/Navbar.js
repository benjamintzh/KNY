import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function Navbar() {
  const { user, logout, loading } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="bg-blue-800 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Know-Your-Neighborhood</h1>
        {!loading && (
          <ul className="flex space-x-4 items-center">
            <li><Link to="/" className="hover:text-gray-300">Home</Link></li>
            <li><Link to="/contact" className="hover:text-gray-300">Contact Us</Link></li>
            <li><Link to="/about" className="hover:text-gray-300">About Us</Link></li>
            <li><Link to="/forums" className="hover:text-gray-300">Forums</Link></li>
            {user ? (
              <li className="relative">
                <button
                  onClick={toggleDropdown}
                  className="hover:text-gray-300 focus:outline-none"
                >
                  My Profile
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg text-black">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      {user.name || 'User'}
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </li>
            ) : (
              <>
                <li><Link to="/register" className="hover:text-gray-300">Register</Link></li>
                <li><Link to="/login" className="hover:text-gray-300">Login</Link></li>
              </>
            )}
          </ul>
        )}
      </div>
    </nav>
  );
}

export default Navbar;