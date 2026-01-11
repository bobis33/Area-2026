import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '@/pages/Home/Home';
import Dashboard from '@/pages/Dashboard/Dashboard';
import Profile from '@/pages/Profile/Profile';
import About from '@/pages/About/About';
import Login from '@/pages/Auth/Login';
import Register from '@/pages/Auth/Register';
import OAuthCallback from '@/pages/Auth/OAuthCallback';
import OAuthError from '@/pages/Auth/OAuthError';
import Area from '@/pages/Area/Area';
import Admin from '@/pages/Admin/Admin';
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';
import Navigation from '@/components/Navigation/Navigation';

/**
 * Main application router
 * Defines all routes and navigation structure
 */
export default function AppRouter() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/auth/success" element={<OAuthCallback />} />
        <Route path="/auth/error" element={<OAuthError />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/area"
          element={
            <ProtectedRoute>
              <Area />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
