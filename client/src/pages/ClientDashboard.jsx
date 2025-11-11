import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingAPI } from '../services/api';
import Navbar from '../components/Navbar';
import '../styles/Dashboard.css';

const ClientDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getAll();
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      requested: '#ff9800',
      accepted: '#2196f3',
      'in-progress': '#9c27b0',
      submitted: '#f44336',
      completed: '#4caf50',
      paid: '#00bcd4',
      cancelled: '#757575'
    };
    return colors[status] || '#999';
  };

  if (loading) {
    return <div className="dashboard-container"><p>Loading...</p></div>;
  }

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Client Dashboard</h1>
        <button className="btn-primary" onClick={() => navigate('/browse')}>
          Browse Freelancers
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Bookings</h3>
          <p className="stat-number">{bookings.length}</p>
        </div>
        <div className="stat-card">
          <h3>Active Projects</h3>
          <p className="stat-number">
            {bookings.filter(b => ['accepted', 'in-progress'].includes(b.status)).length}
          </p>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <p className="stat-number">
            {bookings.filter(b => b.status === 'completed' || b.status === 'paid').length}
          </p>
        </div>
      </div>

      <div className="bookings-section">
        <h2>Recent Bookings</h2>
        {bookings.length === 0 ? (
          <div className="empty-state">
            <p>No bookings yet. Start by browsing freelancers!</p>
            <button className="btn-primary" onClick={() => navigate('/browse')}>
              Browse Freelancers
            </button>
          </div>
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
                  Freelancer: {booking.freelancerId?.name || 'N/A'}
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
    </>
  );
};

export default ClientDashboard;
