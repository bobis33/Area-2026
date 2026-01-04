import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import './Home.css';

export default function Home() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // If user is not authenticated, show landing page
  return (
    <div className="home-container">
      <section className="hero-section">
        <nav className="hero-nav">
          <Link to="/" className="nav-logo">
            AREA
          </Link>
          <div className="nav-links">
            <Link to="/about" className="nav-link">
              About
            </Link>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/register" className="nav-link nav-link-primary">
              Sign Up
            </Link>
          </div>
        </nav>
        <h1 className="hero-title">AREA</h1>
        <p className="hero-subtitle">Automate Your Digital Life</p>
        <p className="hero-description">
          Connect your favorite services and create powerful automations.
          <br />
          When an action happens, trigger a reaction automatically.
        </p>

        <div className="cta-buttons">
          <Link to="/register" className="btn btn-primary">
            Get Started
          </Link>
        </div>
      </section>

      <section className="features-section">
        <h2>How It Works</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>📧 Connect Services</h3>
            <p>Link your email, social media, and productivity tools</p>
          </div>
          <div className="feature-card">
            <h3>⚡ Create Actions</h3>
            <p>Set triggers like "new email" or "new tweet"</p>
          </div>
          <div className="feature-card">
            <h3>🎯 Set Reactions</h3>
            <p>Define what happens: send notification, create task, etc.</p>
          </div>
        </div>
      </section>

      <section className="info-section">
        <h2>Why Choose AREA?</h2>
        <ul className="benefits-list">
          <li>✅ Easy to use - No coding required</li>
          <li>✅ Powerful integrations - Connect all your tools</li>
          <li>✅ Save time - Automate repetitive tasks</li>
          <li>✅ Stay organized - Everything in one place</li>
        </ul>
      </section>
    </div>
  );
}
