import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../api';
import './UserAuth.css';

export default function Signup() {
  const [data, setData] = useState({
    name: '', email: '', password: '',
    phone: '', city: '', photo: null
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setData(d => ({ ...d, photo: files[0] }));
    } else {
      setData(d => ({ ...d, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData();
    ['name', 'email', 'password', 'phone', 'city'].forEach(k => form.append(k, data[k]));
    if (data.photo) form.append('photo', data.photo);

    const res = await signup(form);
    if (res.msg === 'Signup successful') {
      alert('Signup successful! Please login.');
      navigate('/login');
    } else {
      alert(res.msg || 'Signup failed');
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
            <h2 className="user-auth-image-title">Join as an Employer!</h2>
            <p className="user-auth-image-subtitle">
              Create your employer account and start finding skilled workers for your projects and business needs
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
          <h2 className="user-auth-title">Employer Sign Up</h2>
          <p className="user-auth-subtitle">Create your employer account and find skilled workers</p>
          <form onSubmit={handleSubmit} encType="multipart/form-data" style={{ width: '100%', maxWidth: '400px' }}>
            <div className="user-auth-form-group">
              <input
                className="user-auth-input"
                name="name"
                placeholder="👤 Full Name"
                value={data.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="user-auth-form-group">
              <input
                className="user-auth-input"
                name="email"
                type="email"
                placeholder="📧 Email Address"
                value={data.email}
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
                value={data.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="user-auth-form-group">
              <input
                className="user-auth-input"
                name="phone"
                type="tel"
                placeholder="📱 Phone Number"
                value={data.phone}
                onChange={handleChange}
              />
            </div>
            <div className="user-auth-form-group">
              <input
                className="user-auth-input"
                name="city"
                placeholder="🏙️ City"
                value={data.city}
                onChange={handleChange}
              />
            </div>
            <div className="user-auth-form-group">
              <input
                className="user-auth-file-input"
                name="photo"
                type="file"
                accept="image/*"
                onChange={handleChange}
              />
            </div>
            <button 
              type="submit" 
              className="user-auth-btn"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : '✨ Sign Up'}
            </button>
          </form>
          <div className="user-auth-link-container">
            Already have an account?{' '}
            <button 
              className="user-auth-link" 
              onClick={() => navigate('/login')}
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
