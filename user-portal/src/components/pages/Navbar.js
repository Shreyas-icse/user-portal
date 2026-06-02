import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/navbar.css';

export default function Navbar({ profile, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  useEffect(() => {
    // Only try to load Google Translate if not already loaded and handle CORS errors
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.defer = true;
      
      // Handle script load errors (CORS, network, etc.)
      script.onerror = () => {
        console.warn('Google Translate script failed to load (CORS or network issue). Using fallback.');
        // Remove the script element if it fails
        const failedScript = document.getElementById('google-translate-script');
        if (failedScript) {
          failedScript.remove();
        }
      };

      window.googleTranslateElementInit = () => {
        try {
          if (window.google && window.google.translate) {
            new window.google.translate.TranslateElement(
              {
                pageLanguage: 'en',
                includedLanguages: 'en,kn,hi,te,ta,ml',
                layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false,
              },
              'google_translate_element'
            );
          }
        } catch (err) {
          console.warn('Google Translate initialization failed:', err);
        }
      };

      try {
        document.body.appendChild(script);
      } catch (err) {
        console.warn('Failed to append Google Translate script:', err);
      }
    } else {
      // Script already exists, try to initialize if available
      if (window.google && window.google.translate && !document.getElementById(':0.container')) {
        try {
          window.googleTranslateElementInit?.();
        } catch (err) {
          console.warn('Google Translate re-initialization failed:', err);
        }
      }
    }
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <strong>Service Hire</strong>
        <div id="google_translate_element" style={{ color: 'black' }} />
        {/* Fallback translate button if Google Translate widget fails */}
        {!window.google?.translate && (
          <a
            href="https://translate.google.com/?sl=auto&tl=en&op=translate"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.25rem 0.75rem',
              background: '#4285f4',
              color: 'white',
              borderRadius: '4px',
              textDecoration: 'none',
              fontSize: '0.85rem',
              cursor: 'pointer',
              marginLeft: '0.5rem'
            }}
            title="Open Google Translate"
          >
            🌐 Translate
          </a>
        )}
      </div>

      <div className="navbar-right">
        <div className="nav-links">
          <span className="nav-link" onClick={() => navigate('/home')}>Home</span>
          <span className="nav-link" onClick={() => navigate('/workers')}>Workers</span>
          <a
            href="https://clone-chat-app-5h0j.onrender.com/chats"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
          >
            Chat
          </a>
        </div>

        {profile && (
          <div className="profile-section">
            <div className="profile-info" onClick={() => navigate('/profile')}>
              {profile.photo ? (
                <img
                  src={`data:${profile.contentType || 'image/jpeg'};base64,${profile.photo}`}
                  alt="Profile"
                  className="profile-img"
                />
              ) : (
                <div className="profile-placeholder" />
              )}
              <span>{profile.name}</span>
            </div>

            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}
