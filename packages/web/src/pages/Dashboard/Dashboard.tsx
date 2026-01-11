import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { WebCard } from '@/components/ui-web';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, {user.name || user.email}!</h1>
        <p className="dashboard-subtitle">
          Manage your automations and account from here
        </p>
      </div>

      <div className="dashboard-grid">
        <WebCard>
          <Link to="/area" className="dashboard-card-link">
            <h2>My Automations</h2>
            <p>
              Create and manage your action-reaction automations. Connect
              services and build powerful workflows.
            </p>
            <div className="dashboard-card-footer">
              <span className="dashboard-card-arrow">→</span>
            </div>
          </Link>
        </WebCard>

        <WebCard>
          <Link to="/profile" className="dashboard-card-link">
            <h2>My Profile</h2>
            <p>
              View and update your personal information, security settings, and
              account preferences.
            </p>
            <div className="dashboard-card-footer">
              <span className="dashboard-card-arrow">→</span>
            </div>
          </Link>
        </WebCard>

        <WebCard>
          <Link to="/about" className="dashboard-card-link">
            <h2>About AREA</h2>
            <p>
              Discover available services, actions, and reactions. Learn how to
              make the most of AREA.
            </p>
            <div className="dashboard-card-footer">
              <span className="dashboard-card-arrow">→</span>
            </div>
          </Link>
        </WebCard>
      </div>

      <div className="dashboard-quick-info">
        <WebCard>
          <div className="quick-info-content">
            <h3>Account Information</h3>
            <div className="quick-info-grid">
              <div className="quick-info-item">
                <div className="quick-info-details">
                  <span className="quick-info-label">Email</span>
                  <span className="quick-info-value">{user.email}</span>
                </div>
              </div>
              <div className="quick-info-item">
                <div className="quick-info-details">
                  <span className="quick-info-label">Role</span>
                  <span className="quick-info-value quick-info-role">
                    {user.role}
                  </span>
                </div>
              </div>
              <div className="quick-info-item">
                <div className="quick-info-details">
                  <span className="quick-info-label">Provider</span>
                  <span className="quick-info-value">
                    {user.provider === 'local'
                      ? 'Email/Password'
                      : user.provider.charAt(0).toUpperCase() +
                        user.provider.slice(1)}
                  </span>
                </div>
              </div>
              <div className="quick-info-item">
                <div className="quick-info-details">
                  <span className="quick-info-label">Member since</span>
                  <span className="quick-info-value">
                    {new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </WebCard>
      </div>
    </div>
  );
}
