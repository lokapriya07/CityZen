"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Clock, CheckCircle, Navigation, Play, Phone } from "lucide-react";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";

// --- API Utility with dynamic token
const fetchApi = async (url, method = "GET", body = null) => {
  const token = localStorage.getItem("workerToken");
  if (!token) throw new Error("No auth token found. Please login.");

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  const finalUrl = url.startsWith("/") && !url.startsWith("//")
    ? `http://localhost:8001${url}`
    : url;

  const response = await fetch(finalUrl, config);
  if (!response.ok) {
    let errorData = {};
    try { errorData = await response.json(); } catch (e) { }
    throw new Error(`API Error ${response.status}: ${errorData.msg || response.statusText}`);
  }

  return response.json();
};

export default function TaskQueue() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch assigned tasks from backend
  useEffect(() => {
    const token = localStorage.getItem("workerToken");
    if (!token) {
      alert("Please login first.");
      window.location.href = "/login";
      return;
    }

    const fetchAssignedTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchApi("/api/worker/tasks");
        const mappedTasks = res.data.tasks.map(t => ({
          id: t._id,
          location: t.report?.location || "N/A",
          lat: t.report?.coordinates?.lat || 0,
          lng: t.report?.coordinates?.lng || 0,
          wasteType: t.report?.wasteType || "General Waste",
          priority: t.report?.priority || "medium",
          estimatedTime: t.estimatedTime || "N/A",
          description: t.report?.description || "",
          status: t.status || "pending",
          assignedTime: t.assignedAt || "N/A",
          dueTime: t.dueTime || "N/A",
          supportNumber: t.report?.reporterPhone || "N/A",
        }));
        setTasks(mappedTasks);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedTasks();
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical": return "bg-red-600 text-white";
      case "high": return "bg-orange-500 text-white";
      case "medium": return "bg-yellow-500 text-white";
      default: return "bg-blue-600 text-white";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "text-green-600";
      case "in-progress": return "text-blue-600";
      case "on-way": return "text-orange-500";
      case "accepted": return "text-purple-600";
      default: return "text-gray-500";
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await fetchApi(`/api/worker/tasks/${taskId}/status`, "PUT", { status: newStatus });
      setTasks(tasks.map(task => task.id === taskId ? { ...task, status: newStatus } : task));
    } catch (err) {
      alert("Failed to update task status: " + err.message);
    }
  };

  const getNextAction = (status) => {
    switch (status) {
      case "pending": return { label: "Accept Task", icon: CheckCircle, nextStatus: "accepted" };
      case "accepted": return { label: "On the Way", icon: Navigation, nextStatus: "on-way" };
      case "on-way": return { label: "Start Work", icon: Play, nextStatus: "in-progress" };
      case "in-progress": return { label: "Mark Complete", icon: CheckCircle, nextStatus: "completed" };
      default: return null;
    }
  };

  const handleActionClick = (task) => {
    const nextAction = getNextAction(task.status);
    if (nextAction) updateTaskStatus(task.id, nextAction.nextStatus);
  };

  const handleNavigate = (task) => {
    if (!task.lat || !task.lng) return alert("Location not available!");
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${task.lat},${task.lng}`, "_blank");
  };

  const handleCallSupport = (number) => {
    if (!number) return alert("Support number not available!");
    window.open(`tel:${number}`);
  };

  if (loading) return <div className="text-center p-8 text-blue-600">Loading tasks...</div>;
  if (error) return <div className="text-center p-8 text-red-600">{error}</div>;

  return (
    <LoadScript googleMapsApiKey="AIzaSyByW1p9H83GngOKJM2tEO4RG_M6flF21Qg">
      <div className="space-y-6">
        {tasks.map(task => {
          const nextAction = getNextAction(task.status);
          return (
            <div key={task.id} className="bg-white shadow rounded overflow-hidden">
              {/* Header */}
              <div className="flex justify-between items-start p-4 border-b">
                <div>
                  <div className="text-lg font-semibold">{task.id}</div>
                  <div className="flex gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded text-xs ${getPriorityColor(task.priority)}`}>
                      {task.priority.toUpperCase()}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs border ${getStatusColor(task.status)}`}>
                      {task.status.replace("-", " ").toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-500 text-right">
                  <div>Assigned: {task.assignedTime}</div>
                  <div>Due: {task.dueTime}</div>
                </div>
              </div>

              {/* Content with map on right */}
              <div className="p-4 space-y-4 grid md:grid-cols-2 gap-4 items-center">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-gray-500" />
                    <div>
                      <div className="font-medium text-sm">{task.location}</div>
                      <div className="text-xs text-gray-500">Waste Type: {task.wasteType}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Estimated: {task.estimatedTime}</span>
                  </div>
                  <p className="text-sm text-gray-500">{task.description}</p>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleNavigate(task)}
                      className="flex items-center gap-1 px-3 py-1 border rounded text-sm hover:bg-gray-100"
                    >
                      <MapPin className="h-4 w-4" /> Navigate
                    </button>
                    <button
                      onClick={() => handleCallSupport(task.supportNumber)}
                      className="flex items-center gap-1 px-3 py-1 border rounded text-sm hover:bg-gray-100"
                    >
                      <Phone className="h-4 w-4" /> Call Support
                    </button>
                  </div>
                </div>

                {/* Map */}
                <div className="bg-gray-100 rounded-lg h-32 w-full">
                  <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    center={{ lat: task.lat, lng: task.lng }}
                    zoom={16}
                  >
                    <Marker position={{ lat: task.lat, lng: task.lng }} />
                  </GoogleMap>
                </div>
              </div>

              {/* Task Action Button */}
              {nextAction && (
                <div className="p-4 border-t flex justify-end">
                  <button
                    onClick={() => handleActionClick(task)}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    <nextAction.icon className="h-4 w-4" />
                    {nextAction.label}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </LoadScript>
  );
}
