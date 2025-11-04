"use client";

import React, { useState, useEffect, useCallback } from "react";
// --- Import the real components from their files ---
import {CommunityEngagement }from "./CommunityEngagement";
import  WasteHeatmap from "./WasteHeatMap";
import { AnalyticsDashboard } from "./AnalyticsDashboard";
import TaskAssignmentHub  from "./TaskAssignmentHub";
import { WorkerPerformance } from "./WorkerPerformance";

// --- UI Helpers ---
const cn = (...inputs) => inputs.filter(Boolean).join(" ");
const Card = ({ children, className = "" }) => (
  <div className={`border rounded-lg shadow-sm ${className}`}>{children}</div>
);
const CardHeader = ({ children, className = "" }) => (
  <div className={`p-4 sm:p-6 pb-2 ${className}`}>{children}</div>
);
const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-base sm:text-lg font-semibold tracking-tight ${className}`}>{children}</h3>
);
const CardContent = ({ children, className = "" }) => (
  <div className={`p-4 sm:p-6 pt-0 ${className}`}>{children}</div>
);
const Button = ({ children, variant = "default", size = "md", className = "", ...props }) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  };
  const sizeClasses = size === "sm" ? "h-8 sm:h-9 px-2 sm:px-3" : "h-10 px-4 py-2";
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.default} ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
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
    default: "bg-gray-100 text-gray-800 border",
  };
  return (
    <span
      className={cn(
        "px-2 py-1 text-xs font-semibold rounded-full inline-block",
        variants[variant] || variants.default,
        className
      )}
    >
      {children}
    </span>
  );
};
const API = process.env.REACT_APP_API_URL;
console.log("API LOADED:", API);
// --- API Utility ---
const fetchApi = async (url, method = "GET", body = null) => {
  let finalUrl =
    url.startsWith("/") && !url.startsWith("//")
      ? `${API}${url}`
      : url;
  const token = localStorage.getItem("adminToken");

  if (method === "GET") {
    finalUrl += (finalUrl.includes("?") ? "&" : "?") + `_=${new Date().getTime()}`;
  }

  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  const response = await fetch(finalUrl, config);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`API Error ${response.status}: ${errorData.message || response.statusText}`);
  }
  return response.json();
};

// --- Sidebar Component ---
const AdminSidebar = ({ activeView, onViewChange, isOpen, toggleSidebar }) => {
  const views = {
    overview: "Overview",
    heatmap: "Heatmap",
    tasks: "Tasks",
    analytics: "Analytics",
    community: "Community",
    workerPerformance: "Worker Performance",
  };

  const viewIcons = {
    overview: "🏠",
    heatmap: "🗺️",
    tasks: "🧾",
    analytics: "📊",
    community: "👥",
    workerPerformance: "⚙️",
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <nav
        className={`fixed lg:static z-50 top-0 left-0 h-full lg:h-auto bg-white border-r border-gray-200 w-64 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 flex-shrink-0 p-4`}
      >
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">CleanCity</h2>
          <button
            className="lg:hidden text-gray-600 hover:text-gray-900"
            onClick={toggleSidebar}
          >
            ✖
          </button>
        </div>
        <ul className="space-y-2">
          {Object.entries(views).map(([key, name]) => (
            <li key={key}>
              <button
                onClick={() => {
                  onViewChange(key);
                  // Close sidebar on mobile after selection
                  if (isOpen) {
                    toggleSidebar();
                  }
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm font-medium transition-colors ${
                  activeView === key
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="text-lg">{viewIcons[key]}</span>
                <span>{name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

// --- Main Admin Dashboard ---
export default function AdminDashboard() {
  const [activeView, setActiveView] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    inProgressReports: 0,
    activeWorkers: 0,
    tasksCompletedToday: 0,
    avgCompletionTime: 0,
  });
  const [recentReports, setRecentReports] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const loadOverviewData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchApi("/api/admin/dashboard");
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
    if (activeView === "overview") loadOverviewData();
  }, [activeView, loadOverviewData]);

  const formatStatus = (status) =>
    status ? status.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) : "Unknown";

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <AdminSidebar
        activeView={activeView}
        onViewChange={setActiveView}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* --- HEADER (MODIFIED) --- */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Grouping for left-aligned items */}
          <div className="flex items-center gap-4">
            {/* Hamburger button moved to the left */}
            <button
              className="lg:hidden text-gray-700 hover:text-gray-900"
              onClick={toggleSidebar}
            >
              ☰
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          
          {/* Right-aligned content (if any) would go here */}
          {/* Example: <div className="... user icon ...">...</div> */}
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6">
          {activeView === "overview" && (
            loading ? (
              <p className="text-center text-gray-500">Loading overview...</p>
            ) : error ? (
              <p className="text-center text-red-500 bg-red-50 p-4 rounded-md">{error}</p>
            ) : (
              <div className="space-y-6">
                {/* Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  <Card className="bg-orange-50 border-orange-200">
                    <CardHeader>
                      <CardTitle>Pending Reports</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-900">{stats.pendingReports}</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-yellow-50 border-yellow-200">
                    <CardHeader>
                      <CardTitle>In Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-yellow-900">{stats.inProgressReports}</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                      <CardTitle>Total Active</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-900">
                        {stats.pendingReports + stats.inProgressReports}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-green-50 border-green-200">
                    <CardHeader>
                      <CardTitle>Active Workers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-900">{stats.activeWorkers}</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Unassigned Reports */}
                <Card className="bg-white border-gray-200">
                  <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <CardTitle>New Unassigned Reports</CardTitle>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveView("tasks")}
                        // Adjusted button classes for responsiveness
                        className="w-full sm:w-auto text-sm px-3 py-2"
                      >Assign Tasks
                    </Button>

                  </CardHeader>
                  <CardContent>
                    {recentReports.length > 0 ? (
                      <div className="space-y-4">
                        {recentReports.map((report) => (
                          <div
                            key={report._id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-white hover:shadow transition"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <Badge variant={report.urgency}>{report.urgency}</Badge>
                              <div>
                                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                                  {report.wasteType}
                                </h4>
                                <p className="text-xs sm:text-sm text-gray-600">
                                  {report.location?.address}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center justify-end gap-2 mt-2 sm:mt-0">
                              <Badge variant="Submitted">{formatStatus(report.status)}</Badge>
                              
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-8">No new reports.</p>
                    )}
                  </CardContent>
                </Card>

                {/* Ongoing Tasks */}
                <Card className="bg-white border-gray-200">
                  <CardHeader>
                    <CardTitle>Ongoing Tasks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {assignedTasks.length > 0 ? (
                      <div className="space-y-3">
                        {assignedTasks.map((task) => (
                          <div
                            key={task._id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg bg-gray-50"
                          >
                            <div>
                              <p className="font-semibold text-sm text-gray-800">{task.title}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                Assigned to:{" "}
                                <span className="font-medium text-gray-700">
                                  {task.assignedWorker?.name || "N/A"}
                                </span>
                              </p>
                            </div>
                            <div className="text-right mt-2 sm:mt-0">
                              <Badge variant={task.status}>{formatStatus(task.status)}</Badge>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(task.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-8">No ongoing tasks.</p>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Active Operations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between bg-blue-50 p-3 rounded">
                        <span>Workers on Duty</span>
                        <span className="font-bold text-blue-600">{stats.activeWorkers}</span>
                      </div>
                      <div className="flex justify-between bg-green-50 p-3 rounded">
                        <span>Tasks Completed Today</span>
                        <span className="font-bold text-green-600">{stats.tasksCompletedToday}</span>
                      </div>
                      <div className="flex justify-between bg-yellow-50 p-3 rounded">
                        <span>Avg Completion Time</span>
                        <span className="font-bold text-yellow-600">{stats.avgCompletionTime} mins</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      
                      <Button variant="outline" className="w-full justify-start" onClick={() => setActiveView("tasks")}>
                        📋 Assign Tasks
                      </Button>
                      <Button variant="outline" className="w-full justify-start" onClick={() => setActiveView("analytics")}>
                        📈 View Analytics
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )
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