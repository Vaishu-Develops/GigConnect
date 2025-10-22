import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Loader from './components/ui/Loader';

const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Profile = React.lazy(() => import('./pages/Profile'));
const PostGig = React.lazy(() => import('./pages/PostGig'));
const GigsList = React.lazy(() => import('./pages/GigsList'));
const Chat = React.lazy(() => import('./pages/Chat'));

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-primary via-[#1A1F3A] to-[#2D1B4E] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-primary via-[#1A1F3A] to-[#2D1B4E]">
      <Navbar />
      <main className="flex-1">
        <React.Suspense 
          fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
              <Loader />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/post-gig" element={<PostGig />} />
            <Route path="/gigs" element={<GigsList />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/chat/:chatId" element={<Chat />} />
          </Routes>
        </React.Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;