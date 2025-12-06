import React, { useState, useEffect } from 'react';
import { vulnerabilitiesAPI } from '../../services/api';
import { VULNERABILITY_CATEGORIES } from '../../utils/riskHelpers';

const Vulnerabilities = () => {
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVuln, setEditingVuln] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: ''
  });

  useEffect(() => {
    fetchVulnerabilities();
  }, []);

  const fetchVulnerabilities = async () => {
    try {
      const response = await vulnerabilitiesAPI.getAll();
      setVulnerabilities(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingVuln) {
        await vulnerabilitiesAPI.update(editingVuln.id, formData);
      } else {
        await vulnerabilitiesAPI.create(formData);
      }
      setShowModal(false);
      resetForm();
      fetchVulnerabilities();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (vuln) => {
    setEditingVuln(vuln);
    setFormData({
      name: vuln.name,
      description: vuln.description || '',
      category: vuln.category || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vulnerability?')) {
      try {
        await vulnerabilitiesAPI.delete(id);
        fetchVulnerabilities();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', category: '' });
    setEditingVuln(null);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Vulnerability Library</h1>
        <p>Manage common vulnerabilities in your organization</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Vulnerabilities ({vulnerabilities.length})</h3>
          <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            + Add Vulnerability
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading vulnerabilities...</div>
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
                {vulnerabilities.map((vuln) => (
                  <tr key={vuln.id}>
                    <td><strong>{vuln.name}</strong></td>
                    <td>{vuln.category}</td>
                    <td>{vuln.description}</td>
                    <td>
                      <button className="btn btn-primary btn-sm" onClick={() => handleEdit(vuln)}>
                        Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(vuln.id)}>
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
              <h2 className="modal-title">{editingVuln ? 'Edit Vulnerability' : 'Add New Vulnerability'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Vulnerability Name *</label>
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
                  {VULNERABILITY_CATEGORIES.map(cat => (
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
                  {editingVuln ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vulnerabilities;
