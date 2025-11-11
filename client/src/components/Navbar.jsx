import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import '../styles/Layout.css';

const Navbar = () => {
  const { user, logout, isClient, isFreelancer } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const dashboardPath = '/';

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to={dashboardPath} className="nav-logo">
          FreelanceHub
        </Link>
        
        <div className="nav-menu">
          <Link to={dashboardPath} className="nav-link">Dashboard</Link>
          {isClient && <Link to="/browse" className="nav-link">Browse Freelancers</Link>}
          <NotificationBell />
          <div className="nav-user">
            <span>{user?.name}</span>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
