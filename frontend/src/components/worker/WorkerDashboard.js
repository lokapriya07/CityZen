// "use client";

// import React, { useState, useEffect, useCallback } from "react";
// import { ChevronUp, AlertTriangle } from "lucide-react";
// import TaskQueue from "./TaskQueue";
// import PerformanceTracker from "./PerformanceTracker";
// import ResourceHub from "./ResourceHub";
// import TaskCardSkeleton from "./TaskCardSkeleton";

// // --- API Utility ---
// const fetchApi = async (url, method = "GET", body = null) => {
//   const token = localStorage.getItem("workerToken");
//   if (!token) throw new Error("No auth token found. Please login.");

//   const headers = {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`,
//   };
//   const config = { method, headers };
//   if (body) config.body = JSON.stringify(body);
//   const finalUrl = url.startsWith("/") && !url.startsWith("//") ? `http://localhost:8001${url}` : url;
//   const response = await fetch(finalUrl, config);
//   if (!response.ok) {
//     const errorData = await response.json().catch(() => ({}));
//     throw new Error(`API Error ${response.status}: ${errorData.msg || response.statusText}`);
//   }
//   return response.json();
// };

// function WorkerDashboard() {
//   const [activeView, setActiveView] = useState("tasks");
//   const [resourcesOpen, setResourcesOpen] = useState(false);
  
//   // --- State for tasks, loading, and stats is now here ---
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [taskStats, setTaskStats] = useState({ total: 0, completed: 0, inProgress: 0, pending: 0 });

//   // --- Data fetching logic is now in the dashboard ---
//   const fetchAssignedTasks = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetchApi("/api/worker/tasks");
//       const rawTasks = res.data?.tasks || res.tasks || [];
//       const mappedTasks = rawTasks.map((t, index) => ({
//         displayId: `W${(index + 1).toString().padStart(3, "0")}`,
//         id: t._id,
//         location: t.report?.location?.address || t.report?.address || "N/A",
//         lat: t.report?.location?.coordinates?.[1] || 0,
//         lng: t.report?.location?.coordinates?.[0] || 0,
//         wasteType: t.report?.wasteType || "General Waste",
//         priority: t.priority,
//         estimatedTime: t.estimatedTime || "N/A",
//         description: t.report?.description || "",
//         status: t.status || "pending",
//         assignedTime: t.assignedAt || "N/A",
//         dueTime: t.dueTime || "N/A",
//         supportNumber: t.report?.reporterPhone || "N/A",
//       }));
      
//       const visibleTasks = mappedTasks.filter((t) => t.status !== "completed");
//       setTasks(visibleTasks);

//       setTaskStats({
//         total: mappedTasks.length,
//         completed: mappedTasks.filter((t) => t.status === "completed").length,
//         inProgress: mappedTasks.filter((t) => t.status === "in-progress").length,
//         pending: mappedTasks.filter((t) => ["pending", "assigned", "accepted", "on-the-way"].includes(t.status)).length,
//       });

//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     const token = localStorage.getItem("workerToken");
//     if (!token) {
//       alert("Please login first.");
//       window.location.href = "/login";
//       return;
//     }
//     fetchAssignedTasks();
//   }, [fetchAssignedTasks]);

//   const handleTaskStatusUpdate = async (taskId, newStatus) => {
//     try {
//       await fetchApi(`/api/worker/tasks/${taskId}/status`, "PUT", { status: newStatus });
//       fetchAssignedTasks(); // Refetch all tasks to ensure data is consistent
//     } catch (err) {
//       alert("Failed to update task status: " + err.message);
//     }
//   };

//   const quickStats = [
//     { label: "Today's Tasks", value: taskStats.total, color: "text-blue-600" },
//     { label: "Completed", value: taskStats.completed, color: "text-green-600" },
//     { label: "In Progress", value: taskStats.inProgress, color: "text-orange-500" },
//     { label: "Pending", value: taskStats.pending, color: "text-yellow-600" },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="flex">
//         <div className={`transition-all duration-300 ${resourcesOpen ? "w-80" : "w-16"} border-r border-gray-300`}>
//           <div className="p-4">
//             <button className="w-full flex justify-between items-center p-2 bg-gray-100 rounded hover:bg-gray-200" onClick={() => setResourcesOpen(!resourcesOpen)}>
//               {resourcesOpen ? ( <><span className="font-semibold">Resources</span><ChevronUp className="h-4 w-4" /></> ) : ( <AlertTriangle className="h-4 w-4" /> )}
//             </button>
//             {resourcesOpen && <div className="mt-4"><ResourceHub /></div>}
//           </div>
//         </div>

//         <main className="flex-1 p-6">
//           <div className="mb-6">
//             <h1 className="text-3xl font-bold mb-2">Smart Taskboard</h1>
//             <p className="text-gray-600">Manage your waste collection tasks efficiently</p>
//           </div>

//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//             {quickStats.map((stat, i) => (
//               <div key={i} className="bg-white shadow rounded p-4 flex flex-col items-center">
//                 <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
//                 <div className="text-sm text-gray-500">{stat.label}</div>
//               </div>
//             ))}
//           </div>

//           <div className="flex gap-2 mb-6">
//             <button className={`px-4 py-2 rounded ${activeView === "tasks" ? "bg-blue-600 text-white" : "bg-white border text-gray-700"}`} onClick={() => setActiveView("tasks")}>My Tasks</button>
//             <button className={`px-4 py-2 rounded ${activeView === "performance" ? "bg-blue-600 text-white" : "bg-white border text-gray-700"}`} onClick={() => setActiveView("performance")}>Performance</button>
//           </div>

//           {activeView === "tasks" && (
//             <>
//               {loading && (
//                 <div className="space-y-6">
//                   <TaskCardSkeleton />
//                   <TaskCardSkeleton />
//                 </div>
//               )}
//               {error && <div className="text-center p-8 text-red-600">{error}</div>}
//               {!loading && !error && (
//                 <TaskQueue tasks={tasks} onStatusUpdate={handleTaskStatusUpdate} />
//               )}
//             </>
//           )}
//           {activeView === "performance" && <PerformanceTracker />}
//         </main>
//       </div>
//     </div>
//   );
// }

// export default WorkerDashboard;
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronUp, AlertTriangle } from "lucide-react";
import TaskQueue from "./TaskQueue";
import PerformanceTracker from "./PerformanceTracker";
import ResourceHub from "./ResourceHub";
import TaskCardSkeleton from "./TaskCardSkeleton";

// --- API Utility ---
const fetchApi = async (url, method = "GET", body = null) => {
  const token = localStorage.getItem("workerToken");
  if (!token) throw new Error("No auth token found. Please login.");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);
  const finalUrl = url.startsWith("/") && !url.startsWith("//") ? `http://localhost:8001${url}` : url;
  const response = await fetch(finalUrl, config);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`API Error ${response.status}: ${errorData.msg || response.statusText}`);
  }
  return response.json();
};

function WorkerDashboard() {
  const [activeView, setActiveView] = useState("tasks");
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [taskStats, setTaskStats] = useState({ total: 0, completed: 0, inProgress: 0, pending: 0 });

  const fetchAssignedTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchApi("/api/worker/tasks");
      const rawTasks = res.data?.tasks || res.tasks || [];
      
      const mappedTasks = rawTasks.map((t, index) => ({
        displayId: `W${(index + 1).toString().padStart(3, "0")}`,
        id: t._id,
        title: t.title,
        location: t.location?.address || "N/A",
        lat: t.location?.coordinates?.lat || 0,
        lng: t.location?.coordinates?.lng || 0,
        priority: t.priority,
        description: t.description || "",
        status: t.status || "pending",
        estimatedTime: t.estimatedDuration || "N/A",
        assignedTime: t.createdAt || "N/A",
        dueTime: t.scheduledDate || "N/A",
        wasteType: t.report?.wasteType || "N/A",
        supportNumber: t.report?.phone || "N/A",
      }));
      
      const visibleTasks = mappedTasks.filter((t) => t.status !== "completed");
      setTasks(visibleTasks);

      setTaskStats({
        total: mappedTasks.length,
        completed: mappedTasks.filter((t) => t.status === "completed").length,
        inProgress: mappedTasks.filter((t) => t.status === "in-progress").length,
        pending: mappedTasks.filter((t) => ["pending", "assigned", "accepted", "on-the-way"].includes(t.status)).length,
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("workerToken");
    if (!token) {
      alert("Please login first.");
      window.location.href = "/login";
      return;
    }
    fetchAssignedTasks();
  }, [fetchAssignedTasks]);

  const handleTaskStatusUpdate = async (taskId, newStatus) => {
    try {
      await fetchApi(`/api/worker/tasks/${taskId}/status`, "PUT", { status: newStatus });
      fetchAssignedTasks(); // Refetch all tasks to get the latest state
    } catch (err) {
      alert("Failed to update task status: " + err.message);
    }
  };

  const quickStats = [
    { label: "Today's Tasks", value: taskStats.total, color: "text-blue-600" },
    { label: "Completed", value: taskStats.completed, color: "text-green-600" },
    { label: "In Progress", value: taskStats.inProgress, color: "text-orange-500" },
    { label: "Pending", value: taskStats.pending, color: "text-yellow-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <div className={`transition-all duration-300 ${resourcesOpen ? "w-80" : "w-16"} border-r border-gray-300`}>
          <div className="p-4">
            <button className="w-full flex justify-between items-center p-2 bg-gray-100 rounded hover:bg-gray-200" onClick={() => setResourcesOpen(!resourcesOpen)}>
              {resourcesOpen ? ( <><span className="font-semibold">Resources</span><ChevronUp className="h-4 w-4" /></> ) : ( <AlertTriangle className="h-4 w-4" /> )}
            </button>
            {resourcesOpen && <div className="mt-4"><ResourceHub /></div>}
          </div>
        </div>

        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Smart Taskboard</h1>
            <p className="text-gray-600">Manage your waste collection tasks efficiently</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {quickStats.map((stat, i) => (
              <div key={i} className="bg-white shadow rounded p-4 flex flex-col items-center">
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-6">
            <button className={`px-4 py-2 rounded ${activeView === "tasks" ? "bg-blue-600 text-white" : "bg-white border text-gray-700"}`} onClick={() => setActiveView("tasks")}>My Tasks</button>
            <button className={`px-4 py-2 rounded ${activeView === "performance" ? "bg-blue-600 text-white" : "bg-white border text-gray-700"}`} onClick={() => setActiveView("performance")}>Performance</button>
          </div>

          {activeView === "tasks" && (
            <>
              {loading && (
                <div className="space-y-6">
                  <TaskCardSkeleton />
                  <TaskCardSkeleton />
                </div>
              )}
              {error && <div className="text-center p-8 text-red-600">{error}</div>}
              {!loading && !error && (
                <TaskQueue tasks={tasks} onStatusUpdate={handleTaskStatusUpdate} />
              )}
            </>
          )}
          {activeView === "performance" && <PerformanceTracker />}
        </main>
      </div>
    </div>
  );
}

export default WorkerDashboard;