import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import "./Home.css";

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();

  // If user is authenticated, show dashboard
  if (isAuthenticated && user) {
    return (
      <div className="home-container">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">
                Welcome back, {user.name || user.email}! 👋
              </h1>
              <p className="dashboard-subtitle">
                You're successfully authenticated
              </p>
            </div>
            <button onClick={logout} className="btn btn-logout">
              Logout
            </button>
          </div>

          <div className="user-info-card">
            <h2>Your Profile</h2>
            <div className="user-details">
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Name:</strong> {user.name || "Not set"}
              </p>
              <p>
                <strong>Role:</strong> {user.role}
              </p>
              <p>
                <strong>Provider:</strong>{" "}
                {user.provider === "local"
                  ? "Email/Password"
                  : user.provider.charAt(0).toUpperCase() +
                    user.provider.slice(1)}
              </p>
              <p>
                <strong>Account created:</strong>{" "}
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <section className="features-section dashboard-features">
            <h2>Quick Access</h2>
            <div className="feature-grid">
              <div className="feature-card dashboard-card">
                <h3>⚡ Your Automations</h3>
                <p>Manage your services and scenarios</p>
                <Link to="/area" className="btn btn-feature">
                  Go to Area
                </Link>
              </div>
              {user.role === "admin" && (
                <div className="feature-card dashboard-card">
                  <h3>🛡️ Admin Panel</h3>
                  <p>Manage users and system settings</p>
                  <Link to="/admin" className="btn btn-feature">
                    Go to Admin
                  </Link>
                </div>
              )}
              <div className="feature-card dashboard-card">
                <h3>📊 Statistics</h3>
                <p>View your automation analytics</p>
                <button className="btn btn-feature" disabled>
                  Coming Soon
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
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
