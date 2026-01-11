import { useAuth } from '@/hooks/useAuth';
import { WebCard, WebButton } from '@/components/ui-web';
import './Profile.css';

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>Manage your account information</p>
      </div>

      <div className="profile-content">
        <WebCard>
          <div className="profile-section">
            <h2>Personal Information</h2>
            <div className="profile-info-grid">
              <div className="profile-info-item">
                <span className="profile-label">Name</span>
                <span className="profile-value">{user.name || 'Not set'}</span>
              </div>
              <div className="profile-info-item">
                <span className="profile-label">Email</span>
                <span className="profile-value">{user.email}</span>
              </div>
              <div className="profile-info-item">
                <span className="profile-label">Role</span>
                <span className="profile-value profile-role">{user.role}</span>
              </div>
              <div className="profile-info-item">
                <span className="profile-label">Authentication Provider</span>
                <span className="profile-value">
                  {user.provider === 'local'
                    ? 'Email/Password'
                    : user.provider.charAt(0).toUpperCase() +
                      user.provider.slice(1)}
                </span>
              </div>
              <div className="profile-info-item">
                <span className="profile-label">Account Created</span>
                <span className="profile-value">
                  {new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>
        </WebCard>

        <WebCard>
          <div className="profile-section">
            <h2>Account Actions</h2>
            <div className="profile-actions">
              <WebButton
                label="Sign Out"
                variant="secondary"
                onClick={logout}
              />
            </div>
          </div>
        </WebCard>
      </div>
    </div>
  );
}
