

// export default WorkerDashboard;
"use client";

import React, { useState, useEffect, useCallback } from "react";
// ✅ ADDED Phone, X, and User icons
import { ChevronUp, AlertTriangle, Phone, X, User } from "lucide-react";
import TaskQueue from "./TaskQueue";
import PerformanceTracker from "./PerformanceTracker";
import ResourceHub from "./ResourceHub";
import TaskCardSkeleton from "./TaskCardSkeleton";
import { EmergencyMessaging } from "../EmergencyMessaging";

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
  const finalUrl =
    url.startsWith("/") && !url.startsWith("//")
      ? `http://localhost:8001${url}`
      : url;
  const response = await fetch(finalUrl, config);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `API Error ${response.status}: ${errorData.msg || response.statusText}`
    );
  }
  return response.json();
};

function WorkerDashboard() {
  const [activeView, setActiveView] = useState("tasks");
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
  });

  const [selectedTask, setSelectedTask] = useState(null);
  const [showChat, setShowChat] = useState(false);

  // ✅ ADDED: State for the call modal
  const [showCallModal, setShowCallModal] = useState(false);
  const [selectedTaskForCall, setSelectedTaskForCall] = useState(null);

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
        // ✅ ADDED: Get the reporter's name and phone from the populated report
        reporterName: t.report?.fullName || "N/A",
        supportNumber: t.report?.phone || "N/A",
      }));

      const visibleTasks = mappedTasks.filter((t) => t.status !== "completed");
      setTasks(visibleTasks);

      setTaskStats({
        total: mappedTasks.length,
        completed: mappedTasks.filter((t) => t.status === "completed").length,
        inProgress: mappedTasks.filter((t) => t.status === "in-progress")
          .length,
        pending: mappedTasks.filter((t) =>
          ["pending", "assigned", "accepted", "on-the-way"].includes(t.status)
        ).length,
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
      await fetchApi(`/api/worker/tasks/${taskId}/status`, "PUT", {
        status: newStatus,
      });
      fetchAssignedTasks(); // Refetch all tasks to get the latest state
    } catch (err) {
      alert("Failed to update task status: " + err.message);
    }
  };

  const handleOpenChat = (task) => {
    setSelectedTask(task);
    setShowChat(true);
  };

  // ✅ ADDED: Handler to open the call modal
  const handleOpenCallModal = (task) => {
    setSelectedTaskForCall(task);
    setShowCallModal(true);
  };

  const quickStats = [
    { label: "Today's Tasks", value: taskStats.total, color: "text-blue-600" },
    { label: "Completed", value: taskStats.completed, color: "text-green-600" },
    {
      label: "In Progress",
      value: taskStats.inProgress,
      color: "text-orange-500",
    },
    { label: "Pending", value: taskStats.pending, color: "text-yellow-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row">
        <div
          className={`transition-all duration-300 
           ${resourcesOpen ? "w-full md:w-80" : "w-full md:w-16"} 
           border-b md:border-b-0 md:border-r border-gray-300 
           bg-white flex flex-col`}
        >
          <div
            className={`p-4 ${
              resourcesOpen ? "items-start" : "items-center"
            } flex flex-col`}
          >
            <button
              className={`w-full flex ${
                resourcesOpen ? "justify-between" : "justify-center"
              } items-center p-2 bg-gray-100 rounded hover:bg-gray-200 transition-all`}
              onClick={() => setResourcesOpen(!resourcesOpen)}
              title={resourcesOpen ? "Hide Resources" : "Show Resources"}
            >
              {resourcesOpen ? (
                <>
                  <span className="font-semibold">Resources</span>
                  <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mb-1" />
                </div>
              )}
            </button>

            {resourcesOpen && (
              <div className="mt-4 overflow-y-auto max-h-[90vh] w-full">
                <ResourceHub />
              </div>
            )}
          </div>
        </div>

        <main className="flex-1 p-4 sm:p-6">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Smart Taskboard
            </h1>

            <p className="text-gray-600">
              Manage your waste collection tasks efficiently
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
            {quickStats.map((stat, i) => (
              <div
                key={i}
                className="bg-white shadow rounded p-4 flex flex-col items-center"
              >
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              className={`px-4 py-2 rounded ${
                activeView === "tasks"
                  ? "bg-blue-600 text-white"
                  : "bg-white border text-gray-700"
              }`}
              onClick={() => setActiveView("tasks")}
            >
              My Tasks
            </button>
            <button
              className={`px-4 py-2 rounded ${
                activeView === "performance"
                  ? "bg-blue-600 text-white"
                  : "bg-white border text-gray-700"
              }`}
              onClick={() => setActiveView("performance")}
            >
              Performance
            </button>
          </div>

          {activeView === "tasks" && (
            <>
              {loading && (
                <div className="space-y-6">
                  <TaskCardSkeleton />
                  <TaskCardSkeleton />
                </div>
              )}
              {error && (
                <div className="text-center p-8 text-red-600">{error}</div>
              )}
              {!loading && !error && (
                <TaskQueue
                  tasks={tasks}
                  onStatusUpdate={handleTaskStatusUpdate}
                  onOpenChat={handleOpenChat}
                  // ✅ ADDED: Pass the call handler to the TaskQueue
                  onOpenCall={handleOpenCallModal}
                />
              )}
            </>
          )}
          {activeView === "performance" && <PerformanceTracker />}
        </main>
      </div>

      {/* Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl h-[80vh]">
            <EmergencyMessaging
              userType="worker"
              taskId={selectedTask?._id || selectedTask?.id}
              onClose={() => setShowChat(false)}
            />
          </div>
        </div>
      )}

      {/* ✅ ADDED: Call Reporter Modal */}
      {showCallModal && selectedTaskForCall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-sm p-6 shadow-xl transform transition-all">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Contact Reporter
              </h3>
              <button
                onClick={() => setShowCallModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Reporter Name */}
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 bg-gray-100 rounded-full p-3">
                  <User size={20} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="text-lg font-medium text-gray-900">
                    {selectedTaskForCall.reporterName}
                  </p>
                </div>
              </div>
              
              {/* Phone Number */}
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 bg-gray-100 rounded-full p-3">
                  <Phone size={20} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="text-lg font-medium text-gray-900">
                    {selectedTaskForCall.supportNumber}
                  </p>
                </div>
              </div>
            </div>

            {/* Call Button */}
            <a
              href={`tel:${selectedTaskForCall.supportNumber}`}
              className="mt-6 w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition duration-150 ease-in-out"
            >
              <Phone size={20} className="mr-2" />
              Call Now
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkerDashboard;