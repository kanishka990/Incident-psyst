# 🚀 Command Line Deep Dive: Incident Management Platform

A comprehensive guide to exploring, understanding, and navigating the Incident Management Platform using command line commands.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Directory Structure Exploration](#directory-structure-exploration)
3. [Backend Deep Dive](#backend-deep-dive)
4. [Frontend Deep Dive](#frontend-deep-dive)
5. [Database Exploration](#database-exploration)
6. [API Endpoint Discovery](#api-endpoint-discovery)
7. [Running and Testing](#running-and-testing)
8. [Common Development Tasks](#common-development-tasks)

---

## Project Overview

This is a full-stack Incident Management Platform with:

- **Frontend**: React 19 with React Router, Redux, and Socket.io
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL
- **Real-time**: Socket.io for chat and notifications
- **File Storage**: Local uploads with multer

---

## Directory Structure Exploration

### View Top-Level Project Structure

```bash
# Windows (cmd.exe)
dir

# Windows (PowerShell)
ls

# Git Bash / Linux / Mac
ls -la
```

**Expected Output:**
```
backend/
frontend/
docker-compose.yaml
README.md
SYSTEM_ARCHITECTURE.md
...
```

### Explore Backend Directory

```bash
# Navigate to backend
cd backend

# List all files (including hidden)
dir /a

# Windows with tree view (PowerShell)
tree /f

# Unix-like systems
tree -L 3
```

### Explore Frontend Directory

```bash
# Navigate to frontend
cd frontend

# List with details
dir

# Show directory structure visually
tree /f /a
```

### View Complete Project Tree

```bash
# Using tree command (install via: winget install Git.Git or use Git Bash)
tree -L 3

# Or recursively list all files
dir /s /b
```

---

## Backend Deep Dive

### Backend Directory Structure

```
backend/
├── src/
│   ├── server.js           # Main server entry point
│   ├── app.js              # Express app configuration
│   ├── config/
│   │   └── db.js           # PostgreSQL connection
│   ├── controllers/        # Request handlers
│   │   ├── auth.controller.js
│   │   ├── incident.controller.js
│   │   ├── service.controller.js
│   │   ├── update.controller.js
│   │   ├── chat.controller.js
│   │   ├── notification.controller.js
│   │   ├── attachment.controller.js
│   │   └── app.connection.controller.js
│   ├── routes/             # API route definitions
│   │   ├── auth.routes.js
│   │   ├── incident.routes.js
│   │   ├── service.routes.js
│   │   ├── update.routes.js
│   │   ├── chat.routes.js
│   │   ├── notification.routes.js
│   │   ├── attachment.routes.js
│   │   └── app.connection.routes.js
│   ├── middleware/        # Express middleware
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   └── upload.js       # File upload config
│   └── scripts/           # Database scripts
│       ├── seedUsers.js
│       ├── addSampleTickets.js
│       ├── createAppConnectionsTable.js
│       └── ...
├── uploads/                # File uploads directory
├── package.json
└── .env
```

### View Backend Files

```bash
# Navigate to backend
cd backend

# List all JavaScript files recursively
dir /s /b *.js

# Or using PowerShell
Get-ChildItem -Recurse -Filter *.js | Select-Object FullName
```

### Read Key Backend Files

```bash
# View main server file
type src\server.js

# View Express app configuration
type src\app.js

# View database configuration
type src\config\db.js
```

### View Package.json Dependencies

```bash
# View backend dependencies
type package.json

# Or parse JSON (PowerShell)
Get-Content package.json | ConvertFrom-Json | Select-Object -ExpandProperty dependencies
```

### Explore Backend Controllers

```bash
# List all controllers
dir src\controllers

# View specific controller
type src\controllers\incident.controller.js
```

### Search for Specific Code Patterns

```bash
# Find all API endpoints (Windows)
findstr /s /i "router\." src\routes\*.js

# Find all HTTP methods (PowerShell)
Select-String -Path "src\routes\*.js" -Pattern "router\.(get|post|put|delete)"

# Find all database queries
findstr /s "pool.query" src\*.js
```

### Find All\controllers Route Definitions

```bash
# Search for route definitions
findstr /s "router\." backend\src\routes\*.js

# Count routes per file
for %f in (backend\src\routes\*.js) do @echo %f && findstr /c:"router." %f | find /c "/"
```

---

## Frontend Deep Dive

### Frontend Directory Structure

```
frontend/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── favicon.ico
├── src/
│   ├── index.js              # React entry point
│   ├── index.css             # Global styles
│   ├── App.jsx               # Main App component
│   ├── App.js                # Original App (legacy)
│   ├── components/           # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── Navbar.css
│   │   ├── Chat.jsx
│   │   ├── Chat.css
│   │   ├── Notifications.jsx
│   │   ├── CreateIncident.jsx
│   │   ├── ServiceStatusCard.jsx
│   │   └── StatusPage.jsx
│   ├── pages/                # Page components
│   │   ├── Login.jsx
│   │   ├── Login.css
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Incidents.jsx
│   │   ├── Incidents.css
│   │   ├── Services.jsx
│   │   ├── Services.css
│   │   ├── Updates.jsx
│   │   ├── Updates.css
│   │   ├── PublicStatusPage.jsx
│   │   ├── PublicStatusPage.css
│   │   ├── CustomerReportIssue.jsx
│   │   ├── CustomerReportIssue.css
│   │   ├── InternalDashboard.jsx
│   │   ├── InternalDashboard.css
│   │   ├── CustomerIncidentManagement.jsx
│   │   ├── CustomerIncidentManagement.css
│   │   ├── DeveloperIncidentManagement.jsx
│   │   ├── DeveloperIncidentManagement.css
│   │   ├── ProfileSettings.jsx
│   │   ├── ForgotPassword.jsx
│   │   └── ClickUpHome.jsx
│   ├── services/             # API service files
│   │   ├── api.js            # Axios instance
│   │   ├── incident.service.js
│   │   ├── service.service.js
│   │   ├── update.service.js
│   │   ├── app.connection.service.js
│   │   └── socket.js         # Socket.io client
│   ├── redux/                # Redux state management
│   │   ├── store.js
│   │   └── authSlice.js
│   └── App.test.js
├── package.json
└── .env
```

### View Frontend Files

```bash
# Navigate to frontend
cd frontend

# List all JSX files
dir /s /b *.jsx

# List all CSS files
dir /s /b *.css

# List all service files
dir src\services
```

### View Package.json

```bash
# View all dependencies
type package.json
```

### Search Frontend Code

```bash
# Find all React components
findstr /s /i "import.*from" src\pages\*.jsx

# Find all API calls
findstr /s "api\." src\pages\*.jsx

# Find all Redux dispatches
findstr /s "dispatch(" src\*.jsx
```

### Find All Routes in Frontend

```bash
# Search for Route definitions
findstr /s "Route" src\App.jsx

# Search for navigation links
findstr /s "to=" src\components\*.jsx
```

### View API Service Files

```bash
# View main API configuration
type src\services\api.js

# View incident service
type src\services\incident.service.js

# View socket service
type src\services\socket.js
```

---

## Database Exploration

### View Database Configuration

```bash
# View backend .env file
type backend\.env

# View database config
type backend\src\config\db.js
```

### List Database Scripts

```bash
# List all scripts
dir backend\src\scripts

# View specific script
type backend\src\scripts\seedUsers.js
```

### Common Database Operations

```bash
# Note: These require PostgreSQL client installed

# Connect to database (requires psql)
psql -U postgres -d incidentdb -c "\dt"

# List all tables
psql -U postgres -d incidentdb -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"

# Describe a table
psql -U postgres -d incidentdb -c "\d incidents"

# View table data
psql -U postgres -d incidentdb -c "SELECT * FROM incidents LIMIT 5;"
```

---

## API Endpoint Discovery

### Find All API Endpoints in Backend

```bash
# Navigate to backend
cd backend

# Find all GET routes
findstr /s "router\.get" src\routes\*.js

# Find all POST routes
findstr /s "router\.post" src\routes\*.js

# Find all PUT routes
findstr /s "router\.put" src\routes\*.js

# Find all DELETE routes
findstr /s "router\.delete" src\routes\*.js
```

### Create API Endpoint Map

```bash
# Extract all route definitions
for /r backend\src\routes %f in (*.js) do @echo === %f === && findstr /n "router\." %f
```

### Common API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/incidents` | Get all incidents |
| POST | `/api/incidents` | Create incident |
| GET | `/api/incidents/:id` | Get incident by ID |
| PUT | `/api/incidents/:id` | Update incident |
| DELETE | `/api/incidents/:id` | Delete incident |
| GET | `/api/services` | Get all services |
| POST | `/api/services` | Create service |
| GET | `/api/updates` | Get all updates |
| POST | `/api/updates` | Create update |
| GET | `/api/chat/:incidentId` | Get chat messages |
| POST | `/api/chat` | Send chat message |
| GET | `/api/notifications` | Get notifications |
| POST | `/api/attachments/upload` | Upload file |
| GET | `/api/app-connections` | Get app connections |

---

## Running and Testing

### Install Dependencies

```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd frontend
npm install
```

### Start Development Servers

```bash
# Start backend (from project root)
cd backend
node src\server.js

# Start frontend (from project root, new terminal)
cd frontend
npm start
```

### Using Docker

```bash
# Start all services with Docker
docker-compose up -d

# View running containers
docker-compose ps

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Run Database Scripts

```bash
# Run seed script
cd backend
node src\scripts\seedUsers.js

# Run other scripts
node src\scripts\addSampleTickets.js
node src\scripts\createAppConnectionsTable.js
```

---

## Common Development Tasks

### Adding a New API Endpoint

1. **Create the route** in `backend/src/routes/`:
```bash
type nul > backend\src\routes\custom.routes.js
```

2. **Create the controller** in `backend/src/controllers/`:
```bash
type nul > backend\src\controllers\custom.controller.js
```

3. **Register the route** in `backend/src/app.js`:
```bash
findstr /n "routes" backend\src\app.js
```

### Adding a New Frontend Page

1. **Create the page component**:
```bash
type nul > frontend\src\pages\NewPage.jsx
```

2. **Add the route** in `frontend/src/App.jsx`:
```bash
findstr /n "Route" frontend\src\App.jsx
```

3. **Add navigation** in `frontend/src/components/Navbar.jsx`:
```bash
findstr /n "Link" frontend\src\components\Navbar.jsx
```

### Finding Specific Code

```bash
# Find a specific function
findstr /s "functionName" backend\src\*.js

# Find a specific variable
findstr /s "const.*variableName" frontend\src\*.jsx

# Find all imports
findstr /s "^import" frontend\src\pages\*.jsx

# Find all CSS classes
findstr /s "className=" frontend\src\*.jsx
```

### Viewing Git Status

```bash
# Check git status
git status

# View git diff
git diff

# View commit history
git log --oneline -10
```

### Finding Files by Name

```bash
# Windows - find file
dir /s /b filename.js

# Windows PowerShell
Get-ChildItem -Recurse -Filter "filename.js"

# Unix-like systems
find . -name "filename.js"
```

### Counting Lines of Code

```bash
# Count lines in backend
(for %f in (backend\src\*.js backend\src\*\*\*.js) do @type %f) | find /c /v ""

# Count lines in frontend
(for %f in (frontend\src\*.jsx frontend\src\**\*.jsx) do @type %f) | find /c /v ""
```

### Finding TODO Comments

```bash
# Find TODO in backend
findstr /s /i "TODO" backend\src\*.js

# Find TODO in frontend
findstr /s /i "TODO" frontend\src\*.jsx
```

---

## Quick Reference Commands

### Essential Windows Commands

| Command | Description |
|---------|-------------|
| `dir` | List directory contents |
| `cd` | Change directory |
| `type` | Display file contents |
| `findstr` | Search for text in files |
| `mkdir` | Create directory |
| `copy` | Copy files |
| `move` | Move/rename files |
| `del` | Delete files |

### Essential PowerShell Commands

| Command | Description |
|---------|-------------|
| `ls` | List directory contents |
| `cd` | Change directory |
| `cat` | Display file contents |
| `Select-String` | Search in files |
| `Get-Content` | Read file content |
| `New-Item` | Create file/directory |

### Essential Git Commands

| Command | Description |
|---------|-------------|
| `git status` | Show working tree status |
| `git add .` | Stage all changes |
| `git commit -m "message"` | Commit changes |
| `git push` | Push to remote |
| `git pull` | Pull from remote |
| `git checkout -b branch` | Create new branch |

---

## Summary

This document provides a comprehensive command-line-based guide for exploring and understanding the Incident Management Platform. Use these commands to:

1. **Navigate** the project structure
2. **Discover** API endpoints and routes
3. **Find** specific code patterns
4. **Run** development servers
5. **Perform** common development tasks

For more details, refer to:
- [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md)
- [QUICK_START_GUIDE.md](./QUICK_START_GUIDE.md)
- [IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md)
