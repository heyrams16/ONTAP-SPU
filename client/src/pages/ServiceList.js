import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { servicesAPI } from '../services/api';
import './ServiceList.css';

function ServiceList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    sort: 'createdAt'
  });

  useEffect(() => {
    fetchServices();
  }, [filters]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await servicesAPI.getAll(filters);
      setServices(response.data.services);
    } catch (error) {
      console.error('Error fetching services:', error);
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

  const getCategoryColor = (category) => {
    const colors = {
      'rides': '#4CAF50',
      'tutoring': '#2196F3',
      'errands': '#FF9800',
      'campus-tasks': '#9C27B0',
      'marketplace': '#E91E63',
      'rentals': '#00BCD4'
    };
    return colors[category] || '#666';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'rides': '🚗',
      'tutoring': '📚',
      'errands': '🛒',
      'campus-tasks': '🏗️',
      'marketplace': '🛍️',
      'rentals': '🔑'
    };
    return icons[category] || '📦';
  };

  return (
    <div className="service-list-page">
      <div className="container">
        <h1 className="page-title">Browse Services</h1>

        <div className="filters-bar">
          <div className="filter-group">
            <input
              type="text"
              name="search"
              placeholder="Search services..."
              value={filters.search}
              onChange={handleFilterChange}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <select name="category" value={filters.category} onChange={handleFilterChange}>
              <option value="">All Categories</option>
              <option value="rides">Rides</option>
              <option value="tutoring">Tutoring</option>
              <option value="errands">Errands</option>
              <option value="campus-tasks">Campus Tasks</option>
              <option value="marketplace">Marketplace</option>
              <option value="rentals">Rentals</option>
            </select>
          </div>

          <div className="filter-group">
            <select name="sort" value={filters.sort} onChange={handleFilterChange}>
              <option value="createdAt">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-message">Loading services...</div>
        ) : services.length === 0 ? (
          <div className="no-results">
            <p>No services found matching your criteria.</p>
          </div>
        ) : (
          <div className="services-grid">
            {services.map(service => (
              <Link
                key={service._id}
                to={`/services/${service._id}`}
                className="service-card"
              >
                <div className="service-header">
                  <span
                    className="service-category"
                    style={{ backgroundColor: getCategoryColor(service.category) }}
                  >
                    {getCategoryIcon(service.category)} {service.category.replace('-', ' ')}
                  </span>
                  <span className="service-rating">⭐ {service.rating.toFixed(1)}</span>
                </div>

                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>

                <div className="service-info">
                  <div className="service-provider">
                    By: {service.provider.name}
                  </div>
                  <div className="service-location">
                    📍 {service.location}
                  </div>
                </div>

                <div className="service-footer">
                  <div className="service-price">
                    ${service.price}
                    {service.priceType === 'hourly' && '/hr'}
                    {service.priceType === 'negotiable' && ' (negotiable)'}
                  </div>
                  <button className="btn btn-secondary">View Details</button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ServiceList;
