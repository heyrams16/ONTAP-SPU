import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { profilesAPI } from '../services/api';
import './CreateProfile.css';

function CreateProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    profilePicture: '',
    bio: '',
    major: '',
    year: 'Freshman',
    areasOfInterest: '',
    skills: '',
    hobbies: '',
    lookingFor: [],
    socialMedia: {
      instagram: '',
      linkedin: '',
      twitter: ''
    }
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('social_')) {
      const platform = name.split('_')[1];
      setFormData({
        ...formData,
        socialMedia: {
          ...formData.socialMedia,
          [platform]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleLookingForChange = (e) => {
    const value = e.target.value;
    const lookingFor = [...formData.lookingFor];

    if (e.target.checked) {
      lookingFor.push(value);
    } else {
      const index = lookingFor.indexOf(value);
      if (index > -1) lookingFor.splice(index, 1);
    }

    setFormData({ ...formData, lookingFor });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);

    try {
      const profileData = {
        ...formData,
        areasOfInterest: formData.areasOfInterest.split(',').map(i => i.trim()).filter(i => i),
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        hobbies: formData.hobbies.split(',').map(h => h.trim()).filter(h => h)
      };

      await profilesAPI.create(profileData);
      setMessage({ type: 'success', text: 'Profile created successfully!' });

      setTimeout(() => {
        navigate('/college-zone');
      }, 2000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to create profile'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-profile-page">
      <div className="container">
        <div className="create-profile-container">
          <h1 className="page-title">Create Your Profile</h1>
          <p className="page-subtitle">
            Share your interests and connect with students across universities!
          </p>

          {message.text && (
            <div className={`${message.type}-message`}>{message.text}</div>
          )}

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-section">
              <h3>Basic Information</h3>

              <div className="form-group">
                <label>Profile Picture URL</label>
                <input
                  type="url"
                  name="profilePicture"
                  value={formData.profilePicture}
                  onChange={handleChange}
                  placeholder="https://example.com/your-photo.jpg"
                />
                <small>Enter a URL to your profile picture</small>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Major *</label>
                  <input
                    type="text"
                    name="major"
                    value={formData.major}
                    onChange={handleChange}
                    placeholder="e.g., Computer Science"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Year *</label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    required
                  >
                    <option value="Freshman">Freshman</option>
                    <option value="Sophomore">Sophomore</option>
                    <option value="Junior">Junior</option>
                    <option value="Senior">Senior</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell others about yourself..."
                  rows="4"
                  maxLength="500"
                />
                <small>{formData.bio.length}/500 characters</small>
              </div>
            </div>

            <div className="form-section">
              <h3>Interests & Skills</h3>

              <div className="form-group">
                <label>Areas of Interest</label>
                <input
                  type="text"
                  name="areasOfInterest"
                  value={formData.areasOfInterest}
                  onChange={handleChange}
                  placeholder="e.g., AI, Web Development, Music (comma-separated)"
                />
                <small>Separate with commas</small>
              </div>

              <div className="form-group">
                <label>Skills</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g., Python, React, Public Speaking (comma-separated)"
                />
                <small>Separate with commas</small>
              </div>

              <div className="form-group">
                <label>Hobbies</label>
                <input
                  type="text"
                  name="hobbies"
                  value={formData.hobbies}
                  onChange={handleChange}
                  placeholder="e.g., Photography, Gaming, Hiking (comma-separated)"
                />
                <small>Separate with commas</small>
              </div>
            </div>

            <div className="form-section">
              <h3>Looking For</h3>
              <div className="checkbox-group">
                {['Study Partner', 'Project Collaborator', 'Mentor', 'Friend', 'Networking'].map(option => (
                  <label key={option} className="checkbox-label">
                    <input
                      type="checkbox"
                      value={option}
                      checked={formData.lookingFor.includes(option)}
                      onChange={handleLookingForChange}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h3>Social Media (Optional)</h3>

              <div className="form-group">
                <label>Instagram</label>
                <input
                  type="text"
                  name="social_instagram"
                  value={formData.socialMedia.instagram}
                  onChange={handleChange}
                  placeholder="@username"
                />
              </div>

              <div className="form-group">
                <label>LinkedIn</label>
                <input
                  type="url"
                  name="social_linkedin"
                  value={formData.socialMedia.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div className="form-group">
                <label>Twitter</label>
                <input
                  type="text"
                  name="social_twitter"
                  value={formData.socialMedia.twitter}
                  onChange={handleChange}
                  placeholder="@username"
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/college-zone')}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateProfile;
