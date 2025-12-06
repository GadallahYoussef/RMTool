import React, { useState, useEffect } from 'react';
import { treatmentsAPI, risksAPI } from '../../services/api';
import { TREATMENT_TYPES, TREATMENT_STATUSES } from '../../utils/riskHelpers';

const Treatments = () => {
  const [treatments, setTreatments] = useState([]);
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState(null);
  const [formData, setFormData] = useState({
    risk_id: '',
    treatment_type: 'Mitigate',
    description: '',
    owner: '',
    due_date: '',
    status: 'Planned',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [treatmentsRes, risksRes] = await Promise.all([
        treatmentsAPI.getAll(),
        risksAPI.getAll()
      ]);
      setTreatments(treatmentsRes.data);
      setRisks(risksRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTreatment) {
        await treatmentsAPI.update(editingTreatment.id, formData);
      } else {
        await treatmentsAPI.create(formData);
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (treatment) => {
    setEditingTreatment(treatment);
    setFormData({
      risk_id: treatment.risk_id,
      treatment_type: treatment.treatment_type,
      description: treatment.description || '',
      owner: treatment.owner || '',
      due_date: treatment.due_date || '',
      status: treatment.status,
      notes: treatment.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this treatment?')) {
      try {
        await treatmentsAPI.delete(id);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      risk_id: '',
      treatment_type: 'Mitigate',
      description: '',
      owner: '',
      due_date: '',
      status: 'Planned',
      notes: ''
    });
    setEditingTreatment(null);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Risk Treatment Tracking</h1>
        <p>Manage treatment actions for identified risks</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Treatments ({treatments.length})</h3>
          <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            + Add Treatment
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading treatments...</div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Type</th>
                  <th>Owner</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {treatments.map((treatment) => (
                  <tr key={treatment.id}>
                    <td>
                      <strong>{treatment.asset_name}</strong>
                      {treatment.description && (
                        <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                          {treatment.description}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="badge" style={{ backgroundColor: '#6c757d', color: 'white' }}>
                        {treatment.treatment_type}
                      </span>
                    </td>
                    <td>{treatment.owner || 'N/A'}</td>
                    <td>{treatment.due_date || 'N/A'}</td>
                    <td>
                      <span className={`badge badge-${treatment.status.toLowerCase().replace(' ', '-')}`}>
                        {treatment.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-primary btn-sm" onClick={() => handleEdit(treatment)}>
                        Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(treatment.id)}>
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
              <h2 className="modal-title">{editingTreatment ? 'Edit Treatment' : 'Add New Treatment'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Risk *</label>
                <select
                  className="form-control"
                  value={formData.risk_id}
                  onChange={(e) => setFormData({ ...formData, risk_id: e.target.value })}
                  required
                >
                  <option value="">Select Risk</option>
                  {risks.map(risk => (
                    <option key={risk.id} value={risk.id}>
                      {risk.asset_name} - {risk.threat_name} (Score: {risk.risk_score})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Treatment Type *</label>
                <select
                  className="form-control"
                  value={formData.treatment_type}
                  onChange={(e) => setFormData({ ...formData, treatment_type: e.target.value })}
                  required
                >
                  {TREATMENT_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
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
                <label className="form-label">Owner</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Status *</label>
                <select
                  className="form-control"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  required
                >
                  {TREATMENT_STATUSES.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-control"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingTreatment ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Treatments;
