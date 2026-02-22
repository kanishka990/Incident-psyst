import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import "./Auth.css";

export default function Login(){
  const navigate = useNavigate();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");
  const [loading,setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    
    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const response = await login(email, password);
      
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.user.role);
        localStorage.setItem("userName", response.data.user.email.split('@')[0]);
        localStorage.setItem("userEmail", response.data.user.email);

        if (response.data.user.role === "developer" || response.data.user.role === "admin") {
          navigate("/developer-dashboard");
        } else {
          navigate("/customer");
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return(
    <div className="auth-page">
      <div className="auth-card">
        <h1>🎫 Ticketing Login</h1>
        <p>Sign in to manage tickets</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="auth-form">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

          <button className="main-btn" disabled={loading}>
            {loading ? "Logging in..." : "🔐 Sign In"}
          </button>
        </form>

        <p className="forgot-link">
          <span onClick={()=>navigate("/forgot-password")}>Forgot Password?</span>
        </p>

        <p className="switch-link">
          New user? <span onClick={()=>navigate("/register")}>Create Account</span>
        </p>
      </div>
    </div>
  );
}
