import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/Home/Home";
import About from "@/pages/About/About";
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import OAuthCallback from "@/pages/Auth/OAuthCallback";
import OAuthError from "@/pages/Auth/OAuthError";
import Area from "@/pages/Area/Area";
import Admin from "@/pages/Admin/Admin";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";

/**
 * Main application router
 * Defines all routes and navigation structure
 */
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/auth/success" element={<OAuthCallback />} />
        <Route path="/auth/error" element={<OAuthError />} />
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
    </BrowserRouter>
  );
}
