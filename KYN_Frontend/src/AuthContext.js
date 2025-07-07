import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async (retry = true) => {
    try {
      const response = await axios.get('http://localhost:8080/api/user/info', { withCredentials: true });
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      if (retry && error.response?.status === 401) {
        // Retry once after a short delay
        setTimeout(() => fetchUser(false), 1000);
      } else {
        setUser(null);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await axios.post('http://localhost:8080/api/user/logout', {}, { withCredentials: true });
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      setUser(null);
      window.location.href = '/';
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}