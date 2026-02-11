# API Update Guide - Complete Changes Explained

## Overview
You have **3 API endpoints** for managing data:
1. **Incidents API** - Manage incidents (GET, POST, PUT, DELETE)
2. **Services API** - Manage services (GET, POST, PUT, DELETE)  
3. **Updates API** - Manage system updates (GET, POST, PUT, DELETE)

All follow the same pattern: **GET (read) → POST (create) → PUT (update) → DELETE (delete)**

---

## API Pattern Explained

Every API follows this CRUD pattern:

```
GET    /api/resource       → Read all items
POST   /api/resource       → Create new item
PUT    /api/resource/:id   → Update specific item
DELETE /api/resource/:id   → Delete specific item
```

---

## Current Implementation Status

### ✅ Incidents API - COMPLETE
```
Frontend: frontend/src/services/incident.service.js
Backend:  backend/src/controllers/incident.controller.js
Routes:   backend/src/routes/incident.routes.js

Endpoints:
✅ GET    /api/incidents           - Get all incidents
✅ POST   /api/incidents           - Create incident
✅ PUT    /api/incidents/:id       - Update incident
✅ DELETE /api/incidents/:id       - Delete incident
```

### ✅ Services API - COMPLETE
```
Frontend: frontend/src/services/service.service.js
Backend:  backend/src/controllers/service.controller.js
Routes:   backend/src/routes/service.routes.js

Endpoints:
✅ GET    /api/services           - Get all services
✅ POST   /api/services           - Create service
✅ PUT    /api/services/:id       - Update service
✅ DELETE /api/services/:id       - Delete service
```

### ✅ Updates API - COMPLETE
```
Frontend: frontend/src/services/update.service.js
Backend:  backend/src/controllers/update.controller.js
Routes:   backend/src/routes/update.routes.js

Endpoints:
✅ GET    /api/updates           - Get all updates
✅ POST   /api/updates           - Create update
✅ PUT    /api/updates/:id       - Update update
✅ DELETE /api/updates/:id       - Delete update
```

---

## Frontend Service Files Structure

### File 1: incident.service.js (Incidents API)
```javascript
import axios from "axios";

const API_URL = "http://localhost:5000/api/incidents";

// Get all incidents
export const fetchIncidents = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Create new incident
export const createIncident = async (incident) => {
  const response = await axios.post(API_URL, incident);
  return response.data;
};

// Update incident status
export const updateIncident = async (id, status) => {
  const response = await axios.put(`${API_URL}/${id}`, { status });
  return response.data;
};

// Delete incident
export const deleteIncident = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};
```

### File 2: service.service.js (Services API)
```javascript
import axios from "axios";

const API_URL = "http://localhost:5000/api/services";

// Get all services
export const fetchServices = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Create new service
export const createService = async (service) => {
  const response = await axios.post(API_URL, service);
  return response.data;
};

// Update service
export const updateService = async (id, service) => {
  const response = await axios.put(`${API_URL}/${id}`, service);
  return response.data;
};

// Delete service
export const deleteService = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
```

### File 3: update.service.js (Updates API)
```javascript
import axios from "axios";

const API_URL = "http://localhost:5000/api/updates";

// Get all updates
export const fetchUpdates = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Create new update
export const createUpdate = async (update) => {
  const response = await axios.post(API_URL, update);
  return response.data;
};

// Update existing update
export const updateUpdate = async (id, update) => {
  const response = await axios.put(`${API_URL}/${id}`, update);
  return response.data;
};

// Delete update
export const deleteUpdate = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
```

---

## Backend Controller Functions

### incident.controller.js
```javascript
export const getIncidents = async (req, res) => {
  // Gets all incidents from database
  // Returns: Array of incident objects
};

export const createIncident = async (req, res) => {
  // Creates new incident
  // Expects: { title, description, severity, status }
  // Returns: New incident with ID
};

export const updateIncident = async (req, res) => {
  // Updates incident by ID
  // Expects: { status } (and optionally other fields)
  // Returns: Updated incident
};

export const deleteIncident = async (req, res) => {
  // Deletes incident by ID
  // Returns: Deleted incident object
};
```

### service.controller.js
```javascript
export const getServices = async (req, res) => {
  // Gets all services from database
  // Returns: Array of service objects
};

export const createService = async (req, res) => {
  // Creates new service
  // Expects: { name, description, status }
  // Returns: New service with ID
};

export const updateService = async (req, res) => {
  // Updates service by ID
  // Expects: { name, description, status }
  // Returns: Updated service
};

export const deleteService = async (req, res) => {
  // Deletes service by ID
  // Returns: Deleted service object
};
```

### update.controller.js
```javascript
export const getUpdates = async (req, res) => {
  // Gets all updates from database
  // Returns: Array of update objects
};

export const createUpdate = async (req, res) => {
  // Creates new update
  // Expects: { message, update_type, incident_id (optional) }
  // Returns: New update with ID
};

export const updateUpdate = async (req, res) => {
  // Updates update by ID
  // Expects: { message, update_type }
  // Returns: Updated update
};

export const deleteUpdate = async (req, res) => {
  // Deletes update by ID
  // Returns: Deleted update object
};
```

---

## Backend Routes Setup

### incident.routes.js
```javascript
import express from "express";
import { 
  getIncidents, 
  createIncident, 
  updateIncident, 
  deleteIncident 
} from "../controllers/incident.controller.js";

const router = express.Router();

router.get("/", getIncidents);           // GET /api/incidents
router.post("/value", createIncident);   // POST /api/incidents/value
router.put("/:id", updateIncident);      // PUT /api/incidents/:id
router.delete("/:id", deleteIncident);   // DELETE /api/incidents/:id

export default router;
```

### service.routes.js
```javascript
import express from "express";
import { 
  getServices, 
  createService, 
  updateService, 
  deleteService 
} from "../controllers/service.controller.js";

const router = express.Router();

router.get("/", getServices);            // GET /api/services
router.post("/", createService);         // POST /api/services
router.put("/:id", updateService);       // PUT /api/services/:id
router.delete("/:id", deleteService);    // DELETE /api/services/:id

export default router;
```

### update.routes.js
```javascript
import express from "express";
import { 
  getUpdates, 
  createUpdate, 
  updateUpdate, 
  deleteUpdate,
  addUpdate
} from "../controllers/update.controller.js";

const router = express.Router();

router.get("/", getUpdates);             // GET /api/updates
router.post("/", createUpdate);          // POST /api/updates
router.put("/:id", updateUpdate);        // PUT /api/updates/:id
router.delete("/:id", deleteUpdate);     // DELETE /api/updates/:id
router.post("/:id", addUpdate);          // Legacy route (keeps old POST /:id)

export default router;
```

---

## How Frontend Calls These APIs

### Example: Loading Incidents Page

```javascript
// File: frontend/src/pages/Incidents.jsx

import { fetchIncidents, createIncident, updateIncident, deleteIncident } 
  from "../services/incident.service.js";

// Step 1: Load all incidents when page opens
const loadIncidents = async () => {
  try {
    const data = await fetchIncidents();  // GET /api/incidents
    setIncidents(data);
  } catch (err) {
    setError("Failed to load incidents");
  }
};

// Step 2: User clicks "Create" button
const handleCreate = async (e) => {
  e.preventDefault();
  try {
    const newIncident = await createIncident({  // POST /api/incidents
      title: "API Down",
      description: "Server not responding",
      severity: "CRITICAL",
      status: "OPEN"
    });
    setIncidents([newIncident, ...incidents]);  // Add to list
  } catch (err) {
    setError("Failed to create incident");
  }
};

// Step 3: User clicks "Update" on incident
const handleUpdate = async (id, newStatus) => {
  try {
    const updated = await updateIncident(id, newStatus);  // PUT /api/incidents/:id
    setIncidents(incidents.map(i => i.id === id ? updated : i));
  } catch (err) {
    setError("Failed to update incident");
  }
};

// Step 4: User clicks "Delete" on incident
const handleDelete = async (id) => {
  try {
    await deleteIncident(id);  // DELETE /api/incidents/:id
    setIncidents(incidents.filter(i => i.id !== id));
  } catch (err) {
    setError("Failed to delete incident");
  }
};
```

---

## Common Errors and Fixes

### Error 1: "Cannot POST /api/incidents"
```
Problem: Frontend trying to POST but route doesn't exist
Solution: Check that POST route is registered in routes file
          router.post("/value", createIncident);
```

### Error 2: "Cannot PUT /api/incidents/1"
```
Problem: Update endpoint not working
Solution: Ensure PUT route exists:
          router.put("/:id", updateIncident);
          
          And :id is correctly passed in controller:
          const { id } = req.params;
```

### Error 3: "Cannot DELETE /api/updates/1"
```
Problem: Delete endpoint not working
Solution: Make sure DELETE route exists:
          router.delete("/:id", deleteUpdate);
          
          And frontend passes correct ID:
          axios.delete(`${API_URL}/${id}`);
```

### Error 4: "Message is required" (when creating update)
```
Problem: Frontend not sending message field
Solution: In frontend form, ensure you're sending:
          {
            message: "Update text here",
            update_type: "ALERT",
            incident_id: 1
          }
```

### Error 5: "Update not found" (404 error)
```
Problem: Trying to update item that doesn't exist
Solution: Make sure ID exists in database before updating
          Check: SELECT * FROM incident_updates WHERE id = 1;
```

---

## Request/Response Examples

### Creating an Incident

**Frontend Code:**
```javascript
const response = await createIncident({
  title: "API Server Down",
  description: "Production API not responding",
  severity: "CRITICAL"
});
```

**What Gets Sent (HTTP):**
```
POST /api/incidents/value HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "title": "API Server Down",
  "description": "Production API not responding",
  "severity": "CRITICAL"
}
```

**What Gets Returned:**
```json
{
  "id": 1,
  "title": "API Server Down",
  "description": "Production API not responding",
  "severity": "CRITICAL",
  "status": "OPEN",
  "created_at": "2026-02-11T10:30:00Z"
}
```

---

### Updating an Update

**Frontend Code:**
```javascript
const response = await updateUpdate(5, {
  message: "Issue resolved successfully",
  update_type: "RESOLVED"
});
```

**What Gets Sent (HTTP):**
```
PUT /api/updates/5 HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "message": "Issue resolved successfully",
  "update_type": "RESOLVED"
}
```

**What Gets Returned:**
```json
{
  "id": 5,
  "incident_id": 1,
  "message": "Issue resolved successfully",
  "update_type": "RESOLVED",
  "created_at": "2026-02-11T10:30:00Z",
  "updated_at": "2026-02-11T11:45:00Z"
}
```

---

### Deleting a Service

**Frontend Code:**
```javascript
await deleteService(2);
```

**What Gets Sent (HTTP):**
```
DELETE /api/services/2 HTTP/1.1
Host: localhost:5000
```

**What Gets Returned:**
```json
{
  "message": "Service deleted",
  "service": {
    "id": 2,
    "name": "Database Server",
    "status": "OPERATIONAL"
  }
}
```

---

## Testing the APIs

### Test with PowerShell (Before Frontend)

**Test 1: Get all incidents**
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/incidents" -Method GET
```

**Test 2: Create new incident**
```powershell
$body = @{
  title = "Test Incident"
  description = "Testing API"
  severity = "HIGH"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/incidents/value" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

**Test 3: Update incident**
```powershell
$body = @{ status = "IN_PROGRESS" } | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/incidents/1" `
  -Method PUT `
  -ContentType "application/json" `
  -Body $body
```

**Test 4: Delete incident**
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/incidents/1" -Method DELETE
```

---

## Summary: What You Have

| Feature | Incidents | Services | Updates |
|---------|-----------|----------|---------|
| GET (Read all) | ✅ Yes | ✅ Yes | ✅ Yes |
| POST (Create) | ✅ Yes | ✅ Yes | ✅ Yes |
| PUT (Update) | ✅ Yes | ✅ Yes | ✅ Yes |
| DELETE | ✅ Yes | ✅ Yes | ✅ Yes |
| Frontend Service | ✅ Yes | ✅ Yes | ✅ Yes |
| Backend Controller | ✅ Yes | ✅ Yes | ✅ Yes |
| Routes Setup | ✅ Yes | ✅ Yes | ✅ Yes |

**Result: All APIs are COMPLETE and ready to use!**

---

## Checklist to Verify Everything Works

- [ ] Backend running: `npm start` in backend folder
- [ ] Frontend running: `npm start` in frontend folder
- [ ] PostgreSQL service running
- [ ] Can load incidents from Incidents page
- [ ] Can create new incident
- [ ] Can update incident status
- [ ] Can delete incident
- [ ] Can load services from Services page
- [ ] Can create/update/delete services
- [ ] Can load updates from Updates page
- [ ] Can create/update/delete updates
- [ ] All data persists in database

If all checks pass, your platform is fully functional!
