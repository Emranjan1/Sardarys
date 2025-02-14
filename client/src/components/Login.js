import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { loginUser } from '../services/api';
import {jwtDecode} from 'jwt-decode'; 
import { useAuth } from '../context/AuthContext';
import './Login.css'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');  
    try {
      const response = await loginUser({ email, password });
      const { token } = response;  

      if (!token) {
        throw new Error("No token provided.");
      }

      login(token);  
      const decoded = jwtDecode(token); 

      const redirectPath = location.state?.from?.pathname || (decoded.isAdmin ? '/adminpanel' : '/profile');
      navigate(redirectPath, { replace: true });  
    } catch (err) {
      console.error("Login error:", err);  
      setError(err.message || 'Login failed. Please try again.'); 
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <div className="register-link">
        <p>Don't have an account? <Link to="/register">Register here</Link></p>
      </div>
    </div>
  );
};

export default Login;
