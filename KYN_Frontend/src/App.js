import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Home from './Components/Home';
import Registration from './Components/Registration';
import Login from './Components/Login';
import ContactUs from './Components/ContactUs';
import AboutUs from './Components/AboutUs';
import Terms from './Components/Terms';
import Navbar from './Components/Navbar';
import UserProfile from './Components/UserProfile';
import AuthCallback from './Components/AuthCallback';
import Footer from './Components/Footer';
import DiscussionForum from './Components/DiscussionForum';
import ForumPost from './Components/ForumPost';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-100">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Registration />} />
              <Route path="/login" element={<Login />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/auth-callback" element={<AuthCallback />} />
              <Route path="/forums" element={<DiscussionForum />} />
              <Route path="/forums/:id" element={<ForumPost />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;