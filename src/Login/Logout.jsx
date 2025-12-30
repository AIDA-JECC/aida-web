import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Logout.css';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut(); // Clear session from Supabase
    localStorage.removeItem('isAuthenticated'); // Optional cleanup
    navigate('/login'); // Redirect to login
  };

  const handleCancel = () => {
    navigate('/dashboard'); // Cancel redirect
  };

  return (
    <div className="logout-container">
      <div className="logout-box">
        <p>Are you sure you want to log out?</p>
        <div className="logout-buttons">
          <center><button onClick={handleLogout} className="logout-button confirm">
            Logout
          </button>
          <button onClick={handleCancel} className="logout-button cancel">
            Cancel
          </button>
          </center>
        </div>
      </div>
    </div>
  );
};

export default Logout;
