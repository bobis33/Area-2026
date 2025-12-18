import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { get } from '@/services/api';
import type { AboutResponse } from '@/types';
import { FaArrowLeft } from 'react-icons/fa';
import './About.css';

export default function About() {
  const [aboutData, setAboutData] = useState<AboutResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await get<AboutResponse>('/about.json');
        setAboutData(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to fetch server information',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (loading) {
    return (
      <div className="about-container">
        <div className="loading">Loading server information...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="about-container">
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!aboutData) {
    return (
      <div className="about-container">
        <div className="error">No data available</div>
      </div>
    );
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0) parts.push(`${secs}s`);

    return parts.join(' ') || '0s';
  };

  return (
    <div className="about-container">
      <Link to="/" className="back-to-home">
        <FaArrowLeft /> Back to Home
      </Link>
      <h1>About AREA Server</h1>

      <section className="about-section">
        <h2>Client Information</h2>
        <div className="info-card">
          <div className="info-row">
            <span className="info-label">Host:</span>
            <span className="info-value">{aboutData.client.host}</span>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>Server Information</h2>
        <div className="info-card">
          <div className="info-row">
            <span className="info-label">Current Time:</span>
            <span className="info-value">
              {formatTimestamp(aboutData.server.current_time)}
            </span>
          </div>
          {aboutData.server.uptime !== undefined && (
            <div className="info-row">
              <span className="info-label">Uptime:</span>
              <span className="info-value">
                {formatUptime(aboutData.server.uptime)}
              </span>
            </div>
          )}
          {aboutData.server.version && (
            <div className="info-row">
              <span className="info-label">Version:</span>
              <span className="info-value">{aboutData.server.version}</span>
            </div>
          )}
        </div>
      </section>

      <section className="about-section">
        <h2>Available Services</h2>
        {aboutData.server.services.length === 0 ||
        !aboutData.server.services[0].name ? (
          <div className="info-card">
            <p className="no-services">No services configured yet</p>
          </div>
        ) : (
          <div className="services-grid">
            {aboutData.server.services.map((service, index) => (
              <div key={index} className="service-card">
                <h3>{service.name}</h3>

                <div className="service-section">
                  <h4>Actions ({service.actions.length})</h4>
                  {service.actions.length === 0 || !service.actions[0].name ? (
                    <p className="empty-list">No actions available</p>
                  ) : (
                    <ul className="service-list">
                      {service.actions.map((action, actionIndex) => (
                        <li key={actionIndex}>
                          <strong>{action.name}</strong>
                          {action.description && (
                            <span> - {action.description}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="service-section">
                  <h4>Reactions ({service.reactions.length})</h4>
                  {service.reactions.length === 0 ||
                  !service.reactions[0].name ? (
                    <p className="empty-list">No reactions available</p>
                  ) : (
                    <ul className="service-list">
                      {service.reactions.map((reaction, reactionIndex) => (
                        <li key={reactionIndex}>
                          <strong>{reaction.name}</strong>
                          {reaction.description && (
                            <span> - {reaction.description}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
