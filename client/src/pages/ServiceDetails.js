import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { servicesAPI, bookingsAPI } from '../services/api';
import './ServiceDetails.css';

function ServiceDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    scheduledDate: '',
    duration: 60,
    meetingLocation: '',
    notes: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      const response = await servicesAPI.getById(id);
      setService(response.data.service);
    } catch (error) {
      console.error('Error fetching service:', error);
      setMessage({ type: 'error', text: 'Failed to load service details' });
    } finally {
      setLoading(false);
    }
  };

  const handleBookingChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await bookingsAPI.create({
        serviceId: id,
        ...bookingData
      });
      setMessage({ type: 'success', text: 'Booking request sent successfully!' });
      setShowBookingForm(false);
      setBookingData({ scheduledDate: '', duration: 60, meetingLocation: '', notes: '' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to create booking' });
    }
  };

  if (loading) {
    return <div className="loading">Loading service details...</div>;
  }

  if (!service) {
    return <div className="error">Service not found</div>;
  }

  const getCategoryColor = (category) => {
    const colors = {
      'rides': '#4CAF50',
      'tutoring': '#2196F3',
      'errands': '#FF9800',
      'campus-tasks': '#9C27B0'
    };
    return colors[category] || '#666';
  };

  return (
    <div className="service-details-page">
      <div className="container">
        {message.text && (
          <div className={`${message.type}-message`}>{message.text}</div>
        )}

        <div className="service-details-card">
          <div className="service-main">
            <div className="service-header-detail">
              <span
                className="category-badge"
                style={{ backgroundColor: getCategoryColor(service.category) }}
              >
                {service.category.replace('-', ' ')}
              </span>
              <span className="rating-badge">⭐ {service.rating.toFixed(1)}</span>
            </div>

            <h1 className="service-title-detail">{service.title}</h1>
            <p className="service-description-detail">{service.description}</p>

            <div className="service-meta">
              <div className="meta-item">
                <strong>Location:</strong> {service.location}
              </div>
              <div className="meta-item">
                <strong>Availability:</strong> {service.availability}
              </div>
              <div className="meta-item">
                <strong>Total Bookings:</strong> {service.totalBookings}
              </div>
            </div>

            <div className="service-price-detail">
              <span className="price-label">Price:</span>
              <span className="price-value">
                ${service.price}
                {service.priceType === 'hourly' && '/hour'}
                {service.priceType === 'negotiable' && ' (negotiable)'}
              </span>
            </div>

            {user && user.id !== service.provider._id && (
              <button
                className="btn btn-primary btn-large"
                onClick={() => setShowBookingForm(!showBookingForm)}
              >
                {showBookingForm ? 'Cancel Booking' : 'Book This Service'}
              </button>
            )}

            {showBookingForm && (
              <form onSubmit={handleBookingSubmit} className="booking-form">
                <h3>Book This Service</h3>

                <div className="form-group">
                  <label>Scheduled Date & Time</label>
                  <input
                    type="datetime-local"
                    name="scheduledDate"
                    value={bookingData.scheduledDate}
                    onChange={handleBookingChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Duration (minutes)</label>
                  <input
                    type="number"
                    name="duration"
                    value={bookingData.duration}
                    onChange={handleBookingChange}
                    min="15"
                    step="15"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Meeting Location</label>
                  <input
                    type="text"
                    name="meetingLocation"
                    value={bookingData.meetingLocation}
                    onChange={handleBookingChange}
                    placeholder="Where should you meet?"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Notes (Optional)</label>
                  <textarea
                    name="notes"
                    value={bookingData.notes}
                    onChange={handleBookingChange}
                    placeholder="Any special requests or information..."
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Confirm Booking
                </button>
              </form>
            )}
          </div>

          <div className="service-sidebar">
            <div className="provider-card">
              <h3>Service Provider</h3>
              <div className="provider-info">
                <div className="provider-name">{service.provider.name}</div>
                <div className="provider-rating">
                  ⭐ {service.provider.rating.toFixed(1)} ({service.provider.totalReviews} reviews)
                </div>
                <div className="provider-contact">
                  📧 {service.provider.email}
                </div>
                <div className="provider-contact">
                  📞 {service.provider.phone}
                </div>
              </div>
            </div>

            {service.tags && service.tags.length > 0 && (
              <div className="tags-section">
                <h3>Tags</h3>
                <div className="tags-list">
                  {service.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {service.reviews && service.reviews.length > 0 && (
          <div className="reviews-section">
            <h2>Reviews ({service.reviews.length})</h2>
            <div className="reviews-list">
              {service.reviews.map((review, index) => (
                <div key={index} className="review-item">
                  <div className="review-header">
                    <span className="review-author">{review.user.name}</span>
                    <span className="review-rating">⭐ {review.rating}</span>
                  </div>
                  {review.comment && <p className="review-comment">{review.comment}</p>}
                  <div className="review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ServiceDetails;
