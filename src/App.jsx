import './App.css';
import { useState } from 'react';
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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <div className="App">
      <StarsCanvas />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path='/project' element={<Project/>} />
          <Route path="/verify" element={<Certificate />} />
          <Route 
            path="/login" 
            element={<Login setIsAuthenticated={setIsAuthenticated} />} 
          />

          {/* Protected Dashboard Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/facultydashboard" 
            element={
              <ProtectedRoute>
                <FacultyDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/projectdashboard" 
            element={
              <ProtectedRoute>
                <ProjectDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/eventdashboard" 
            element={
              <ProtectedRoute>
                <EventDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/memberdashboard" 
            element={
              <ProtectedRoute>
                <MembersDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/achivmentdashboard" 
            element={
              <ProtectedRoute>
                <AchivementDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Redirect invalid paths */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;