import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import type { RegisterData } from "@/types";
import { FaArrowLeft } from "react-icons/fa";
import { WebInput, WebButton } from "@/components/ui-web";
import "./Register.css";

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

export default function Register() {
  const { register, loading, error } = useAuth();
  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [validationError, setValidationError] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError("");

    if (!formData.email || !formData.password || !formData.name) {
      setValidationError("Email, name and password are required");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      setValidationError("Password must be at least 6 characters long");
      return;
    }

    try {
      const requestData: RegisterData = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
      };
      await register(requestData);
    } catch (err) {
      //Handled by useAuth hook
    }
  };
  return (
    <div className="register-container">
      <Link to="/" className="back-to-home">
        <FaArrowLeft /> Back to Home
      </Link>
      <div className="register-card">
        <div className="register-header">
          <h1>Create Account</h1>
          <p>Join AREA and start automating your digital life</p>
        </div>

        {(error || validationError) && (
          <div className="error-message" role="alert">
            {error || validationError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="register-form">
          <WebInput
            label="Name"
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={(value) => setFormData({ ...formData, name: value })}
            placeholder="Enter your name"
            required
            disabled={loading}
          />

          <WebInput
            label="Email"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={(value) => setFormData({ ...formData, email: value })}
            placeholder="Enter your email"
            required
            disabled={loading}
          />

          <WebInput
            label="Password"
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={(value) => setFormData({ ...formData, password: value })}
            placeholder="Enter your password"
            required
            disabled={loading}
          />

          <WebInput
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={(value) =>
              setFormData({ ...formData, confirmPassword: value })
            }
            placeholder="Confirm your password"
            required
            disabled={loading}
          />

          <WebButton
            type="submit"
            label={loading ? "Creating Account..." : "Sign Up"}
            variant="primary"
            disabled={loading}
            fullWidth
          />
        </form>

        <div className="register-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="link">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
