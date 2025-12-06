import React, { useState, useEffect } from 'react';
import { assetsAPI } from '../../services/api';
import { ASSET_CATEGORIES, formatCurrency } from '../../utils/riskHelpers';

const Assets = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    owner: '',
    criticality: 3,
    value: ''
  });

  useEffect(() => {
    fetchAssets();
  }, [searchTerm, filterCategory]);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (filterCategory) params.category = filterCategory;
      const response = await assetsAPI.getAll(params);
      setAssets(response.data);
    } catch (err) {
      setError('Failed to load assets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAsset) {
        await assetsAPI.update(editingAsset.id, formData);
      } else {
        await assetsAPI.create(formData);
      }
      setShowModal(false);
      resetForm();
      fetchAssets();
    } catch (err) {
      setError('Failed to save asset');
      console.error(err);
    }
  };

  const handleEdit = (asset) => {
    setEditingAsset(asset);
    setFormData({
      name: asset.name,
      description: asset.description || '',
      category: asset.category,
      owner: asset.owner || '',
      criticality: asset.criticality,
      value: asset.value || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      try {
        await assetsAPI.delete(id);
        fetchAssets();
      } catch (err) {
        setError('Failed to delete asset');
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      owner: '',
      criticality: 3,
      value: ''
    });
    setEditingAsset(null);
  };

  const handleAddNew = () => {
    resetForm();
    setShowModal(true);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Asset Inventory</h1>
        <p>Manage organizational assets</p>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Assets ({assets.length})</h3>
          <button className="btn btn-primary" onClick={handleAddNew}>
            + Add Asset
          </button>
        </div>

        <div className="search-filter-bar">
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="form-control"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {ASSET_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="loading">Loading assets...</div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Owner</th>
                  <th>Criticality</th>
                  <th>Value</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assets.length > 0 ? (
                  assets.map((asset) => (
                    <tr key={asset.id}>
                      <td>
                        <strong>{asset.name}</strong>
                        {asset.description && (
                          <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                            {asset.description}
                          </div>
                        )}
                      </td>
                      <td>{asset.category}</td>
                      <td>{asset.owner || 'N/A'}</td>
                      <td>
                        <strong>{asset.criticality}/5</strong>
                      </td>
                      <td>{formatCurrency(asset.value)}</td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleEdit(asset)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(asset.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>
                      No assets found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingAsset ? 'Edit Asset' : 'Add New Asset'}
              </h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Asset Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
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
                <label className="form-label">Category *</label>
                <select
                  className="form-control"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                  {ASSET_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
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
                <label className="form-label">Criticality (1-5) *</label>
                <input
                  type="number"
                  className="form-control"
                  min="1"
                  max="5"
                  value={formData.criticality}
                  onChange={(e) => setFormData({ ...formData, criticality: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Value ($)</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingAsset ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assets;
