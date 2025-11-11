import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingAPI, reviewAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/BookingDetail.css';

const BookingDetail = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    try {
      const response = await bookingAPI.getById(id);
      setBooking(response.data);
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action) => {
    try {
      let response;
      switch (action) {
        case 'accept':
          response = await bookingAPI.accept(id);
          break;
        case 'start':
          response = await bookingAPI.start(id);
          break;
        case 'submit':
          response = await bookingAPI.submit(id);
          break;
        case 'approve':
          response = await bookingAPI.approve(id);
          break;
        case 'markPaid':
          response = await bookingAPI.markPaid(id);
          break;
        case 'cancel':
          if (confirm('Are you sure you want to cancel this booking?')) {
            response = await bookingAPI.cancel(id);
          }
          break;
      }
      if (response) {
        setBooking(response.data);
        alert('Action completed successfully!');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Action failed');
    }
  };

  if (loading) {
    return <div className="booking-detail-container"><p>Loading...</p></div>;
  }

  if (!booking) {
    return <div className="booking-detail-container"><p>Booking not found</p></div>;
  }

  const isClient = booking.clientId._id === user._id;
  const isFreelancer = booking.freelancerId._id === user._id;

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

  return (
    <div className="booking-detail-container">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      
      <div className="booking-detail-card">
        <div className="booking-detail-header">
          <h1>{booking.title}</h1>
          <span className="status-badge-large" style={{ background: getStatusColor(booking.status) }}>
            {booking.status}
          </span>
        </div>

        <div className="booking-info-grid">
          <div className="info-section">
            <h3>Client</h3>
            <p>{booking.clientId.name}</p>
            <p className="contact-info">{booking.clientId.phone}</p>
          </div>
          
          <div className="info-section">
            <h3>Freelancer</h3>
            <p>{booking.freelancerId.name}</p>
            <p className="contact-info">{booking.freelancerId.phone}</p>
          </div>
          
          <div className="info-section">
            <h3>Package</h3>
            <p>{booking.pricingPackageId?.title || 'N/A'}</p>
            <p className="price">${booking.pricingPackageId?.price || 'N/A'}</p>
          </div>
          
          <div className="info-section">
            <h3>Created</h3>
            <p>{new Date(booking.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="brief-section">
          <h3>Project Brief</h3>
          <p>{booking.brief}</p>
        </div>

        <div className="actions-section">
          {isFreelancer && booking.status === 'requested' && (
            <>
              <button className="btn-primary" onClick={() => handleAction('accept')}>
                Accept Booking
              </button>
              <button className="btn-danger" onClick={() => handleAction('cancel')}>
                Decline
              </button>
            </>
          )}
          
          {isFreelancer && booking.status === 'accepted' && (
            <button className="btn-primary" onClick={() => handleAction('start')}>
              Start Work
            </button>
          )}
          
          {isFreelancer && booking.status === 'in-progress' && (
            <button className="btn-primary" onClick={() => handleAction('submit')}>
              Submit Work
            </button>
          )}
          
          {isClient && booking.status === 'submitted' && (
            <button className="btn-primary" onClick={() => handleAction('approve')}>
              Approve Work
            </button>
          )}
          
          {isClient && booking.status === 'completed' && (
            <>
              <button className="btn-primary" onClick={() => handleAction('markPaid')}>
                Mark as Paid
              </button>
              <button className="btn-secondary" onClick={() => setShowReviewModal(true)}>
                Leave Review
              </button>
            </>
          )}
          
          {booking.status === 'requested' && (
            <button className="btn-danger" onClick={() => handleAction('cancel')}>
              Cancel Booking
            </button>
          )}
        </div>

        <div className="timeline-section">
          <h3>Booking Timeline</h3>
          <div className="timeline">
            <div className="timeline-item active">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h4>Requested</h4>
                <p>{new Date(booking.createdAt).toLocaleString()}</p>
              </div>
            </div>
            {['accepted', 'in-progress', 'submitted', 'completed', 'paid'].includes(booking.status) && (
              <>
                <div className="timeline-item active">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <h4>Accepted</h4>
                  </div>
                </div>
                {['in-progress', 'submitted', 'completed', 'paid'].includes(booking.status) && (
                  <div className="timeline-item active">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <h4>In Progress</h4>
                    </div>
                  </div>
                )}
                {['submitted', 'completed', 'paid'].includes(booking.status) && (
                  <div className="timeline-item active">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <h4>Submitted</h4>
                    </div>
                  </div>
                )}
                {['completed', 'paid'].includes(booking.status) && (
                  <div className="timeline-item active">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <h4>Completed</h4>
                    </div>
                  </div>
                )}
                {booking.status === 'paid' && (
                  <div className="timeline-item active">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <h4>Paid</h4>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {showReviewModal && (
        <ReviewModal
          bookingId={id}
          freelancerId={booking.freelancerId._id}
          onClose={() => setShowReviewModal(false)}
        />
      )}
    </div>
  );
};

const ReviewModal = ({ bookingId, freelancerId, onClose }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await reviewAPI.create({ bookingId, rating, comment });
      alert('Review submitted successfully!');
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Leave a Review</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Rating (1-5)</label>
            <div className="rating-selector">
              {[1, 2, 3, 4, 5].map(num => (
                <span
                  key={num}
                  className={`star ${rating >= num ? 'selected' : ''}`}
                  onClick={() => setRating(num)}
                >
                  ⭐
                </span>
              ))}
            </div>
          </div>
          
          <div className="form-group">
            <label>Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="5"
              placeholder="Share your experience..."
            />
          </div>
          
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingDetail;
