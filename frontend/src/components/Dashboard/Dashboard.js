import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../../services/api';
import { getRiskColor } from '../../utils/riskHelpers';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getStats();
      setStats(response.data);
    } catch (err) {
      setError('Failed to load dashboard statistics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!stats) return null;

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of your risk management activities</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.totalAssets || 0}</div>
          <div className="stat-label">Total Assets</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalRisks || 0}</div>
          <div className="stat-label">Total Risks</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalTreatments || 0}</div>
          <div className="stat-label">Total Treatments</div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="card">
          <h3 className="card-title">Risks by Level</h3>
          <div style={{ marginTop: '20px' }}>
            {stats.risksByLevel && stats.risksByLevel.length > 0 ? (
              stats.risksByLevel.map((item) => (
                <div key={item.risk_level} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '10px',
                  marginBottom: '10px',
                  backgroundColor: getRiskColor(item.risk_level) + '20',
                  borderRadius: '4px'
                }}>
                  <span className={`badge badge-${item.risk_level.toLowerCase()}`}>
                    {item.risk_level}
                  </span>
                  <strong>{item.count}</strong>
                </div>
              ))
            ) : (
              <p style={{ color: '#7f8c8d' }}>No risks recorded</p>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Assets by Category</h3>
          <div style={{ marginTop: '20px' }}>
            {stats.assetsByCategory && stats.assetsByCategory.length > 0 ? (
              stats.assetsByCategory.map((item) => (
                <div key={item.category} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '10px',
                  borderBottom: '1px solid #eee'
                }}>
                  <span>{item.category}</span>
                  <strong>{item.count}</strong>
                </div>
              ))
            ) : (
              <p style={{ color: '#7f8c8d' }}>No assets recorded</p>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Treatment Status</h3>
          <div style={{ marginTop: '20px' }}>
            {stats.treatmentsByStatus && stats.treatmentsByStatus.length > 0 ? (
              stats.treatmentsByStatus.map((item) => (
                <div key={item.status} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '10px',
                  borderBottom: '1px solid #eee'
                }}>
                  <span className={`badge badge-${item.status.toLowerCase().replace(' ', '-')}`}>
                    {item.status}
                  </span>
                  <strong>{item.count}</strong>
                </div>
              ))
            ) : (
              <p style={{ color: '#7f8c8d' }}>No treatments recorded</p>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Top 10 Highest Risks</h3>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Threat</th>
                <th>Vulnerability</th>
                <th>Risk Score</th>
                <th>Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {stats.topRisks && stats.topRisks.length > 0 ? (
                stats.topRisks.map((risk) => (
                  <tr key={risk.id}>
                    <td>{risk.asset_name}</td>
                    <td>{risk.threat_name}</td>
                    <td>{risk.vulnerability_name}</td>
                    <td><strong>{risk.risk_score}</strong></td>
                    <td>
                      <span className={`badge badge-${risk.risk_level.toLowerCase()}`}>
                        {risk.risk_level}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: '#7f8c8d' }}>
                    No risks recorded
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
