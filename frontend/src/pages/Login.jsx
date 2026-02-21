import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Login(){

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");

  const handleLogin = async (e)=>{
    e.preventDefault();

    try {

      const res = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method:"POST",
          headers:{ "Content-Type":"application/json" },
          body: JSON.stringify({ email,password })
        }
      );

      const data = await res.json();

      if(!data.token){
        setError(data.error);
        return;
      }

      localStorage.setItem("token",data.token);
      localStorage.setItem("role",data.user.role);
      localStorage.setItem("userName",data.user.name || data.user.email.split('@')[0]);
      localStorage.setItem("userEmail",data.user.email);

      dispatch(login(data.user));

      if(data.user.role==="developer"){
        navigate("/developer-dashboard");
      }else{
        navigate("/home");
      }

    } catch {
      setError("Login failed");
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

          <button className="main-btn">
            🔐 Sign In
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
