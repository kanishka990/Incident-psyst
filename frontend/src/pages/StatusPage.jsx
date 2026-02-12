import { useEffect, useState } from "react";
import api from "../services/api";

export default function StatusPage() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.get("/services").then(res => setServices(res.data));
  }, []);

  return (
    <div>
      <h1>System Status</h1>
      {services.map(s => (
        <p key={s.id}>{s.name} : {s.status}</p>
      ))}
    </div>
  );
}
