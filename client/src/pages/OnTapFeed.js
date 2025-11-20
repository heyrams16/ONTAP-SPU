import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OnTapFeed.css';

function OnTapFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState({ content: '', type: 'general' });
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});
  const [filter, setFilter] = useState('all');

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { type: filter } : {};
      const response = await axios.get('/api/posts', { params });
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('Please log in to create a post');
      return;
    }

    if (!newPost.content.trim()) return;

    try {
      const response = await axios.post('/api/posts', newPost, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPosts([response.data, ...posts]);
      setNewPost({ content: '', type: 'general' });
      setShowCreatePost(false);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    }
  };

  const handleLike = async (postId) => {
    if (!token) {
      alert('Please log in to like posts');
      return;
    }

    try {
      const response = await axios.post(`/api/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPosts(posts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            likes: response.data.isLiked
              ? [...post.likes, user.id]
              : post.likes.filter(id => id !== user.id)
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId) => {
    if (!token) {
      alert('Please log in to comment');
      return;
    }

    const content = commentInputs[postId];
    if (!content || !content.trim()) return;

    try {
      const response = await axios.post(`/api/posts/${postId}/comment`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPosts(posts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            comments: [...post.comments, response.data]
          };
        }
        return post;
      }));

      setCommentInputs({ ...commentInputs, [postId]: '' });
    } catch (error) {
      console.error('Error commenting:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await axios.delete(`/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  const getPostTypeIcon = (type) => {
    const icons = {
      general: '💬',
      event: '📅',
      announcement: '📢',
      question: '❓',
      achievement: '🏆'
    };
    return icons[type] || '💬';
  };

  const getPostTypeBadge = (type) => {
    const badges = {
      general: { bg: '#2874f0', label: 'General' },
      event: { bg: '#ff9f00', label: 'Event' },
      announcement: { bg: '#e91e63', label: 'Announcement' },
      question: { bg: '#9c27b0', label: 'Question' },
      achievement: { bg: '#4caf50', label: 'Achievement' }
    };
    return badges[type] || badges.general;
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="ontap-feed-page">
      <div className="feed-container">
        {/* Header */}
        <div className="feed-header">
          <div className="header-content">
            <h1 className="feed-title">🌟 OnTap Feed</h1>
            <p className="feed-subtitle">Share your campus life, connect with students</p>
          </div>
          {token && (
            <button
              className="btn-create-post"
              onClick={() => setShowCreatePost(!showCreatePost)}
            >
              ✍️ Create Post
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="feed-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Posts
          </button>
          <button
            className={`filter-btn ${filter === 'general' ? 'active' : ''}`}
            onClick={() => setFilter('general')}
          >
            💬 General
          </button>
          <button
            className={`filter-btn ${filter === 'event' ? 'active' : ''}`}
            onClick={() => setFilter('event')}
          >
            📅 Events
          </button>
          <button
            className={`filter-btn ${filter === 'announcement' ? 'active' : ''}`}
            onClick={() => setFilter('announcement')}
          >
            📢 Announcements
          </button>
          <button
            className={`filter-btn ${filter === 'question' ? 'active' : ''}`}
            onClick={() => setFilter('question')}
          >
            ❓ Questions
          </button>
          <button
            className={`filter-btn ${filter === 'achievement' ? 'active' : ''}`}
            onClick={() => setFilter('achievement')}
          >
            🏆 Achievements
          </button>
        </div>

        {/* Create Post Form */}
        {showCreatePost && (
          <div className="create-post-card">
            <form onSubmit={handleCreatePost}>
              <div className="form-header">
                <h3>Create a New Post</h3>
                <button
                  type="button"
                  className="close-btn"
                  onClick={() => setShowCreatePost(false)}
                >
                  ✕
                </button>
              </div>

              <select
                className="post-type-select"
                value={newPost.type}
                onChange={(e) => setNewPost({ ...newPost, type: e.target.value })}
              >
                <option value="general">💬 General</option>
                <option value="event">📅 Event</option>
                <option value="announcement">📢 Announcement</option>
                <option value="question">❓ Question</option>
                <option value="achievement">🏆 Achievement</option>
              </select>

              <textarea
                className="post-textarea"
                placeholder="What's on your mind?"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                rows="4"
                maxLength="1000"
              />

              <div className="form-footer">
                <span className="char-count">{newPost.content.length}/1000</span>
                <button type="submit" className="btn-submit-post">
                  Post
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Posts Feed */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No posts yet</h3>
            <p>Be the first to share something with the community!</p>
          </div>
        ) : (
          <div className="posts-feed">
            {posts.map(post => {
              const typeBadge = getPostTypeBadge(post.type);
              const isLiked = post.likes.includes(user.id);
              const isOwner = post.user._id === user.id;

              return (
                <div key={post._id} className="post-card">
                  <div className="post-header">
                    <div className="user-info">
                      <div className="user-avatar">
                        {post.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="user-details">
                        <h4 className="user-name">{post.user.name}</h4>
                        <span className="post-time">{formatTimeAgo(post.createdAt)}</span>
                      </div>
                    </div>
                    <div className="post-actions-header">
                      <span
                        className="post-type-badge"
                        style={{ backgroundColor: typeBadge.bg }}
                      >
                        {getPostTypeIcon(post.type)} {typeBadge.label}
                      </span>
                      {isOwner && (
                        <button
                          className="delete-post-btn"
                          onClick={() => handleDeletePost(post._id)}
                          title="Delete post"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="post-content">
                    <p>{post.content}</p>
                  </div>

                  <div className="post-stats">
                    <span className="stat-item">
                      ❤️ {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
                    </span>
                    <span className="stat-item">
                      💬 {post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}
                    </span>
                  </div>

                  <div className="post-actions">
                    <button
                      className={`action-btn ${isLiked ? 'liked' : ''}`}
                      onClick={() => handleLike(post._id)}
                    >
                      {isLiked ? '❤️' : '🤍'} Like
                    </button>
                    <button className="action-btn">
                      💬 Comment
                    </button>
                  </div>

                  {/* Comments Section */}
                  {post.comments.length > 0 && (
                    <div className="comments-section">
                      {post.comments.map((comment, idx) => (
                        <div key={idx} className="comment-item">
                          <div className="comment-avatar">
                            {comment.user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="comment-content">
                            <div className="comment-header">
                              <span className="comment-user">{comment.user.name}</span>
                              <span className="comment-time">{formatTimeAgo(comment.createdAt)}</span>
                            </div>
                            <p className="comment-text">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Comment */}
                  {token && (
                    <div className="add-comment">
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        value={commentInputs[post._id] || ''}
                        onChange={(e) => setCommentInputs({
                          ...commentInputs,
                          [post._id]: e.target.value
                        })}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleComment(post._id);
                          }
                        }}
                        className="comment-input"
                      />
                      <button
                        onClick={() => handleComment(post._id)}
                        className="btn-send-comment"
                      >
                        ➤
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default OnTapFeed;
