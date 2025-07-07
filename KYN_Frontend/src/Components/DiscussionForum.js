import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function DiscussionForum() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [forums, setForums] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8080/api/forums')
      .then(response => setForums(response.data))
      .catch(err => console.error('Failed to fetch forums:', err));
  }, []);

  const handleCreateForum = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please log in to create a forum');
      setTimeout(() => navigate('/login'), 2000); // Redirect after showing message
      return;
    }
    try {
      console.log('Sending POST to /api/forums with JSESSIONID:', document.cookie);
      const response = await axios.post('http://localhost:8080/api/forums', {
        title,
        description,
        createdBy: user.email
      }, { withCredentials: true });
      setForums([...forums, response.data]);
      setTitle('');
      setDescription('');
      setError('');
    } catch (err) {
      console.error('POST /api/forums failed:', err.response);
      if (err.response && err.response.status === 401) {
        setError('Session expired. Please log in again.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError('Failed to create forum: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Discussion Forums</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {user ? (
        <form onSubmit={handleCreateForum} className="mb-8">
          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Create Forum
          </button>
        </form>
      ) : (
        <p className="text-gray-700 mb-4">
          Please <Link to="/login" className="text-blue-500">log in</Link> to create a forum.
        </p>
      )}
      <div>
        {forums.map(forum => (
          <div key={forum.id} className="bg-white p-4 mb-2 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">{forum.title}</h3>
            <p className="text-gray-600">{forum.description}</p>
            <p className="text-sm text-gray-500">Created by: {forum.createdBy}</p>
            <Link to={`/forums/${forum.id}`} className="text-blue-500">View Posts</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DiscussionForum;