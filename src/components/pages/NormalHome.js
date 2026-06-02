import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Services from './Roles';
import Footer from './Footer';
import Choose from './Choose';
import Roles from './Services'; 
import '../style/home.css'
import video1 from './vedios/bluecolar1.mp4';
import video2 from './vedios/bluecolar2.mp4';
import video3 from './vedios/bluecolar3.mp4';
import NormalNavbar from './NormalNavbar'

const videos = [video1, video2, video3];

const NormalHome = () => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo((prev) => (prev + 1) % videos.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
     <NormalNavbar/>
      <div style={styles.heroSection}>
        <video key={videos[currentVideo]} autoPlay loop muted style={styles.backgroundVideo}>
          <source src={videos[currentVideo]} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div style={styles.welcomeContent}>
          <h1>Empowering Blue-Collar Workers Everywhere</h1>
          <p>Connecting skilled workers with meaningful job opportunities—fast, simple, and secure.</p>

          <div style={styles.buttonContainer}>
            <button style={styles.button} onClick={() => navigate('/workerlogin')}>I'm a Worker</button>
            <button style={styles.button} onClick={() => navigate('/login')}>I'm an Employer</button>
          </div>
        </div>
      </div>
      {/* Services Section */}
      <Services />

      {/* Workers List Section (optional) */}
      <Roles /> 
      <Choose/>
      <Footer/> 
    </>
  );
};

const styles = {
  heroSection: {
    position: 'relative',
    minHeight: '100vh',
    overflow: 'hidden',
    color: 'white',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: -1,
    filter: 'brightness(0.5)',
  },
  welcomeContent: {
    position: 'relative',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: '0 2rem',
    textShadow: '2px 2px 4px #000',
  },
  buttonContainer: {
    marginTop: '2rem',
    display: 'flex',
    gap: '1rem',
  },
  button: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007BFF',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default NormalHome;
