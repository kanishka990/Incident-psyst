import { useState } from "react";
import { createIncident } from "../services/incidentService";

const CreateIncident = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("LOW");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await createIncident({ title, description, severity });
      setMessage("Incident created successfully ✅");

      // reset form
      setTitle("");
      setDescription("");
      setSeverity("LOW");
    } catch (err) {
      setError("Failed to create incident ❌");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px" }}>
      <h2>Create Incident</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
        />

        <br /><br />

        <textarea
          placeholder="Description"
          value={description}
          required
          onChange={(e) => setDescription(e.target.value)}
        />

        <br /><br />

        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
        >
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
        </select>

        <br /><br />

        <button type="submit">Create Incident</button>
      </form>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default CreateIncident;
