import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login({ roleType }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(roleType || "customer");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Simple validation
    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    // Dummy authentication (You can connect backend later)
    dispatch(
      login({
        user: email,
        role: role,
      })
    );

    // Redirect based on role
    if (role === "customer") {
      navigate("/customer");
    } else {
      navigate("/developer-dashboard");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>🔐 Incident Management Login</h2>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="customer">Customer</option>
            <option value="developer">Developer</option>
          </select>

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
