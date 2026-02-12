import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Login from "./pages/Login";
import CustomerIncidentManagement from "./pages/CustomerIncidentManagement";
import DeveloperIncidentManagement from "./pages/DeveloperIncidentManagement";

function App() {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN PAGE */}
        <Route path="/login" element={<Login />} />

        {/* CUSTOMER DASHBOARD */}
        <Route
          path="/customer"
          element={
            isAuthenticated ? (
              role === "customer" ? (
                <CustomerIncidentManagement />
              ) : (
                <Navigate to="/developer-dashboard" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* DEVELOPER DASHBOARD */}
        <Route
          path="/developer-dashboard"
          element={
            isAuthenticated ? (
              role === "developer" ? (
                <DeveloperIncidentManagement />
              ) : (
                <Navigate to="/customer" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* DEFAULT ROUTE */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
