import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/Home/Home";
import About from "@/pages/About/About";
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import OAuthCallback from "@/pages/Auth/OAuthCallback";
import OAuthError from "@/pages/Auth/OAuthError";

/**
 * Main application router
 * Defines all routes and navigation structure
 */
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/success" element={<OAuthCallback />} />
        <Route path="/auth/error" element={<OAuthError />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
