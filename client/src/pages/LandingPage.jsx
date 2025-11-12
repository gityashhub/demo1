import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';

const LandingPage = () => {
  const categories = [
    { name: 'Web Development', icon: '💻', count: '2,453' },
    { name: 'Graphic Design', icon: '🎨', count: '1,892' },
    { name: 'Digital Marketing', icon: '📱', count: '1,234' },
    { name: 'Content Writing', icon: '✍️', count: '987' },
    { name: 'Video Editing', icon: '🎬', count: '756' },
    { name: 'UI/UX Design', icon: '🖌️', count: '654' }
  ];

  const featuredFreelancers = [
    {
      name: 'Sarah Johnson',
      role: 'Senior Web Developer',
      rating: 4.9,
      reviews: 128,
      hourlyRate: '$85',
      skills: ['React', 'Node.js', 'TypeScript'],
      avatar: '👩‍💻'
    },
    {
      name: 'Michael Chen',
      role: 'UI/UX Designer',
      rating: 5.0,
      reviews: 94,
      hourlyRate: '$75',
      skills: ['Figma', 'Adobe XD', 'Prototyping'],
      avatar: '👨‍🎨'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Content Strategist',
      rating: 4.8,
      reviews: 156,
      hourlyRate: '$65',
      skills: ['SEO', 'Copywriting', 'Marketing'],
      avatar: '👩‍💼'
    }
  ];

  const testimonials = [
    {
      text: 'FreelanceHub made it incredibly easy to find the perfect developer for our project. The quality of talent is outstanding!',
      author: 'David Thompson',
      role: 'CEO, TechStart Inc.',
      avatar: '👨‍💼'
    },
    {
      text: 'As a freelancer, this platform has connected me with amazing clients and helped me grow my business significantly.',
      author: 'Lisa Martinez',
      role: 'Freelance Designer',
      avatar: '👩‍🎨'
    },
    {
      text: 'The process is seamless, and the support is excellent. I found three talented freelancers in just one week!',
      author: 'James Wilson',
      role: 'Marketing Director',
      avatar: '👨‍💻'
    }
  ];

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="container">
          <div className="nav-content">
            <Link to="/" className="brand">FreelanceHub</Link>
            <div className="nav-actions">
              <Link to="/login" className="btn btn-secondary">Log In</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="container">
          <div className="hero-content fade-in">
            <h1 className="hero-title">
              Find the Perfect <span className="highlight">Freelancer</span> for Your Project
            </h1>
            <p className="hero-subtitle">
              Connect with top-rated professionals in web development, design, marketing, and more. 
              Build your dream team today.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary btn-lg">Get Started</Link>
              <Link to="/browse" className="btn btn-secondary btn-lg">Browse Talent</Link>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-number">10,000+</div>
                <div className="stat-label">Freelancers</div>
              </div>
              <div className="stat">
                <div className="stat-number">5,000+</div>
                <div className="stat-label">Projects Completed</div>
              </div>
              <div className="stat">
                <div className="stat-number">98%</div>
                <div className="stat-label">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="categories-section section">
        <div className="container">
          <h2 className="section-title">Browse by Category</h2>
          <p className="section-subtitle">
            Explore thousands of talented professionals across various categories
          </p>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <div key={index} className="category-card card">
                <div className="category-icon">{category.icon}</div>
                <h3 className="category-name">{category.name}</h3>
                <p className="category-count">{category.count} freelancers</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="featured-section section">
        <div className="container">
          <h2 className="section-title">Featured Freelancers</h2>
          <p className="section-subtitle">
            Meet some of our top-rated professionals ready to bring your vision to life
          </p>
          <div className="freelancers-grid">
            {featuredFreelancers.map((freelancer, index) => (
              <div key={index} className="freelancer-card card">
                <div className="freelancer-avatar">{freelancer.avatar}</div>
                <h3 className="freelancer-name">{freelancer.name}</h3>
                <p className="freelancer-role">{freelancer.role}</p>
                <div className="freelancer-rating">
                  <span className="rating-stars">⭐ {freelancer.rating}</span>
                  <span className="rating-count">({freelancer.reviews} reviews)</span>
                </div>
                <div className="freelancer-rate">{freelancer.hourlyRate}/hour</div>
                <div className="freelancer-skills">
                  {freelancer.skills.map((skill, idx) => (
                    <span key={idx} className="skill-badge">{skill}</span>
                  ))}
                </div>
                <Link to="/register" className="btn btn-primary btn-full">View Profile</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="testimonials-section section">
        <div className="container">
          <h2 className="section-title">What Our Users Say</h2>
          <p className="section-subtitle">
            Join thousands of satisfied clients and freelancers
          </p>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card card">
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.avatar}</div>
                  <div className="author-info">
                    <div className="author-name">{testimonial.author}</div>
                    <div className="author-role">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Get Started?</h2>
            <p className="cta-subtitle">
              Join FreelanceHub today and connect with talented professionals or find your next opportunity
            </p>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-primary btn-lg">Sign Up Now</Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>FreelanceHub</h4>
              <p>Connecting talent with opportunity</p>
            </div>
            <div className="footer-section">
              <h5>For Clients</h5>
              <a href="#browse">Browse Freelancers</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#pricing">Pricing</a>
            </div>
            <div className="footer-section">
              <h5>For Freelancers</h5>
              <a href="#find-work">Find Work</a>
              <a href="#resources">Resources</a>
              <a href="#success-stories">Success Stories</a>
            </div>
            <div className="footer-section">
              <h5>Company</h5>
              <a href="#about">About Us</a>
              <a href="#contact">Contact</a>
              <a href="#support">Support</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 FreelanceHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
