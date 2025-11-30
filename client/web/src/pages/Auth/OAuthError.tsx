import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Login.css";

export default function OAuthError() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string>(
    "Authentication failed",
  );

  useEffect(() => {
    const message = searchParams.get("message");
    if (message) {
      setErrorMessage(decodeURIComponent(message));
    }
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [searchParams, navigate]);

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Authentication Failed</h1>
          <p>We couldn't sign you in</p>
        </div>
        <div className="error-message" role="alert">
          {errorMessage}
        </div>
        <div className="oauth-error-content">
          <p
            style={{
              textAlign: "center",
              color: "#666",
              marginBottom: "1.5rem",
            }}
          >
            Please try again or use a different sign-in method.
          </p>
          <Link
            to="/"
            className="btn btn-primary"
            style={{ textDecoration: "none" }}
          >
            Go to Login
          </Link>
          <p
            style={{
              textAlign: "center",
              color: "#999",
              fontSize: "0.875rem",
              marginTop: "1rem",
            }}
          >
            Redirecting automatically in 5 seconds...
          </p>
        </div>
      </div>
    </div>
  );
}
