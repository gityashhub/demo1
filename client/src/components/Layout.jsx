import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import '../styles/Layout.css';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-brand">FreelanceHub</Link>
          
          <div className="nav-links">
            {user && (
              <>
                {user.role === 'client' && (
                  <>
                    <Link to="/browse">Browse Freelancers</Link>
                    <Link to="/my-bookings">My Bookings</Link>
                  </>
                )}
                
                {user.role === 'freelancer' && (
                  <>
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/my-profile">My Profile</Link>
                    <Link to="/my-bookings">Bookings</Link>
                  </>
                )}
                
                <NotificationBell />
                
                <div className="user-menu">
                  <span className="user-name">{user.name}</span>
                  <button onClick={handleLogout} className="btn-logout">Logout</button>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
      
      <main className="main-content">{children}</main>
      
      <footer className="footer">
        <p>&copy; 2025 FreelanceHub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
