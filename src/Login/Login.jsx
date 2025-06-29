import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { GrGoogle } from 'react-icons/gr';
import { supabase } from '../supabaseClient';

const LoginPage = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      if (data?.session) {
        setIsAuthenticated(true);
        navigate('/dashboard');
      }
    });

    // Listen to auth state changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Email and password are required.');
      setIsLoading(false);
      return;
    }

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError('Invalid credentials or user not found.');
      setIsLoading(false);
      return;
    }

    // After successful sign-in, check for approval status
    if (data.user) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('approved')
        .eq('id', data.user.id)
        .single();

      if (profileError || !profile) {
        setError('Could not retrieve user profile. Please contact support.');
        await supabase.auth.signOut(); // Log the user out
      } else if (!profile.approved) {
        setError('Your account is pending admin approval.');
        await supabase.auth.signOut(); // Log the user out
      } else {
        // User is approved, proceed to dashboard
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/dashboard');
      }
    } else {
      setError('An unexpected error occurred. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <div className="loginContainer">
      <form onSubmit={handleSubmit}>
        <img src="https://ik.imagekit.io/AIDA/Assets%20for%20Web/AIDA%20LOGO%20THEMED.png?updatedAt=1697129861653"/>
        <h2 className="title">Administration</h2>
        {error && <div className="error">{error}</div>}

        <label htmlFor="email" className="label">
          Email
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
        </label>

        <label htmlFor="password" className="label">
          Password
          <div className="password-container">
            <input
              type='password'
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
        </label>

        <center>
        <button className={isLoading ? 'loading' : 'load'}>
          {isLoading ? 'Logging in...' : 'Log In'}
        </button>
        </center>

        <div className="forgot-password">
          <a href="/forgot-password">Forgot Password?</a>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
