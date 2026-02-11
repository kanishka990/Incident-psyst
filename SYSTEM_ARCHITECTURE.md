# 📋 System Architecture Overview

## Complete Incident Management Platform

```
┌─────────────────────────────────────────────────────────────────────┐
│                    INCIDENT MANAGEMENT SYSTEM                        │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │              CUSTOMER VIEW (Public Pages)                     │   │
│  │                                                               │   │
│  │  ┌─────────────────────┐  ┌──────────────────────────────┐   │   │
│  │  │ Public Status Page  │  │ Customer Report Page         │   │   │
│  │  │ ━━━━━━━━━━━━━━━━━  │  │ ━━━━━━━━━━━━━━━━━━━━━━━━   │   │   │
│  │  │                     │  │                              │   │   │
│  │  │ • System Status     │  │ • Report Issues              │   │   │
│  │  │ • Service Health    │  │ • Severity Selection         │   │   │
│  │  │ • Active Incidents  │  │ • Track Your Issues          │   │   │
│  │  │ • Updates Timeline  │  │ • See Status Updates         │   │   │
│  │  │ • Resolved Issues   │  │ • View Statistics            │   │   │
│  │  │                     │  │                              │   │   │
│  │  │ URL: /public-status │  │ URL: /customer-report        │   │   │
│  │  └─────────────────────┘  └──────────────────────────────┘   │   │
│  │                                                               │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │             TEAM VIEW (Internal Pages)                       │   │
│  │                                                               │   │
│  │              ┌──────────────────────────────┐                │   │
│  │              │ Internal Team Dashboard      │                │   │
│  │              │ ━━━━━━━━━━━━━━━━━━━━━━━━   │                │   │
│  │              │                              │                │   │
│  │  ┌─────────────────────┐  ┌────────────────┐                │   │
│  │  │ LEFT PANEL:         │  │ RIGHT PANEL:   │                │   │
│  │  │ • Incidents List    │  │ • Incident     │                │   │
│  │  │ • Search & Filter   │  │   Details      │                │   │
│  │  │ • Quick Selection   │  │ • Change       │                │   │
│  │  │ • View All Issues   │  │   Status       │                │   │
│  │  │                     │  │ • Add Updates  │                │   │
│  │  │                     │  │ • View         │                │   │
│  │  │                     │  │   Timeline     │                │   │
│  │  └─────────────────────┘  └────────────────┘                │   │
│  │                                                               │   │
│  │  ┌──────────────────────────────────────────────┐            │   │
│  │  │ BOTTOM: Service Status Monitor                │            │   │
│  │  │ • Change Service Status                      │            │   │
│  │  │ • Monitor System Health                      │            │   │
│  │  └──────────────────────────────────────────────┘            │   │
│  │                                                               │   │
│  │                 URL: /internal-dashboard                      │   │
│  │                                                               │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                              ↓ ↓ ↓
┌─────────────────────────────────────────────────────────────────────┐
│                          BACKEND API                                 │
│                     (Express.js on Port 5000)                        │
│                                                                       │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │ INCIDENTS API    │  │ SERVICES API     │  │ UPDATES API      │  │
│  │ ━━━━━━━━━━━━━   │  │ ━━━━━━━━━━━━━   │  │ ━━━━━━━━━━━━   │  │
│  │                  │  │                  │  │                  │  │
│  │ GET /incidents   │  │ GET /services    │  │ GET /updates     │  │
│  │ POST /incidents/ │  │ POST /services   │  │ POST /updates    │  │
│  │      value       │  │ PUT /services/:id│  │ PUT /updates/:id │  │
│  │ PUT /incidents   │  │ DELETE /services │  │ DELETE /updates  │  │
│  │     /:id         │  │        /:id      │  │      /:id        │  │
│  │ DELETE /incidents│  │                  │  │                  │  │
│  │        /:id      │  │                  │  │                  │  │
│  │                  │  │                  │  │                  │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                              ↓ ↓ ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        DATABASE (PostgreSQL)                         │
│                   (localhost:5432, incidentdb)                       │
│                                                                       │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │ incidents TABLE  │  │ services TABLE   │  │incident_updates  │  │
│  │ ━━━━━━━━━━━━━   │  │ ━━━━━━━━━━━━━   │  │   TABLE          │  │
│  │                  │  │                  │  │ ━━━━━━━━━━━━   │  │
│  │ • id (PK)        │  │ • id (PK)        │  │ • id (PK)        │  │
│  │ • title          │  │ • name           │  │ • incident_id(FK)│  │
│  │ • description    │  │ • description    │  │ • message        │  │
│  │ • severity       │  │ • status         │  │ • update_type    │  │
│  │ • status         │  │ • created_at     │  │ • created_at     │  │
│  │ • created_at     │  │ • updated_at     │  │ • updated_at     │  │
│  │ • updated_at     │  │                  │  │                  │  │
│  │                  │  │                  │  │                  │  │
│  │ [3+ rows]        │  │ [5+ rows]        │  │ [5+ rows]        │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    INCIDENT LIFECYCLE                            │
└─────────────────────────────────────────────────────────────────┘

STEP 1: CUSTOMER REPORTS
┌──────────────────────────────────┐
│ Customer goes to                  │
│ /customer-report                  │
│                                   │
│ • Enters name                     │
│ • Fills issue form                │
│ • Selects severity                │
│ • Clicks "Submit Issue"           │
└──────────────────────────────────┘
         ↓ POST /api/incidents/value
┌──────────────────────────────────┐
│ Backend receives POST request     │
│                                   │
│ • Validates data                  │
│ • Saves to incidents TABLE        │
│ • Returns new incident with ID    │
└──────────────────────────────────┘
         ↓ NEW INCIDENT CREATED
┌──────────────────────────────────┐
│ Database                          │
│ INSERT INTO incidents (...)       │
│ ID #47 created                    │
└──────────────────────────────────┘

───────────────────────────────────────────────────────────────────

STEP 2: TEAM SEES & MANAGES
┌──────────────────────────────────┐
│ Team goes to                      │
│ /internal-dashboard               │
│                                   │
│ • Sees incident #47 in list       │
│ • Clicks to view details          │
│ • Changes status to "In Progress" │
└──────────────────────────────────┘
         ↓ PUT /api/incidents/:id
┌──────────────────────────────────┐
│ Backend updates incident          │
│                                   │
│ • Updates status in DB            │
│ • Returns updated incident        │
└──────────────────────────────────┘
         ↓ STATUS UPDATED
┌──────────────────────────────────┐
│ Database                          │
│ UPDATE incidents                  │
│ SET status = "IN_PROGRESS"        │
│ WHERE id = 47                     │
└──────────────────────────────────┘

───────────────────────────────────────────────────────────────────

STEP 3: TEAM ADDS UPDATES
┌──────────────────────────────────┐
│ Team fills update form on         │
│ /internal-dashboard               │
│                                   │
│ • Type: "Investigating database"  │
│ • Message: "Found slow queries"   │
│ • Clicks "Post Update"            │
└──────────────────────────────────┘
         ↓ POST /api/updates
┌──────────────────────────────────┐
│ Backend creates update            │
│                                   │
│ • Saves to incident_updates TABLE │
│ • Links to incident #47           │
│ • Returns new update              │
└──────────────────────────────────┘
         ↓ UPDATE SAVED
┌──────────────────────────────────┐
│ Database                          │
│ INSERT INTO incident_updates      │
│ (incident_id: 47, message: "...",)│
└──────────────────────────────────┘

───────────────────────────────────────────────────────────────────

STEP 4: CUSTOMERS SEE UPDATES
┌──────────────────────────────────┐
│ Customer goes to                  │
│ /public-status                    │
│                                   │
│ • Sees incident #47               │
│ • Status: "In Progress"           │
│ • Reads latest updates            │
│ • Knows team is working on it     │
└──────────────────────────────────┘
         ↓ GET /api/incidents + /api/updates
┌──────────────────────────────────┐
│ Backend fetches data              │
│                                   │
│ • SELECT from incidents           │
│ • SELECT from incident_updates    │
│ • JOIN on incident_id             │
│ • Returns combined data           │
└──────────────────────────────────┘
         ↓ DATA DISPLAYED
┌──────────────────────────────────┐
│ React renders                     │
│ • Shows incident details          │
│ • Shows updates timeline          │
│ • Shows current status            │
│ • Shows when last updated         │
└──────────────────────────────────┘

───────────────────────────────────────────────────────────────────

STEP 5: TEAM RESOLVES ISSUE
┌──────────────────────────────────┐
│ Team on /internal-dashboard       │
│                                   │
│ • Issue now fixed                 │
│ • Changes status to "Resolved"    │
│ • Adds final update: "Fixed"      │
│ • Clicks "Resolved" button        │
└──────────────────────────────────┘
         ↓ PUT /api/incidents/47 + POST /api/updates
┌──────────────────────────────────┐
│ Backend updates                   │
│                                   │
│ • Updates status to "RESOLVED"    │
│ • Creates new update              │
│ • Returns updated incident        │
└──────────────────────────────────┘
         ↓ ISSUE RESOLVED
┌──────────────────────────────────┐
│ Database                          │
│ UPDATE incidents                  │
│ SET status = "RESOLVED"           │
│                                   │
│ INSERT INTO incident_updates      │
│ (message: "Issue resolved...")    │
└──────────────────────────────────┘

───────────────────────────────────────────────────────────────────

STEP 6: CUSTOMERS SEE RESOLUTION
┌──────────────────────────────────┐
│ Customer checks                   │
│ /public-status again              │
│                                   │
│ • Incident #47 now in             │
│   "Recently Resolved" section      │
│ • Status shows: Resolved          │
│ • Timeline shows all steps        │
│ • Can see complete story          │
│ • Knows exactly what happened     │
└──────────────────────────────────┘

RESULT: Complete Transparency & Communication ✅
```

---

## File Organization

```
incident-platform/
│
├── backend/                          ← API Server (Port 5000)
│   ├── src/
│   │   ├── server.js
│   │   ├── app.js
│   │   ├── controllers/
│   │   │   ├── incident.controller.js
│   │   │   ├── service.controller.js
│   │   │   └── update.controller.js
│   │   ├── routes/
│   │   │   ├── incident.routes.js
│   │   │   ├── service.routes.js
│   │   │   └── update.routes.js
│   │   └── config/
│   │       └── db.js
│   └── package.json
│
├── frontend/                         ← React App (Port 3000)
│   ├── src/
│   │   ├── App.jsx                  ← Updated with 3 new routes
│   │   ├── pages/
│   │   │   ├── PublicStatusPage.jsx      ✨ NEW
│   │   │   ├── PublicStatusPage.css      ✨ NEW
│   │   │   ├── CustomerReportIssue.jsx   ✨ NEW
│   │   │   ├── CustomerReportIssue.css   ✨ NEW
│   │   │   ├── InternalDashboard.jsx     ✨ NEW
│   │   │   ├── InternalDashboard.css     ✨ NEW
│   │   │   └── [other pages...]
│   │   ├── components/
│   │   │   └── Navbar.jsx           ← Updated with new links
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── incident.service.js
│   │   │   ├── service.service.js
│   │   │   └── update.service.js
│   │   └── [other files...]
│   └── package.json
│
├── Documentation/                    ← New Guides
│   ├── INCIDENT_MANAGEMENT_SYSTEM.md  ✨ NEW
│   ├── QUICK_START_GUIDE.md           ✨ NEW
│   ├── IMPLEMENTATION_COMPLETE.md     ✨ NEW
│   ├── COMPLETE_DOCUMENTATION.md
│   ├── API_UPDATE_GUIDE.md
│   └── SETUP_GUIDE.md
│
└── Database/
    └── PostgreSQL incidentdb
        ├── incidents table
        ├── services table
        └── incident_updates table
```

---

## Technology Stack

```
FRONTEND                BACKEND              DATABASE
────────────────────    ────────────────     ──────────────────
React 19.2              Node.js 18+          PostgreSQL 18
├─ Components            ├─ Express.js 5     ├─ incidentdb
├─ React Hooks           ├─ pg driver        ├─ incidents
├─ React Router 7        ├─ Middleware       ├─ services
├─ Axios 1.13            │   (CORS, JSON)    └─ incident_updates
└─ CSS3 Gradients        └─ Controllers
                            + Routes
```

---

## Key Features Matrix

```
┌──────────────────────┬──────────────┬──────────────┬──────────────┐
│ Feature              │ Public Page  │ Customer     │ Team         │
│                      │              │ Report Page  │ Dashboard    │
├──────────────────────┼──────────────┼──────────────┼──────────────┤
│ View Incidents       │ ✅ READ ONLY │ ✅ OWN ONLY │ ✅ ALL       │
│ Report Issue         │ ❌ NO        │ ✅ YES       │ ❌ NO        │
│ Change Status        │ ❌ NO        │ ❌ NO        │ ✅ YES       │
│ Add Updates          │ ❌ NO        │ ❌ NO        │ ✅ YES       │
│ View Services        │ ✅ YES       │ ❌ NO        │ ✅ YES       │
│ Change Service       │ ❌ NO        │ ❌ NO        │ ✅ YES       │
│ Status               │              │              │              │
│ Search/Filter        │ ✅ YES       │ ✅ YES       │ ✅ YES       │
│ View Timeline        │ ✅ YES       │ ✅ YES       │ ✅ YES       │
│ Statistics           │ ✅ YES       │ ✅ YES       │ ✅ YES       │
│ Auto Refresh         │ ✅ 30 SEC    │ ❌ NO        │ ❌ NO        │
└──────────────────────┴──────────────┴──────────────┴──────────────┘
```

---

## Status: ✅ COMPLETE

All components built, tested, and documented!

```
✅ Frontend Pages: 3/3 created
✅ CSS Styling: 3/3 created  
✅ Routes: 3/3 added
✅ Navigation: Updated
✅ APIs: Connected
✅ Database: Integrated
✅ Documentation: Complete
✅ Ready to Deploy

🚀 READY FOR USE!
```
