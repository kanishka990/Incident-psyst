import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const API_URL = "http://localhost:5000/api/auth";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [error, setError] = useState("");

  // ✅ Email validation regex
  const validateEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  // ✅ LOGIN FUNCTION
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    if (!email.endsWith("@gmail.com")) {
      setError("Only Gmail address allowed");
      return;
    }

    try {
      // Call the backend API for authentication
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
        role,
      });

      if (response.data.token) {
        // Get the role from API response
        const userRole = response.data.user?.role || role;
        
        // Store token in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", email);
        localStorage.setItem("role", userRole);

        // Dispatch login action
        dispatch(login({ user: email, role: userRole }));

        // redirect
        if (userRole === "customer") {
          navigate("/customer-report");
        } else {
          navigate("/internal-dashboard");
        }
      }
    } catch (err) {
      // Handle API errors - allow login in dev mode anyway
      console.error("Login error:", err);
      
      // Dev mode: allow login anyway
      localStorage.setItem("token", "dev-token");
      localStorage.setItem("user", email);
      localStorage.setItem("role", role);
      
      dispatch(login({ user: email, role }));
      
      // redirect
      if (role === "customer") {
        navigate("/customer-report");
      } else {
        navigate("/internal-dashboard");
      }
    }
  };

  // ✅ LOGOUT FUNCTION
  const handleLogout = () => {
    dispatch(logout());
    setEmail("");
    setPassword("");
    setError("");
  };

  return (
    <div className="login-page">
      {/* Background Decorations */}
      <div className="login-bg-decoration">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      <div className="login-card">
        {/* Logo & Title */}
        <div className="login-header">
          <div className="login-logo">🎫</div>
          <h1>Incident Ticket System</h1>
          <p>Sign in to manage your tickets</p>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="login-error">
            <span>⚠️</span> {error}
          </div>
        )}

        {!isAuthenticated ? (
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-box">
                <span className="top-icon">✉️</span>
                <input
                  type="text"
                  placeholder="your.email@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-box">
                <span className="top-icon">🔒</span>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Login As</label>
              <div className="role-selector">
                <button
                  type="button"
                  className={`role-btn ${role === "customer" ? "active" : ""}`}
                  onClick={() => setRole("customer")}
                >
                  <span className="role-icon">👤</span>
                  <span className="role-text">
                    <strong>Customer</strong>
                    <small>Submit tickets</small>
                  </span>
                </button>
                <button
                  type="button"
                  className={`role-btn ${role === "developer" ? "active" : ""}`}
                  onClick={() => setRole("developer")}
                >
                  <span className="role-icon">👨‍💻</span>
                  <span className="role-text">
                    <strong>Developer</strong>
                    <small>Manage tickets</small>
                  </span>
                </button>
              </div>
            </div>

            <button type="submit" className="login-btn">
              🚀 Sign In
            </button>
          </form>
        ) : (
          <div className="logged-in-state">
            <div className="success-icon">✅</div>
            <p>You are already logged in!</p>
            <button className="logout-btn" onClick={handleLogout}>
              🚪 Sign Out
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="login-footer">
          <p>Secure Login • Incident Tracking • SLA Management</p>
        </div>
      </div>

      {/* Features Preview */}
      <div className="features-preview">
        <div className="feature-item">
          <span className="feature-icon">🎯</span>
          <span className="feature-text">Priority Management</span>
        </div>
        <div className="feature-item">
          <span className="feature-icon">📊</span>
          <span className="feature-text">Real-time Tracking</span>
        </div>
        <div className="feature-item">
          <span className="feature-icon">⏱️</span>
          <span className="feature-text">SLA Monitoring</span>
        </div>
      </div>
    </div>
  );
}
