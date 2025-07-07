import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-blue-800 text-white py-4 mt-auto">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <p className="text-sm mb-2">© 2025 Know-Your-Neighborhood. All rights reserved.</p>
        <ul className="flex space-x-4">
          <li>
            <Link to="/terms" className="hover:text-gray-300">Terms and Conditions</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;