import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext';

function ForumPosts() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [forum, setForum] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  const [commentError, setCommentError] = useState('');

  useEffect(() => {
    // Fetch forum details
    axios.get(`http://localhost:8080/api/forums/${id}`, { withCredentials: true })
      .then(response => {
        setForum(response.data);
        setError('');
      })
      .catch(err => {
        console.error('Failed to fetch forum:', err);
        setError(err.response?.data?.message || 'Forum not found');
      });

    // Fetch comments
    axios.get(`http://localhost:8080/api/comments/forum/${id}`, { withCredentials: true })
      .then(response => {
        setComments(response.data);
      })
      .catch(err => {
        console.error('Failed to fetch comments:', err);
        setCommentError('Failed to load comments');
      });
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setCommentError('Please log in to post a comment');
      setTimeout(() => navigate('/login'), 2000); // Redirect after showing message
      return;
    }
    if (!newComment.trim()) {
      setCommentError('Comment cannot be empty');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8080/api/comments/forum/${id}`, 
        { content: newComment }, 
        { withCredentials: true }
      );
      setComments([...comments, response.data]);
      setNewComment('');
      setCommentError('');
    } catch (err) {
      console.error('Failed to post comment:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          'Failed to post comment';
      setCommentError(errorMessage);
      if (err.response?.status === 401) {
        setTimeout(() => navigate('/login'), 2000);
      }
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500">{error}</p>
        <Link to="/forums" className="text-blue-500 hover:underline">Back to Forums</Link>
      </div>
    );
  }

  if (!forum) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">{forum.title}</h2>
      <p className="text-gray-600 mb-4">{forum.description}</p>
      <p className="text-sm text-gray-500 mb-4">Created by: {forum.createdBy}</p>
      
      <h3 className="text-xl font-semibold mb-4">Comments</h3>
      {commentError && <p className="text-red-500 mb-4">{commentError}</p>}
      {comments.length > 0 ? (
        <div className="space-y-4 mb-6">
          {comments.map(comment => (
            <div key={comment.id} className="bg-gray-100 p-4 rounded-lg">
              <p className="text-gray-800">{comment.content}</p>
              <p className="text-sm text-gray-500 mt-2">
                Posted by: {comment.createdByName || comment.createdBy} on {new Date(comment.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 mb-6">No comments yet. Be the first to comment!</p>
      )}

      {user ? (
        <form onSubmit={handleCommentSubmit} className="mt-4">
          <textarea
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder="Write your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            type="submit"
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Post Comment
          </button>
        </form>
      ) : (
        <p className="text-gray-600">
          <Link to="/login" className="text-blue-500 hover:underline">Log in</Link> to post a comment.
        </p>
      )}

      <Link to="/forums" className="text-blue-500 hover:underline mt-4 inline-block">Back to Forums</Link>
    </div>
  );
}

export default ForumPosts;