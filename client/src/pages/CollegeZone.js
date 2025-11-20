import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { profilesAPI } from '../services/api';
import './CollegeZone.css';

function CollegeZone() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    university: '',
    major: '',
    year: '',
    search: ''
  });

  useEffect(() => {
    fetchProfiles();
  }, [filters]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const response = await profilesAPI.getAll(filters);
      setProfiles(response.data.profiles);
    } catch (error) {
      console.error('Error fetching profiles:', error);
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

  return (
    <div className="college-zone-page">
      <div className="container">
        <div className="zone-header">
          <h1 className="page-title">College Zone</h1>
          <p className="zone-subtitle">
            Connect with students across universities. Share interests, find study partners, and grow your network!
          </p>
          <Link to="/create-profile" className="btn btn-primary">
            Create Your Profile
          </Link>
        </div>

        <div className="filters-bar">
          <div className="filter-group">
            <input
              type="text"
              name="search"
              placeholder="Search by interests, major..."
              value={filters.search}
              onChange={handleFilterChange}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <select name="year" value={filters.year} onChange={handleFilterChange}>
              <option value="">All Years</option>
              <option value="Freshman">Freshman</option>
              <option value="Sophomore">Sophomore</option>
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
              <option value="Graduate">Graduate</option>
            </select>
          </div>

          <div className="filter-group">
            <input
              type="text"
              name="major"
              placeholder="Filter by major..."
              value={filters.major}
              onChange={handleFilterChange}
              className="search-input"
            />
          </div>
        </div>

        {loading ? (
          <div className="loading-message">Loading profiles...</div>
        ) : profiles.length === 0 ? (
          <div className="no-results">
            <p>No profiles found. Be the first to create one!</p>
            <Link to="/create-profile" className="btn btn-primary">
              Create Profile
            </Link>
          </div>
        ) : (
          <div className="profiles-grid">
            {profiles.map(profile => (
              <Link
                key={profile._id}
                to={`/profile/${profile._id}`}
                className="profile-card"
              >
                <div className="profile-image">
                  <img src={profile.profilePicture} alt={profile.user.name} />
                  <div className="profile-status"></div>
                </div>

                <div className="profile-info">
                  <h3 className="profile-name">{profile.user.name}</h3>
                  <p className="profile-university">{profile.university}</p>
                  <p className="profile-details">
                    {profile.major} • {profile.year}
                  </p>

                  {profile.bio && (
                    <p className="profile-bio">{profile.bio}</p>
                  )}

                  {profile.areasOfInterest && profile.areasOfInterest.length > 0 && (
                    <div className="profile-interests">
                      {profile.areasOfInterest.slice(0, 3).map((interest, idx) => (
                        <span key={idx} className="interest-tag">{interest}</span>
                      ))}
                      {profile.areasOfInterest.length > 3 && (
                        <span className="interest-tag">+{profile.areasOfInterest.length - 3}</span>
                      )}
                    </div>
                  )}

                  {profile.lookingFor && profile.lookingFor.length > 0 && (
                    <div className="looking-for">
                      <strong>Looking for:</strong> {profile.lookingFor.join(', ')}
                    </div>
                  )}

                  <div className="profile-rating">
                    ⭐ {profile.user.rating || 5.0} Rating
                  </div>
                </div>

                <button className="btn btn-secondary btn-sm">View Profile</button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CollegeZone;
