import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Auth.css";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ===============================
     REGISTER FUNCTION
  =============================== */
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("All fields required");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      const data = response.data;

      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }

      alert("🎉 Account Created Successfully");

      navigate("/login", { replace: true });

    } catch (err) {
      console.error(err);
      setError("Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1>✨ Create Ticketing Account</h1>
        <p>Join Incident Management Platform</p>

        {error && <div className="auth-error">⚠️ {error}</div>}

        <form onSubmit={handleRegister} className="auth-form">

          {/* NAME */}
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* ROLE SELECT */}
          <div className="role-box">

            <button
              type="button"
              className={
                role === "customer"
                  ? "role-btn active"
                  : "role-btn"
              }
              onClick={() => setRole("customer")}
            >
              👤 Customer
            </button>

            <button
              type="button"
              className={
                role === "developer"
                  ? "role-btn active"
                  : "role-btn"
              }
              onClick={() => setRole("developer")}
            >
              👨‍💻 Developer
            </button>

          </div>

          <button className="main-btn" disabled={loading}>
            {loading ? "Creating Account..." : "🚀 Create Account"}
          </button>

        </form>

        <div className="auth-footer">
          Already have account?{" "}
          <span
            className="auth-link"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </div>

      </div>

    </div>
  );
}
