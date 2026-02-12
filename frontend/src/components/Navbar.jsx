import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div style={styles.nav}>
      <Link to="/" style={styles.btn}>📊 Status</Link>
      <Link to="/customer-incidents" style={styles.btn}>👤 Customer Incidents</Link>
      <Link to="/developer-incidents" style={styles.btn}>🔧 Developer Incidents</Link>
      <Link to="/public-status" style={styles.btn}>🌐 Public Status</Link>
      <Link to="/customer-report" style={styles.btn}>📝 Report Issue</Link>
      <Link to="/internal-dashboard" style={styles.btn}>👥 Team Dashboard</Link>
      <Link to="/services" style={styles.btn}>⚙️ Services</Link>
      <Link to="/updates" style={styles.btn}>📢 Updates</Link>
      <Link to="/dashboard" style={styles.btn}>📈 Dashboard</Link>
      <Link to="/login" style={styles.btn}>🔐 Login</Link>
    </div>
  );
};

const styles = {
  nav: {
    display: "flex",
    gap: "10px",
    padding: "15px",
    background: "#222",
    flexWrap: "wrap",
  },
  btn: {
    color: "#fff",
    background: "#007bff",
    padding: "8px 14px",
    textDecoration: "none",
    borderRadius: "5px",
    fontSize: "0.9rem",
  },
};

export default Navbar;
