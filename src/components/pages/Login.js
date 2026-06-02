import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api';
import './UserAuth.css';

export default function Login() {
  const [creds, setCreds] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e =>
    setCreds(c => ({ ...c, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await login(creds);
    console.log('Login response:', res);

    if (res.token) {
      localStorage.setItem('token', res.token);
      window.location.href = '/home';
    } else {
      alert(res.msg || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="user-auth-container">
      <div className="user-auth-wrapper">
        <div className="user-auth-image-section">
          <div className="user-auth-image-content">
            <div style={{
              display: 'inline-block',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '0.5rem 1.5rem',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: '700',
              marginBottom: '2rem',
              letterSpacing: '0.5px',
              border: '2px solid rgba(255, 255, 255, 0.3)'
            }}>
              👔 EMPLOYER PORTAL
            </div>
            <div className="user-auth-image-icon">👔</div>
            <h2 className="user-auth-image-title">Welcome Back, Employer!</h2>
            <p className="user-auth-image-subtitle">
              Login to access your employer dashboard and find the best skilled workers for your projects
            </p>
          </div>
        </div>
        <div className="user-auth-card">
          <a href="/" className="user-auth-back-btn">
            ← Back to Home
          </a>
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
            color: 'white',
            padding: '0.5rem 1.5rem',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: '700',
            marginBottom: '1rem',
            letterSpacing: '0.5px'
          }}>
            👔 EMPLOYER
          </div>
          <h2 className="user-auth-title">Employer Log In</h2>
          <p className="user-auth-subtitle">Login as an employer to find skilled workers</p>
          <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px' }}>
            <div className="user-auth-form-group">
              <input
                className="user-auth-input"
                name="email"
                type="email"
                placeholder="📧 Email Address"
                value={creds.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="user-auth-form-group">
              <input
                className="user-auth-input"
                name="password"
                type="password"
                placeholder="🔒 Password"
                value={creds.password}
                onChange={handleChange}
                required
              />
            </div>
            <button 
              type="submit" 
              className="user-auth-btn"
              disabled={loading}
            >
              {loading ? 'Logging in...' : '🚀 Log In'}
            </button>
          </form>
          <div className="user-auth-link-container">
            Don't have an account?{' '}
            <button 
              className="user-auth-link" 
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
