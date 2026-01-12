import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { get, put, del } from '@/services/api.ts';
import {
  FaUserShield,
  FaUser,
  FaTrash,
  FaSync,
  FaChevronUp,
  FaChevronDown,
} from 'react-icons/fa';
import './Admin.css';

interface User {
  id: number;
  email: string;
  name?: string;
  role: string;
  provider: string;
  created_at: string;
}

export default function Admin() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

  // Check if user is admin (specific email)
  if (user?.email !== 'areaserveur825@gmail.com') {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const usersData = await get<User[]>('/users', token);
      setUsers(usersData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load users';
      setError(errorMessage);
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteUser = async (userId: number) => {
    if (
      !window.confirm('Are you sure you want to promote this user to admin?')
    ) {
      return;
    }

    try {
      setUpdatingUserId(userId);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      await put(`/users/${userId}`, { role: 'admin' }, token);
      await loadUsers();
      alert('User promoted to admin successfully');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to promote user';
      alert(`Error: ${errorMessage}`);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleDemoteUser = async (userId: number) => {
    if (
      !window.confirm('Are you sure you want to demote this admin to user?')
    ) {
      return;
    }

    try {
      setUpdatingUserId(userId);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      await put(`/users/${userId}`, { role: 'user' }, token);
      await loadUsers();
      alert('Admin demoted to user successfully');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to demote user';
      alert(`Error: ${errorMessage}`);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleRevokeUser = async (userId: number) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this user? This action cannot be undone.',
      )
    ) {
      return;
    }

    try {
      setDeletingUserId(userId);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      await del(`/users/${userId}`, token);
      await loadUsers();
      alert('User deleted successfully');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete user';
      alert(`Error: ${errorMessage}`);
    } finally {
      setDeletingUserId(null);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-content">
        <header className="admin-header">
          <h1 className="admin-title">Admin</h1>
          <p className="admin-subtitle">Manage users and their roles</p>
        </header>

        {/* User Management Section */}
        <section className="admin-section">
          <div className="section-header">
            <h2 className="section-title">Members & roles</h2>
            <button
              onClick={loadUsers}
              className="btn btn-refresh"
              disabled={loading}
            >
              <FaSync className={loading ? 'spin-icon' : ''} /> Refresh
            </button>
          </div>

          {loading && (
            <div className="loading-container">
              <div className="spinner"></div>
              <p className="loading-text">Loading users...</p>
            </div>
          )}

          {error && !loading && (
            <div className="error-container">
              <p className="error-text">{error}</p>
              <button onClick={loadUsers} className="btn btn-retry">
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && users.length === 0 && (
            <div className="empty-container">
              <p className="empty-text">No users found</p>
            </div>
          )}

          {!loading && !error && users.length > 0 && (
            <div className="users-table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Provider</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.email}</td>
                      <td>{u.name || '-'}</td>
                      <td>
                        <span className={`role-badge role-${u.role}`}>
                          {u.role === 'admin' ? (
                            <>
                              <FaUserShield className="role-icon" /> admin
                            </>
                          ) : (
                            <>
                              <FaUser className="role-icon" /> user
                            </>
                          )}
                        </span>
                      </td>
                      <td className="provider-cell">{u.provider}</td>
                      <td className="date-cell">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="action-buttons">
                          {u.role === 'user' ? (
                            <button
                              onClick={() => handlePromoteUser(u.id)}
                              className="btn btn-action btn-promote"
                              disabled={
                                updatingUserId === u.id || u.id === user?.id
                              }
                              title="Promote to admin"
                            >
                              {updatingUserId === u.id ? (
                                <span className="btn-loading">...</span>
                              ) : (
                                <>
                                  <FaChevronUp /> Promote
                                </>
                              )}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDemoteUser(u.id)}
                              className="btn btn-action btn-demote"
                              disabled={
                                updatingUserId === u.id || u.id === user?.id
                              }
                              title="Demote to user"
                            >
                              {updatingUserId === u.id ? (
                                <span className="btn-loading">...</span>
                              ) : (
                                <>
                                  <FaChevronDown /> Demote
                                </>
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => handleRevokeUser(u.id)}
                            className="btn btn-action btn-delete"
                            disabled={
                              deletingUserId === u.id || u.id === user?.id
                            }
                            title="Delete user"
                          >
                            {deletingUserId === u.id ? (
                              <span className="btn-loading">...</span>
                            ) : (
                              <>
                                <FaTrash /> Revoke
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
