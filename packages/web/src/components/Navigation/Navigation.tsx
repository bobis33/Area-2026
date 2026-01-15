import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiActivity,
  FiSettings,
  FiUser,
  FiInfo,
  FiShield,
  FiLogOut,
  FiMenu,
  FiX,
} from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { ThemeToggle } from '../ThemeToggle';
import styles from './Navigation.module.css';

export default function Navigation() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    console.log('Mobile menu state changed:', isMobileMenuOpen);
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      console.log('Body scroll locked');
    } else {
      document.body.style.overflow = '';
      console.log('Body scroll unlocked');
    }

    // Cleanup
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const isActive = (path: string) => location.pathname === path;

  const toggleMobileMenu = () => {
    console.log('Toggle mobile menu clicked. Current state:', isMobileMenuOpen);
    setIsMobileMenuOpen(!isMobileMenuOpen);
    console.log('New state will be:', !isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    console.log('Closing mobile menu');
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    console.log('Logout clicked from mobile menu');
    closeMobileMenu();
    logout();
  };

  return (
    <>
      <nav className={styles.navigation}>
        <Link to="/dashboard" className={styles.navLogo}>
          <img src="/logo.svg" alt="AREA Logo" className={styles.navLogoImg} />
          <span className={styles.navLogoText}>AREA</span>
        </Link>

        {/* Desktop Navigation */}
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

        {/* Mobile Hamburger Button */}
        <button
          className={styles.hamburger}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          data-menu-open={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </nav>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`${styles.overlay} ${isMobileMenuOpen ? styles.show : ''}`}
        onClick={closeMobileMenu}
        data-overlay-visible={isMobileMenuOpen}
        style={{ pointerEvents: isMobileMenuOpen ? 'auto' : 'none' }}
      ></div>

      {/* Mobile Sidebar */}
      <div
        className={`${styles.sidebar} ${isMobileMenuOpen ? styles.sidebarOpen : ''}`}
        data-sidebar-open={isMobileMenuOpen}
      >
        <div className={styles.sidebarHeader}>
          <span className={styles.sidebarUser}>{user.email}</span>
          <ThemeToggle />
        </div>

        <div className={styles.sidebarLinks}>
          <Link
            to="/dashboard"
            className={`${styles.sidebarLink} ${isActive('/dashboard') ? styles.active : ''}`}
            onClick={closeMobileMenu}
          >
            <FiHome />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/area"
            className={`${styles.sidebarLink} ${isActive('/area') ? styles.active : ''}`}
            onClick={closeMobileMenu}
          >
            <FiActivity />
            <span>Automations</span>
          </Link>
          <Link
            to="/services"
            className={`${styles.sidebarLink} ${isActive('/services') ? styles.active : ''}`}
            onClick={closeMobileMenu}
          >
            <FiSettings />
            <span>Services</span>
          </Link>
          <Link
            to="/profile"
            className={`${styles.sidebarLink} ${isActive('/profile') ? styles.active : ''}`}
            onClick={closeMobileMenu}
          >
            <FiUser />
            <span>Profile</span>
          </Link>
          <Link
            to="/about"
            className={`${styles.sidebarLink} ${isActive('/about') ? styles.active : ''}`}
            onClick={closeMobileMenu}
          >
            <FiInfo />
            <span>About</span>
          </Link>
          {user.email === 'areaserveur825@gmail.com' && (
            <Link
              to="/admin"
              className={`${styles.sidebarLink} ${isActive('/admin') ? styles.active : ''}`}
              onClick={closeMobileMenu}
            >
              <FiShield />
              <span>Admin</span>
            </Link>
          )}
        </div>

        <div className={styles.sidebarFooter}>
          <button onClick={handleLogout} className={styles.btnLogoutSidebar}>
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
