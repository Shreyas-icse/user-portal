// src/pages/worker/WorkerHome.jsx
import React, { useEffect, useState } from 'react';
import { getWorkerProfile } from '../../../workerApi';
import { useNavigate } from 'react-router-dom';
import Navbar from '../worker/WorkerNavbar'; 
import Services from '../Roles';
import Footer from '../Footer';
import Choose from '../Choose';
import Roles from '../Services'; 
import '../../style/home.css';
import video1 from '../vedios/bluecolar1.mp4';
import video2 from '../vedios/bluecolar2.mp4';
import video3 from '../vedios/bluecolar3.mp4';

const videos = [video1, video2, video3];

export default function WorkerHome() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const [currentVideo, setCurrentVideo] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo((prev) => (prev + 1) % videos.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('workerToken');
      if (!token) return navigate('/workerlogin');

      const res = await getWorkerProfile(token);
      if (res._id) {
        setProfile(res);
      } else {
        localStorage.removeItem('workerToken');
        navigate('/workerlogin');
      }
    })();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('workerToken');
    navigate('/workerlogin');
  };

  return (
    <>
      <Navbar profile={profile} onLogout={handleLogout} />
      <div style={styles.heroSection}>
        <video key={videos[currentVideo]} autoPlay loop muted style={styles.backgroundVideo}>
          <source src={videos[currentVideo]} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <main style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Welcome, {profile?.name || 'User'}!</h1>
        </main>

        <div style={styles.welcomeContent}>
          <h1>Empowering Blue-Collar Workers Everywhere</h1>
          <p>Connecting skilled workers with meaningful job opportunities—fast, simple, and secure.</p>

          <div style={{ padding: "4rem 2rem", backgroundColor: "transparent", color: "#fff", textAlign: "center" }}>
            <h2 style={{ marginBottom: "1rem", color: "#00BFFF" }}>Why Choose Our Platform?</h2>
            <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "2rem" }}>
              
              <div style={styles.card}>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2331/2331943.png"
                  alt="Easy Booking"
                  style={styles.icon}
                />
                <h4 style={{ color: "#00BFFF" }}>Easy Booking</h4>
                <p style={{ color: "#ccc" }}>Book skilled workers in just a few clicks. Fast, reliable, and hassle-free service.</p>
              </div>

              <div style={styles.card}>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135768.png"
                  alt="Verified Workers"
                  style={styles.icon}
                />
                <h4 style={{ color: "#00BFFF" }}>Verified Workers</h4>
                <p style={{ color: "#ccc" }}>Every worker is background-checked and reviewed to ensure trust and quality.</p>
              </div>

              <div style={styles.card}>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/684/684908.png"
                  alt="Real-Time Tracking"
                  style={styles.icon}
                />
                <h4 style={{ color: "#00BFFF" }}>Real-Time Tracking</h4>
                <p style={{ color: "#ccc" }}>Know where your booked worker is and stay updated with real-time location sharing.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Services />
      <Roles />
      <Choose />
      <Footer />
    </>
  );
}

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
  card: {
    maxWidth: "300px",
    backgroundColor: "#1a1a1a",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 0 10px rgba(0,0,0,0.6)",
  },
  icon: {
    width: "80px",
    marginBottom: "1rem",
    filter: "brightness(1.1)",
  },
};
