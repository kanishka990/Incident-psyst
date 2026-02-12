import { useEffect, useState } from "react";
import {
  fetchServices,
  createService,
  updateService,
  deleteService,
} from "../services/service.service";
import "./Services.css";

export default function Services() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "OPERATIONAL",
  });

  // Fetch all services
  useEffect(() => {
    loadServices();
  }, []);

  // Filter services when search or status changes
  useEffect(() => {
    let filtered = services;

    if (searchTerm) {
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((s) => s.status === statusFilter);
    }

    setFilteredServices(filtered);
  }, [services, searchTerm, statusFilter]);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchServices();
      setServices(data || []);
    } catch (err) {
      console.error("Error loading services:", err);
      setError("Failed to load services. Please check if backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle create new service
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      if (!formData.name.trim()) {
        setError("Service name is required");
        return;
      }

      const newService = await createService(formData);
      setServices([newService, ...services]);
      setFormData({ name: "", description: "", status: "OPERATIONAL" });
      setShowForm(false);
      setError(null);
    } catch (err) {
      console.error("Error creating service:", err);
      setError("Failed to create service");
    }
  };

  // Handle update service
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      if (!formData.name.trim()) {
        setError("Service name is required");
        return;
      }

      const updatedService = await updateService(editingId, formData);
      setServices(
        services.map((s) => (s.id === editingId ? updatedService : s))
      );
      setFormData({ name: "", description: "", status: "OPERATIONAL" });
      setEditingId(null);
      setShowForm(false);
      setError(null);
    } catch (err) {
      console.error("Error updating service:", err);
      setError("Failed to update service");
    }
  };

  // Handle delete service
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteService(id);
        setServices(services.filter((s) => s.id !== id));
        setError(null);
      } catch (err) {
        console.error("Error deleting service:", err);
        setError("Failed to delete service");
      }
    }
  };

  // Handle edit button click
  const handleEditClick = (service) => {
    setFormData({
      name: service.name,
      description: service.description,
      status: service.status,
    });
    setEditingId(service.id);
    setShowForm(true);
    setError(null);
  };

  // Handle cancel
  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: "", description: "", status: "OPERATIONAL" });
    setError(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "OPERATIONAL":
        return "#28a745";
      case "DEGRADED":
        return "#ffc107";
      case "DOWN":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  if (loading) {
    return (
      <div className="services-container">
        <div className="loading">
          <p>Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="services-container">
      <div className="services-header">
        <h1>Services Management</h1>
        <p className="subtitle">Monitor and manage services across your organization</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="services-toolbar">
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ name: "", description: "", status: "OPERATIONAL" });
          }}
        >
          + Add New Service
        </button>

        <input
          type="text"
          className="search-input"
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button className="btn btn-secondary" onClick={loadServices}>
          Refresh
        </button>
      </div>

      <div className="services-filters">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="OPERATIONAL">Operational</option>
          <option value="DEGRADED">Degraded</option>
          <option value="DOWN">Down</option>
        </select>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div className="form-card">
          <h2>{editingId ? "Edit Service" : "Create New Service"}</h2>
          <form onSubmit={editingId ? handleUpdate : handleCreate}>
            <div className="form-group">
              <label htmlFor="name">Service Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter service name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter service description"
                rows="4"
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="OPERATIONAL">Operational</option>
                <option value="DEGRADED">Degraded</option>
                <option value="DOWN">Down</option>
              </select>
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn btn-success">
                {editingId ? "Update" : "Create"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services List */}
      <div className="services-list-container">
        <div className="list-header">
          <h2>
            Services ({filteredServices.length} of {services.length})
          </h2>
        </div>

        {filteredServices.length === 0 ? (
          <div className="empty-state">
            <p>No services found</p>
            <small>Create a new service or adjust your filters</small>
          </div>
        ) : (
          <table className="services-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map((service) => (
                <tr key={service.id}>
                  <td className="service-id">#{service.id}</td>
                  <td className="service-name">{service.name}</td>
                  <td className="service-desc">
                    {service.description || "-"}
                  </td>
                  <td>
                    <span
                      className="badge status-badge"
                      style={{
                        backgroundColor: getStatusColor(service.status),
                      }}
                    >
                      {service.status}
                    </span>
                  </td>
                  <td>
                    {service.created_at
                      ? new Date(service.created_at).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="actions">
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => handleEditClick(service)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(service.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
