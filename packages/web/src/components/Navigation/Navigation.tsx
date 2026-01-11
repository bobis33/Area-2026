import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import './Navigation.css';

export default function Navigation() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return null;
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navigation">
      <Link to="/dashboard" className="nav-logo">
        <img src="/logo.svg" alt="AREA Logo" className="nav-logo-img" />
      </Link>
      <div className="nav-links">
        <Link
          to="/dashboard"
          className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
        >
          Dashboard
        </Link>
        <Link
          to="/area"
          className={`nav-link ${isActive('/area') ? 'active' : ''}`}
        >
          Automations
        </Link>
        <Link
          to="/services"
          className={`nav-link ${isActive('/services') ? 'active' : ''}`}
        >
          Services
        </Link>
        <Link
          to="/profile"
          className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
        >
          Profile
        </Link>
        <Link
          to="/about"
          className={`nav-link ${isActive('/about') ? 'active' : ''}`}
        >
          About
        </Link>
        {user.email === 'areaserveur825@gmail.com' && (
          <Link
            to="/admin"
            className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
          >
            Admin
          </Link>
        )}
        <span className="nav-user">{user.email}</span>
        <button onClick={logout} className="btn-logout-nav">
          Logout
        </button>
      </div>
    </nav>
  );
}
