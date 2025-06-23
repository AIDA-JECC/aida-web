import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { GrGoogle } from 'react-icons/gr';
const LoginPage = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic validation
    if (!email) {
      setError('Email is required.');
      setIsLoading(false);
      return;
    }
    if (!password) {
      setError('Password is required.');
      setIsLoading(false);
      return;
    }

    try {
      // In a real app, you would make an API call here
      // const response = await authApi.login(email, password);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll just check for specific credentials
      if (email === 'admin@example.com' && password === 'admin123') {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. Try admin@example.com / admin123 for demo');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Implement Google login logic here
    alert('Google login would be implemented here');
    // In a real app, this would also call setIsAuthenticated(true)
  };

  return (
    <div className="loginContainer">
      <form onSubmit={handleSubmit}>
        <h2 className="title">Admin Login</h2>
        {error && <div className="error">{error}</div>}
        
        <label htmlFor="email" className="label">
          Email
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            autoComplete="username"
          />
        </label>
        
        <label htmlFor="password" className="label">
          Password
          <div className="password-container">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <span 
              className="eye-icon" 
              onClick={() => setShowPassword(!showPassword)}
              role="button"
              tabIndex={0}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </span>
          </div>
        </label>
        
        <button 
          type="submit" 
          disabled={isLoading}
          className={isLoading ? 'loading' : ''}
        >
          {isLoading ? 'Logging in...' : 'Log In'}
        </button>
        
        <div className="forgot-password">
          <a href="/forgot-password">Forgot Password?</a>
        </div>
        
        <div className="divider">or</div>
        
        <div className="google-login">
          <button 
            type="button" 
            onClick={handleGoogleLogin}
            className="google-btn"
          >
            <GrGoogle/> Continue with Google
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;