import React, { useState, useEffect } from 'react';
import { bookingsAPI } from '../services/api';
import './MyBookings.css';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const type = filter === 'all' ? null : filter;
      const response = await bookingsAPI.getMyBookings(type);
      setBookings(response.data.bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await bookingsAPI.updateStatus(bookingId, newStatus);
      setMessage({ type: 'success', text: 'Booking status updated successfully!' });
      fetchBookings();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to update booking status'
      });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': '#FF9800',
      'accepted': '#2196F3',
      'completed': '#4CAF50',
      'cancelled': '#f44336'
    };
    return colors[status] || '#666';
  };

  return (
    <div className="my-bookings-page">
      <div className="container">
        <h1 className="page-title">My Bookings</h1>

        {message.text && (
          <div className={`${message.type}-message`}>{message.text}</div>
        )}

        <div className="bookings-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Bookings
          </button>
          <button
            className={`filter-btn ${filter === 'customer' ? 'active' : ''}`}
            onClick={() => setFilter('customer')}
          >
            As Customer
          </button>
          <button
            className={`filter-btn ${filter === 'provider' ? 'active' : ''}`}
            onClick={() => setFilter('provider')}
          >
            As Provider
          </button>
        </div>

        {loading ? (
          <div className="loading-message">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="no-bookings">
            <p>No bookings found.</p>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map(booking => (
              <div key={booking._id} className="booking-card">
                <div className="booking-header">
                  <div>
                    <h3 className="booking-title">{booking.service.title}</h3>
                    <span className="booking-category">{booking.service.category}</span>
                  </div>
                  <span
                    className="booking-status"
                    style={{ backgroundColor: getStatusColor(booking.status) }}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="booking-details">
                  <div className="booking-detail-item">
                    <strong>Date:</strong>{' '}
                    {new Date(booking.scheduledDate).toLocaleString()}
                  </div>
                  <div className="booking-detail-item">
                    <strong>Duration:</strong> {booking.duration} minutes
                  </div>
                  <div className="booking-detail-item">
                    <strong>Location:</strong> {booking.meetingLocation}
                  </div>
                  <div className="booking-detail-item">
                    <strong>Price:</strong> ${booking.totalPrice}
                  </div>
                </div>

                <div className="booking-parties">
                  <div className="party-info">
                    <strong>Provider:</strong> {booking.provider.name}
                    <br />
                    <small>{booking.provider.email}</small>
                  </div>
                  <div className="party-info">
                    <strong>Customer:</strong> {booking.customer.name}
                    <br />
                    <small>{booking.customer.email}</small>
                  </div>
                </div>

                {booking.notes && (
                  <div className="booking-notes">
                    <strong>Notes:</strong> {booking.notes}
                  </div>
                )}

                <div className="booking-actions">
                  {booking.status === 'pending' && (
                    <>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleStatusUpdate(booking._id, 'accepted')}
                      >
                        Accept
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {booking.status === 'accepted' && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleStatusUpdate(booking._id, 'completed')}
                    >
                      Mark as Completed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookings;
