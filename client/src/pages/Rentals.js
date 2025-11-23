import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { rentalsAPI } from '../services/api';
import './Rentals.css';

function Rentals() {
  const navigate = useNavigate();
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
      const response = await rentalsAPI.getAll(filters);
      setRentals(response.data || []);
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

  const getItemTypeIcon = (itemType) => {
    const icons = {
      'textbook': '📚',
      'electronics': '💻',
      'equipment': '🔧',
      'furniture': '🪑',
      'vehicle': '🚗',
      'other': '📦'
    };
    return icons[itemType] || '📦';
  };

  return (
    <div className="rentals-page page">
      {/* Header */}
      <div className="rentals-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 className="page-title">Rentals</h1>
        <p className="text-secondary">Borrow items from fellow students</p>
      </div>

      {/* Filters */}
      <div className="rentals-filters">
        <div className="input-icon">
          <span className="input-icon-left">🔍</span>
          <input
            type="text"
            name="search"
            placeholder="Search rentals..."
            value={filters.search}
            onChange={handleFilterChange}
            className="input"
          />
        </div>

        <div className="filter-chips">
          <select
            name="rentalItemType"
            value={filters.rentalItemType}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">All Items</option>
            <option value="textbook">Textbooks</option>
            <option value="electronics">Electronics</option>
            <option value="equipment">Equipment</option>
            <option value="furniture">Furniture</option>
            <option value="vehicle">Vehicles</option>
          </select>

          <select
            name="rentalPeriod"
            value={filters.rentalPeriod}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">All Periods</option>
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="semester">Semester</option>
          </select>

          <select
            name="sort"
            value={filters.sort}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="createdAt">Newest</option>
            <option value="price-low">Price: Low</option>
            <option value="price-high">Price: High</option>
          </select>
        </div>
      </div>

      {/* Rentals Grid */}
      {loading ? (
        <div className="empty-state">
          <div className="empty-state-icon animate-pulse">📦</div>
          <p className="text-secondary">Loading rentals...</p>
        </div>
      ) : rentals.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔑</div>
          <h3 className="empty-state-title">No rentals found</h3>
          <p className="empty-state-text">Be the first to list an item for rent!</p>
        </div>
      ) : (
        <div className="rentals-grid">
          {rentals.map(rental => (
            <Link
              key={rental._id}
              to={`/services/${rental._id}`}
              className="rental-card card"
            >
              <div className="rental-header">
                <span className="rental-type">
                  {getItemTypeIcon(rental.rentalItemType)} {rental.rentalItemType}
                </span>
                <span className="badge badge-green">
                  {rental.rentalPeriod}
                </span>
              </div>

              <h3 className="rental-title">{rental.title}</h3>
              <p className="rental-description text-secondary text-sm">
                {rental.description?.substring(0, 80)}...
              </p>

              <div className="rental-meta">
                <span className="text-tertiary text-sm">
                  📍 {rental.location}
                </span>
                {rental.deposit && (
                  <span className="rental-deposit text-sm">
                    ${rental.deposit} deposit
                  </span>
                )}
              </div>

              <div className="rental-footer">
                <div className="rental-price">
                  ${rental.price}
                  <span className="rental-period">/{rental.rentalPeriod}</span>
                </div>
                <span className="rental-owner text-sm">
                  {rental.provider?.name || 'Student'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Rentals;
