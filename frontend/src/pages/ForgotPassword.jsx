import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1: email, 2: reset
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSendResetLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (data.success) {
        setMessage(data.message);
        // For testing purposes, show the token
        if (data.resetToken) {
          setResetToken(data.resetToken);
          setStep(2);
        }
      } else {
        setError(data.error);
      }
    } catch {
      setError("Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: resetToken, newPassword })
      });

      const data = await res.json();

      if (data.success) {
        setMessage(data.message);
        setTimeout(() => {
          navigate("/login/customer");
        }, 2000);
      } else {
        setError(data.error);
      }
    } catch {
      setError("Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card forgot-password-card">
        <h1>🔐 {step === 1 ? "Forgot Password" : "Reset Password"}</h1>
        <p>
          {step === 1 
            ? "Enter your email to receive a password reset link" 
            : "Enter your new password"}
        </p>

        {error && <div className="auth-error">{error}</div>}
        {message && <div className="auth-success">{message}</div>}

        {step === 1 ? (
          <form onSubmit={handleSendResetLink} className="auth-form">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button className="main-btn" disabled={loading}>
              {loading ? "Sending..." : "📧 Send Reset Link"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="auth-form">
            <div className="token-display">
              <small>Reset Token (for testing):</small>
              <code>{resetToken}</code>
            </div>

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button className="main-btn" disabled={loading}>
              {loading ? "Resetting..." : "🔒 Reset Password"}
            </button>
          </form>
        )}

        <p className="switch-link">
          Remember your password? <span onClick={() => navigate("/login/customer")}>Sign In</span>
        </p>
      </div>
    </div>
  );
}
