import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { itemsAPI } from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { FiUpload, FiX } from 'react-icons/fi';
import './AddReport.css';

const EditReport = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    type: 'lost',
    title: '',
    description: '',
    location: '',
    date: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchItem = async () => {
    try {
      const response = await itemsAPI.getById(id);
      const item = response.data;

      // Check if user owns this item
      if (item.reporterId._id !== user.id && user.role !== 'admin') {
        navigate('/');
        return;
      }

      setFormData({
        type: item.type,
        title: item.title,
        description: item.description,
        location: item.location,
        date: item.date.split('T')[0]
      });

      if (item.imageUrl) {
        setCurrentImageUrl(`http://localhost:5000${item.imageUrl}`);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching item:', error);
      setError('Failed to load item');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.description || !formData.location || !formData.date) {
      setError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('type', formData.type);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('date', formData.date);
      
      if (image) {
        formDataToSend.append('image', image);
      }

      await itemsAPI.update(id, formDataToSend);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update report');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="add-report-container">
      <div className="add-report-card">
        <div className="add-report-header">
          <h1>Edit Report</h1>
          <p>Update your item information</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="report-form">
          <div className="form-group">
            <label>Item Type *</label>
            <div className="type-selector">
              <button
                type="button"
                className={formData.type === 'lost' ? 'type-btn active lost' : 'type-btn lost'}
                onClick={() => setFormData({ ...formData, type: 'lost' })}
              >
                🔍 I Lost Something
              </button>
              <button
                type="button"
                className={formData.type === 'found' ? 'type-btn active found' : 'type-btn found'}
                onClick={() => setFormData({ ...formData, type: 'found' })}
              >
                ✅ I Found Something
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="title">Item Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Black Wallet, iPhone 13, Blue Backpack"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide detailed description of the item..."
              rows="4"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Where was it lost/found?"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="date">Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Item Photo (Optional)</label>
            {!imagePreview && !currentImageUrl ? (
              <label htmlFor="image" className="image-upload">
                <FiUpload size={32} />
                <span>Click to upload image</span>
                <small>PNG, JPG, GIF up to 5MB</small>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </label>
            ) : (
              <div className="image-preview">
                <img src={imagePreview || currentImageUrl} alt="Preview" />
                {imagePreview ? (
                  <button type="button" onClick={removeImage} className="remove-image">
                    <FiX /> Remove New Image
                  </button>
                ) : (
                  <label htmlFor="image" className="remove-image" style={{ cursor: 'pointer' }}>
                    <FiUpload /> Change Image
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                )}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-cancel"
            >
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={submitting}>
              {submitting ? 'Updating...' : 'Update Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReport;
