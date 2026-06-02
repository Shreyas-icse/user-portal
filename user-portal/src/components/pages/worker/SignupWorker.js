import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { workerSignup } from '../../../workerApi';
import './WorkerAuth.css';

export default function SignupWorker() {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    city: '',
    workType: '',
    salaryPerDay: '',
    photo: null,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setData(prev => ({ ...prev, photo: files[0] }));
    } else {
      setData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData();
    const fields = ['name', 'email', 'password', 'phone', 'city', 'workType', 'salaryPerDay'];
    fields.forEach(key => form.append(key, data[key]));
    if (data.photo) form.append('photo', data.photo);

    const res = await workerSignup(form);
    if (res.msg === 'Signup successful') {
      
      alert('Signup successful! Please login.');
      navigate('/workerlogin');
    } else {
      alert(res.msg || 'Signup failed');
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
            <h2 className="worker-auth-image-title">Join as a Worker!</h2>
            <p className="worker-auth-image-subtitle">
              Create your worker profile and start connecting with employers who need your skills and expertise
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
          <h2 className="worker-auth-title">Worker Sign Up</h2>
          <p className="worker-auth-subtitle">Create your worker profile and start earning today</p>
          <form onSubmit={handleSubmit} encType="multipart/form-data" style={{ width: '100%', maxWidth: '400px' }}>
          <div className="worker-auth-form-group">
            <input
              className="worker-auth-input"
              name="name"
              placeholder="👤 Full Name"
              value={data.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="worker-auth-form-group">
            <input
              className="worker-auth-input"
              name="email"
              type="email"
              placeholder="📧 Email Address"
              value={data.email}
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
              value={data.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="worker-auth-form-group">
            <input
              className="worker-auth-input"
              name="phone"
              type="tel"
              placeholder="📱 Phone Number"
              value={data.phone}
              onChange={handleChange}
            />
          </div>
          <div className="worker-auth-form-group">
            <input
              className="worker-auth-input"
              name="city"
              placeholder="🏙️ City"
              value={data.city}
              onChange={handleChange}
            />
          </div>
          <div className="worker-auth-form-group">
            <select
              className="worker-auth-select"
              name="workType"
              value={data.workType}
              onChange={handleChange}
              required
            >
              <option value="">🔧 Select Work Type</option>
              <option value="Plumber">🔧 Plumber</option>
              <option value="Electrician">⚡ Electrician</option>
              <option value="Carpenter">🪵 Carpenter</option>
              <option value="Mason">🧱 Mason</option>
              <option value="Painter">🎨 Painter</option>
              <option value="Welder">🔥 Welder</option>
              <option value="Mechanic">🔩 Mechanic</option>
              <option value="Cleaner">🧹 Cleaner</option>
              <option value="Gardener">🌱 Gardener</option>
              <option value="Construction Worker">🏗️ Construction Worker</option>
              <option value="Driver">🚗 Driver</option>
              <option value="AC Technician">❄️ AC Technician</option>
              <option value="Tailor">✂️ Tailor</option>
              <option value="Housekeeper">🏠 Housekeeper</option>
              <option value="Cook">👨‍🍳 Cook</option>
              <option value="Security Guard">🛡️ Security Guard</option>
              <option value="Delivery Boy">📦 Delivery Boy</option>
              <option value="Helper">🤝 Helper</option>
              <option value="Loader">📦 Loader</option>
              <option value="Other">🔨 Other</option>
            </select>
          </div>
          <div className="worker-auth-form-group">
            <input
              className="worker-auth-input"
              name="salaryPerDay"
              type="number"
              min="0"
              placeholder="💰 Salary Per Day (₹)"
              value={data.salaryPerDay}
              onChange={handleChange}
              required
            />
          </div>
          <div className="worker-auth-form-group">
            <input
              className="worker-auth-file-input"
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleChange}
            />
          </div>
          <button 
            type="submit" 
            className="worker-auth-btn"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : '✨ Sign Up'}
          </button>
        </form>
          <div className="worker-auth-link-container">
            Already have a worker account?{' '}
            <button 
              className="worker-auth-link" 
              onClick={() => navigate('/workerlogin')}
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
