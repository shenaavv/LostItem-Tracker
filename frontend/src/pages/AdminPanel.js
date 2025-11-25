import React, { useState, useEffect } from 'react';
import { itemsAPI } from '../api/axios';
import { FiUsers, FiPackage, FiCheckCircle, FiClock } from 'react-icons/fi';
import './AdminPanel.css';

const AdminPanel = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    verified: 0,
    returned: 0
  });

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    calculateStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await itemsAPI.getAll();
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    setStats({
      total: items.length,
      open: items.filter(item => item.status === 'open').length,
      verified: items.filter(item => item.status === 'verified').length,
      returned: items.filter(item => item.status === 'returned').length
    });
  };

  const handleStatusChange = async (itemId, newStatus) => {
    try {
      const formData = new FormData();
      formData.append('status', newStatus);
      
      await itemsAPI.update(itemId, formData);
      
      // Update local state
      setItems(items.map(item => 
        item._id === itemId ? { ...item, status: newStatus } : item
      ));
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await itemsAPI.delete(itemId);
        setItems(items.filter(item => item._id !== itemId));
      } catch (error) {
        alert('Failed to delete item');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(item => item.status === filter);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>🛡️ Admin Panel</h1>
        <p>Manage all lost and found reports</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card total">
          <FiPackage />
          <div className="stat-content">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Reports</span>
          </div>
        </div>

        <div className="stat-card open">
          <FiClock />
          <div className="stat-content">
            <span className="stat-value">{stats.open}</span>
            <span className="stat-label">Open</span>
          </div>
        </div>

        <div className="stat-card verified">
          <FiCheckCircle />
          <div className="stat-content">
            <span className="stat-value">{stats.verified}</span>
            <span className="stat-label">Verified</span>
          </div>
        </div>

        <div className="stat-card returned">
          <FiUsers />
          <div className="stat-content">
            <span className="stat-value">{stats.returned}</span>
            <span className="stat-label">Returned</span>
          </div>
        </div>
      </div>

      <div className="admin-controls">
        <div className="admin-filter-buttons">
          <button
            className={filter === 'all' ? 'admin-filter-btn active' : 'admin-filter-btn'}
            onClick={() => setFilter('all')}
          >
            All ({stats.total})
          </button>
          <button
            className={filter === 'open' ? 'admin-filter-btn active' : 'admin-filter-btn'}
            onClick={() => setFilter('open')}
          >
            Open ({stats.open})
          </button>
          <button
            className={filter === 'verified' ? 'admin-filter-btn active' : 'admin-filter-btn'}
            onClick={() => setFilter('verified')}
          >
            Verified ({stats.verified})
          </button>
          <button
            className={filter === 'returned' ? 'admin-filter-btn active' : 'admin-filter-btn'}
            onClick={() => setFilter('returned')}
          >
            Returned ({stats.returned})
          </button>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ticket</th>
              <th>Type</th>
              <th>Title</th>
              <th>Location</th>
              <th>Date</th>
              <th>Reporter</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  No items found
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item._id}>
                  <td className="ticket-cell">#{item.ticketNumber}</td>
                  <td>
                    <span className={`type-badge-small ${item.type}`}>
                      {item.type === 'lost' ? '🔍 Lost' : '✅ Found'}
                    </span>
                  </td>
                  <td className="title-cell">{item.title}</td>
                  <td>{item.location}</td>
                  <td>{formatDate(item.date)}</td>
                  <td>{item.reporterId?.name}</td>
                  <td>
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item._id, e.target.value)}
                      className={`status-select ${item.status}`}
                    >
                      <option value="open">Open</option>
                      <option value="verified">Verified</option>
                      <option value="returned">Returned</option>
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="btn-delete-admin"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
