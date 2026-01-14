import { Link, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiActivity,
  FiSettings,
  FiUser,
  FiInfo,
  FiShield,
  FiLogOut,
} from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { ThemeToggle } from '../ThemeToggle';
import styles from './Navigation.module.css';

export default function Navigation() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return null;
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={styles.navigation}>
      <Link to="/dashboard" className={styles.navLogo}>
        <img src="/logo.svg" alt="AREA Logo" className={styles.navLogoImg} />
        <span className={styles.navLogoText}>AREA</span>
      </Link>
      <div className={styles.navLinks}>
        <Link
          to="/dashboard"
          className={`${styles.navLink} ${isActive('/dashboard') ? styles.active : ''}`}
        >
          <FiHome />
          <span>Dashboard</span>
        </Link>
        <Link
          to="/area"
          className={`${styles.navLink} ${isActive('/area') ? styles.active : ''}`}
        >
          <FiActivity />
          <span>Automations</span>
        </Link>
        <Link
          to="/services"
          className={`${styles.navLink} ${isActive('/services') ? styles.active : ''}`}
        >
          <FiSettings />
          <span>Services</span>
        </Link>
        <Link
          to="/profile"
          className={`${styles.navLink} ${isActive('/profile') ? styles.active : ''}`}
        >
          <FiUser />
          <span>Profile</span>
        </Link>
        <Link
          to="/about"
          className={`${styles.navLink} ${isActive('/about') ? styles.active : ''}`}
        >
          <FiInfo />
          <span>About</span>
        </Link>
        {user.email === 'areaserveur825@gmail.com' && (
          <Link
            to="/admin"
            className={`${styles.navLink} ${isActive('/admin') ? styles.active : ''}`}
          >
            <FiShield />
            <span>Admin</span>
          </Link>
        )}
        <div className={styles.navDivider}></div>
        <span className={styles.navUser}>{user.email}</span>
        <ThemeToggle />
        <button onClick={logout} className={styles.btnLogout}>
          <FiLogOut />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}
