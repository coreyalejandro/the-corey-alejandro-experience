// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CMSProvider } from './context/CMSContext';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import Admin from './pages/Admin';

function App() {
  return (
    <CMSProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/project/:projectId" element={<ProjectDetail />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </CMSProvider>
  );
}

export default App;
