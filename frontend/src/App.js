import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/common/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import Assets from './components/Assets/Assets';
import Threats from './components/Threats/Threats';
import Vulnerabilities from './components/Vulnerabilities/Vulnerabilities';
import Risks from './components/Risks/Risks';
import RiskMatrix from './components/RiskMatrix/RiskMatrix';
import Treatments from './components/Treatments/Treatments';
import Reports from './components/Reports/Reports';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/threats" element={<Threats />} />
            <Route path="/vulnerabilities" element={<Vulnerabilities />} />
            <Route path="/risks" element={<Risks />} />
            <Route path="/risk-matrix" element={<RiskMatrix />} />
            <Route path="/treatments" element={<Treatments />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
