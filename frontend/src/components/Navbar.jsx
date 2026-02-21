import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user, role } = useSelector((state) => state.auth);
  const [showDropdown, setShowDropdown] = useState(false);

  /* ===== GET FROM LOCAL STORAGE ===== */
  const storedUser =
    localStorage.getItem("userName") || user;

  const storedRole =
    localStorage.getItem("role") || role;

  const storedEmail =
    localStorage.getItem("userEmail") || "email";

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    navigate("/login/customer");
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <span className="brand-icon">🎫</span>
          <span className="brand-text">Incident System</span>
        </Link>
      </div>

      

      <div className="navbar-profile">
        {isAuthenticated || storedUser ? (
          <div className="profile-dropdown">
            <button 
              className="profile-button"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="profile-avatar">
                {getInitials(storedUser)}
              </div>
              <span className="profile-name">{storedUser || "User"}</span>
              <span className="dropdown-arrow">▼</span>
            </button>
            
            {showDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <div className="dropdown-user-info">
                    <div className="dropdown-avatar-large">
                      {getInitials(storedUser)}
                    </div>
                    <div>
                      <div className="dropdown-name">{storedUser || "User"}</div>
                      <div className="dropdown-role">{storedRole || "Customer"}</div>
                    </div>
                  </div>
                </div>
                
                
              

                <Link to="/home" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                  🏠 Home
                </Link>
                
              
                
                <div className="dropdown-divider"></div>
                
                <button className="dropdown-item logout" onClick={handleLogout}>
                  🚪 Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login/customer" className="nav-link login-btn">
              🔐 Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
