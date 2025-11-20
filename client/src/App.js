import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import Navbar from './components/Navbar';
import MobileNav from './components/MobileNav';
import InstallPrompt from './components/InstallPrompt';
import OnTapAI from './components/OnTapAI';
import NetworkAccess from './components/NetworkAccess';
import NewHome from './pages/NewHome';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyMagicLink from './pages/VerifyMagicLink';
import Dashboard from './pages/Dashboard';
import ServiceList from './pages/ServiceList';
import ServiceDetails from './pages/ServiceDetails';
import CreateService from './pages/CreateService';
import MyBookings from './pages/MyBookings';
import CollegeZone from './pages/CollegeZone';
import CreateProfile from './pages/CreateProfile';
import Showcase from './pages/Showcase';
import Marketplace from './pages/Marketplace';
import Rentals from './pages/Rentals';
import RidePooling from './pages/RidePooling';
import OfferRide from './pages/OfferRide';
import OnTapFeed from './pages/OnTapFeed';
import StudentTools from './pages/StudentTools';
import ResumeOptimizer from './pages/ResumeOptimizer';
import AutoApply from './pages/AutoApply';
import MindWaveHub from './pages/MindWaveHub';
import AIStudyAssistant from './pages/AIStudyAssistant';
import SmartCampus from './pages/SmartCampus';
import WellnessCoach from './pages/WellnessCoach';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Navbar user={user} onLogout={handleLogout} />
        <MobileNav user={user} />
        <InstallPrompt />
        <OnTapAI />
        <NetworkAccess />
        <Routes>
          <Route path="/" element={<NewHome />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/dashboard" /> : <Register onLogin={handleLogin} />}
          />
          <Route
            path="/verify-magic-link"
            element={<VerifyMagicLink onLogin={handleLogin} />}
          />
          <Route
            path="/dashboard"
            element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
          />
          <Route path="/services" element={<ServiceList />} />
          <Route path="/services/:id" element={<ServiceDetails user={user} />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/rentals" element={<Rentals />} />
          <Route path="/ride-pooling" element={<RidePooling />} />
          <Route
            path="/rides/offer"
            element={user ? <OfferRide /> : <Navigate to="/login" />}
          />
          <Route path="/feed" element={<OnTapFeed />} />
          <Route
            path="/create-service"
            element={user ? <CreateService /> : <Navigate to="/login" />}
          />
          <Route
            path="/my-bookings"
            element={user ? <MyBookings /> : <Navigate to="/login" />}
          />
          <Route path="/college-zone" element={<CollegeZone />} />
          <Route
            path="/create-profile"
            element={user ? <CreateProfile /> : <Navigate to="/login" />}
          />
          <Route path="/showcase" element={<Showcase />} />
          <Route path="/student-tools" element={<StudentTools />} />
          <Route path="/tools/resume-optimizer" element={<ResumeOptimizer />} />
          <Route path="/tools/auto-apply" element={<AutoApply />} />
          <Route path="/mindwave" element={<MindWaveHub />} />
          <Route path="/ai/study-assistant" element={<AIStudyAssistant />} />
          <Route path="/ai/career-advisor" element={<ResumeOptimizer />} />
          <Route path="/ai/research-assistant" element={<MindWaveHub />} />
          <Route path="/ai/tutor" element={<AIStudyAssistant />} />
          <Route path="/ai/smart-campus" element={<SmartCampus />} />
          <Route path="/ai/wellness" element={<WellnessCoach />} />
          <Route path="/ai/writing-assistant" element={<MindWaveHub />} />
          <Route path="/ai/schedule-optimizer" element={<MindWaveHub />} />
          <Route path="/ai/dashboard" element={<MindWaveHub />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
