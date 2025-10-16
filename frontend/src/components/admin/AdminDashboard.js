// import React, { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "../citizen/ui/card";
// import { Button } from "../citizen/ui/button";
// import { Badge } from "../citizen/ui/badge";
// import { AdminSidebar } from "./AdminSidebar";
// import { WasteHeatmap } from "./WasteHeatMap";
// import { TaskAssignmentHub } from "./TaskAssignmentHub";
// import { AnalyticsDashboard } from "./AnalyticsDashboard";
// import CommunityEngagement from "./CommunityEngagement";


// // Mock data for admin dashboard
// const mockReports = [
//   {
//     id: "WC004",
//     type: "Broken Waste Bin",
//     location: "Community Center, Block C",
//     coordinates: { lat: 28.6139, lng: 77.209 },
//     status: "submitted",
//     priority: "medium",
//     reportedAt: "2024-01-15T14:45:00Z",
//     reportedBy: "John Doe",
//     description: "Large waste bin is cracked and overflowing",
//   },
//   {
//     id: "WC001",
//     type: "Overflowing Bin",
//     location: "Park Street, Block A",
//     coordinates: { lat: 28.6149, lng: 77.2095 },
//     status: "in_progress",
//     priority: "high",
//     reportedAt: "2024-01-15T10:30:00Z",
//     reportedBy: "Sarah Wilson",
//     description: "Bin is completely full and attracting pests",
//     assignedWorker: "Rajesh Kumar",
//   },
//   {
//     id: "WC002",
//     type: "Illegal Dumping",
//     location: "Main Road, Sector 15",
//     coordinates: { lat: 28.6129, lng: 77.2295 },
//     status: "resolved",
//     priority: "critical",
//     reportedAt: "2024-01-14T09:00:00Z",
//     reportedBy: "Mike Johnson",
//     description: "Large pile of construction waste dumped illegally",
//     assignedWorker: "Priya Sharma",
//     resolvedAt: "2024-01-14T18:00:00Z",
//   },
// ];

// const mockWorkers = [
//   {
//     id: "W001",
//     name: "Rajesh Kumar",
//     phone: "+91 98765 43210",
//     avatar: "/hardworking-construction-worker.png",
//     status: "busy",
//     currentLocation: { lat: 28.6139, lng: 77.209 },
//     specialization: ["bin_collection", "maintenance"],
//     rating: 4.8,
//     completedTasks: 156,
//     currentTask: "WC001",
//   },
//   {
//     id: "W002",
//     name: "Priya Sharma",
//     phone: "+91 87654 32109",
//     avatar: "/female-worker.jpg",
//     status: "available",
//     currentLocation: { lat: 28.6129, lng: 77.2295 },
//     specialization: ["illegal_dumping", "hazardous_waste"],
//     rating: 4.9,
//     completedTasks: 203,
//     currentTask: null,
//   },
//   {
//     id: "W003",
//     name: "Amit Singh",
//     phone: "+91 76543 21098",
//     avatar: "/male-worker.jpg",
//     status: "available",
//     currentLocation: { lat: 28.6149, lng: 77.209 },
//     specialization: ["bin_collection", "street_cleaning"],
//     rating: 4.7,
//     completedTasks: 134,
//     currentTask: null,
//   },
// ];

// export default function AdminDashboard() {
//   const [activeView, setActiveView] = useState("overview");

//   const stats = {
//     totalReports: mockReports.length,
//     pendingReports: mockReports.filter((r) => r.status === "submitted").length,
//     inProgressReports: mockReports.filter((r) => r.status === "in_progress").length,
//     resolvedReports: mockReports.filter((r) => r.status === "resolved").length,
//     activeWorkers: mockWorkers.filter((w) => w.status === "busy").length,
//     availableWorkers: mockWorkers.filter((w) => w.status === "available").length,
//   };

//   return (
//     <div className="flex h-screen bg-background">
//       <AdminSidebar activeView={activeView} onViewChange={setActiveView} />

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Header */}
//         <header className="bg-card border-b border-border px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
//               <p className="text-sm text-muted-foreground">Smart Waste Management System</p>
//             </div>
//             <div className="flex items-center space-x-4">
//               <Button variant="outline" size="sm">
//                 <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-12" />
//                 </svg>
//                 Export Data
//               </Button>
//               <Button size="sm">
//                 <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                 </svg>
//                 New Alert
//               </Button>
//             </div>
//           </div>
//         </header>

//         {/* Content Area */}
//         <main className="flex-1 overflow-auto p-6">
//           {activeView === "overview" && (
//             <div className="space-y-6">
//               {/* Dashboard Stats */}
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                 {/* Total Reports */}
//                 <Card className="bg-blue-50 border-blue-200">
//                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                     <CardTitle className="text-sm font-medium text-blue-900">Total Reports</CardTitle>
//                     <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                       />
//                     </svg>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-2xl font-bold text-blue-900">{stats.totalReports}</div>
//                     <p className="text-xs text-blue-700">+2 from yesterday</p>
//                   </CardContent>
//                 </Card>

//                 {/* Pending */}
//                 <Card className="bg-orange-50 border-orange-200">
//                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                     <CardTitle className="text-sm font-medium text-orange-900">Pending</CardTitle>
//                     <svg className="h-4 w-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//                       />
//                     </svg>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-2xl font-bold text-orange-900">{stats.pendingReports}</div>
//                     <p className="text-xs text-orange-700">Requires attention</p>
//                   </CardContent>
//                 </Card>

//                 {/* In Progress */}
//                 <Card className="bg-yellow-50 border-yellow-200">
//                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                     <CardTitle className="text-sm font-medium text-yellow-900">In Progress</CardTitle>
//                     <svg className="h-4 w-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M13 10V3L4 14h7v7l9-11h-7z"
//                       />
//                     </svg>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-2xl font-bold text-yellow-900">{stats.inProgressReports}</div>
//                     <p className="text-xs text-yellow-700">Being handled</p>
//                   </CardContent>
//                 </Card>

//                 {/* Available Workers */}
//                 <Card className="bg-green-50 border-green-200">
//                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                     <CardTitle className="text-sm font-medium text-green-900">Available Workers</CardTitle>
//                     <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
//                       />
//                     </svg>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-2xl font-bold text-green-900">{stats.availableWorkers}</div>
//                     <p className="text-xs text-green-700">Ready for assignment</p>
//                   </CardContent>
//                 </Card>
//               </div>

//               {/* Recent Reports */}
//               {/* ... rest of code remains unchanged (maps through mockReports, mockWorkers) */}
//             </div>
//           )}

//           {activeView === "heatmap" && <WasteHeatmap />}
//           {activeView === "tasks" && <TaskAssignmentHub />}
//           {activeView === "analytics" && <AnalyticsDashboard />}
//           {activeView === "community" && <CommunityEngagement />}
//         </main>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../citizen/ui/card";
import { Button } from "../citizen/ui/button";
import { Badge } from "../citizen/ui/badge";
import { AdminSidebar } from "./AdminSidebar";
import { WasteHeatmap } from "./WasteHeatMap";
import { TaskAssignmentHub } from "./TaskAssignmentHub";
import { AnalyticsDashboard } from "./AnalyticsDashboard";
import CommunityEngagement from "./CommunityEngagement";
import { User, FileText, Clock, Users } from "lucide-react";

// Helper function to call your API
const fetchApi = async (url) => {
  const token = localStorage.getItem("adminToken"); // Or however you store your admin token
  if (!token) throw new Error("No auth token found.");

  const response = await fetch(`http://localhost:8001${url}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
};

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState("overview");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the backend when the component loads
  useEffect(() => {
    const getDashboardData = async () => {
      try {
        setLoading(true);
        const res = await fetchApi("/api/admin/dashboard");
        if (res.success) {
          setDashboardData(res.data);
        } else {
          throw new Error(res.message || "Failed to fetch data");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getDashboardData();
  }, []);

  const stats = dashboardData?.overview;

  const renderOverview = () => {
    if (loading) return <div>Loading dashboard...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;
    if (!stats) return <div>No data available.</div>;

    return (
      <div className="space-y-6">
        {/* Dashboard Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card><CardHeader><CardTitle>Total Reports</CardTitle><FileText /></CardHeader><CardContent>{stats.totalReports}</CardContent></Card>
          <Card><CardHeader><CardTitle>Pending</CardTitle><Clock /></CardHeader><CardContent>{stats.pendingReports}</CardContent></Card>
          <Card><CardHeader><CardTitle>In Progress</CardTitle><Users /></CardHeader><CardContent>{stats.inProgressReports}</CardContent></Card>
          <Card><CardHeader><CardTitle>Active Workers</CardTitle><User /></CardHeader><CardContent>{stats.activeWorkers}</CardContent></Card>
        </div>

        {/* ✅ NEW "Assigned Tasks" SECTION */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recently Assigned Tasks</h2>
          <div className="bg-white rounded-lg shadow">
            <ul className="divide-y divide-gray-200">
              {dashboardData.assignedTasks?.length > 0 ? (
                dashboardData.assignedTasks.map((task) => (
                  <li key={task._id} className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">{task.title}</p>
                      <p className="text-sm text-gray-500">Status: <Badge>{task.status.toUpperCase()}</Badge></p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm text-gray-800">{task.assignedWorker.name}</p>
                      <p className="text-xs text-gray-500">Assigned Worker</p>
                    </div>
                  </li>
                ))
              ) : (
                <p className="p-4 text-gray-500">No tasks are currently assigned.</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar activeView={activeView} onViewChange={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">Smart Waste Management System</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">Export Data</Button>
              <Button size="sm">New Alert</Button>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {activeView === "overview" && renderOverview()}
          {activeView === "heatmap" && <WasteHeatmap />}
          {activeView === "tasks" && <TaskAssignmentHub />}
          {activeView === "analytics" && <AnalyticsDashboard />}
          {activeView === "community" && <CommunityEngagement />}
        </main>
      </div>
    </div>
  );
}