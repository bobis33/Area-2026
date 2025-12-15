import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import type { LoginCredentials } from "@/types";
import { FaGoogle, FaDiscord, FaGithub, FaArrowLeft } from "react-icons/fa";
import { WebInput, WebButton, WebOAuthButton } from "@/components/ui-web";
import "./Login.css";

export default function Login() {
  const { login, loginWithOAuth, loading, error } = useAuth();
  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return;
    }

    try {
      await login(formData);
    } catch (err) {
      //Handled by useAuth hook
    }
  };

  const handleOAuthLogin = (provider: "google" | "discord" | "github") => {
    loginWithOAuth(provider);
  };

  return (
    <div className="login-container">
      <Link to="/" className="back-to-home">
        <FaArrowLeft /> Back to Home
      </Link>
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your AREA account</p>
        </div>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
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

          <WebButton
            label={loading ? "Signing In..." : "Sign In"}
            variant="primary"
            disabled={loading}
            fullWidth
          />
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <div className="oauth-buttons">
          <WebOAuthButton
            label="Continue with Google"
            onClick={() => handleOAuthLogin("google")}
            provider="google"
            disabled={loading}
            icon={<FaGoogle />}
          />

          <WebOAuthButton
            label="Continue with Discord"
            onClick={() => handleOAuthLogin("discord")}
            provider="discord"
            disabled={loading}
            icon={<FaDiscord />}
          />

          <WebOAuthButton
            label="Continue with GitHub"
            onClick={() => handleOAuthLogin("github")}
            provider="github"
            disabled={loading}
            icon={<FaGithub />}
          />
        </div>

        <div className="login-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="link">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
