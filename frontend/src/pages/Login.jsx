import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login as loginAction } from "../redux/authSlice";
import { login } from "../services/authService";
import "./Auth.css";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await login(email, password);

      console.log("Login Response:", response);

      const user = response?.data?.user;
      const token = response?.data?.token;

      console.log("User object:", user);
      console.log("Token:", token);

      if (!user || !token) {
        throw new Error("Invalid response from server - missing user or token");
      }

      // Dispatch to Redux for authentication state
      dispatch(loginAction({ user, role: user.role }));
      
      // Also save to localStorage for backup
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("userName", user.name || user.email || "");
      localStorage.setItem("userEmail", user.email || "");

      console.log("Saved token:", localStorage.getItem("token"));
      console.log("User role:", user.role);

      // Redirect based on user role (matching App.js routes)
      let redirectPath = "/";
      if (user.role === "customer") {
        redirectPath = "/customer";
        console.log("Redirecting to /customer");
      } else if (user.role === "developer") {
        redirectPath = "/home";
        console.log("Redirecting to /home");
      } else if (user.role === "admin") {
        redirectPath = "/Dashboard";
        console.log("Redirecting to /Dashboard");
      } else {
        console.log("Unknown role, redirecting to /");
      }

      // Use React Router navigation
      console.log("About to navigate to:", redirectPath);
      
      try {
        navigate(redirectPath);
      } catch (err) {
        console.error("Navigation error:", err);
        // Fallback to window.location
        window.location.href = redirectPath;
      }

    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>🎫 Ticketing Login</h1>
        <p>Sign in to manage tickets</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleLogin} className="auth-form">

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="main-btn" disabled={loading}>
            {loading ? "Logging in..." : "🔐 Sign In"}
          </button>
        </form>

        <p className="forgot-link">
          <span onClick={() => navigate("/forgot-password")}>
            Forgot Password?
          </span>
        </p>

        <p className="switch-link">
          New user?{" "}
          <span onClick={() => navigate("/register")}>
            Create Account
          </span>
        </p>
      </div>
    </div>
  );
}
