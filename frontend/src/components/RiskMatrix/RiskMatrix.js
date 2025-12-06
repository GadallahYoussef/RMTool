import React, { useState, useEffect } from 'react';
import { risksAPI } from '../../services/api';
import { getRiskColor, getRiskLevel } from '../../utils/riskHelpers';

const RiskMatrix = () => {
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCell, setSelectedCell] = useState(null);

  useEffect(() => {
    fetchRisks();
  }, []);

  const fetchRisks = async () => {
    try {
      const response = await risksAPI.getAll();
      setRisks(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRisksForCell = (likelihood, impact) => {
    return risks.filter(r => r.likelihood === likelihood && r.impact === impact);
  };

  const getCellColor = (likelihood, impact) => {
    const score = likelihood * impact;
    const level = getRiskLevel(score);
    return getRiskColor(level);
  };

  const handleCellClick = (likelihood, impact) => {
    const cellRisks = getRisksForCell(likelihood, impact);
    setSelectedCell({ likelihood, impact, risks: cellRisks });
  };

  if (loading) return <div className="loading">Loading risk matrix...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Risk Matrix</h1>
        <p>Interactive 5×5 risk heat map visualization</p>
      </div>

      <div className="card">
        <h3 className="card-title">Risk Heat Map</h3>
        <div style={{ overflowX: 'auto', marginTop: '20px' }}>
          <div className="risk-matrix">
            <div className="risk-matrix-grid">
              {/* Corner cell */}
              <div className="risk-matrix-cell risk-matrix-label"></div>
              
              {/* Impact labels (top) */}
              {[1, 2, 3, 4, 5].map(impact => (
                <div key={`impact-${impact}`} className="risk-matrix-cell risk-matrix-label">
                  Impact {impact}
                </div>
              ))}
              
              {/* Likelihood rows (reversed to show 5 at top) */}
              {[5, 4, 3, 2, 1].map(likelihood => (
                <React.Fragment key={likelihood}>
                  {/* Likelihood label */}
                  <div className="risk-matrix-cell risk-matrix-label">
                    Likelihood {likelihood}
                  </div>
                  
                  {/* Risk cells */}
                  {[1, 2, 3, 4, 5].map(impact => {
                    const cellRisks = getRisksForCell(likelihood, impact);
                    const score = likelihood * impact;
                    const bgColor = getCellColor(likelihood, impact);
                    
                    return (
                      <div
                        key={`${likelihood}-${impact}`}
                        className="risk-matrix-cell"
                        style={{
                          backgroundColor: bgColor,
                          cursor: cellRisks.length > 0 ? 'pointer' : 'default',
                          color: 'white',
                          fontSize: '18px',
                          fontWeight: 'bold'
                        }}
                        onClick={() => handleCellClick(likelihood, impact)}
                      >
                        {score}
                        {cellRisks.length > 0 && (
                          <div className="risk-count">{cellRisks.length}</div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '30px' }}>
          <h4>Legend:</h4>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ 
                width: '30px', 
                height: '30px', 
                backgroundColor: getRiskColor('Critical'), 
                marginRight: '10px' 
              }}></div>
              <span>Critical (20-25)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ 
                width: '30px', 
                height: '30px', 
                backgroundColor: getRiskColor('High'), 
                marginRight: '10px' 
              }}></div>
              <span>High (12-19)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ 
                width: '30px', 
                height: '30px', 
                backgroundColor: getRiskColor('Medium'), 
                marginRight: '10px' 
              }}></div>
              <span>Medium (6-11)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ 
                width: '30px', 
                height: '30px', 
                backgroundColor: getRiskColor('Low'), 
                marginRight: '10px' 
              }}></div>
              <span>Low (1-5)</span>
            </div>
          </div>
        </div>
      </div>

      {selectedCell && selectedCell.risks.length > 0 && (
        <div className="modal-overlay" onClick={() => setSelectedCell(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                Risks at L{selectedCell.likelihood} × I{selectedCell.impact}
              </h2>
              <button className="modal-close" onClick={() => setSelectedCell(null)}>×</button>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th>Threat</th>
                    <th>Vulnerability</th>
                    <th>Score</th>
                    <th>Level</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCell.risks.map(risk => (
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskMatrix;
