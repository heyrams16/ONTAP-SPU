import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { servicesAPI } from '../services/api';
import './CreateService.css';

function CreateService() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'rides',
    price: '',
    priceType: 'fixed',
    availability: '',
    location: '',
    tags: '',
    // Marketplace fields
    condition: 'good',
    itemType: 'other',
    // Rentals fields
    rentalPeriod: 'daily',
    deposit: '',
    rentalItemType: 'other',
    rentalCondition: 'good'
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);

    try {
      const serviceData = {
        ...formData,
        price: Number(formData.price),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      await servicesAPI.create(serviceData);
      setMessage({ type: 'success', text: 'Service created successfully!' });

      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to create service'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-service-page">
      <div className="container">
        <div className="create-service-container">
          <h1 className="page-title">
            {formData.category === 'marketplace' ? 'List a Marketplace Item' :
             formData.category === 'rentals' ? 'List a Rental Item' : 'Offer a New Service'}
          </h1>
          <p className="page-subtitle">
            {formData.category === 'marketplace'
              ? 'Sell your used or new items to fellow students!'
              : formData.category === 'rentals'
              ? 'Rent out your items to fellow students and earn passive income!'
              : 'Share your skills and help fellow students while earning some money!'}
          </p>

          {message.text && (
            <div className={`${message.type}-message`}>{message.text}</div>
          )}

          <form onSubmit={handleSubmit} className="create-service-form">
            <div className="form-row">
              <div className="form-group">
                <label>Service Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Airport Ride Service"
                  required
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="rides">Rides</option>
                  <option value="tutoring">Tutoring</option>
                  <option value="errands">Errands</option>
                  <option value="campus-tasks">Campus Tasks</option>
                  <option value="marketplace">Marketplace Item</option>
                  <option value="rentals">Rental Item</option>
                </select>
              </div>
            </div>

            {/* Marketplace-specific fields */}
            {formData.category === 'marketplace' && (
              <div className="form-row">
                <div className="form-group">
                  <label>Item Type *</label>
                  <select
                    name="itemType"
                    value={formData.itemType}
                    onChange={handleChange}
                    required
                  >
                    <option value="textbook">Textbook</option>
                    <option value="electronics">Electronics</option>
                    <option value="furniture">Furniture</option>
                    <option value="clothing">Clothing</option>
                    <option value="supplies">Supplies</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Condition *</label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    required
                  >
                    <option value="new">New</option>
                    <option value="like-new">Like New</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
              </div>
            )}

            {/* Rentals-specific fields */}
            {formData.category === 'rentals' && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label>Rental Item Type *</label>
                    <select
                      name="rentalItemType"
                      value={formData.rentalItemType}
                      onChange={handleChange}
                      required
                    >
                      <option value="textbook">Textbook</option>
                      <option value="electronics">Electronics</option>
                      <option value="equipment">Equipment</option>
                      <option value="furniture">Furniture</option>
                      <option value="vehicle">Vehicle</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Item Condition *</label>
                    <select
                      name="rentalCondition"
                      value={formData.rentalCondition}
                      onChange={handleChange}
                      required
                    >
                      <option value="new">New</option>
                      <option value="like-new">Like New</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Rental Period *</label>
                    <select
                      name="rentalPeriod"
                      value={formData.rentalPeriod}
                      onChange={handleChange}
                      required
                    >
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="semester">Semester</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Security Deposit ($) *</label>
                    <input
                      type="number"
                      name="deposit"
                      value={formData.deposit}
                      onChange={handleChange}
                      placeholder="50"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your service in detail..."
                required
                rows="5"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price ($) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="10"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label>Price Type *</label>
                <select
                  name="priceType"
                  value={formData.priceType}
                  onChange={handleChange}
                  required
                >
                  <option value="fixed">Fixed Price</option>
                  <option value="hourly">Per Hour</option>
                  <option value="negotiable">Negotiable</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Main Campus"
                  required
                />
              </div>

              <div className="form-group">
                <label>Availability *</label>
                <input
                  type="text"
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  placeholder="e.g., Weekdays 3-6 PM"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Tags (Optional)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g., quick, reliable, flexible (comma-separated)"
              />
              <small>Separate tags with commas</small>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/dashboard')}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Service'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateService;
