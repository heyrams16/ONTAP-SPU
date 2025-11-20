import React, { useState, useEffect, useRef } from 'react';
import {
  searchLocations,
  getCategoryIcon,
  getPopularZones,
  findLocationById
} from '../utils/locationAutocomplete';
import './LocationPicker.css';

/**
 * LocationPicker - Via-style location selector with pickup zones
 * @param {String} label - Input label
 * @param {String} value - Current value (location ID or name)
 * @param {Function} onChange - Callback when location is selected
 * @param {String} placeholder - Input placeholder
 * @param {Array} nearbyZones - Optional nearby zones to show
 */
function LocationPicker({ label, value, onChange, placeholder, nearbyZones = [] }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // If value is a location ID, find and set it
    if (value && typeof value === 'string') {
      const location = findLocationById(value);
      if (location) {
        setSelectedLocation(location);
        setQuery(location.name);
      } else {
        setQuery(value);
      }
    }
  }, [value]);

  useEffect(() => {
    // Show popular zones or nearby zones when input is focused and empty
    if (showDropdown && !query) {
      const popular = nearbyZones.length > 0 ? nearbyZones : getPopularZones();
      setSuggestions(popular);
    } else if (query && query.length >= 2) {
      const results = searchLocations(query, 8);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  }, [query, showDropdown, nearbyZones]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setShowDropdown(true);
    setSelectedLocation(null);
  };

  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
    setQuery(location.name);
    setShowDropdown(false);

    // Call onChange with location object
    onChange(location);
  };

  const handleInputFocus = () => {
    setShowDropdown(true);
  };

  const handleClear = () => {
    setQuery('');
    setSelectedLocation(null);
    setShowDropdown(false);
    onChange(null);
    inputRef.current?.focus();
  };

  return (
    <div className="location-picker">
      {label && <label className="location-label">{label}</label>}

      <div className="location-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder || 'Enter location...'}
          className="location-input"
          autoComplete="off"
        />

        {query && (
          <button
            type="button"
            className="clear-btn"
            onClick={handleClear}
            aria-label="Clear"
          >
            ✕
          </button>
        )}
      </div>

      {showDropdown && suggestions.length > 0 && (
        <div ref={dropdownRef} className="location-dropdown">
          {!query && (
            <div className="dropdown-header">
              {nearbyZones.length > 0 ? '📍 Nearby Pickup Points' : '⭐ Popular Locations'}
            </div>
          )}

          <ul className="location-suggestions">
            {suggestions.map((location, index) => (
              <li
                key={location.id || index}
                className="location-suggestion-item"
                onClick={() => handleSelectLocation(location)}
              >
                <div className="suggestion-icon">
                  {getCategoryIcon(location.category)}
                </div>
                <div className="suggestion-details">
                  <div className="suggestion-name">{location.name}</div>
                  <div className="suggestion-address">{location.address}</div>
                  {location.zone && (
                    <div className="suggestion-zone">Zone: {location.zone}</div>
                  )}
                  {location.distance && (
                    <div className="suggestion-distance">
                      {location.distance.toFixed(1)} km away
                    </div>
                  )}
                </div>
                {location.isPopular && (
                  <div className="popular-badge">Popular</div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedLocation && (
        <div className="selected-location-info">
          <span className="info-icon">{getCategoryIcon(selectedLocation.category)}</span>
          <span className="info-text">
            {selectedLocation.zone || selectedLocation.category} pickup zone
          </span>
        </div>
      )}
    </div>
  );
}

export default LocationPicker;
