"use client";

import React, { useState, useEffect, useCallback } from "react";
// --- Import the real components from their files ---
import {CommunityEngagement }from "./CommunityEngagement";
import  WasteHeatmap from "./WasteHeatMap";
import { AnalyticsDashboard } from "./AnalyticsDashboard";
import TaskAssignmentHub  from "./TaskAssignmentHub";
import { WorkerPerformance } from "./WorkerPerformance";


// --- UI Components & Helpers ---
const cn = (...inputs) => inputs.filter(Boolean).join(' ');
const Card = ({ children, className = "" }) => <div className={`border rounded-lg shadow-sm ${className}`}>{children}</div>;
const CardHeader = ({ children, className = "" }) => <div className={`p-6 pb-2 ${className}`}>{children}</div>;
const CardTitle = ({ children, className = "" }) => <h3 className={`text-lg font-semibold tracking-tight ${className}`}>{children}</h3>;
const CardContent = ({ children, className = "" }) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;
const Button = ({ children, variant = "default", size = "md", className = "", ...props }) => {
    const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    const variantClasses = {
        default: "bg-blue-600 text-white hover:bg-blue-700",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    };
    const sizeClasses = size === "sm" ? "h-9 px-3" : "h-10 px-4 py-2";
    return <button className={`${baseClasses} ${variantClasses[variant] || variantClasses.default} ${sizeClasses} ${className}`} {...props}>{children}</button>;
};
const Badge = ({ children, variant, className }) => {
    const variants = {
        high: "bg-orange-100 text-orange-800",
        critical: "bg-red-100 text-red-800",
        medium: "bg-yellow-100 text-yellow-800",
        low: "bg-green-100 text-green-800",
        assigned: "bg-blue-100 text-blue-800",
        accepted: "bg-indigo-100 text-indigo-800",
        "on-the-way": "bg-purple-100 text-purple-800",
        "in-progress": "bg-yellow-100 text-yellow-800",
        Submitted: "bg-gray-200 text-gray-800",
        default: "bg-gray-100 text-gray-800 border"
    };
    return <span className={cn(`px-2.5 py-1 text-xs font-semibold rounded-full inline-block`, variants[variant] || variants.default, className)}>{children}</span>;
};


// --- API Utility ---
const fetchApi = async (url, method = 'GET', body = null) => {
    let finalUrl = url.startsWith('/') && !url.startsWith('//') ? `http://localhost:8001${url}` : url;
    const token = localStorage.getItem('adminToken');
    
    if (method === 'GET') {
        finalUrl += (finalUrl.includes('?') ? '&' : '?') + `_=${new Date().getTime()}`;
    }

    const headers = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const config = { method, headers };
    if (body) config.body = JSON.stringify(body);
    const response = await fetch(finalUrl, config);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API Error ${response.status}: ${errorData.message || response.statusText}`);
    }
    return response.json();
};

// --- Dashboard Sidebar ---
const AdminSidebar = ({ activeView, onViewChange }) => {
    const views = {
        "overview": "Overview",
        "heatmap": "Heatmap",
        "tasks": "Tasks",
        "analytics": "Analytics",
        "community": "Community",
        "workerPerformance": "Worker Performance"
    };

    const viewIcons = {
        overview: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>,
        heatmap: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 3.636a1 1 0 011.414 0L10 7.172l3.536-3.536a1 1 0 111.414 1.414L11.414 8.586l3.536 3.535a1 1 0 01-1.414 1.415L10 10.414l-3.536 3.536a1 1 0 01-1.414-1.415L8.586 8.586 5.05 5.05a1 1 0 010-1.414z" clipRule="evenodd" /></svg>,
        tasks: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>,
        analytics: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>,
        community: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>,
        workerPerformance: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015.5-4.95A5 5 0 0111 16v1a1 1 0 01-1 1H1v-1a5 5 0 015-5z" /></svg>,
    };
    return (
        <nav className="w-64 bg-white border-r border-gray-200 flex-shrink-0 p-4">
            <div className="mb-8"><h2 className="text-xl font-bold text-gray-800">CleanCity</h2><p className="text-xs text-gray-500">Admin Panel</p></div>
            <ul className="space-y-2">
                {Object.entries(views).map(([key, name]) => (
                    <li key={key}><button onClick={() => onViewChange(key)} className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-sm font-medium transition-colors ${activeView === key ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}>{viewIcons[key]}<span>{name}</span></button></li>
                ))}
            </ul>
        </nav>
    );
};


// --- Main Dashboard Component ---
export default function AdminDashboard() {
  const [activeView, setActiveView] = useState("overview");
  const [stats, setStats] = useState({ totalReports: 0, pendingReports: 0, inProgressReports: 0, activeWorkers: 0, tasksCompletedToday: 0, avgCompletionTime: 0 });
  const [recentReports, setRecentReports] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const loadOverviewData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchApi('/api/admin/dashboard'); 
      if (response.success && response.data) {
        const { overview, unassignedReports, assignedTasks } = response.data;
        setStats({
          totalReports: overview.totalReports || 0,
          pendingReports: overview.pendingReports || 0,
          inProgressReports: overview.inProgressReports || 0,
          activeWorkers: overview.activeWorkers || 0,
          tasksCompletedToday: overview.tasksCompletedToday || 0,
          avgCompletionTime: overview.avgCompletionTime || 0,
        });
        setRecentReports(unassignedReports || []);
        setAssignedTasks(assignedTasks || []);
      }
    } catch (error) {
      console.error("Failed to load overview data:", error);
      setError(`Failed to load dashboard: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeView === 'overview') {
      loadOverviewData();
    }
  }, [activeView, loadOverviewData]);

  const formatStatus = (status) => {
    if (!status) return 'Unknown';
    return status.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <AdminSidebar activeView={activeView} onViewChange={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div><h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1></div>
            
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {activeView === "overview" && (
            loading ? <p className="text-center text-gray-500">Loading overview...</p> :
            error ? <p className="text-center text-red-500 bg-red-50 p-4 rounded-md">{error}</p> :
            <div className="space-y-6">
              {/* Row 1: Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-orange-50 border-orange-200"><CardHeader><CardTitle className="text-sm font-medium text-orange-900">Pending Reports</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-orange-900">{stats.pendingReports}</div></CardContent></Card>
                  <Card className="bg-yellow-50 border-yellow-200"><CardHeader><CardTitle className="text-sm font-medium text-yellow-900">Tasks In Progress</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-yellow-900">{stats.inProgressReports}</div></CardContent></Card>
                  <Card className="bg-blue-50 border-blue-200"><CardHeader><CardTitle className="text-sm font-medium text-blue-900">Total Active Reports</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-blue-900">{stats.pendingReports + stats.inProgressReports}</div></CardContent></Card>
                  <Card className="bg-green-50 border-green-200"><CardHeader><CardTitle className="text-sm font-medium text-green-900">Available Workers</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-green-900">{stats.activeWorkers}</div></CardContent></Card>
              </div>

              {/* Row 2: Unassigned Reports Card */}
              <Card className="bg-white border-gray-200">
                  <CardHeader>
                      <div className="flex justify-between items-center">
                          <CardTitle className="text-gray-900">New Unassigned Reports</CardTitle>
                          <Button variant="outline" size="sm" onClick={() => setActiveView('tasks')}>Assign Tasks</Button>
                      </div>
                  </CardHeader>
                  <CardContent>
                      <div className="space-y-4">
                          {recentReports.length > 0 ? recentReports.map((report) => (
                              <div key={report._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow">
                                  <div className="flex-1 flex items-center space-x-4">
                                      <Badge variant={report.urgency}>{report.urgency}</Badge>
                                      <div>
                                          <h4 className="font-semibold text-gray-900">{report.wasteType}</h4>
                                          <p className="text-sm text-gray-600 mt-1">{report.location?.address}</p>
                                      </div>
                                  </div>
                                  <div className="flex items-center space-x-4">
                                      <Badge variant="Submitted">{formatStatus(report.status)}</Badge>
                                      <Button size="sm" onClick={() => setActiveView('tasks')}>Assign</Button>
                                  </div>
                              </div>
                          )) : <p className="text-center text-gray-500 py-8">No new reports to assign.</p>}
                      </div>
                  </CardContent>
              </Card>
              
              {/* Row 3: Ongoing Tasks Card */}
              <Card className="bg-white border-gray-200">
                  <CardHeader>
                      <CardTitle className="text-gray-900">Ongoing Tasks</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <div className="space-y-4">
                          {assignedTasks.length > 0 ? assignedTasks.map((task) => (
                              <div key={task._id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                                  <div className="flex-1">
                                      <p className="font-semibold text-gray-800 text-sm">{task.title}</p>
                                      <p className="text-xs text-gray-500 mt-1">
                                          Assigned to: <span className="font-medium text-gray-700">{task.assignedWorker?.name || 'N/A'}</span>
                                      </p>
                                  </div>
                                  <div className="text-right">
                                      <Badge variant={task.status}>{formatStatus(task.status)}</Badge>
                                      <p className="text-xs text-gray-500 mt-1">{new Date(task.createdAt).toLocaleDateString()}</p>
                                  </div>
                              </div>
                          )) : <p className="text-center text-gray-500 py-8">No tasks are currently in progress.</p>}
                      </div>
                  </CardContent>
              </Card>
              
              {/* Row 4: Active Operations & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-white border-gray-200">
                      <CardHeader><CardTitle className="text-gray-900">Active Operations</CardTitle></CardHeader>
                      <CardContent>
                          <div className="space-y-3">
                              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                  <span className="text-sm font-medium text-gray-900">Workers on Duty</span>
                                  <span className="text-lg font-bold text-blue-600">{stats.activeWorkers}</span>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                  <span className="text-sm font-medium text-gray-900">Tasks Completed Today</span>
                                  <span className="text-lg font-bold text-green-600">{stats.tasksCompletedToday}</span>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                                  <span className="text-sm font-medium text-gray-900">Avg Completion Time</span>
                                  <span className="text-lg font-bold text-yellow-600">{stats.avgCompletionTime} mins</span>
                              </div>
                          </div>
                      </CardContent>
                  </Card>
                  <Card className="bg-white border-gray-200">
                      <CardHeader><CardTitle className="text-gray-900">Quick Actions</CardTitle></CardHeader>
                      <CardContent>
                          <div className="space-y-2">
                              <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700" onClick={() => alert('Create New Alert clicked!')}>
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                  Create New Alert
                              </Button>
                              <Button className="w-full justify-start bg-transparent" variant="outline" onClick={() => setActiveView('tasks')}>
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                  Assign Pending Tasks
                              </Button>
                              <Button className="w-full justify-start bg-transparent" variant="outline" onClick={() => setActiveView('analytics')}>
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                  View Analytics
                              </Button>
                          </div>
                      </CardContent>
                  </Card>
              </div>
            </div> // This is the closing div for the main "space-y-6" wrapper
          )}

          {activeView === "heatmap" && <WasteHeatmap />}
          {activeView === "tasks" && <TaskAssignmentHub onTaskAssigned={loadOverviewData} />}
          {activeView === "analytics" && <AnalyticsDashboard />}
          {activeView === "community" && <CommunityEngagement />}
          {activeView === "workerPerformance" && <WorkerPerformance />}
        </main>
      </div>
    </div>
  );
}


