import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import About from "../pages/About/About";

/**
 * Main application router
 * Defines all routes and navigation structure
 */
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/about" replace />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/about" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
