import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Risk Management Tool</h2>
        <p>IT Security & Risk Assessment</p>
      </div>
      <nav className="sidebar-nav">
        <Link to="/" className={`nav-item ${isActive('/')}`}>
          <span className="nav-item-icon">📊</span>
          Dashboard
        </Link>
        <Link to="/assets" className={`nav-item ${isActive('/assets')}`}>
          <span className="nav-item-icon">💼</span>
          Assets
        </Link>
        <Link to="/threats" className={`nav-item ${isActive('/threats')}`}>
          <span className="nav-item-icon">⚠️</span>
          Threats
        </Link>
        <Link to="/vulnerabilities" className={`nav-item ${isActive('/vulnerabilities')}`}>
          <span className="nav-item-icon">🔓</span>
          Vulnerabilities
        </Link>
        <Link to="/risks" className={`nav-item ${isActive('/risks')}`}>
          <span className="nav-item-icon">🎯</span>
          Risks
        </Link>
        <Link to="/risk-matrix" className={`nav-item ${isActive('/risk-matrix')}`}>
          <span className="nav-item-icon">📈</span>
          Risk Matrix
        </Link>
        <Link to="/treatments" className={`nav-item ${isActive('/treatments')}`}>
          <span className="nav-item-icon">🛡️</span>
          Treatments
        </Link>
        <Link to="/reports" className={`nav-item ${isActive('/reports')}`}>
          <span className="nav-item-icon">📄</span>
          Reports
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
