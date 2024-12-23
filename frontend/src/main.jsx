import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PlayGround from './components/PlayGround.jsx';
import Dashboard from './components/Dashboard.jsx';
import GoogleLogin from './components/GoogleLogin.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

const GoogleOAuthWrapper = () => (
  <GoogleOAuthProvider clientId='880538644738-bv3porbv4753qhi2fo59c823lnqnro9d.apps.googleusercontent.com'>
    <GoogleLogin />
  </GoogleOAuthProvider>
);

const container = document.getElementById('root');

// Prevent reinitializing root during hot reload
if (!container._reactRootContainer) {
  const root = createRoot(container);
  root.render(
    <Router>
      <Routes>
        <Route path="/login" element={<GoogleOAuthWrapper />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/playground" element={<PlayGround />} />
      </Routes>
    </Router>
  );
}
