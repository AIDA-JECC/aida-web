import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './UpdatePassword.css'; // optional styling

function UpdatePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        setError(error.message);
      } else {
        supabase.auth.signOut();
        setMessage('Password updated successfully. Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2500);
      }
    } catch {
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div className="update-password-container">
      <div className="update-password-box">
        <h2>Reset Your Password</h2>
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
          </div>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
          <button className="submitbutton">Update Password</button>
        </form>
      </div>
    </div>
  );
}

export default UpdatePassword;
