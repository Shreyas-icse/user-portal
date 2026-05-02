import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function WorkerNavbar({ profile, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/workerlogin');
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
              'google_translate_element_worker'
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
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white'
    }}>
      {/* Logo + Google Translate */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <strong>Worker App</strong>
        <div id="google_translate_element_worker" style={{ color: 'black' }} />
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
              cursor: 'pointer'
            }}
            title="Open Google Translate"
          >
            🌐 Translate
          </a>
        )}
      </div>

      {/* Navigation Links + Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/workerhome')}>Home</span>
                    <a
  href="https://clone-chat-app-5h0j.onrender.com/chats"
  target="_blank"
  rel="noopener noreferrer"
  style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
>
  Chat
</a>
          <span style={{cursor:'pointer'}} onClick={()=>navigate('/Dashboard')}>Dashboard</span>
          <span
            style={{ cursor: 'pointer', color: '#ffd700', fontWeight: 'bold' }}
            onClick={() => window.location.href = 'http://localhost:9000'}
          >
            Premium
          </span>
        </div>

        {profile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              onClick={() => navigate('/workerprofile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer'
              }}
            >
              {profile.photo ? (
                <img
                  src={`data:${profile.contentType || 'image/jpeg'};base64,${profile.photo}`}
                  alt="Profile"
                  style={{ width: 40, height: 40, borderRadius: '50%' }}
                />
              ) : (
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: '#999'
                }} />
              )}
              <span>{profile.name}</span>
            </div>

            <button
              onClick={handleLogout}
              style={{
                background: 'white',
                color: 'black',
                padding: '0.5rem 1rem',
                borderRadius: '5px'
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
