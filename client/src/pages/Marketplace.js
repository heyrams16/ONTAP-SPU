import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { servicesAPI } from '../services/api';
import './Marketplace.css';

function Marketplace() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'marketplace',
    search: '',
    itemType: '',
    condition: '',
    sort: 'createdAt'
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await servicesAPI.getAll(filters);
      setProducts(response.data.services);
    } catch (error) {
      console.error('Error fetching marketplace products:', error);
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

  const getConditionBadge = (condition) => {
    const badges = {
      'new': { color: '#4CAF50', text: 'New' },
      'like-new': { color: '#8BC34A', text: 'Like New' },
      'good': { color: '#2196F3', text: 'Good' },
      'fair': { color: '#FF9800', text: 'Fair' },
      'poor': { color: '#f44336', text: 'Poor' }
    };
    return badges[condition] || { color: '#666', text: condition };
  };

  const getItemTypeIcon = (itemType) => {
    const icons = {
      'textbook': '📚',
      'electronics': '💻',
      'furniture': '🪑',
      'clothing': '👕',
      'supplies': '📦',
      'other': '🏷️'
    };
    return icons[itemType] || '🏷️';
  };

  return (
    <div className="service-list-page">
      <div className="container">
        <h1 className="page-title">🛒 Student Marketplace</h1>
        <p className="page-subtitle">Buy and sell items within the campus community</p>

        <div className="filters-bar">
          <div className="filter-group">
            <input
              type="text"
              name="search"
              placeholder="Search products..."
              value={filters.search}
              onChange={handleFilterChange}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <select name="itemType" value={filters.itemType} onChange={handleFilterChange}>
              <option value="">All Items</option>
              <option value="textbook">Textbooks</option>
              <option value="electronics">Electronics</option>
              <option value="furniture">Furniture</option>
              <option value="clothing">Clothing</option>
              <option value="supplies">Supplies</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="filter-group">
            <select name="condition" value={filters.condition} onChange={handleFilterChange}>
              <option value="">Any Condition</option>
              <option value="new">New</option>
              <option value="like-new">Like New</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
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
          <div className="loading-message">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="no-results">
            <p>No products found. Be the first to list an item!</p>
          </div>
        ) : (
          <div className="services-grid">
            {products.map(product => {
              const conditionBadge = getConditionBadge(product.condition);
              return (
                <Link
                  key={product._id}
                  to={`/services/${product._id}`}
                  className="service-card"
                >
                  <div className="service-header">
                    <span className="service-category" style={{ backgroundColor: '#E91E63' }}>
                      {getItemTypeIcon(product.itemType)} {product.itemType}
                    </span>
                    <span
                      className="service-rating"
                      style={{ backgroundColor: conditionBadge.color }}
                    >
                      {conditionBadge.text}
                    </span>
                  </div>

                  <h3 className="service-title">{product.title}</h3>
                  <p className="service-description">{product.description}</p>

                  <div className="service-info">
                    <div className="service-provider">
                      Seller: {product.provider.name}
                    </div>
                    <div className="service-location">
                      📍 {product.location}
                    </div>
                  </div>

                  <div className="service-footer">
                    <div className="service-price">
                      ${product.price}
                      {product.priceType === 'negotiable' && ' (OBO)'}
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

export default Marketplace;
