import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">
      <section className="hero-section">
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
          <Link to="/about" className="btn btn-secondary">
            Learn More
          </Link>
        </div>
      </section>

      <section className="features-section">
        <div className="feature-card">
          <h3>📧 Connect Services</h3>
        </div>
        <div className="feature-card">
          <h3>⚡ Create Actions</h3>
        </div>
        <div className="feature-card">
          <h3>🎯 Set Reactions</h3>
        </div>
      </section>
    </div>
  );
}
