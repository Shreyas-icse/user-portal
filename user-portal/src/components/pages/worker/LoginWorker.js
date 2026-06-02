import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { workerLogin } from '../../../workerApi';
import './WorkerAuth.css';

export default function LoginWorker() {
  const [creds, setCreds] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e =>
    setCreds(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await workerLogin(creds);
    console.log('Worker login response:', res);

   if (res.token) {
  
    localStorage.setItem('workerToken', res.token);
  window.location.reload();  // ✅ This is the correct way
}
else {
      alert(res.msg || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="worker-auth-container">
      <div className="worker-auth-wrapper">
        <div className="worker-auth-image-section">
          <div className="worker-auth-image-content">
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
              👷 WORKER PORTAL
            </div>
            <div className="worker-auth-image-icon">👷</div>
            <h2 className="worker-auth-image-title">Welcome Back, Worker!</h2>
            <p className="worker-auth-image-subtitle">
              Login to access your worker dashboard and start connecting with employers who need your skills
            </p>
          </div>
        </div>
        <div className="worker-auth-card">
          <a href="/" className="worker-auth-back-btn">
            ← Back to Home
          </a>
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '0.5rem 1.5rem',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: '700',
            marginBottom: '1rem',
            letterSpacing: '0.5px'
          }}>
            👷 WORKER
          </div>
          <h2 className="worker-auth-title">Worker Log In</h2>
          <p className="worker-auth-subtitle">Login as a worker to find job opportunities</p>
          <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px' }}>
            <div className="worker-auth-form-group">
              <input
                className="worker-auth-input"
                name="email"
                type="email"
                placeholder="📧 Email Address"
                value={creds.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="worker-auth-form-group">
              <input
                className="worker-auth-input"
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
              className="worker-auth-btn"
              disabled={loading}
            >
              {loading ? 'Logging in...' : '🚀 Log In'}
            </button>
          </form>
          <div className="worker-auth-link-container">
            Don't have a worker account?{' '}
            <button 
              className="worker-auth-link" 
              onClick={() => navigate('/workersignup')}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
