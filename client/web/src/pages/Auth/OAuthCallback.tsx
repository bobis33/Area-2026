import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { handleOAuthCallback } from "@/services/auth.service";
import "./Login.css";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"processing" | "success" | "error">(
    "processing",
  );

  useEffect(() => {
    const userParam = searchParams.get("user");

    if (!userParam) {
      navigate("/auth/error?message=No user data received");
      return;
    }

    try {
      handleOAuthCallback(userParam);
      setStatus("success");
      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } catch (error) {
      console.error("Failed to process OAuth callback:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Invalid authentication data";
      navigate(`/auth/error?message=${encodeURIComponent(errorMessage)}`);
    }
  }, [searchParams, navigate]);

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>
            {status === "processing" && "Processing Authentication..."}
            {status === "success" && "Authentication Successful"}
            {status === "error" && "Authentication Failed"}
          </h1>
          <p>
            {status === "processing" && "Please wait while we sign you in"}
            {status === "success" && "Redirecting you to the application..."}
            {status === "error" && "An error occurred"}
          </p>
        </div>
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    </div>
  );
}
