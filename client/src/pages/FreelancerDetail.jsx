import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { freelancerAPI, pricingAPI, projectAPI, reviewAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/FreelancerDetail.css';

const FreelancerDetail = () => {
  const { id } = useParams();
  const [freelancer, setFreelancer] = useState(null);
  const [packages, setPackages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const { user, isClient } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [freelancerRes, packagesRes, projectsRes, reviewsRes] = await Promise.all([
        freelancerAPI.getDetails(id),
        pricingAPI.getByFreelancer(id),
        projectAPI.getByFreelancer(id),
        reviewAPI.getByFreelancer(id)
      ]);
      
      setFreelancer(freelancerRes.data);
      setPackages(packagesRes.data);
      setProjects(projectsRes.data);
      setReviews(reviewsRes.data.reviews || reviewsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = (pkg) => {
    if (!isClient) {
      alert('Only clients can create bookings');
      return;
    }
    setSelectedPackage(pkg);
    setShowBookingModal(true);
  };

  if (loading) {
    return <div className="detail-container"><p>Loading...</p></div>;
  }

  if (!freelancer) {
    return <div className="detail-container"><p>Freelancer not found</p></div>;
  }

  const { profile, avgRating, reviewCount } = freelancer;

  return (
    <div className="detail-container">
      <div className="profile-header">
        <div className="profile-avatar-large">
          {profile.userId.name.charAt(0)}
        </div>
        <div className="profile-info">
          <h1>{profile.userId.name}</h1>
          <p className="specialization">{profile.specialization}</p>
          <div className="rating-info">
            <span>⭐ {avgRating} ({reviewCount} reviews)</span>
            <span>💼 {profile.experience} years experience</span>
          </div>
        </div>
      </div>

      <div className="content-grid">
        <div className="main-content">
          <section className="section">
            <h2>About</h2>
            <p>{profile.description || 'No description provided'}</p>
          </section>

          <section className="section">
            <h2>Skills</h2>
            <div className="skills-grid">
              {profile.skills.map((skill, index) => (
                <span key={index} className="skill-badge">{skill}</span>
              ))}
            </div>
          </section>

          <section className="section">
            <h2>Portfolio</h2>
            {projects.length === 0 ? (
              <p className="empty-text">No portfolio items yet</p>
            ) : (
              <div className="projects-grid">
                {projects.map((project) => (
                  <div key={project._id} className="project-card">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="tags">
                      {project.tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="section">
            <h2>Reviews</h2>
            {reviews.length === 0 ? (
              <p className="empty-text">No reviews yet</p>
            ) : (
              <div className="reviews-list">
                {reviews.map((review) => (
                  <div key={review._id} className="review-card">
                    <div className="review-header">
                      <span className="reviewer-name">{review.clientId?.name || 'Anonymous'}</span>
                      <span className="review-rating">⭐ {review.rating}/5</span>
                    </div>
                    <p>{review.comment}</p>
                    <span className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="sidebar">
          <h2>Packages</h2>
          {packages.length === 0 ? (
            <p className="empty-text">No packages available</p>
          ) : (
            packages.map((pkg) => (
              <div key={pkg._id} className="package-card">
                <h3>{pkg.title}</h3>
                <p className="package-price">${pkg.price}</p>
                <p className="package-delivery">📦 {pkg.deliveryDays} days delivery</p>
                <p>{pkg.description}</p>
                {isClient && (
                  <button className="btn-primary" onClick={() => handleBooking(pkg)}>
                    Book Now
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {showBookingModal && (
        <BookingModal
          package={selectedPackage}
          freelancerId={id}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </div>
  );
};

const BookingModal = ({ package: pkg, freelancerId, onClose }) => {
  const [title, setTitle] = useState(pkg.title);
  const [brief, setBrief] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await import('../services/api').then(({ bookingAPI }) =>
        bookingAPI.create({
          freelancerId,
          pricingPackageId: pkg._id,
          title,
          brief
        })
      );
      alert('Booking request sent successfully!');
      navigate('/my-bookings');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Create Booking</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Project Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Project Brief</label>
            <textarea
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              required
              rows="5"
              placeholder="Describe your project requirements in detail..."
            />
          </div>
          
          <p className="package-info">
            Package: {pkg.title} - ${pkg.price} ({pkg.deliveryDays} days)
          </p>
          
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FreelancerDetail;
