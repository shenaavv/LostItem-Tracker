import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { itemsAPI } from '../api/axios';
import { FiPlus, FiSearch, FiMapPin, FiCalendar, FiPackage } from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, filter, searchQuery]);

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

  const applyFilters = () => {
    let filtered = items;

    // Filter by type
    if (filter !== 'all') {
      filtered = filtered.filter(item => item.type === filter);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  };

  const getStatusBadge = (status) => {
    const badges = {
      open: { class: 'badge-open', text: 'Open' },
      verified: { class: 'badge-verified', text: 'Verified' },
      returned: { class: 'badge-returned', text: 'Returned' }
    };
    return badges[status] || badges.open;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading items...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>📦 Lost & Found Dashboard</h1>
          <p>Browse and manage lost and found items</p>
        </div>
        <Link to="/add-report" className="btn-add-report">
          <FiPlus /> Report Item
        </Link>
      </div>

      <div className="dashboard-controls">
        <div className="search-bar">
          <FiSearch />
          <input
            type="text"
            placeholder="Search items by title, description, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button
            className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('all')}
          >
            All Items
          </button>
          <button
            className={filter === 'lost' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('lost')}
          >
            Lost Items
          </button>
          <button
            className={filter === 'found' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('found')}
          >
            Found Items
          </button>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="no-items">
          <FiPackage size={64} />
          <h2>No items found</h2>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="items-grid">
          {filteredItems.map((item) => (
            <Link
              to={`/item/${item._id}`}
              key={item._id}
              className="item-card"
            >
              <div className="item-image">
                {item.imageUrl ? (
                  <img
                    src={`http://localhost:5000${item.imageUrl}`}
                    alt={item.title}
                  />
                ) : (
                  <div className="no-image">
                    <FiPackage size={48} />
                  </div>
                )}
                <span className={`type-badge ${item.type}`}>
                  {item.type === 'lost' ? '🔍 Lost' : '✅ Found'}
                </span>
              </div>

              <div className="item-content">
                <div className="item-header-card">
                  <h3>{item.title}</h3>
                  <span className={`status-badge ${getStatusBadge(item.status).class}`}>
                    {getStatusBadge(item.status).text}
                  </span>
                </div>

                <p className="item-description">{item.description}</p>

                <div className="item-meta">
                  <div className="meta-item">
                    <FiMapPin />
                    <span>{item.location}</span>
                  </div>
                  <div className="meta-item">
                    <FiCalendar />
                    <span>{formatDate(item.date)}</span>
                  </div>
                </div>

                <div className="item-footer">
                  <span className="ticket-number">#{item.ticketNumber}</span>
                  <span className="reporter">By {item.reporterId?.name}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
