import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import ServiceStatusCard from "../components/ServiceStatusCard";

export default function StatusPage() {
  const [services, setServices] = useState([]); // ✅ MUST be []

  useEffect(() => {
    api.get("/services")
      .then(res => {
        setServices(res.data); // res.data must be an array
      })
      .catch(err => {
        console.error("API error:", err);
        setServices([]); // fallback safety
      });
  }, []);

  return (
    <>
      <Navbar />
      <h1>System Status</h1>

      
      {services.map(s => (
        <ServiceStatusCard
          key={s.id}
          name={s.name}
          status={s.status}
        />
      ))}
    </>
  );
}

