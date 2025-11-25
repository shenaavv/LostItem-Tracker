import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { itemsAPI } from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import {
  FiMapPin,
  FiCalendar,
  FiUser,
  FiEdit,
  FiTrash2,
  FiMail,
  FiMessageSquare,
  FiArrowLeft,
  FiPackage
} from 'react-icons/fi';
import './ItemDetail.css';

const ItemDetail = () => {
  const { id } = useParams();
  const { user, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchItem = async () => {
    try {
      const response = await itemsAPI.getById(id);
      setItem(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching item:', error);
      setError('Failed to load item details');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await itemsAPI.delete(id);
        navigate('/');
      } catch (error) {
        alert('Failed to delete item');
      }
    }
  };

  const handleContactAdmin = () => {
    const message = `Hi, I'm interested in item #${item.ticketNumber} - ${item.title}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      open: { class: 'badge-open', text: 'Open', icon: '🔓' },
      verified: { class: 'badge-verified', text: 'Verified', icon: '✓' },
      returned: { class: 'badge-returned', text: 'Returned', icon: '✓✓' }
    };
    return badges[status] || badges.open;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading item details...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="error-container">
        <h2>Item not found</h2>
        <Link to="/" className="btn-back">Go back to Dashboard</Link>
      </div>
    );
  }

  const isOwner = item.reporterId._id === user.id;
  const canEdit = isOwner || isAdmin();

  return (
    <div className="item-detail-container">
      <div className="detail-header">
        <button onClick={() => navigate('/')} className="btn-back-arrow">
          <FiArrowLeft /> Back to Dashboard
        </button>
      </div>

      <div className="detail-card">
        <div className="detail-image-section">
          {item.imageUrl ? (
            <img
              src={`http://localhost:5000${item.imageUrl}`}
              alt={item.title}
              className="detail-image"
            />
          ) : (
            <div className="detail-no-image">
              <FiPackage size={80} />
              <p>No image available</p>
            </div>
          )}
        </div>

        <div className="detail-content">
          <div className="detail-top">
            <div className="detail-title-section">
              <span className={`type-badge-large ${item.type}`}>
                {item.type === 'lost' ? '🔍 Lost Item' : '✅ Found Item'}
              </span>
              <h1>{item.title}</h1>
              <div className="status-info">
                <span className={`status-badge-large ${getStatusBadge(item.status).class}`}>
                  {getStatusBadge(item.status).icon} {getStatusBadge(item.status).text}
                </span>
                <span className="ticket-large">Ticket #{item.ticketNumber}</span>
              </div>
            </div>

            {canEdit && (
              <div className="detail-actions">
                <Link to={`/edit-report/${item._id}`} className="btn-edit">
                  <FiEdit /> Edit
                </Link>
                <button onClick={handleDelete} className="btn-delete">
                  <FiTrash2 /> Delete
                </button>
              </div>
            )}
          </div>

          <div className="detail-section">
            <h3>Description</h3>
            <p>{item.description}</p>
          </div>

          <div className="detail-info-grid">
            <div className="info-card">
              <FiMapPin />
              <div>
                <span className="info-label">Location</span>
                <span className="info-value">{item.location}</span>
              </div>
            </div>

            <div className="info-card">
              <FiCalendar />
              <div>
                <span className="info-label">Date</span>
                <span className="info-value">{formatDate(item.date)}</span>
              </div>
            </div>

            <div className="info-card">
              <FiUser />
              <div>
                <span className="info-label">Reported by</span>
                <span className="info-value">{item.reporterId.name}</span>
              </div>
            </div>

            <div className="info-card">
              <FiMail />
              <div>
                <span className="info-label">Contact</span>
                <span className="info-value">{item.reporterId.email}</span>
              </div>
            </div>
          </div>

          {!isOwner && (
            <div className="contact-section">
              <h3>Interested in this item?</h3>
              <button onClick={handleContactAdmin} className="btn-contact">
                <FiMessageSquare /> Contact via WhatsApp
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
