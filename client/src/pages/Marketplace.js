import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { marketplaceAPI } from '../services/api';
import './Marketplace.css';

function Marketplace() {
  const navigate = useNavigate();
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
      const response = await marketplaceAPI.getAll(filters);
      setProducts(response.data || []);
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
      'new': 'New',
      'like-new': 'Like New',
      'good': 'Good',
      'fair': 'Fair',
      'poor': 'Poor'
    };
    return badges[condition] || condition;
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
    <div className="marketplace-page page">
      {/* Header */}
      <div className="marketplace-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 className="page-title">Marketplace</h1>
        <p className="text-secondary">Buy and sell items on campus</p>
      </div>

      {/* Filters */}
      <div className="marketplace-filters">
        <div className="input-icon">
          <span className="input-icon-left">🔍</span>
          <input
            type="text"
            name="search"
            placeholder="Search products..."
            value={filters.search}
            onChange={handleFilterChange}
            className="input"
          />
        </div>

        <div className="filter-chips">
          <select
            name="itemType"
            value={filters.itemType}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">All Items</option>
            <option value="textbook">Textbooks</option>
            <option value="electronics">Electronics</option>
            <option value="furniture">Furniture</option>
            <option value="clothing">Clothing</option>
            <option value="supplies">Supplies</option>
            <option value="other">Other</option>
          </select>

          <select
            name="condition"
            value={filters.condition}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">Any Condition</option>
            <option value="new">New</option>
            <option value="like-new">Like New</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
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

      {/* Products Grid */}
      {loading ? (
        <div className="empty-state">
          <div className="empty-state-icon animate-pulse">🛍️</div>
          <p className="text-secondary">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <h3 className="empty-state-title">No products found</h3>
          <p className="empty-state-text">Be the first to list an item!</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <Link
              key={product._id}
              to={`/services/${product._id}`}
              className="product-card card"
            >
              <div className="product-header">
                <span className="product-type">
                  {getItemTypeIcon(product.itemType)} {product.itemType}
                </span>
                <span className="badge badge-green">
                  {getConditionBadge(product.condition)}
                </span>
              </div>

              <h3 className="product-title">{product.title}</h3>
              <p className="product-description text-secondary text-sm">
                {product.description?.substring(0, 80)}...
              </p>

              <div className="product-meta">
                <span className="text-tertiary text-sm">
                  📍 {product.location}
                </span>
              </div>

              <div className="product-footer">
                <div className="product-price">
                  ${product.price}
                  {product.priceType === 'negotiable' && (
                    <span className="negotiable">OBO</span>
                  )}
                </div>
                <span className="product-seller text-sm">
                  {product.provider?.name || 'Student'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Marketplace;
