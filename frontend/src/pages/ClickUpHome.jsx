import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './ClickUpHome.css';
import appConnectionService from '../services/app.connection.service';

// Brand icons as SVG components
const SlackIcon = () => (
  <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const GoogleDriveIcon = () => (
  <svg viewBox="0 0 87.3 78" fill="white" width="18" height="18">
    <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.9 2.5 3.2 3.3l-15.4-26.7c-3.9 6.75-3.9 15.15 8.35 16.75zm40.7-23.25c0-5.4-4.35-9.75-9.75-9.75-5.4 0-9.75 4.35-9.75 9.75 0 5.4 4.35 9.75 9.75 9.75 5.4 0 9.75-4.35 9.75-9.75zm21.7 12.9 12.15-7.05c1.2-.7 1.8-2 1.5-3.3-.3-1.3-1.4-2.25-2.75-2.55l-13.5-3.15c-2.7-.6-5.4.3-7.35 2.25l-12.6 12.6 4.5 7.8 16.05-4.65 6.75 2.25z"/>
  </svg>
);

const GoogleCalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
  </svg>
);

const NotionIcon = () => (
  <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
    <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.98-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.886l-15.177.887c-.56.047-.747.327-.747.934zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952l1.448.327s0 .84-1.168.84l-3.222.186c-.094-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.514.28-.886.747-.933zM2.1 1.155l13.075-.98c1.634-.14 2.055-.047 3.082.7l4.25 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.921c0-.839.374-1.48 1.681-1.766z"/>
  </svg>
);

const MicrosoftTeamsIcon = () => (
  <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
    <path d="M20.625 8.5h-6.25a1.125 1.125 0 0 0-1.125 1.125v6.25A1.125 1.125 0 0 0 14.375 17h6.25A1.125 1.125 0 0 0 21.75 15.875v-6.25A1.125 1.125 0 0 0 20.625 8.5z"/>
    <path d="M12.375 7a2.625 2.625 0 1 0 0-5.25 2.625 2.625 0 0 0 0 5.25zM17.25 17v-6.25a2.625 2.625 0 0 0-2.625-2.625h-5.25A2.625 2.625 0 0 0 6.75 10.75v6.25A2.625 2.625 0 0 0 9.375 19.625h5.25a2.625 2.625 0 0 0 2.625-2.625z"/>
  </svg>
);

const GoogleMeetIcon = () => (
  <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
  </svg>
);

const JiraIcon = () => (
  <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
    <path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H5.736a5.215 5.215 0 0 0 5.215 5.214h2.129v2.058a5.218 5.218 0 0 0 5.215 5.214V6.758a1.001 1.001 0 0 0-1.001-1.001zM23.013 0H11.455a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057A5.215 5.215 0 0 0 24 12.483V1.005A1.005 1.005 0 0 0 23.013 0z"/>
  </svg>
);

const DropboxIcon = () => (
  <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
    <path d="M6 2l6 3.75L6 9.5 0 5.75 6 2zm12 0l6 3.75-6 3.75-6-3.75L18 2zM0 13.25L6 9.5l6 3.75-6 3.75-6-3.75zm18-3.75l6 3.75-6 3.75-6-3.75 6-3.75zM6 18.25l6-3.75 6 3.75-6 3.75-6-3.75z"/>
  </svg>
);

const OneDriveIcon = () => (
  <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
  </svg>
);

const OutlookIcon = () => (
  <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
);

// Icon mapping
const getAppIcon = (iconName) => {
  const icons = {
    slack: <SlackIcon />,
    github: <GitHubIcon />,
    notion: <NotionIcon />,
    gdrive: <GoogleDriveIcon />,
    gcal: <GoogleCalendarIcon />,
    teams: <MicrosoftTeamsIcon />,
    meet: <GoogleMeetIcon />,
    jira: <JiraIcon />,
    dropbox: <DropboxIcon />,
    onedrive: <OneDriveIcon />,
    outlook: <OutlookIcon />
  };
  return icons[iconName] || <SlackIcon />;
};

const ClickUpHome = () => {
  const navigate = useNavigate();
  const currentUserName = localStorage.getItem('userName') || 'John Doe';
  const firstName = currentUserName.split(' ')[0];
  
  const [currentView, setCurrentView] = useState('list');
  const [timeView, setTimeView] = useState('today');
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', priority: '', search: '' });
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [myTasksExpanded, setMyTasksExpanded] = useState(true);
  const [inboxExpanded, setInboxExpanded] = useState(true);
  const [activeTaskFilter, setActiveTaskFilter] = useState('assigned');
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [spaceFoldersExpanded, setSpaceFoldersExpanded] = useState({});
  
  // Connected Apps State - loaded from API
  const [connectedApps, setConnectedApps] = useState([
    { id: 'slack', name: 'Slack', icon: 'slack', color: '#4A154B', connected: false, features: ['Channel integration', 'Direct messages', 'Bot commands'] },
    { id: 'github', name: 'GitHub', icon: 'github', color: '#333', connected: false, features: ['Repository linking', 'Issue sync', 'Commit tracking'] },
    { id: 'notion', name: 'Notion', icon: 'notion', color: '#000', connected: false, features: ['Page embedding', 'Database sync', 'Wiki links'] },
    { id: 'gdrive', name: 'Google Drive', icon: 'gdrive', color: '#4285f4', connected: false, features: ['File picker', 'Auto sync', 'Share links'] },
    { id: 'gcal', name: 'Google Calendar', icon: 'gcal', color: '#4285f4', connected: false, features: ['Event sync', 'Due date reminders', 'Meeting integration'] },
    { id: 'teams', name: 'Microsoft Teams', icon: 'teams', color: '#6264A7', connected: false, features: ['Channel chat', 'Meetings', 'File sharing'] },
    { id: 'meet', name: 'Google Meet', icon: 'meet', color: '#00897B', connected: false, features: ['One-click meeting', 'Recording', 'Screen share'] },
    { id: 'jira', name: 'Jira', icon: 'jira', color: '#0052CC', connected: false, features: ['Issue sync', 'Status mapping', 'Sprint tracking'] },
    { id: 'dropbox', name: 'Dropbox', icon: 'dropbox', color: '#0061FE', connected: false, features: ['File storage', 'Version history', 'Team folders'] },
    { id: 'onedrive', name: 'OneDrive', icon: 'onedrive', color: '#0078D4', connected: false, features: ['File sync', 'SharePoint integration', 'Co-authoring'] }
  ]);
  
  const [showAppDetailModal, setShowAppDetailModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  
  // AI Chat State
  const [showAIChatModal, setShowAIChatModal] = useState(false);
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  
  // More Tools Modal State
  const [showMoreToolsModal, setShowMoreToolsModal] = useState(false);
  const [activeTool, setActiveTool] = useState(null);
  
  // Team Spaces with Folders
  const [teamSpaces, setTeamSpaces] = useState([
    { 
      id: 1, 
      name: 'Infrastructure', 
      icon: '🖥️', 
      color: '#8b5cf6', 
      tasks: 24,
      folders: [
        { id: 1, name: 'Servers', tasks: 8 },
        { id: 2, name: 'Networking', tasks: 6 },
        { id: 3, name: 'Databases', tasks: 10 }
      ]
    },
    { 
      id: 2, 
      name: 'Development', 
      icon: '💻', 
      color: '#10b981', 
      tasks: 18,
      folders: [
        { id: 1, name: 'Frontend', tasks: 5 },
        { id: 2, name: 'Backend', tasks: 7 },
        { id: 3, name: 'API', tasks: 6 }
      ]
    },
    { 
      id: 3, 
      name: 'Security', 
      icon: '🔒', 
      color: '#ef4444', 
      tasks: 12,
      folders: [
        { id: 1, name: 'Audits', tasks: 4 },
        { id: 2, name: 'Vulnerabilities', tasks: 5 },
        { id: 3, name: 'Compliance', tasks: 3 }
      ]
    },
    { 
      id: 4, 
      name: 'Support', 
      icon: '🎧', 
      color: '#3b82f6', 
      tasks: 31,
      folders: [
        { id: 1, name: 'Customer Tickets', tasks: 15 },
        { id: 2, name: 'Bug Reports', tasks: 8 },
        { id: 3, name: 'Feature Requests', tasks: 8 }
      ]
    }
  ]);
  
  const [showTeamsModal, setShowTeamsModal] = useState(false);
  const [teams] = useState([
    { id: 1, name: 'Engineering', members: 12, icon: '💻' },
    { id: 2, name: 'Support', members: 8, icon: '🎧' },
    { id: 3, name: 'Marketing', members: 6, icon: '📢' },
    { id: 4, name: 'Operations', members: 5, icon: '⚙️' }
  ]);

  const [showPeopleModal, setShowPeopleModal] = useState(false);
  const [peopleSearch, setPeopleSearch] = useState('');
  const [accountTypeFilter, setAccountTypeFilter] = useState('all');
  const [people] = useState([
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', status: 'online', team: 'Engineering', accountType: 'admin', avatar: 'A' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', status: 'online', team: 'Support', accountType: 'member', avatar: 'B' },
    { id: 3, name: 'Carol Williams', email: 'carol@example.com', status: 'offline', team: 'Marketing', avatar: 'C' },
    { id: 4, name: 'David Brown', email: 'david@example.com', status: 'online', team: 'Engineering', accountType: 'admin', avatar: 'D' },
    { id: 5, name: 'Eva Martinez', email: 'eva@example.com', status: 'offline', team: 'Operations', accountType: 'guest', avatar: 'E' },
    { id: 6, name: 'Frank Wilson', email: 'frank@example.com', status: 'online', team: 'Support', accountType: 'limited', avatar: 'F' }
  ]);

  const [showPlannerModal, setShowPlannerModal] = useState(false);
  const [plannerApps, setPlannerApps] = useState([
    { id: 'google', name: 'Google Calendar', icon: '📅', connected: false, color: '#4285f4' },
    { id: 'outlook', name: 'Microsoft Outlook', icon: '📧', connected: false, color: '#0078d4' }
  ]);

  const [showAIModal, setShowAIModal] = useState(false);
  const [showCreateSpaceModal, setShowCreateSpaceModal] = useState(false);
  const [spaceName, setSpaceName] = useState('');
  const [spaceDescription, setSpaceDescription] = useState('');
  const [spacePermissions, setSpacePermissions] = useState('private');
  const [spaceIcon, setSpaceIcon] = useState('💼');
  
  const spaceIcons = ['💼', '📊', '💻', '🎨', '📢', '⚙️', '🔒', '📈', '🎯', '🚀', '🌟', '💡', '🎬', '📱', '🌐', '🔧'];

  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const templates = [
    { id: 'incident', name: 'Incident Management', icon: '🚨', description: 'Track and resolve incidents efficiently' },
    { id: 'project', name: 'Project Management', icon: '📋', description: 'Manage projects from start to finish' },
    { id: 'content', name: 'Content Calendar', icon: '📅', description: 'Plan and schedule content' },
    { id: 'cr', name: 'Customer Request', icon: '🙋', description: 'Handle customer requests' },
    { id: 'meeting', name: 'Meeting Notes', icon: '📝', description: 'Document meeting outcomes' },
    { id: 'milestone', name: 'Milestone Tracker', icon: '🎯', description: 'Track project milestones' }
  ];

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    name: '', description: '', assignee: '', dueDate: '', priority: 'P3', tags: '', status: 'TODO', dependencyType: '', dependencyTask: ''
  });
  const [showTaskDetailModal, setShowTaskDetailModal] = useState(false);
  const [taskDetail, setTaskDetail] = useState(null);

  const kanbanColumns = [
    { id: 'TODO', name: 'To Do', color: '#64748b' },
    { id: 'IN_PROGRESS', name: 'In Progress', color: '#f59e0b' },
    { id: 'RESOLVED', name: 'Resolved', color: '#10b981' },
    { id: 'CLOSED', name: 'Closed', color: '#22c55e' }
  ];

  const priorities = [
    { id: 'P1', name: 'Critical', color: '#ef4444' },
    { id: 'P2', name: 'High', color: '#f97316' },
    { id: 'P3', name: 'Medium', color: '#eab308' },
    { id: 'P4', name: 'Low', color: '#22c55e' }
  ];

  const dependencyTypes = [
    { id: '', label: 'No dependency' },
    { id: 'waiting', label: 'Is waiting on' },
    { id: 'blocking', label: 'Is blocking' },
    { id: 'linked', label: 'Linked to' }
  ];

  const sampleIncidents = [
    { id: 101, title: 'Server downtime on Production', status: 'IN_PROGRESS', priority: 'P1', assignee: 'Alice Johnson', created_at: '2026-02-19', due_date: '2026-02-20', tags: ['infrastructure', 'critical'], spaceId: 1 },
    { id: 102, title: 'Database performance degradation', status: 'TODO', priority: 'P2', assignee: 'Bob Smith', created_at: '2026-02-18', due_date: '2026-02-21', tags: ['database'], spaceId: 2 },
    { id: 103, title: 'API rate limit exceeded', status: 'RESOLVED', priority: 'P2', assignee: 'Carol Williams', created_at: '2026-02-17', due_date: '2026-02-18', tags: ['api'], spaceId: 2 },
    { id: 104, title: 'Memory leak in microservice', status: 'TODO', priority: 'P2', assignee: 'David Brown', created_at: '2026-02-16', due_date: '2026-02-22', tags: ['memory'], spaceId: 2 },
    { id: 105, title: 'SSL certificate renewal', status: 'TODO', priority: 'P3', assignee: 'Eva Martinez', created_at: '2026-02-15', due_date: '2026-03-01', tags: ['ssl'], spaceId: 3 },
    { id: 106, title: 'Backup verification failed', status: 'IN_PROGRESS', priority: 'P1', assignee: 'Frank Wilson', created_at: '2026-02-14', due_date: '2026-02-19', tags: ['backup'], spaceId: 1 },
    { id: 107, title: 'Customer login issue', status: 'TODO', priority: 'P1', assignee: 'Alice Johnson', created_at: '2026-02-19', due_date: '2026-02-19', tags: ['customer'], spaceId: 4 },
    { id: 108, title: 'Mobile app crash on iOS', status: 'TODO', priority: 'P2', assignee: 'Bob Smith', created_at: '2026-02-18', due_date: '2026-02-20', tags: ['mobile', 'ios'], spaceId: 2 }
  ];

  const [selectedProject, setSelectedProject] = useState(null);

  // Load connected apps from API
  const loadConnectedApps = useCallback(async () => {
    try {
      const apps = await appConnectionService.getConnectedApps();
      if (apps && apps.length > 0) {
        setConnectedApps(prevApps => prevApps.map(app => {
          const connectedApp = apps.find(a => a.id === app.id);
          return connectedApp ? { ...app, connected: connectedApp.connected, connectedAt: connectedApp.connectedAt } : app;
        }));
      }
    } catch (error) {
      console.log('Using local app state - API not available');
    }
  }, []);

  useEffect(() => {
    setIncidents(sampleIncidents);
    loadConnectedApps();
    setLoading(false);
  }, [loadConnectedApps]);

  const filteredIncidents = incidents.filter(incident => {
    if (selectedSpace && incident.spaceId !== selectedSpace) return false;
    if (filters.status && incident.status !== filters.status) return false;
    if (filters.priority && incident.priority !== filters.priority) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!incident.title?.toLowerCase().includes(searchLower)) return false;
    }
    return true;
  });

  const statuses = [...new Set(incidents.map(i => i.status).filter(Boolean))];
  const getIncidentsByStatus = (status) => filteredIncidents.filter(i => i.status === status);
  const getPriorityColor = (priority) => priorities.find(p => p.id === priority)?.color || '#94a3b8';
  const getStatusColor = (status) => kanbanColumns.find(c => c.id === status)?.color || '#94a3b8';
  const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-';

  const handleCreateSpace = () => {
    if (!spaceName.trim()) return;
    const newSpace = {
      id: teamSpaces.length + 1,
      name: spaceName,
      icon: spaceIcon,
      color: '#' + Math.floor(Math.random()*16777215).toString(16),
      tasks: 0,
      folders: []
    };
    setTeamSpaces([...teamSpaces, newSpace]);
    setShowCreateSpaceModal(false);
    setSpaceName('');
    setSpaceDescription('');
    setSpacePermissions('private');
    setSpaceIcon('💼');
  };

  const handleCreateTask = () => {
    if (!newTask.name.trim()) return;
    const newIncident = {
      id: incidents.length + 101,
      title: newTask.name,
      description: newTask.description,
      status: newTask.status,
      priority: newTask.priority,
      assignee: newTask.assignee || currentUserName,
      created_at: new Date().toISOString().split('T')[0],
      due_date: newTask.dueDate,
      tags: newTask.tags ? newTask.tags.split(',').map(t => t.trim()) : [],
      spaceId: selectedSpace || 1
    };
    setIncidents([newIncident, ...incidents]);
    setShowTaskModal(false);
    setNewTask({ name: '', description: '', assignee: '', dueDate: '', priority: 'P3', tags: '', status: 'TODO', dependencyType: '', dependencyTask: '' });
  };

  const handleProjectSelect = (spaceId) => {
    if (selectedSpace === spaceId) {
      setSelectedSpace(null);
    } else {
      setSelectedSpace(spaceId);
    }
  };

  // Handle clicking on a task to show details
  const handleTaskClick = (incident) => {
    setTaskDetail(incident);
    setShowTaskDetailModal(true);
  };

  // Handle marking task complete
  const handleToggleTaskComplete = (taskId) => {
    setIncidents(incidents.map(inc => 
      inc.id === taskId 
        ? { ...inc, status: inc.status === 'RESOLVED' ? 'TODO' : 'RESOLVED' }
        : inc
    ));
    // Update task detail if it's the same task
    if (taskDetail && taskDetail.id === taskId) {
      setTaskDetail(prev => ({
        ...prev,
        status: prev.status === 'RESOLVED' ? 'TODO' : 'RESOLVED'
      }));
    }
  };

  const handleSpaceFolderToggle = (spaceId) => {
    setSpaceFoldersExpanded(prev => ({
      ...prev,
      [spaceId]: !prev[spaceId]
    }));
  };

  // Handle app connection
  const handleAppClick = (app) => {
    setSelectedApp(app);
    setShowAppDetailModal(true);
  };

  const handleToggleConnection = async (appId) => {
    try {
      const app = connectedApps.find(a => a.id === appId);
      if (app.connected) {
        await appConnectionService.disconnectApp(appId);
        setConnectedApps(prev => prev.map(a => a.id === appId ? { ...a, connected: false, connectedAt: null } : a));
      } else {
        await appConnectionService.connectApp(appId);
        setConnectedApps(prev => prev.map(a => a.id === appId ? { ...a, connected: true, connectedAt: new Date().toISOString() } : a));
      }
    } catch (error) {
      // Fallback to local state if API fails
      setConnectedApps(prev => prev.map(a => a.id === appId ? { ...a, connected: !a.connected } : a));
    }
  };

  // AI Chat handlers
  const handleAIChat = async () => {
    if (!aiInput.trim() || aiLoading) return;
    
    const userMessage = aiInput;
    setAiInput('');
    setAiMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setAiLoading(true);
    
    try {
      const response = await appConnectionService.aiChat(userMessage);
      setAiMessages(prev => [...prev, { role: 'assistant', content: response.response, demo: response.demo }]);
    } catch (error) {
      setAiMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.', error: true }]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleAIGenerateImage = async (prompt) => {
    try {
      const response = await appConnectionService.aiGenerateImage(prompt);
      if (response.imageUrl) {
        setAiMessages(prev => [...prev, { role: 'assistant', content: `Generated image:`, imageUrl: response.imageUrl }]);
      } else {
        alert(response.message || 'Configure OpenAI API key for image generation');
      }
    } catch (error) {
      alert('Failed to generate image');
    }
  };

  // More Tools handlers
  const handleToolClick = (tool) => {
    setActiveTool(tool);
    if (tool === 'chat') {
      setShowAIChatModal(true);
    } else if (tool === 'ai') {
      setShowAIModal(true);
    }
  };

  const connectApp = (appId) => setPlannerApps(plannerApps.map(app => app.id === appId ? { ...app, connected: !app.connected } : app));

  if (loading) return <div className="clickup-home loading"><div className="loading-spinner">Loading...</div></div>;

  return (
    <div className="clickup-home">
      <div className="top-header">
        <div className="header-left">
          <div className="logo-section">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">Incident Manager</span>
          </div>
        </div>
        <div className="header-center">
          <div className="search-container">
            <span className="material-icons-round search-icon">search</span>
            <input type="text" placeholder="Search..." value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} className="search-input" />
          </div>
        </div>
        <div className="header-right">
          <button className="header-btn" onClick={() => setShowPlannerModal(true)} title="Planner"><span className="material-icons-round">event</span></button>
          <button className="header-btn" onClick={() => { setShowAIModal(true); setAiMessages([]); }} title="AI Assistant"><span className="material-icons-round">psychology</span></button>
          <button className="header-btn" onClick={() => setShowTemplatesModal(true)} title="Templates"><span className="material-icons-round">description</span></button>
          <button className="header-btn" onClick={() => setShowMoreToolsModal(true)} title="More Tools"><span className="material-icons-round">apps</span></button>
          <button className="header-btn" onClick={() => setShowTeamsModal(true)} title="Teams"><span className="material-icons-round">groups</span></button>
          <button className="header-btn" onClick={() => setShowPeopleModal(true)} title="People"><span className="material-icons-round">people</span></button>
          <div className="user-avatar">{currentUserName.charAt(0)}</div>
        </div>
      </div>

      <div className="main-layout">
        <div className="left-sidebar">
          <div className="sidebar-section">
            <div className="sidebar-item active" onClick={() => { setSelectedSpace(null); setCurrentView('list'); }}>
              <span className="material-icons-round">home</span><span>Home</span>
            </div>
          </div>
          <div className="sidebar-section">
            <div className="sidebar-header" onClick={() => setMyTasksExpanded(!myTasksExpanded)}>
              <div className="sidebar-header-left"><span className="material-icons-round">check_circle</span><span>My tasks</span></div>
              <span className="material-icons-round expand-icon">{myTasksExpanded ? 'expand_more' : 'chevron_right'}</span>
            </div>
            {myTasksExpanded && (
              <div className="sidebar-subitems">
                <div className={`sidebar-subitem ${activeTaskFilter === 'assigned' ? 'active' : ''}`} onClick={() => setActiveTaskFilter('assigned')}><span>Assigned to me</span><span className="badge">2</span></div>
                <div className={`sidebar-subitem ${activeTaskFilter === 'today' ? 'active' : ''}`} onClick={() => setActiveTaskFilter('today')}><span>Today</span></div>
                <div className={`sidebar-subitem ${activeTaskFilter === 'overdue' ? 'active' : ''}`} onClick={() => setActiveTaskFilter('overdue')}><span>Overdue</span><span className="badge red">3</span></div>
              </div>
            )}
          </div>
          <div className="sidebar-section">
            <div className="sidebar-header" onClick={() => setInboxExpanded(!inboxExpanded)}>
              <div className="sidebar-header-left"><span className="material-icons-round">inbox</span><span>Inbox</span></div>
              <span className="material-icons-round expand-icon">{inboxExpanded ? 'expand_more' : 'chevron_right'}</span>
            </div>
            {inboxExpanded && (
              <div className="sidebar-subitems">
                <div className="sidebar-subitem"><span className="material-icons-round">alternate_email</span><span>Mentions</span><span className="badge">7</span></div>
                <div className="sidebar-subitem"><span className="material-icons-round">assignment_ind</span><span>Assign to me</span><span className="badge">2</span></div>
                <div className="sidebar-subitem"><span className="material-icons-round">mark_email_unread</span><span>Unread</span><span className="badge">12</span></div>
              </div>
            )}
          </div>
          <div className="sidebar-section">
            <div className="sidebar-header">
              <div className="sidebar-header-left"><span className="material-icons-round">folder</span><span>Team Spaces</span></div>
              <span className="material-icons-round expand-icon" onClick={() => setShowCreateSpaceModal(true)}>add</span>
            </div>
            <div className="sidebar-spaces">
              {teamSpaces.map(space => (
                <div key={space.id}>
                  <div 
                    className={`sidebar-space-item ${selectedSpace === space.id ? 'active' : ''}`} 
                    onClick={() => handleProjectSelect(space.id)}
                  >
                    <span className="space-icon" style={{ backgroundColor: space.color }}>{space.icon}</span>
                    <span className="space-name">{space.name}</span>
                    <span className="space-count">{space.tasks}</span>
                    {space.folders && space.folders.length > 0 && (
                      <span 
                        className="folder-toggle"
                        onClick={(e) => { e.stopPropagation(); handleSpaceFolderToggle(space.id); }}
                      >
                        {spaceFoldersExpanded[space.id] ? '▼' : '▶'}
                      </span>
                    )}
                  </div>
                  {spaceFoldersExpanded[space.id] && space.folders && (
                    <div className="space-folders">
                      {space.folders.map(folder => (
                        <div 
                          key={folder.id} 
                          className="sidebar-folder-item"
                          onClick={() => { setSelectedSpace(space.id); }}
                        >
                          <span className="material-icons-round folder-icon">folder</span>
                          <span className="folder-name">{folder.name}</span>
                          <span className="folder-count">{folder.tasks}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="sidebar-space-item get-started" onClick={() => setShowCreateSpaceModal(true)}>
                <span className="space-icon add">+</span>
                <span>Get started</span>
              </div>
            </div>
          </div>
          <button className="create-space-btn" onClick={() => setShowCreateSpaceModal(true)}>
            <span className="material-icons-round">add</span>
            Create a Space
          </button>
        </div>

        <div className="main-content">
          <div className="content-header">
            <div className="content-title">
              <h1>{selectedSpace ? teamSpaces.find(s => s.id === selectedSpace)?.name + ' - All Tasks' : 'All Tasks'}</h1>
              <div className="view-toggle-group">
                <button className={`view-toggle ${timeView === 'today' ? 'active' : ''}`} onClick={() => setTimeView('today')}>Today</button>
                <button className={`view-toggle ${timeView === 'month' ? 'active' : ''}`} onClick={() => setTimeView('month')}>Month</button>
              </div>
            </div>
            <div className="content-actions">
              <button className="view-btn" onClick={() => setCurrentView('list')}><span className="material-icons-round">list</span></button>
              <button className="view-btn" onClick={() => setCurrentView('board')}><span className="material-icons-round">view_kanban</span></button>
              <button className="view-btn"><span className="material-icons-round">calendar_month</span></button>
              <button className="view-btn"><span className="material-icons-round">dashboard</span></button>
              <button className="new-task-btn" onClick={() => setShowTaskModal(true)}><span className="material-icons-round">add</span>New Task</button>
            </div>
          </div>

          <div className="content-filters">
            <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="filter-select">
              <option value="">All Status</option>
              {statuses.map(status => <option key={status} value={status}>{status}</option>)}
            </select>
            <select value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })} className="filter-select">
              <option value="">All Priority</option>
              {priorities.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <select className="filter-select">
              <option value="">Sort by</option>
              <option value="dateCreated">Date created</option>
              <option value="dateUpdated">Date updated</option>
              <option value="alphaAZ">A-Z</option>
              <option value="alphaZA">Z-A</option>
            </select>
            <select className="filter-select">
              <option value="">Group by</option>
              <option value="status">Status</option>
              <option value="priority">Priority</option>
              <option value="assignee">Assignee</option>
            </select>
          </div>

          <div className="tasks-container">
            {currentView === 'list' ? (
              <div className="tasks-list">
                {filteredIncidents.length === 0 ? (
                  <div className="empty-state">
                    <span className="material-icons-round">inbox</span>
                    <p>No tasks found</p>
                  </div>
                ) : (
                  filteredIncidents.map(incident => (
                    <div key={incident.id} className={`task-row ${incident.status === 'RESOLVED' ? 'completed' : ''}`} onClick={() => handleTaskClick(incident)}>
                      <div className="task-checkbox" onClick={(e) => { e.stopPropagation(); handleToggleTaskComplete(incident.id); }}>
                        <span className="material-icons-round">{incident.status === 'RESOLVED' ? 'check_circle' : 'radio_button_unchecked'}</span>
                      </div>
                      <div className="task-info">
                        <span className="task-title">{incident.title}</span>
                        <div className="task-meta">
                          <span className="task-id">#{incident.id}</span>
                          {incident.tags && incident.tags.map((tag, idx) => <span key={idx} className="task-tag">{tag}</span>)}
                        </div>
                      </div>
                      <div className="task-priority" style={{ backgroundColor: getPriorityColor(incident.priority) }}>{incident.priority}</div>
                      <div className="task-status" style={{ backgroundColor: getStatusColor(incident.status) }}>{incident.status}</div>
                      <div className="task-assignee"><span className="assignee-avatar">{incident.assignee?.charAt(0) || 'U'}</span></div>
                      <div className="task-date">{formatDate(incident.due_date)}</div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="board-view">
                <div className="kanban-board">
                  {kanbanColumns.map(column => (
                    <div key={column.id} className="kanban-column">
                      <div className="column-header" style={{ borderTopColor: column.color }}>
                        <span className="column-name">{column.name}</span>
                        <span className="column-count">{getIncidentsByStatus(column.id).length}</span>
                      </div>
                      <div className="column-content">
                        {getIncidentsByStatus(column.id).map(incident => (
                          <div key={incident.id} className="kanban-card" onClick={() => handleTaskClick(incident)}>
                            <div className="card-priority" style={{ backgroundColor: getPriorityColor(incident.priority) }}>{incident.priority}</div>
                            <div className="card-title">{incident.title}</div>
                            <div className="card-meta"><span className="card-id">#{incident.id}</span></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="right-sidebar">
          <div className="sidebar-section">
            <div className="sidebar-header"><span className="sidebar-header-title">My first task</span></div>
            <div className="first-task-card">
              <span className="material-icons-round task-icon">assignment</span>
              <span className="task-hint">Create your first task</span>
              <button className="create-task-btn" onClick={() => setShowTaskModal(true)}><span className="material-icons-round">add</span></button>
            </div>
          </div>
          <div className="sidebar-section">
            <div className="sidebar-header"><span className="sidebar-header-title">Connected Apps</span></div>
            <div className="apps-grid">
              {connectedApps.slice(0, 9).map(app => (
                <div 
                  key={app.id} 
                  className={`app-icon ${app.connected ? 'connected' : ''}`} 
                  style={{ background: app.color }}
                  onClick={() => handleAppClick(app)}
                  title={app.name}
                >
                  {getAppIcon(app.icon)}
                </div>
              ))}
            </div>
            <button className="connect-apps-btn" onClick={() => { setShowAIModal(true); setAiMessages([]); }}><span className="material-icons-round">add</span>Connect Apps</button>
          </div>
          <div className="sidebar-section">
            <div className="sidebar-header"><span className="sidebar-header-title">AI Features</span></div>
            <div className="ai-features-list">
              <div className="ai-feature-item" onClick={() => { setShowAIChatModal(true); setAiMessages([]); }}><span className="material-icons-round">psychology</span><span>Think & Create</span></div>
              <div className="ai-feature-item" onClick={() => { setShowAIChatModal(true); setAiMessages([]); }}><span className="material-icons-round">chat</span><span>AI Chat</span></div>
              <div className="ai-feature-item" onClick={() => handleAIGenerateImage('A beautiful workspace') }><span className="material-icons-round">image</span><span>Generate Image</span></div>
              <div className="ai-feature-item" onClick={() => { setShowAIChatModal(true); setAiMessages([{ role: 'assistant', content: 'Hello! I can help you brainstorm ideas. What would you like to work on?' }]); }}><span className="material-icons-round">lightbulb</span><span>Brainstorm</span></div>
              <div className="ai-feature-item" onClick={() => { setShowAIChatModal(true); setAiMessages([{ role: 'assistant', content: 'Summarize your tasks: You have 8 tasks pending, including 2 high priority incidents and 3 overdue items.' }]); }}><span className="material-icons-round">summarize</span><span>Summarize</span></div>
            </div>
          </div>
          <div className="sidebar-section">
            <div className="sidebar-header"><span className="sidebar-header-title">More Tools</span></div>
            <div className="more-tools-grid">
              <div className="tool-item" onClick={() => handleToolClick('chat')}><span className="material-icons-round">chat</span><span>Chat</span></div>
              <div className="tool-item" onClick={() => handleToolClick('docs')}><span className="material-icons-round">description</span><span>Docs</span></div>
              <div className="tool-item" onClick={() => handleToolClick('dashboard')}><span className="material-icons-round">dashboard</span><span>Dashboards</span></div>
              <div className="tool-item" onClick={() => handleToolClick('whiteboard')}><span className="material-icons-round">draw</span><span>Whiteboard</span></div>
              <div className="tool-item" onClick={() => handleToolClick('forms')}><span className="material-icons-round">quiz</span><span>Forms</span></div>
              <div className="tool-item" onClick={() => handleToolClick('goals')}><span className="material-icons-round">flag</span><span>Goals</span></div>
              <div className="tool-item" onClick={() => handleToolClick('timesheets')}><span className="material-icons-round">schedule</span><span>Timesheets</span></div>
              <div className="tool-item" onClick={() => handleToolClick('drive')}><span className="material-icons-round">folder</span><span>Drive</span></div>
              <div className="tool-item" onClick={() => handleToolClick('github')}><span className="material-icons-round">code</span><span>GitHub</span></div>
              <div className="tool-item" onClick={() => handleToolClick('clips')}><span className="material-icons-round">videocam</span><span>Clips</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Modal */}
      {showAIChatModal && (
        <div className="modal-overlay" onClick={() => setShowAIChatModal(false)}>
          <div className="modal-content ai-chat-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>AI Assistant</h2>
              <button className="close-btn" onClick={() => setShowAIChatModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="ai-chat-messages">
                {aiMessages.length === 0 && (
                  <div className="ai-welcome">
                    <span className="material-icons-round">psychology</span>
                    <p>Hi {firstName}! I'm your AI assistant. Ask me anything!</p>
                    <div className="suggestions">
                      <button onClick={() => setAiInput('Help me create a task')}>Help me create a task</button>
                      <button onClick={() => setAiInput('Summarize my tasks')}>Summarize my tasks</button>
                      <button onClick={() => setAiInput('Brainstorm ideas for project')}>Brainstorm ideas</button>
                    </div>
                  </div>
                )}
                {aiMessages.map((msg, idx) => (
                  <div key={idx} className={`ai-message ${msg.role}`}>
                    {msg.role === 'user' ? (
                      <span className="material-icons-round">person</span>
                    ) : (
                      <span className="material-icons-round">smart_toy</span>
                    )}
                    <div className="message-content">
                      {msg.content}
                      {msg.imageUrl && <img src={msg.imageUrl} alt="Generated" />}
                      {msg.demo && <span className="demo-badge">Demo Mode</span>}
                    </div>
                  </div>
                ))}
                {aiLoading && <div className="ai-loading"><span className="material-icons-round">hourglass_empty</span>Thinking...</div>}
              </div>
              <div className="ai-input-container">
                <input 
                  type="text" 
                  value={aiInput} 
                  onChange={(e) => setAiInput(e.target.value)} 
                  placeholder="Ask me anything..."
                  onKeyPress={(e) => e.key === 'Enter' && handleAIChat()}
                />
                <button onClick={handleAIChat} disabled={aiLoading || !aiInput.trim()}><span className="material-icons-round">send</span></button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* App Detail Modal */}
      {showAppDetailModal && selectedApp && (
        <div className="modal-overlay" onClick={() => setShowAppDetailModal(false)}>
          <div className="modal-content app-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="app-detail-header">
                <div className="app-detail-icon" style={{ background: selectedApp.color }}>
                  {getAppIcon(selectedApp.icon)}
                </div>
                <h2>{selectedApp.name}</h2>
              </div>
              <button className="close-btn" onClick={() => setShowAppDetailModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p className="app-description">
                {selectedApp.id === 'slack' && 'Connect Slack to send messages, create tasks, and get notifications directly in your channels.'}
                {selectedApp.id === 'github' && 'Link GitHub repositories to track commits, pull requests, and issues in your tasks.'}
                {selectedApp.id === 'notion' && 'Embed Notion pages and databases to keep all your documentation in one place.'}
                {selectedApp.id === 'gdrive' && 'Attach files from Google Drive directly to tasks and incidents.'}
                {selectedApp.id === 'gcal' && 'Sync deadlines and create calendar events from your tasks.'}
                {selectedApp.id === 'teams' && 'Chat with your team and start meetings directly from the app.'}
                {selectedApp.id === 'meet' && 'Start instant Google Meet calls from any task or conversation.'}
                {selectedApp.id === 'jira' && 'Sync Jira issues and track development progress.'}
                {selectedApp.id === 'dropbox' && 'Store and share large files using Dropbox.'}
                {selectedApp.id === 'onedrive' && 'Access Microsoft OneDrive files from your tasks.'}
              </p>
              
              <div className="app-status-section">
                <h4>Status</h4>
                <div className="app-status">
                  <span className={`status-badge ${selectedApp.connected ? 'connected' : 'disconnected'}`}>
                    {selectedApp.connected ? 'Connected' : 'Not Connected'}
                  </span>
                </div>
              </div>
              
              <div className="app-features-section">
                <h4>Features</h4>
                <ul className="feature-list">
                  {selectedApp.features && selectedApp.features.map((feature, idx) => (
                    <li key={idx}>
                      <span className="material-icons-round check">check_circle</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              {selectedApp.connected && selectedApp.connectedAt && (
                <div className="app-activity-section">
                  <h4>Connected Since</h4>
                  <div className="activity-list">
                    <div className="activity-item">
                      <span className="material-icons-round">schedule</span>
                      <span>{new Date(selectedApp.connectedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowAppDetailModal(false)}>Close</button>
              <button 
                className="btn-primary" 
                onClick={() => handleToggleConnection(selectedApp.id)}
              >
                {selectedApp.connected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Space Modal */}
      {showCreateSpaceModal && (
        <div className="modal-overlay" onClick={() => setShowCreateSpaceModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create a Space</h2>
              <button className="close-btn" onClick={() => setShowCreateSpaceModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="space-intro">A Space represents teams, departments, or groups, each with its own Lists, workflows, and settings.</div>
              <div className="form-group">
                <label>Icon & Name</label>
                <div className="space-icon-name-row">
                  <div className="icon-picker">
                    {spaceIcons.map(icon => (
                      <span key={icon} className={`icon-option ${spaceIcon === icon ? 'selected' : ''}`} onClick={() => setSpaceIcon(icon)}>{icon}</span>
                    ))}
                  </div>
                  <input type="text" value={spaceName} onChange={(e) => setSpaceName(e.target.value)} placeholder="e.g. Marketing, Engineering, HR" className="form-input" />
                </div>
              </div>
              <div className="form-group">
                <label>Description (optional)</label>
                <textarea value={spaceDescription} onChange={(e) => setSpaceDescription(e.target.value)} placeholder="Enter space description" className="form-textarea" rows="2" />
              </div>
              <div className="form-group">
                <label>Default permission</label>
                <div className="permission-options">
                  <div className={`permission-option ${spacePermissions === 'full' ? 'selected' : ''}`} onClick={() => setSpacePermissions('full')}>
                    <span className="material-icons-round">edit</span>
                    <div className="permission-info"><span className="permission-title">Full edit</span><span className="permission-desc">Members can edit everything</span></div>
                  </div>
                  <div className={`permission-option ${spacePermissions === 'private' ? 'selected' : ''}`} onClick={() => setSpacePermissions('private')}>
                    <span className="material-icons-round">lock</span>
                    <div className="permission-info"><span className="permission-title">Make Private</span><span className="permission-desc">Only you and invited members have access</span></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowCreateSpaceModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleCreateSpace}>Create Space</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {showTaskModal && (
        <div className="modal-overlay" onClick={() => setShowTaskModal(false)}>
          <div className="modal-content task-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create Task</h2>
              <button className="close-btn" onClick={() => setShowTaskModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group"><label>Task Name</label><input type="text" value={newTask.name} onChange={(e) => setNewTask({ ...newTask, name: e.target.value })} placeholder="Enter task name" className="form-input" /></div>
              <div className="form-group">
                <label>Description</label>
                <div className="description-with-ai">
                  <textarea value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} placeholder="Add description..." className="form-textarea" rows="3" />
                  <button className="ai-write-btn" onClick={() => { setAiInput(`Help me write a description for: ${newTask.name}`); setShowAIChatModal(true); setAiMessages([]); }} title="Write with AI"><span className="material-icons-round">auto_awesome</span></button>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Status</label><select value={newTask.status} onChange={(e) => setNewTask({ ...newTask, status: e.target.value })} className="form-select">{kanbanColumns.map(col => <option key={col.id} value={col.id}>{col.name}</option>)}</select></div>
                <div className="form-group"><label>Priority</label><select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })} className="form-select">{priorities.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Assignee</label><input type="text" value={newTask.assignee} onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })} placeholder="Assignee name" className="form-input" /></div>
                <div className="form-group"><label>Due Date</label><input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} className="form-input" /></div>
              </div>
              <div className="form-group"><label>Tags</label><input type="text" value={newTask.tags} onChange={(e) => setNewTask({ ...newTask, tags: e.target.value })} placeholder="Add tags (comma separated)" className="form-input" /></div>
              <div className="form-group">
                <label>Dependencies</label>
                <div className="dependency-row">
                  <select value={newTask.dependencyType} onChange={(e) => setNewTask({ ...newTask, dependencyType: e.target.value })} className="form-select">{dependencyTypes.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}</select>
                  <input type="text" value={newTask.dependencyTask} onChange={(e) => setNewTask({ ...newTask, dependencyTask: e.target.value })} placeholder="Task name or ID" className="form-input" />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowTaskModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleCreateTask}>Create Task</button>
            </div>
          </div>
        </div>
      )}

      {/* Templates Modal */}
      {showTemplatesModal && (
        <div className="modal-overlay" onClick={() => setShowTemplatesModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2>Use Templates</h2><button className="close-btn" onClick={() => setShowTemplatesModal(false)}>×</button></div>
            <div className="modal-body">
              <div className="templates-grid">
                {templates.map(template => (
                  <div key={template.id} className="template-card" onClick={() => { setShowTemplatesModal(false); setShowTaskModal(true); setNewTask({ ...newTask, name: template.name, description: template.description }); }}>
                    <span className="template-icon">{template.icon}</span>
                    <div className="template-info"><span className="template-name">{template.name}</span><span className="template-desc">{template.description}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Teams Modal */}
      {showTeamsModal && (
        <div className="modal-overlay" onClick={() => setShowTeamsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2>Teams</h2><button className="close-btn" onClick={() => setShowTeamsModal(false)}>×</button></div>
            <div className="modal-body">
              <div className="teams-intro">Align teams and visualize their work.</div>
              <div className="teams-actions">
                <button className="team-action-btn"><span className="material-icons-round">add</span>Create Team</button>
                <button className="team-action-btn secondary"><span className="material-icons-round">person_add</span>Invite People</button>
              </div>
              <div className="teams-list">
                {teams.map(team => (
                  <div key={team.id} className="team-item">
                    <span className="team-icon">{team.icon}</span>
                    <span className="team-name">{team.name}</span>
                    <span className="team-members">{team.members} members</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* People Modal */}
      {showPeopleModal && (
        <div className="modal-overlay" onClick={() => setShowPeopleModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2>All People</h2><button className="close-btn" onClick={() => setShowPeopleModal(false)}>×</button></div>
            <div className="modal-body">
              <div className="people-filters">
                <div className="search-box">
                  <span className="material-icons-round">search</span>
                  <input type="text" placeholder="Search or enter email" value={peopleSearch} onChange={(e) => setPeopleSearch(e.target.value)} className="form-input" />
                </div>
                <select value={accountTypeFilter} onChange={(e) => setAccountTypeFilter(e.target.value)} className="filter-select">
                  <option value="all">All Account Types</option>
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
                  <option value="guest">Guest</option>
                  <option value="limited">Limited</option>
                </select>
                <select className="filter-select">
                  <option value="">Sort by</option>
                  <option value="az">A-Z</option>
                  <option value="za">Z-A</option>
                  <option value="lastJoined">Last Joined</option>
                  <option value="firstJoined">First Joined</option>
                </select>
              </div>
              <div className="people-list">
                {people.map(person => (
                  <div key={person.id} className="person-item">
                    <div className="person-avatar" style={{ background: person.status === 'online' ? '#10b981' : '#94a3b8' }}>{person.avatar}</div>
                    <div className="person-info"><span className="person-name">{person.name}</span><span className="person-email">{person.email}</span></div>
                    <span className="person-team">{person.team}</span>
                    <span className={`person-status ${person.status}`}>{person.status}</span>
                    <span className="person-type">{person.accountType}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Planner Modal */}
      {showPlannerModal && (
        <div className="modal-overlay" onClick={() => setShowPlannerModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2>Get Started</h2><button className="close-btn" onClick={() => setShowPlannerModal(false)}>×</button></div>
            <div className="modal-body">
              <div className="planner-apps">
                {plannerApps.map(app => (
                  <div key={app.id} className={`planner-app ${app.connected ? 'connected' : ''}`} onClick={() => connectApp(app.id)}>
                    <span className="planner-icon" style={{ background: app.color }}>{app.icon}</span>
                    <div className="planner-info"><span className="planner-name">{app.name}</span><span className="planner-status">{app.connected ? 'Connected' : 'Not connected'}</span></div>
                    <span className="material-icons-round check-icon">{app.connected ? 'check_circle' : 'add_circle'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Modal */}
      {showAIModal && (
        <div className="modal-overlay" onClick={() => setShowAIModal(false)}>
          <div className="modal-content ai-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2>AI Assistant</h2><button className="close-btn" onClick={() => setShowAIModal(false)}>×</button></div>
            <div className="modal-body">
              <div className="ai-greeting">Hi {firstName}! Connect your apps to unlock powerful AI features. Once connected, you can ask me about anything in your connected apps.</div>
              <div className="ai-features">
                <div className="ai-feature-btn" onClick={() => { setShowAIModal(false); setShowAIChatModal(true); setAiMessages([]); }}><span className="material-icons-round" style={{ color: '#8b5cf6' }}>psychology</span><span>Think & Create</span></div>
                <div className="ai-feature-btn" onClick={() => { setShowAIModal(false); setShowAIChatModal(true); }}><span className="material-icons-round" style={{ color: '#10b981' }}>chat</span><span>AI Chat</span></div>
                <div className="ai-feature-btn" onClick={() => handleAIGenerateImage('A modern workspace')}><span className="material-icons-round" style={{ color: '#3b82f6' }}>image</span><span>Generate Image</span></div>
                <div className="ai-feature-btn" onClick={() => { setShowAIModal(false); setShowAIChatModal(true); setAiMessages([{ role: 'assistant', content: 'Let\'s brainstorm! What topic or project would you like ideas for?' }]); }}><span className="material-icons-round" style={{ color: '#f59e0b' }}>lightbulb</span><span>Brainstorm</span></div>
                <div className="ai-feature-btn" onClick={() => { setShowAIModal(false); setShowAIChatModal(true); setAiMessages([{ role: 'assistant', content: 'Summary of your workspace:\n\n📋 Total Tasks: 8\n✅ Completed: 2\n🔄 In Progress: 2\n⏳ Todo: 4\n🚨 Urgent: 2' }]); }}><span className="material-icons-round" style={{ color: '#ec4899' }}>summarize</span><span>Summarize</span></div>
              </div>
              <div className="ai-tools">
                <h4>Tools</h4>
                <div className="ai-tool-item"><span className="material-icons-round" style={{ color: '#06b6d4' }}>smart_toy</span><span>Create Super Agent</span></div>
                <div className="ai-tool-item" onClick={() => handleAIGenerateImage('Professional team meeting')}><span className="material-icons-round" style={{ color: '#ef4444' }}>image</span><span>Generate Image</span></div>
                <div className="ai-tool-item"><span className="material-icons-round" style={{ color: '#4285f4' }}>event</span><span>Ask about my Google Calendar</span></div>
                <div className="ai-tool-item"><span className="material-icons-round" style={{ color: '#f97316' }}>note</span><span>Ask about my meeting notes</span></div>
                <div className="ai-tool-item"><span className="material-icons-round" style={{ color: '#22c55e' }}>help</span><span>Help using Incident Management</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* More Tools Modal */}
      {showMoreToolsModal && (
        <div className="modal-overlay" onClick={() => setShowMoreToolsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2>More Tools</h2><button className="close-btn" onClick={() => setShowMoreToolsModal(false)}>×</button></div>
            <div className="modal-body">
              <div className="more-tools-list">
                <div className="more-tool-item" onClick={() => { setShowMoreToolsModal(false); setShowAIChatModal(true); setAiMessages([]); }}>
                  <span className="material-icons-round">chat</span><span>Post task comments</span><span className="tool-desc">Post chat message, tag people, tasks, docs, location</span>
                </div>
                <div className="more-tool-item">
                  <span className="material-icons-round">alarm</span><span>Set reminder</span><span className="tool-desc">Get notified about important tasks</span>
                </div>
                <div className="more-tool-item">
                  <span className="material-icons-round">update</span><span>Update task</span><span className="tool-desc">Modify task status, details, or assignments</span>
                </div>
                <div className="more-tool-item" onClick={() => { setShowMoreToolsModal(false); setShowAIChatModal(true); setAiMessages([{ role: 'assistant', content: 'I can help you write! What would you like to write?' }]); }}>
                  <span className="material-icons-round">edit</span><span>Write with AI</span><span className="tool-desc">Generate content using AI</span>
                </div>
                <div className="more-tool-item" onClick={() => handleAIGenerateImage('Creative design concept')}>
                  <span className="material-icons-round">auto_awesome</span><span>Generate Image</span><span className="tool-desc">Create images with AI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Detail Modal */}
      {showTaskDetailModal && taskDetail && (
        <div className="modal-overlay" onClick={() => setShowTaskDetailModal(false)}>
          <div className="modal-content task-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="task-detail-header">
                <div className="task-detail-checkbox" onClick={() => handleToggleTaskComplete(taskDetail.id)}>
                  <span className="material-icons-round">{taskDetail.status === 'RESOLVED' ? 'check_circle' : 'radio_button_unchecked'}</span>
                </div>
                <div className="task-detail-title-section">
                  <span className={`task-detail-title ${taskDetail.status === 'RESOLVED' ? 'completed' : ''}`}>{taskDetail.title}</span>
                  <div className="task-detail-id">#{taskDetail.id}</div>
                </div>
              </div>
              <button className="close-btn" onClick={() => setShowTaskDetailModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="task-detail-section">
                <h4>Status</h4>
                <div className="task-detail-status">
                  <span className="task-status" style={{ backgroundColor: getStatusColor(taskDetail.status) }}>{taskDetail.status}</span>
                </div>
              </div>
              
              <div className="task-detail-section">
                <h4>Priority</h4>
                <div className="task-detail-priority">
                  <span className="task-priority" style={{ backgroundColor: getPriorityColor(taskDetail.priority) }}>{taskDetail.priority}</span>
                  <span>{priorities.find(p => p.id === taskDetail.priority)?.name}</span>
                </div>
              </div>

              <div className="task-detail-section">
                <h4>Assignee</h4>
                <div className="task-detail-assignee">
                  <span className="assignee-avatar">{taskDetail.assignee?.charAt(0) || 'U'}</span>
                  <span>{taskDetail.assignee || 'Unassigned'}</span>
                </div>
              </div>

              <div className="task-detail-section">
                <h4>Dates</h4>
                <div className="task-detail-dates">
                  <div className="date-item">
                    <span className="material-icons-round">event</span>
                    <span>Created: {taskDetail.created_at ? new Date(taskDetail.created_at).toLocaleDateString() : '-'}</span>
                  </div>
                  <div className="date-item">
                    <span className="material-icons-round">alarm</span>
                    <span>Due: {taskDetail.due_date ? new Date(taskDetail.due_date).toLocaleDateString() : 'No due date'}</span>
                  </div>
                </div>
              </div>

              <div className="task-detail-section">
                <h4>Tags</h4>
                <div className="task-detail-tags">
                  {taskDetail.tags && taskDetail.tags.length > 0 ? (
                    taskDetail.tags.map((tag, idx) => (
                      <span key={idx} className="task-tag">{tag}</span>
                    ))
                  ) : (
                    <span className="no-tags">No tags</span>
                  )}
                </div>
              </div>

              <div className="task-detail-section">
                <h4>Space</h4>
                <div className="task-detail-space">
                  {teamSpaces.find(s => s.id === taskDetail.spaceId) ? (
                    <>
                      <span className="space-icon" style={{ backgroundColor: teamSpaces.find(s => s.id === taskDetail.spaceId)?.color }}>
                        {teamSpaces.find(s => s.id === taskDetail.spaceId)?.icon}
                      </span>
                      <span>{teamSpaces.find(s => s.id === taskDetail.spaceId)?.name}</span>
                    </>
                  ) : (
                    <span>No space</span>
                  )}
                </div>
              </div>

              <div className="task-detail-actions">
                <button className="btn-secondary" onClick={() => { setShowTaskDetailModal(false); setShowAIChatModal(true); }}>
                  <span className="material-icons-round">chat</span> Add Comment
                </button>
                <button className="btn-secondary" onClick={() => handleAIGenerateImage(taskDetail.title)}>
                  <span className="material-icons-round">image</span> Generate Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClickUpHome;
