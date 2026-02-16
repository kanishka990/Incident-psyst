import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import StatusPage from "./pages/StatusPage";
import Incidents from "./pages/Incidents";
import Services from "./pages/Services";
import Updates from "./pages/Updates";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PublicStatusPage from "./pages/PublicStatusPage";
import InternalDashboard from "./pages/InternalDashboard";
import CustomerReportIssue from "./pages/CustomerReportIssue";
import CustomerIncidentManagement from "./pages/CustomerIncidentManagement";
import DeveloperIncidentManagement from "./pages/DeveloperIncidentManagement";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Navbar /> {/* UI buttons */}

      <Routes>
        <Route path="/" element={<Navigate to="/login/customer" replace />} />
        <Route path="/incidents" element={<Incidents />} />
        <Route path="/customer-incidents" element={<Incidents />} />
        <Route path="/services" element={<Services />} />
        <Route path="/updates" element={<Updates />} />
        <Route path="/login" element={<Navigate to="/login/customer" replace />} />
        <Route path="/login/customer" element={<Login roleType="customer" />} />
        <Route path="/login/developer" element={<Login roleType="developer" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/public-status" element={<PublicStatusPage />} />
        <Route path="/internal-dashboard" element={<InternalDashboard />} />
        <Route path="/customer-report" element={<CustomerReportIssue />} />
        <Route path="/developer-incidents" element={<DeveloperIncidentManagement />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
