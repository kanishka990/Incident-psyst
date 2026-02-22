import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Auth.css";

export default function Login(){
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");
  const [loading,setLoading] = useState(false);

  const handleLogin = async (e)=>{
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      // Use the api service which points to backend
      const response = await api.post("/auth/login", { email, password });
      
      if (response.data.token) {
        // Get user data from backend response
        const userData = response.data.user;
        
        // Store token and user info
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", userData.role);
        localStorage.setItem("userName", userData.email.split('@')[0]);
        localStorage.setItem("userEmail", userData.email);

        // Dispatch login with user info
        dispatch(login({
          user: { email: userData.email, name: userData.name, role: userData.role },
          role: userData.role
        }));

        // Redirect based on ACTUAL role from database
        if (userData.role === "developer" || userData.role === "admin") {
          navigate("/developer-dashboard");
        } else {
          navigate("/customer");
        }
      }
    } catch (err) {
      const message = err.response?.data?.message || "Login failed. Please try again.";
      setError(message);
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

        <form onSubmit={handleLogin} className="auth-form">

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
          <span onClick={()=>navigate("/forgot-password")}>
            Forgot Password?
          </span>
        </p>

        <p className="switch-link">
          New user? <span onClick={()=>navigate("/register")}>
            Create Account
          </span>
        </p>

      </div>

    </div>
  );
}
