import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// User components
import Signup from './components/pages/Signup';
import Login from './components/pages/Login';
import Home from './components/pages/Home';
import Profile from './components/pages/Profile';
import Navbar from './components/pages/Navbar';
import Workers from './components/pages/Workers';
import VoiceRecognizer from './components/pages/VoiceRecognizer';

// Worker components
import WorkerHome from './components/pages/worker/WorkerHome';
import WorkerNavbar from './components/pages/worker/WorkerNavbar';
import SignupWorker from './components/pages/worker/SignupWorker';
import LoginWorker from './components/pages/worker/LoginWorker';
import WorkerProfile from './components/pages/worker/WorkerProfile';

// Normal/Landing page components
import NormalHome from './components/pages/NormalHome';
// import WhatsAppButton from './components/pages/Whatsapp';
import Services from './components/pages/Services';
import Footer from './components/pages/Footer';
import Choose from './components/pages/Choose';
import Roles from './components/pages/Roles'; // Fixed typo here
import ContactPage from './components/pages/ContactPage';
import HowItWorks from './components/pages/HowItWorks';
import Dashboard from './components/pages/worker/Dashboard';


function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(!!localStorage.getItem('token'));
  const [isWorkerLoggedIn, setIsWorkerLoggedIn] = useState(!!localStorage.getItem('workerToken'));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsUserLoggedIn(!!localStorage.getItem('token'));
      setIsWorkerLoggedIn(!!localStorage.getItem('workerToken'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Landing/Home page */}
        <Route path="/" element={<NormalHome />} />
        <Route path="/howitworks" element={<HowItWorks/>}/>
        <Route path="/Dashboard" element={<Dashboard/>}/>

        <Route path="/services" element={<Services />} />
        <Route path="/choose" element={<Choose />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/voice" element={<VoiceRecognizer />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* User Routes */}
        <Route path="/signup" element={isUserLoggedIn ? <Navigate to="/home" /> : <Signup />} />
        <Route path="/login" element={isUserLoggedIn ? <Navigate to="/home" /> : <Login />} />
        <Route path="/home" element={isUserLoggedIn ? <Home /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isUserLoggedIn ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/navbar" element={<Navbar />} />
        <Route path="/workers" element={<Workers />} />

        {/* Worker Routes */}
        <Route path="/workersignup" element={isWorkerLoggedIn ? <Navigate to="/workerhome" /> : <SignupWorker />} />
        <Route path="/workerlogin" element={isWorkerLoggedIn ? <Navigate to="/workerhome" /> : <LoginWorker />} />
        <Route path="/workerhome" element={isWorkerLoggedIn ? <WorkerHome /> : <Navigate to="/workerlogin" />} />
        <Route path="/workernavbar" element={<WorkerNavbar />} />
        <Route path="/workerprofile" element={isWorkerLoggedIn ? <WorkerProfile /> : <Navigate to="/workerlogin" />} />

        {/* Default Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
