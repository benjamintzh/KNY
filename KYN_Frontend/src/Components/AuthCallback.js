import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function AuthCallback() {
  const navigate = useNavigate();
  const { fetchUser } = useAuth();

  useEffect(() => {
    fetchUser().then(() => {
      navigate('/');
    }).catch(() => {
      navigate('/login?error=auth_failed');
    });
  }, [fetchUser, navigate]);

  return <div>Loading...</div>;
}

export default AuthCallback;