import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingAPI, pricingAPI, projectAPI, freelancerAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

const FreelancerDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [packages, setPackages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bookingsRes, packagesRes, projectsRes] = await Promise.all([
        bookingAPI.getAll(),
        pricingAPI.getByFreelancer(user._id),
        projectAPI.getByFreelancer(user._id)
      ]);
      
      setBookings(bookingsRes.data);
      setPackages(packagesRes.data);
      setProjects(projectsRes.data);

      try {
        const profileRes = await freelancerAPI.getProfile(user._id);
        setProfile(profileRes.data);
      } catch (error) {
        console.log('No profile yet');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      requested: 'var(--warning)',
      accepted: 'var(--primary-blue)',
      'in-progress': '#9c27b0',
      submitted: 'var(--error)',
      completed: 'var(--success)',
      paid: '#00bcd4',
      cancelled: 'var(--gray-500)'
    };
    return colors[status] || 'var(--gray-400)';
  };

  if (loading) {
    return (
      <div className="dashboard-container loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="dashboard-container">
        <div className="empty-state">
          <h2>Complete Your Profile</h2>
          <p>Create your freelancer profile to start receiving bookings</p>
          <button className="btn btn-primary" onClick={() => navigate('/my-profile')}>
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Freelancer Dashboard</h1>
        <button className="btn-primary" onClick={() => navigate('/my-profile')}>
          Manage Profile
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Pending Requests</h3>
          <p className="stat-number">
            {bookings.filter(b => b.status === 'requested').length}
          </p>
        </div>
        <div className="stat-card">
          <h3>Active Projects</h3>
          <p className="stat-number">
            {bookings.filter(b => ['accepted', 'in-progress'].includes(b.status)).length}
          </p>
        </div>
        <div className="stat-card">
          <h3>Packages</h3>
          <p className="stat-number">{packages.length}</p>
        </div>
        <div className="stat-card">
          <h3>Portfolio Items</h3>
          <p className="stat-number">{projects.length}</p>
        </div>
      </div>

      <div className="bookings-section">
        <h2>Booking Requests</h2>
        {bookings.length === 0 ? (
          <p className="empty-state">No booking requests yet</p>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking._id} className="booking-card" onClick={() => navigate(`/bookings/${booking._id}`)}>
                <div className="booking-header">
                  <h3>{booking.title}</h3>
                  <span className="status-badge" style={{ background: getStatusColor(booking.status) }}>
                    {booking.status}
                  </span>
                </div>
                <p className="booking-freelancer">
                  Client: {booking.clientId?.name || 'N/A'}
                </p>
                <p className="booking-brief">{booking.brief.substring(0, 100)}...</p>
                <p className="booking-date">
                  Created: {new Date(booking.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FreelancerDashboard;
