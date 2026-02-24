import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

/* Pages */
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerIncidentManagement from "./pages/CustomerIncidentManagement";
import DeveloperIncidentManagement from "./pages/DeveloperIncidentManagement";
import CustomerReportIssue from "./pages/CustomerReportIssue";
import InternalDashboard from "./pages/InternalDashboard";
import Services from "./pages/Services";
import Updates from "./pages/Updates";
import Incidents from "./pages/Incidents";
import PublicStatusPage from "./pages/PublicStatusPage";
import ClickUpHome from "./pages/ClickUpHome";

/* Components */
import Navbar from "./components/Navbar";

function App() {

  const { isAuthenticated, role } =
    useSelector((state) => state.auth);

  /* Prevent blink */
  if (isAuthenticated === undefined) {
    return null;
  }

  return (
    <BrowserRouter>

      {/* Sidebar/Navbar */}
      {isAuthenticated && <Navbar />}

      <Routes>

        {/* LOGIN */}
        <Route
          path="/login"
          element={
            isAuthenticated
              ? role === "developer"
                ? <Navigate to="/home" replace />
                : <Navigate to="/customer" replace />
              : <Login />
          }
        />

        {/* REGISTER */}
        <Route path="/register" element={<Register />} />

        {/* CUSTOMER */}
        <Route
          path="/customer"
          element={
            isAuthenticated && role === "customer"
              ? <CustomerIncidentManagement />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/customer-report"
          element={
            isAuthenticated && role === "customer"
              ? <CustomerReportIssue />
              : <Navigate to="/login" replace />
          }
        />

        {/* DEVELOPER */}
        <Route
          path="/developer"
          element={
            isAuthenticated && role === "developer"
              ? <DeveloperIncidentManagement />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/developer-dashboard"
          element={
            isAuthenticated && role === "developer"
              ? <DeveloperIncidentManagement />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/internal-dashboard"
          element={
            isAuthenticated && role === "developer"
              ? <InternalDashboard />
              : <Navigate to="/login" replace />
          }
        />

        {/* COMMON */}
        <Route
          path="/services"
          element={
            isAuthenticated
              ? <Services />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/updates"
          element={
            isAuthenticated
              ? <Updates />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/incidents"
          element={
            isAuthenticated
              ? <Incidents />
              : <Navigate to="/login" replace />
          }
        />

        {/* PUBLIC */}
        <Route path="/public-status" element={<PublicStatusPage />} />

        {/* CLICKUP HOME */}
        <Route
          path="/home"
          element={
            isAuthenticated
              ? <ClickUpHome />
              : <Navigate to="/login" replace />
          }
        />

        {/* DEFAULT */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
