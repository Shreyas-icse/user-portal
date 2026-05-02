import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ profile, onLogout }) {
  const navigate = useNavigate();

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      background: 'rgba(0, 0, 0, 0.8)', // black with 80% opacity
      color: 'white' // ← Make all text white
    }}>
      {/* Left: Brand */}
      <div><strong>Service Hire</strong></div>

      {/* Right: Links + Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        
        {/* Nav Links aligned permanently to right */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span style={{ cursor: 'pointer', color: 'white' }} onClick={() => navigate('/home')}>Home</span>
          <span style={{ cursor: 'pointer', color: 'white' }} onClick={() => navigate('/workers')}>Workers</span>
          <span style={{ cursor: 'pointer', color: 'white' }} onClick={() => navigate('/messages')}>Messages</span>
          <span style={{ cursor: 'pointer', color: 'white' }} onClick={() => navigate('/chat')}>Chat</span>
        </div>

        {/* User profile + Logout */}
        {profile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              onClick={() => navigate('/profile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                color: 'white'
              }}
            >
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
