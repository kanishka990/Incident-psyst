export default function ServiceStatusCard({ name, status }) {
  const color =
    status === "OPERATIONAL" ? "green" :
    status === "DEGRADED" ? "orange" : "red";

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}>
      <h3>{name}</h3>
      <p style={{ color }}>{status}</p>
    </div>
  );
}
