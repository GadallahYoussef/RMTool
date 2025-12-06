import React, { useState, useEffect } from 'react';
import { risksAPI, assetsAPI, threatsAPI, vulnerabilitiesAPI } from '../../services/api';
import { calculateRiskScore, getRiskLevel, LIKELIHOOD_SCALE, IMPACT_SCALE } from '../../utils/riskHelpers';

const Risks = () => {
  const [risks, setRisks] = useState([]);
  const [assets, setAssets] = useState([]);
  const [threats, setThreats] = useState([]);
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRisk, setEditingRisk] = useState(null);
  const [formData, setFormData] = useState({
    asset_id: '',
    threat_id: '',
    vulnerability_id: '',
    likelihood: 3,
    impact: 3,
    description: '',
    status: 'Active'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [risksRes, assetsRes, threatsRes, vulnsRes] = await Promise.all([
        risksAPI.getAll(),
        assetsAPI.getAll(),
        threatsAPI.getAll(),
        vulnerabilitiesAPI.getAll()
      ]);
      setRisks(risksRes.data);
      setAssets(assetsRes.data);
      setThreats(threatsRes.data);
      setVulnerabilities(vulnsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRisk) {
        await risksAPI.update(editingRisk.id, formData);
      } else {
        await risksAPI.create(formData);
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (risk) => {
    setEditingRisk(risk);
    setFormData({
      asset_id: risk.asset_id,
      threat_id: risk.threat_id,
      vulnerability_id: risk.vulnerability_id,
      likelihood: risk.likelihood,
      impact: risk.impact,
      description: risk.description || '',
      status: risk.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this risk?')) {
      try {
        await risksAPI.delete(id);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      asset_id: '',
      threat_id: '',
      vulnerability_id: '',
      likelihood: 3,
      impact: 3,
      description: '',
      status: 'Active'
    });
    setEditingRisk(null);
  };

  const calculatedScore = calculateRiskScore(formData.likelihood, formData.impact);
  const calculatedLevel = getRiskLevel(calculatedScore);

  return (
    <div>
      <div className="page-header">
        <h1>Risk Register</h1>
        <p>Manage and assess organizational risks</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Risks ({risks.length})</h3>
          <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            + Add Risk
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading risks...</div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Threat</th>
                  <th>Vulnerability</th>
                  <th>L</th>
                  <th>I</th>
                  <th>Score</th>
                  <th>Level</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {risks.map((risk) => (
                  <tr key={risk.id}>
                    <td><strong>{risk.asset_name}</strong></td>
                    <td>{risk.threat_name}</td>
                    <td>{risk.vulnerability_name}</td>
                    <td>{risk.likelihood}</td>
                    <td>{risk.impact}</td>
                    <td><strong>{risk.risk_score}</strong></td>
                    <td>
                      <span className={`badge badge-${risk.risk_level.toLowerCase()}`}>
                        {risk.risk_level}
                      </span>
                    </td>
                    <td>{risk.status}</td>
                    <td>
                      <button className="btn btn-primary btn-sm" onClick={() => handleEdit(risk)}>
                        Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(risk.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingRisk ? 'Edit Risk' : 'Add New Risk'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Asset *</label>
                <select
                  className="form-control"
                  value={formData.asset_id}
                  onChange={(e) => setFormData({ ...formData, asset_id: e.target.value })}
                  required
                >
                  <option value="">Select Asset</option>
                  {assets.map(asset => (
                    <option key={asset.id} value={asset.id}>{asset.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Threat *</label>
                <select
                  className="form-control"
                  value={formData.threat_id}
                  onChange={(e) => setFormData({ ...formData, threat_id: e.target.value })}
                  required
                >
                  <option value="">Select Threat</option>
                  {threats.map(threat => (
                    <option key={threat.id} value={threat.id}>{threat.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Vulnerability *</label>
                <select
                  className="form-control"
                  value={formData.vulnerability_id}
                  onChange={(e) => setFormData({ ...formData, vulnerability_id: e.target.value })}
                  required
                >
                  <option value="">Select Vulnerability</option>
                  {vulnerabilities.map(vuln => (
                    <option key={vuln.id} value={vuln.id}>{vuln.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Likelihood (1-5) *</label>
                <select
                  className="form-control"
                  value={formData.likelihood}
                  onChange={(e) => setFormData({ ...formData, likelihood: parseInt(e.target.value) })}
                  required
                >
                  {LIKELIHOOD_SCALE.map(item => (
                    <option key={item.value} value={item.value}>
                      {item.value} - {item.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Impact (1-5) *</label>
                <select
                  className="form-control"
                  value={formData.impact}
                  onChange={(e) => setFormData({ ...formData, impact: parseInt(e.target.value) })}
                  required
                >
                  {IMPACT_SCALE.map(item => (
                    <option key={item.value} value={item.value}>
                      {item.value} - {item.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Calculated Risk</label>
                <div style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  <strong>Score: {calculatedScore}</strong> | 
                  <span className={`badge badge-${calculatedLevel.toLowerCase()}`} style={{ marginLeft: '10px' }}>
                    {calculatedLevel}
                  </span>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-control"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Mitigated">Mitigated</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingRisk ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Risks;
