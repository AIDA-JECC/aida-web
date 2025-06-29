import React, { useState } from 'react';
import './Login.css'; // Reuse existing styles
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!username || !email || !password) {
      setError('All fields are required.');
      setIsLoading(false);
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });
    

    if (signUpError) {
      setError(signUpError.message);
    } else {
      // Redirect to a pending approval page or show a success message
      // For now, we'll navigate to login but with a state message.
      // You could create a dedicated /pending-approval route.
      navigate('/login', { state: { message: 'Registration successful! Please check your email to verify your account. An admin will approve your account shortly.' } });
    }

    setIsLoading(false);
  };

  return (
    <div className="loginContainer">
      <form onSubmit={handleRegister}>
        <img src="https://ik.imagekit.io/AIDA/Assets%20for%20Web/AIDA%20LOGO%20THEMED.png?updatedAt=1697129861653" />
        <h2 className="title">Register</h2>
        {error && <div className="error">{error}</div>}

        <label htmlFor="username" className="label">
          Username
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>

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
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </label>

        <center>
          <button className={isLoading ? 'loading' : 'load'}>
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </center>

        <div className="forgot-password">
          <a href="/login">Already have an account? Log in</a>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
