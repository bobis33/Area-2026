import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import './Area.css';

interface Service {
  id: string;
  name: string;
  serviceKey: 'discord' | 'github' | 'google' | 'spotify';
  connected: boolean;
}

interface Automation {
  id: string;
  name: string;
  action: string;
  reaction: string;
  actionService: string;
  reactionService: string;
  status: 'active' | 'inactive';
}

const mockServices: Service[] = [
  { id: '1', name: 'Discord', serviceKey: 'discord', connected: true },
  { id: '2', name: 'GitHub', serviceKey: 'github', connected: true },
  { id: '3', name: 'Google', serviceKey: 'google', connected: false },
  { id: '4', name: 'Spotify', serviceKey: 'spotify', connected: false },
];

const mockAutomations: Automation[] = [
  {
    id: '1',
    name: 'GitHub → Discord',
    action: 'When I push to GitHub',
    reaction: 'Send a message on Discord',
    actionService: 'GitHub',
    reactionService: 'Discord',
    status: 'active',
  },
  {
    id: '2',
    name: 'Follower → Sheets',
    action: 'When I get a new follower',
    reaction: 'Add a row in Google Sheets',
    actionService: 'GitHub',
    reactionService: 'Google',
    status: 'inactive',
  },
];

export default function Area() {
  const { user, logout } = useAuth();
  const [services, setServices] = useState<Service[]>(mockServices);
  const [automations, setAutomations] = useState<Automation[]>(mockAutomations);
  const [selectedAutomation, setSelectedAutomation] = useState<Automation | null>(null);

  useEffect(() => {
    // TODO: Fetch real data from API
    // fetchServices();
    // fetchAutomations();
  }, []);

  const getServiceIcon = (serviceKey: string): string => {
    const icons: Record<string, string> = {
      discord: '💬',
      github: '🐙',
      google: '🔍',
      spotify: '🎵',
    };
    return icons[serviceKey] || '📱';
  };

  return (
    <div className="area-container">
      <nav className="area-nav">
        <Link to="/" className="nav-logo">
          AREA
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/area" className="nav-link nav-link-active">
            Area
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="nav-link">
              Admin
            </Link>
          )}
          <button onClick={logout} className="btn btn-logout-nav">
            Logout
          </button>
        </div>
      </nav>

      <div className="area-content">
        <header className="area-header">
          <h1 className="area-title">Your Automations</h1>
          <p className="area-subtitle">
            Services, actions & reactions connected to your account.
          </p>
        </header>

        {/* Connected Services Section */}
        <section className="area-section">
          <h2 className="section-title">Connected Services</h2>
          <div className="services-grid">
            {services.map((service) => (
              <div key={service.id} className="service-card">
                <div className="service-header">
                  <div className="service-icon">
                    {getServiceIcon(service.serviceKey)}
                  </div>
                  <h3 className="service-name">{service.name}</h3>
                </div>
                <div className="service-footer">
                  <span
                    className={`status-badge ${service.connected ? 'status-connected' : 'status-disconnected'}`}
                  >
                    <span className="status-dot"></span>
                    {service.connected ? 'Connected' : 'Not connected'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Automations Section */}
        <section className="area-section">
          <h2 className="section-title">Scenarios (Actions → Reactions)</h2>
          <div className="automations-list">
            {automations.map((automation) => (
              <div
                key={automation.id}
                className="automation-card"
                onClick={() => setSelectedAutomation(automation)}
              >
                <div className="automation-header">
                  <h3 className="automation-name">{automation.name}</h3>
                  <span
                    className={`status-badge ${automation.status === 'active' ? 'status-active' : 'status-inactive'}`}
                  >
                    {automation.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="automation-flow">
                  <div className="flow-item">
                    <span className="flow-label">Action</span>
                    <p className="flow-text">{automation.action}</p>
                  </div>
                  <div className="flow-arrow">→</div>
                  <div className="flow-item">
                    <span className="flow-label">Reaction</span>
                    <p className="flow-text">{automation.reaction}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Modal for automation details */}
      {selectedAutomation && (
        <div className="modal-overlay" onClick={() => setSelectedAutomation(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{selectedAutomation.name}</h2>
              <button
                className="modal-close"
                onClick={() => setSelectedAutomation(null)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-section">
                <label className="modal-label">Action Service</label>
                <p className="modal-value">{selectedAutomation.actionService}</p>
              </div>
              <div className="modal-section">
                <label className="modal-label">Action Description</label>
                <p className="modal-value">{selectedAutomation.action}</p>
              </div>
              <div className="modal-section">
                <label className="modal-label">Reaction Service</label>
                <p className="modal-value">{selectedAutomation.reactionService}</p>
              </div>
              <div className="modal-section">
                <label className="modal-label">Reaction Description</label>
                <p className="modal-value">{selectedAutomation.reaction}</p>
              </div>
              <div className="modal-section">
                <label className="modal-label">Status</label>
                <span
                  className={`status-badge ${selectedAutomation.status === 'active' ? 'status-active' : 'status-inactive'}`}
                >
                  {selectedAutomation.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
