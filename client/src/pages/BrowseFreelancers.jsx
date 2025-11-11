import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { freelancerAPI } from '../services/api';
import Navbar from '../components/Navbar';
import '../styles/Browse.css';

const BrowseFreelancers = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    specialization: '',
    minExperience: '',
    maxExperience: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchFreelancers();
  }, [filters]);

  const fetchFreelancers = async () => {
    try {
      const cleanFilters = {};
      Object.keys(filters).forEach(key => {
        if (filters[key]) cleanFilters[key] = filters[key];
      });
      
      const response = await freelancerAPI.getAll(cleanFilters);
      setFreelancers(response.data);
    } catch (error) {
      console.error('Error fetching freelancers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="browse-container"><p>Loading...</p></div>
      </>
    );
  }

  return (
    <>
    <Navbar />
    <div className="browse-container">
      <h1>Browse Freelancers</h1>
      
      <div className="filters-section">
        <input
          type="text"
          name="search"
          placeholder="Search by name, skills, or specialization..."
          value={filters.search}
          onChange={handleFilterChange}
          className="search-input"
        />
        
        <div className="filters-row">
          <input
            type="text"
            name="specialization"
            placeholder="Specialization (e.g., Web Developer)"
            value={filters.specialization}
            onChange={handleFilterChange}
          />
          
          <input
            type="number"
            name="minExperience"
            placeholder="Min Experience (years)"
            value={filters.minExperience}
            onChange={handleFilterChange}
          />
          
          <input
            type="number"
            name="maxExperience"
            placeholder="Max Experience (years)"
            value={filters.maxExperience}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      {freelancers.length === 0 ? (
        <div className="empty-state">
          <p>No freelancers found matching your criteria</p>
        </div>
      ) : (
        <div className="freelancers-grid">
          {freelancers.map((freelancer) => (
            <div
              key={freelancer._id}
              className="freelancer-card"
              onClick={() => navigate(`/freelancer/${freelancer.userId._id}`)}
            >
              <div className="freelancer-header">
                <div className="freelancer-avatar">
                  {freelancer.userId.name.charAt(0)}
                </div>
                <div>
                  <h3>{freelancer.userId.name}</h3>
                  <p className="specialization">{freelancer.specialization}</p>
                </div>
              </div>
              
              <p className="description">{freelancer.description?.substring(0, 150)}...</p>
              
              <div className="skills-list">
                {freelancer.skills.slice(0, 5).map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>
              
              <div className="freelancer-stats">
                <span>⭐ {freelancer.avgRating || 'N/A'}</span>
                <span>📝 {freelancer.reviewCount || 0} reviews</span>
                <span>💼 {freelancer.experience} years exp</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default BrowseFreelancers;
