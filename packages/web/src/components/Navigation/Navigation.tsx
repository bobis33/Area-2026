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
import { useTranslation } from '@/contexts/I18nContext';
import { ThemeToggle } from '../ThemeToggle';
import LanguageSelector from '../LanguageSelector';
import styles from './Navigation.module.css';

export default function Navigation() {
  const { user, logout, isAuthenticated } = useAuth();
  const t = useTranslation();
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
            <span>{t('navigation.dashboard')}</span>
          </Link>
          <Link
            to="/area"
            className={`${styles.navLink} ${isActive('/area') ? styles.active : ''}`}
          >
            <FiActivity />
            <span>{t('navigation.area')}</span>
          </Link>
          <Link
            to="/services"
            className={`${styles.navLink} ${isActive('/services') ? styles.active : ''}`}
          >
            <FiSettings />
            <span>{t('navigation.services')}</span>
          </Link>
          <Link
            to="/profile"
            className={`${styles.navLink} ${isActive('/profile') ? styles.active : ''}`}
          >
            <FiUser />
            <span>{t('navigation.profile')}</span>
          </Link>
          <Link
            to="/about"
            className={`${styles.navLink} ${isActive('/about') ? styles.active : ''}`}
          >
            <FiInfo />
            <span>{t('navigation.about')}</span>
          </Link>
          {user.role === 'ADMIN' && (
            <Link
              to="/admin"
              className={`${styles.navLink} ${isActive('/admin') ? styles.active : ''}`}
            >
              <FiShield />
              <span>{t('navigation.admin')}</span>
            </Link>
          )}
          <div className={styles.navDivider}></div>
          <span className={styles.navUser}>{user.email}</span>
          <LanguageSelector />
          <ThemeToggle />
          <button onClick={logout} className={styles.btnLogout}>
            <FiLogOut />
            <span>{t('navigation.logout')}</span>
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
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>

        <div className={styles.sidebarLinks}>
          <Link
            to="/dashboard"
            className={`${styles.sidebarLink} ${isActive('/dashboard') ? styles.active : ''}`}
            onClick={closeMobileMenu}
          >
            <FiHome />
            <span>{t('navigation.dashboard')}</span>
          </Link>
          <Link
            to="/area"
            className={`${styles.sidebarLink} ${isActive('/area') ? styles.active : ''}`}
            onClick={closeMobileMenu}
          >
            <FiActivity />
            <span>{t('navigation.area')}</span>
          </Link>
          <Link
            to="/services"
            className={`${styles.sidebarLink} ${isActive('/services') ? styles.active : ''}`}
            onClick={closeMobileMenu}
          >
            <FiSettings />
            <span>{t('navigation.services')}</span>
          </Link>
          <Link
            to="/profile"
            className={`${styles.sidebarLink} ${isActive('/profile') ? styles.active : ''}`}
            onClick={closeMobileMenu}
          >
            <FiUser />
            <span>{t('navigation.profile')}</span>
          </Link>
          <Link
            to="/about"
            className={`${styles.sidebarLink} ${isActive('/about') ? styles.active : ''}`}
            onClick={closeMobileMenu}
          >
            <FiInfo />
            <span>{t('navigation.about')}</span>
          </Link>
          {user.role === 'ADMIN' && (
            <Link
              to="/admin"
              className={`${styles.sidebarLink} ${isActive('/admin') ? styles.active : ''}`}
              onClick={closeMobileMenu}
            >
              <FiShield />
              <span>{t('navigation.admin')}</span>
            </Link>
          )}
        </div>

        <div className={styles.sidebarFooter}>
          <button onClick={handleLogout} className={styles.btnLogoutSidebar}>
            <FiLogOut />
            <span>{t('navigation.logout')}</span>
          </button>
        </div>
      </div>
    </>
  );
}
