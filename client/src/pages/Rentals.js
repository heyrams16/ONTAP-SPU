import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { servicesAPI } from '../services/api';
import './Rentals.css';

function Rentals() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'rentals',
    search: '',
    rentalItemType: '',
    rentalPeriod: '',
    sort: 'createdAt'
  });

  useEffect(() => {
    fetchRentals();
  }, [filters]);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const response = await servicesAPI.getAll(filters);
      setRentals(response.data.services);
    } catch (error) {
      console.error('Error fetching rentals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const getRentalPeriodBadge = (period) => {
    const badges = {
      'hourly': { color: '#FF6B6B', text: 'Hourly' },
      'daily': { color: '#4ECDC4', text: 'Daily' },
      'weekly': { color: '#45B7D1', text: 'Weekly' },
      'monthly': { color: '#96CEB4', text: 'Monthly' },
      'semester': { color: '#FFEAA7', text: 'Semester' }
    };
    return badges[period] || { color: '#666', text: period };
  };

  const getConditionBadge = (condition) => {
    const badges = {
      'new': { color: '#4CAF50', text: 'New' },
      'like-new': { color: '#8BC34A', text: 'Like New' },
      'good': { color: '#2196F3', text: 'Good' },
      'fair': { color: '#FF9800', text: 'Fair' }
    };
    return badges[condition] || { color: '#666', text: condition };
  };

  const getItemTypeIcon = (itemType) => {
    const icons = {
      'textbook': '📚',
      'electronics': '💻',
      'equipment': '🔧',
      'furniture': '🪑',
      'vehicle': '🚗',
      'other': '🔑'
    };
    return icons[itemType] || '🔑';
  };

  return (
    <div className="service-list-page">
      <div className="container">
        <h1 className="page-title">🔑 Campus Rentals</h1>
        <p className="page-subtitle">Rent items from fellow students - save money and reduce waste!</p>

        <div className="filters-bar">
          <div className="filter-group">
            <input
              type="text"
              name="search"
              placeholder="Search rentals..."
              value={filters.search}
              onChange={handleFilterChange}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <select name="rentalItemType" value={filters.rentalItemType} onChange={handleFilterChange}>
              <option value="">All Items</option>
              <option value="textbook">Textbooks</option>
              <option value="electronics">Electronics</option>
              <option value="equipment">Equipment</option>
              <option value="furniture">Furniture</option>
              <option value="vehicle">Vehicles</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="filter-group">
            <select name="rentalPeriod" value={filters.rentalPeriod} onChange={handleFilterChange}>
              <option value="">All Periods</option>
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="semester">Semester</option>
            </select>
          </div>

          <div className="filter-group">
            <select name="sort" value={filters.sort} onChange={handleFilterChange}>
              <option value="createdAt">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-message">Loading rentals...</div>
        ) : rentals.length === 0 ? (
          <div className="no-results">
            <p>No rentals found. Be the first to list an item for rent!</p>
          </div>
        ) : (
          <div className="services-grid">
            {rentals.map(rental => {
              const periodBadge = getRentalPeriodBadge(rental.rentalPeriod);
              const conditionBadge = getConditionBadge(rental.rentalCondition);
              return (
                <Link
                  key={rental._id}
                  to={`/services/${rental._id}`}
                  className="service-card"
                >
                  <div className="service-header">
                    <span className="service-category" style={{ backgroundColor: '#00BCD4' }}>
                      {getItemTypeIcon(rental.rentalItemType)} {rental.rentalItemType}
                    </span>
                    <span
                      className="service-rating"
                      style={{ backgroundColor: periodBadge.color }}
                    >
                      {periodBadge.text}
                    </span>
                  </div>

                  <h3 className="service-title">{rental.title}</h3>
                  <p className="service-description">{rental.description}</p>

                  <div className="service-info">
                    <div className="service-provider">
                      Owner: {rental.provider.name}
                    </div>
                    <div className="service-location">
                      📍 {rental.location}
                    </div>
                    <div className="service-meta">
                      <span
                        style={{
                          backgroundColor: conditionBadge.color,
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.85em'
                        }}
                      >
                        {conditionBadge.text}
                      </span>
                      <span style={{ marginLeft: '10px', fontSize: '0.9em', color: '#666' }}>
                        💰 ${rental.deposit} deposit
                      </span>
                    </div>
                  </div>

                  <div className="service-footer">
                    <div className="service-price">
                      ${rental.price}/{rental.rentalPeriod}
                    </div>
                    <button className="btn btn-secondary">View Details</button>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Rentals;
