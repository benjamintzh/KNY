import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext';

function UserProfile() {
  const { user, loading } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      setError('Please log in to view your profile');
      navigate('/login');
    }
  }, [user, loading, navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {user ? (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Profile Details</h3>
          <p className="text-gray-700 mb-2"><strong>Name:</strong> {user.name || 'N/A'}</p>
          <p className="text-gray-700 mb-4"><strong>Email:</strong> {user.email}</p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Back to Home
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default UserProfile;