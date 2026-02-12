import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import "./Login.css";

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
  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    if (!email.endsWith("@gmail.com")) {
      setError("Only Gmail address");
      return;
    }

    dispatch(login({ user: email, role }));

    // redirect
    if (role === "customer") {
      navigate("/customer");
    } else {
      navigate("/developer-dashboard");
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
    <div className="login-container">

      <div className="login-card">
        <h2>Incident System Login</h2>

        {/* ERROR MESSAGE */}
        {error && <p className="error">{error}</p>}

        {!isAuthenticated ? (
          <form onSubmit={handleLogin}>

            <input
              type="text"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
            />

            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
            />

            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="customer">Customer</option>
              <option value="developer">Developer</option>
            </select>

            <button type="submit">Login</button>
          </form>
        ) : (
          <>
            <p style={{ marginTop: 10 }}>You are logged in</p>
            <button className="logout-btn" onClick={handleLogout}>
              Sign Out
            </button>
          </>
        )}
      </div>

    </div>
  );
}
