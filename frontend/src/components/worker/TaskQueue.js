"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Clock, CheckCircle, Navigation, Play, Phone } from "lucide-react";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";

const fetchApi = async (url, method = "GET", body = null) => {
  const token = localStorage.getItem("workerToken");
  if (!token) throw new Error("No auth token found. Please login.");

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  const finalUrl =
    url.startsWith("/") && !url.startsWith("//")
      ? `http://localhost:8001${url}`
      : url;

  const response = await fetch(finalUrl, config);
  if (!response.ok) {
    let errorData = {};
    try {
      errorData = await response.json();
    } catch { }
    throw new Error(`API Error ${response.status}: ${errorData.msg || response.statusText}`);
  }

  return response.json();
};

// 🌍 helper to geocode address → lat/lng if missing
const geocodeAddress = async (address) => {
  try {
    const apiKey = "AIzaSyByW1p9H83GngOKJM2tEO4RG_M6flF21Qg";
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${apiKey}`
    );
    const data = await res.json();
    if (data.status === "OK") {
      const loc = data.results[0].geometry.location;
      return { lat: loc.lat, lng: loc.lng };
    }
  } catch (e) {
    console.error("Geocoding failed for", address, e);
  }
  return { lat: 0, lng: 0 };
};

export default function TaskQueue({ onStatsUpdate }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAssignedTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchApi("/api/worker/tasks");
      console.log("API Response:", res);

      const rawTasks = res.data?.tasks || res.tasks || [];

      // Map tasks and generate friendly IDs
      const mappedTasks = rawTasks.map((t, index) => {
        const coords = t.report?.location?.coordinates || [];
        const lat = coords.length === 2 ? coords[1] : 0;
        const lng = coords.length === 2 ? coords[0] : 0;

        return {
          displayId: `W${(index + 1).toString().padStart(3, "0")}`, // Friendly ID
          id: t._id, // backend ID
          location: t.report?.location?.address || t.report?.address || "N/A",
          lat,
          lng,
          wasteType: t.report?.wasteType || "General Waste",
          priority: t.report?.priority || "medium",
          estimatedTime: t.estimatedTime || "N/A",
          description: t.report?.description || "",
          status: t.status || "pending",
          assignedTime: t.assignedAt || "N/A",
          dueTime: t.dueTime || "N/A",
          supportNumber: t.report?.reporterPhone || "N/A",
        };
      });

      // Remove completed tasks from dashboard
      const visibleTasks = mappedTasks.filter((t) => t.status !== "completed");
      setTasks(visibleTasks);
      updateCounts(mappedTasks); // counts include completed tasks
    } catch (err) {
      console.error("Task Fetch Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("workerToken");
    if (!token) {
      alert("Please login first.");
      window.location.href = "/login";
      return;
    }
    fetchAssignedTasks();
  }, []);

  const updateCounts = (taskList) => {
    const stats = {
      total: taskList.length,
      completed: taskList.filter((t) => t.status === "completed").length,
      inProgress: taskList.filter((t) => t.status === "in-progress").length,
      pending: taskList.filter((t) => t.status === "pending").length,
    };
    if (onStatsUpdate) onStatsUpdate(stats);
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await fetchApi(`/api/worker/tasks/${taskId}/status`, "PUT", { status: newStatus });
      let updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      );
      // Remove completed tasks from UI
      updatedTasks = updatedTasks.filter((t) => t.status !== "completed");
      setTasks(updatedTasks);
      updateCounts(updatedTasks);
    } catch (err) {
      alert("Failed to update task status: " + err.message);
    }
  };

  const getNextAction = (status) => {
    switch (status) {
      case "pending":
      case "assigned":
      case "new":
        return { label: "Accept Task", icon: CheckCircle, nextStatus: "accepted" };
      case "accepted":
        return { label: "On the Way", icon: Navigation, nextStatus: "on-the-way" };
      case "on-the-way":
        return { label: "Start Work", icon: Play, nextStatus: "in-progress" };
      case "in-progress":
        return { label: "Mark Complete", icon: CheckCircle, nextStatus: "completed" };
      default:
        return null;
    }
  };

  const handleActionClick = (task) => {
    const nextAction = getNextAction(task.status);
    if (nextAction) updateTaskStatus(task.id, nextAction.nextStatus);
  };

  const handleNavigate = (task) => {
    if (task.lat && task.lng && task.lat !== 0 && task.lng !== 0) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${task.lat},${task.lng}`,
        "_blank"
      );
    } else if (task.location && task.location !== "N/A") {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(task.location)}`,
        "_blank"
      );
    } else {
      alert("Location missing for this task.");
    }
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
        {tasks.map((task) => {
          const nextAction = getNextAction(task.status);
          return (
            <div key={task.id} className="bg-white shadow rounded overflow-hidden">
              <div className="flex justify-between items-start p-4 border-b">
                <div>
                  <div className="text-lg font-semibold">{task.displayId}</div>
                  <div className="flex gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded text-xs bg-blue-600 text-white">
                      {task.priority.toUpperCase()}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs border text-gray-600">
                      {task.status.replace("-", " ").toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-500 text-right">
                  <div>Assigned: {task.assignedTime}</div>
                  <div>Due: {task.dueTime}</div>
                </div>
              </div>

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

                <div className="bg-gray-100 rounded-lg h-32 w-full">
                  <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    center={{ lat: task.lat, lng: task.lng }}
                    zoom={16}
                  >
                    {task.lat !== 0 && task.lng !== 0 && (
                      <Marker position={{ lat: task.lat, lng: task.lng }} />
                    )}
                  </GoogleMap>
                </div>
              </div>

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