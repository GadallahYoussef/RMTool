import React, { useState, useEffect } from 'react';
import { threatsAPI } from '../../services/api';
import { THREAT_CATEGORIES } from '../../utils/riskHelpers';

const Threats = () => {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingThreat, setEditingThreat] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: ''
  });

  useEffect(() => {
    fetchThreats();
  }, []);

  const fetchThreats = async () => {
    try {
      const response = await threatsAPI.getAll();
      setThreats(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingThreat) {
        await threatsAPI.update(editingThreat.id, formData);
      } else {
        await threatsAPI.create(formData);
      }
      setShowModal(false);
      resetForm();
      fetchThreats();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (threat) => {
    setEditingThreat(threat);
    setFormData({
      name: threat.name,
      description: threat.description || '',
      category: threat.category || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this threat?')) {
      try {
        await threatsAPI.delete(id);
        fetchThreats();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', category: '' });
    setEditingThreat(null);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Threat Library</h1>
        <p>Manage common threats to your organization</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Threats ({threats.length})</h3>
          <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            + Add Threat
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading threats...</div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {threats.map((threat) => (
                  <tr key={threat.id}>
                    <td><strong>{threat.name}</strong></td>
                    <td>{threat.category}</td>
                    <td>{threat.description}</td>
                    <td>
                      <button className="btn btn-primary btn-sm" onClick={() => handleEdit(threat)}>
                        Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(threat.id)}>
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
              <h2 className="modal-title">{editingThreat ? 'Edit Threat' : 'Add New Threat'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Threat Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-control"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {THREAT_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
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
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingThreat ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Threats;
