# 📋 Incident Management Platform - Complete Project Overview

## A Comprehensive Guide for Management

---

## 1. Executive Summary

This document provides a complete overview of the **Incident Management Platform** - a professional system for managing incidents, communicating with customers, and monitoring service health in real-time.

### What This Platform Does

- Allows customers to report issues they're experiencing
- Enables internal teams to track and resolve incidents
- Provides transparent communication to customers about system status
- Monitors service health across the entire system

---

## 2. Technology Stack

### Programming Languages & Versions

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Frontend** | JavaScript (React) | React 19.2 | User Interface |
| **Backend** | JavaScript (Node.js) | Node.js 18+ | API Server |
| **Database** | PostgreSQL | PostgreSQL 18 | Data Storage |
| **Server Runtime** | Express.js | Express 5 | Web Framework |
| **HTTP Client** | Axios | 1.13 | API Communication |
| **Real-time** | Socket.io | Latest | Live Chat & Notifications |
| **File Upload** | Multer | Latest | File Handling |

### Development Tools

| Tool | Purpose |
|------|---------|
| **npm** | Package Management |
| **Git** | Version Control |
| **Docker** | Containerization |
| **VSCode** | Code Editor |

---

## 3. Project Structure

### Directory Layout

```
incident-platform/
│
├── backend/                    # API Server (Port 5000)
│   ├── src/
│   │   ├── server.js          # Main server entry point
│   │   ├── app.js            # Express app configuration
│   │   ├── config/           # Database configuration
│   │   │   └── db.js        # PostgreSQL connection
│   │   ├── controllers/     # Business logic (8 controllers)
│   │   │   ├── auth.controller.js
│   │   │   ├── incident.controller.js
│   │   │   ├── service.controller.js
│   │   │   ├── update.controller.js
│   │   │   ├── chat.controller.js
│   │   │   ├── notification.controller.js
│   │   │   ├── attachment.controller.js
│   │   │   └── app.connection.controller.js
│   │   ├── routes/          # API routes (8 route files)
│   │   │   ├── auth.routes.js
│   │   │   ├── incident.routes.js
│   │   │   ├── service.routes.js
│   │   │   ├── update.routes.js
│   │   │   ├── chat.routes.js
│   │   │   ├── notification.routes.js
│   │   │   ├── attachment.routes.js
│   │   │   └── app.connection.routes.js
│   │   ├── middleware/       # Authentication & uploads
│   │   │   ├── auth.middleware.js
│   │   │   ├── role.middleware.js
│   │   │   └── upload.js
│   │   └── scripts/         # Database utility scripts
│   │       ├── seedUsers.js
│   │       ├── addSampleTickets.js
│   │       └── createAppConnectionsTable.js
│   ├── uploads/             # File upload directory
│   ├── package.json         # Backend dependencies
│   └── .env                 # Environment variables
│
├── frontend/                  # React Application (Port 3000)
│   ├── public/              # Static assets
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── index.js         # React entry point
│   │   ├── App.jsx          # Main app with routing
│   │   ├── index.css        # Global styles
│   │   ├── components/     # Reusable UI components
│   │   │   ├── Navbar.jsx           # Navigation bar
│   │   │   ├── Chat.jsx             # Real-time chat
│   │   │   ├── Notifications.jsx    # Notification panel
│   │   │   ├── CreateIncident.jsx   # Create incident form
│   │   │   ├── ServiceStatusCard.jsx # Service status card
│   │   │   └── StatusPage.jsx       # Status display
│   │   ├── pages/           # Page components (16 pages)
│   │   │   ├── Login.jsx            # User login
│   │   │   ├── Register.jsx         # User registration
│   │   │   ├── ForgotPassword.jsx   # Password recovery
│   │   │   ├── Dashboard.jsx        # Main dashboard
│   │   │   ├── Incidents.jsx        # Incidents list
│   │   │   ├── Services.jsx          # Services management
│   │   │   ├── Updates.jsx          # Updates management
│   │   │   ├── ProfileSettings.jsx   # User profile
│   │   │   ├── PublicStatusPage.jsx  # Customer status view
│   │   │   ├── CustomerReportIssue.jsx # Customer issue reporting
│   │   │   ├── InternalDashboard.jsx # Team dashboard
│   │   │   ├── CustomerIncidentManagement.jsx # Customer incident view
│   │   │   ├── DeveloperIncidentManagement.jsx # Developer incidents
│   │   │   └── ClickUpHome.jsx       # Home page
│   │   ├── services/        # API service files
│   │   │   ├── api.js               # Axios configuration
│   │   │   ├── incident.service.js # Incident API calls
│   │   │   ├── service.service.js   # Service API calls
│   │   │   ├── update.service.js    # Update API calls
│   │   │   ├── app.connection.service.js # App connections
│   │   │   └── socket.js            # Socket.io client
│   │   └── redux/           # State management
│   │       ├── store.js
│   │       └── authSlice.js
│   ├── package.json         # Frontend dependencies
│   └── .env                # Frontend environment
│
├── docker-compose.yaml      # Docker configuration
└── Documentation files     # Project documentation
```

---

## 4. Key Features

### Customer Features

| Feature | Description |
|---------|-------------|
| **Public Status Page** | View system health and active incidents |
| **Report Issues** | Submit new incidents with severity levels |
| **Track Issues** | Monitor status of reported issues |
| **View Updates** | See real-time updates from team |
| **Service Monitoring** | Check operational status of all services |

### Team/Internal Features

| Feature | Description |
|---------|-------------|
| **Incident Dashboard** | View all incidents in one place |
| **Search & Filter** | Find incidents by keyword, severity, status |
| **Status Management** | Change incident status (Open → In Progress → Resolved) |
| **Add Updates** | Post updates to communicate with customers |
| **Service Management** | Update service status (Operational/Degraded/Down) |
| **Real-time Chat** | Chat with customers about incidents |
| **Notifications** | Receive notifications for new incidents |

### Technical Features

| Feature | Description |
|---------|-------------|
| **REST API** | Full RESTful API with 8 endpoint groups |
| **Real-time Updates** | Socket.io for live data |
| **File Attachments** | Upload files to incidents |
| **User Authentication** | Secure login/registration system |
| **Role-based Access** | Different permissions for users |
| **Responsive Design** | Works on mobile, tablet, and desktop |

---

## 5. How to Run the Project

### Prerequisites

Before starting, ensure you have installed:
- **Node.js** (v18 or higher)
- **PostgreSQL** (v18)
- **npm** (comes with Node.js)

### Starting the Backend Server

```powershell
# Open terminal and navigate to backend directory
cd D:\incident-platform\backend

# Install dependencies (first time only)
npm install

# Start the server
npm start
```

**Expected Output:**
```
Server running on port 5000
Database connected successfully
```

### Starting the Frontend Application

```powershell
# Open a NEW terminal and navigate to frontend directory
cd D:\incident-platform\frontend

# Install dependencies (first time only)
npm install

# Start the application
npm start
```

**Expected Output:**
```
Compiled successfully!
You can now view frontend in the browser.
Local: http://localhost:3000
```

### Using Docker (Alternative)

```powershell
# Start all services with Docker
docker-compose up -d

# View running containers
docker-compose ps

# Stop services
docker-compose down
```

---

## 6. Accessing the Application

### Main Pages

| URL | Page Name | Users | Purpose |
|-----|-----------|-------|---------|
| `http://localhost:3000/` | Home/ClickUp | All | Landing page |
| `http://localhost:3000/login` | Login | All | User authentication |
| `http://localhost:3000/register` | Register | All | New user registration |
| `http://localhost:3000/public-status` | Public Status | Customers | View system status |
| `http://localhost:3000/customer-report` | Report Issue | Customers | Report problems |
| `http://localhost:3000/internal-dashboard` | Team Dashboard | Team | Manage incidents |
| `http://localhost:3000/incidents` | Incidents | Team | Technical incidents |
| `http://localhost:3000/services` | Services | Team | Manage services |
| `http://localhost:3000/updates` | Updates | Team | Manage updates |

---

## 7. User Types & Workflows

### Customer Workflow

```
STEP 1: Visit Public Status Page
        └─ See system health and active incidents

STEP 2: Report an Issue
        └─ Go to /customer-report
        └─ Enter name (saved in browser)
        └─ Click "Report New Issue"
        └─ Fill form: Title, Description, Severity
        └─ Submit

STEP 3: Track Your Issue
        └─ See issue in "Your Reported Issues"
        └─ Check status (Open/In Progress/Resolved)
        └─ View timeline of updates

STEP 4: See Resolution
        └─ Issue moves to "Recently Resolved"
        └─ Full timeline visible
```

### Internal Team Workflow

```
STEP 1: Login to Dashboard
        └─ Go to /internal-dashboard
        └─ See all incidents in left panel

STEP 2: Manage Incident
        └─ Click incident to view details
        └─ Change status: Open → In Progress → Resolved

STEP 3: Communicate Updates
        └─ Add update with message
        └─ Select update type (Alert/Incident/Maintenance/Resolved)
        └─ Customers see updates immediately

STEP 4: Monitor Services
        └─ View all services at bottom
        └─ Change status: Operational/Degraded/Down
        └─ Customers see status changes
```

---

## 8. Color Coding System

### Severity Levels (Incidents)

| Color | Level | Meaning |
|-------|-------|---------|
| 🔴 | **CRITICAL** | System down, affects everyone |
| 🟠 | **HIGH** | Major feature broken |
| 🟡 | **MEDIUM** | Some features affected |
| 🟢 | **LOW** | Minor issue, workaround available |

### Incident Status

| Color | Status | Meaning |
|-------|--------|---------|
| 🔴 | **OPEN** | Not started yet, needs attention |
| 🔵 | **IN_PROGRESS** | Team actively working on it |
| ✅ | **RESOLVED** | Issue fixed and closed |

### Service Status

| Color | Status | Meaning |
|-------|--------|---------|
| ✅ | **OPERATIONAL** | Working perfectly |
| ⚠️ | **DEGRADED** | Having issues but working |
| ❌ | **DOWN** | Not working at all |

---

## 9. Database Overview

### Tables

| Table | Purpose |
|-------|---------|
| **users** | Store user accounts and authentication |
| **incidents** | Store reported issues |
| **services** | Store service information and status |
| **incident_updates** | Store status updates for incidents |
| **notifications** | Store user notifications |
| **chat_messages** | Store real-time chat messages |
| **attachments** | Store file attachments |
| **app_connections** | Store third-party app connections |

### Data Flow

```
Customer Report → incidents table
Team adds update → incident_updates table
Team changes status → incidents table + services table
Public Status reads → incidents + services + incident_updates
```

---

## 10. API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/user` | Get current user |

### Incidents

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/incidents` | Get all incidents |
| POST | `/api/incidents/value` | Create new incident |
| GET | `/api/incidents/:id` | Get incident by ID |
| PUT | `/api/incidents/:id` | Update incident |
| DELETE | `/api/incidents/:id` | Delete incident |

### Services

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/services` | Get all services |
| POST | `/api/services` | Create service |
| PUT | `/api/services/:id` | Update service |
| DELETE | `/api/services/:id` | Delete service |

### Updates

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/updates` | Get all updates |
| POST | `/api/updates` | Create update |
| PUT | `/api/updates/:id` | Update update |
| DELETE | `/api/updates/:id` | Delete update |

### Chat & Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/chat/:incidentId` | Get chat messages |
| POST | `/api/chat` | Send message |
| GET | `/api/notifications` | Get notifications |
| POST | `/api/notifications/mark-read` | Mark as read |

### Attachments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/attachments/upload` | Upload file |
| GET | `/api/attachments/:id` | Download file |

---

## 11. Real-World Example

### Scenario: Database Server Goes Down

```
MINUTE 1-5: Customer Reports Issue
─────────────────────────────────
Customer visits /customer-report
Enters:
  - Name: "John Smith"
  - Title: "Cannot access my account"
  - Severity: CRITICAL
Submits form
Issue #47 created in database
Status: OPEN

MINUTE 6-10: Team Sees It
─────────────────────────────────
Internal Dashboard shows new incident #47
Team member clicks to view details
Sees: "Cannot access account" - CRITICAL - OPEN
Clicks "In Progress" button
Starts investigation

MINUTE 11-20: Team Communicates
─────────────────────────────────
Team adds update: "Investigating database logs"
Update type: INCIDENT
Customers see on Public Status Page:
  - Incident #47: IN_PROGRESS
  - Latest update: "Investigating database logs"

MINUTE 21-30: Issue Resolved
─────────────────────────────────
Team adds update: "Root cause: disk full, cleared"
Update type: RESOLVED
Changes incident status to RESOLVED
Changes Database Server to OPERATIONAL

RESULT: Complete Transparency
─────────────────────────────────
Customer checks /public-status
Sees incident #47 in "Recently Resolved"
Full timeline visible:
  - 🚨 Issue reported
  - 📢 Investigating database logs
  - 📢 Root cause: disk full
  - ✅ Service restored

Customer knows exactly what happened!
```

---

## 12. Benefits & Value

### For Customers
- ✅ Easy way to report issues
- ✅ Real-time visibility into incident status
- ✅ Transparent communication from team
- ✅ Know when issues are resolved
- ✅ View overall system health

### For Internal Team
- ✅ Centralized incident management
- ✅ Easy status updates
- ✅ Built-in communication with customers
- ✅ Service health monitoring
- ✅ Search and filter capabilities

### For Business
- ✅ Improved customer satisfaction
- ✅ Faster incident resolution
- ✅ Transparent communication builds trust
- ✅ Complete audit trail
- ✅ Professional appearance

---

## 13. Development Commands Quick Reference

### Installation

```bash
# Install all dependencies
cd backend && npm install
cd frontend && npm install
```

### Running

```bash
# Start backend
cd backend && npm start

# Start frontend
cd frontend && npm start
```

### Database

```bash
# Run seed script (create sample data)
cd backend && node src\scripts\seedUsers.js

# Run sample tickets
cd backend && node src\scripts\addSampleTickets.js
```

### Docker

```bash
# Start with Docker
docker-compose up -d

# Stop Docker
docker-compose down

# View logs
docker-compose logs -f
```

---

## 14. File Statistics

| Category | Count |
|----------|-------|
| Backend JavaScript files | 25+ |
| Frontend JSX components | 20+ |
| CSS files | 15+ |
| API Routes | 8 groups |
| Database Tables | 8 |
| Documentation files | 10+ |

---

## 15. Support & Documentation

### Available Documentation

| File | Description |
|------|-------------|
| `README.md` | Basic project info |
| `SYSTEM_ARCHITECTURE.md` | Technical architecture |
| `INCIDENT_MANAGEMENT_SYSTEM.md` | Feature overview |
| `QUICK_START_GUIDE.md` | Getting started |
| `IMPLEMENTATION_COMPLETE.md` | Implementation details |
| `CLI_DEEP_DIVE.md` | Command line guide |

---

## 16. Summary

The **Incident Management Platform** is a complete solution for:

1. **Incident Tracking** - From customer report to resolution
2. **Customer Communication** - Real-time updates visible to customers
3. **Service Monitoring** - Track health of all services
4. **Team Collaboration** - Central dashboard for the team
5. **Transparency** - Complete audit trail of all actions

### Technology Stack
- **Frontend**: React 19, React Router, Redux, Socket.io
- **Backend**: Node.js 18+, Express.js 5
- **Database**: PostgreSQL 18

### Key URLs
- Backend API: http://localhost:5000
- Frontend: http://localhost:3000

---

**Document Version:** 1.0
**Last Updated:** February 2026
**For:** Management Review
