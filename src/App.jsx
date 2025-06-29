import './App.css';
import { useState, useEffect } from 'react';
import Home from "./Home";
import EventsPage from "./components/eventspage";
import Certificate from "./components/Certificate";
import Project from "./components/Project";
import Faculty from "./components/Faculty";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import StarsCanvas from './Canvas/Stars';
import Login from './Login/Login';
import FacultyDashboard from './Admin/Pages/FacultyDashboard';
import Dashboard from './Admin/Dashboard';
import EventDashboard from './Admin/Pages/EventDashboard';
import ProjectDashboard from './Admin/Pages/ProjectDashboard';
import MembersDashboard from './Admin/Pages/MembersDashboard';
import AchivementDashboard from './Admin/Pages/AchivementDashboard';
import Logout from './Login/Logout';
import ForgotPassword from './Login/ForgotPassword';
import UpdatePassword from './Login/UpdatePassword';
import RegisterPage from './Login/Register';
import { supabase } from './supabaseClient';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check persisted session on load
  useEffect(() => {
    const checkUserApproval = async (session) => {
      if (!session?.user) {
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('approved')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching profile for auth check:', error.message);
        // Safest to sign out if profile can't be retrieved
        await supabase.auth.signOut();
        return; // onAuthStateChange will handle setting isAuthenticated to false
      }

      if (profile && profile.approved) {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        // User has a session but is not approved. Log them out.
        await supabase.auth.signOut();
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
      }
    };

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      checkUserApproval(session);
      setLoading(false);
    });

    // Setup auth state listener to handle all auth events
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      checkUserApproval(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  if (loading) return null;

  return (
    <div className="App">
      <StarsCanvas />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/project" element={<Project />} />
          <Route path="/verify" element={<Certificate />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/update-password" element={<UpdatePassword />} />

          {/* Protected Dashboard Routes */}
          <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/logout" element={<ProtectedRoute><Logout/></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/facultydashboard" element={<ProtectedRoute><FacultyDashboard /></ProtectedRoute>} />
          <Route path="/projectdashboard" element={<ProtectedRoute><ProjectDashboard /></ProtectedRoute>} />
          <Route path="/eventdashboard" element={<ProtectedRoute><EventDashboard /></ProtectedRoute>} />
          <Route path="/memberdashboard" element={<ProtectedRoute><MembersDashboard /></ProtectedRoute>} />
          <Route path="/achievementdashboard" element={<ProtectedRoute><AchivementDashboard /></ProtectedRoute>} />

          {/* Redirect invalid paths */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
