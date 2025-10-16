"use client";

import React from "react";
import { MapPin, Clock, CheckCircle, Navigation, Play, Phone } from "lucide-react";
import { GoogleMap, Marker } from "@react-google-maps/api";

export default function TaskQueue({ tasks = [], onStatusUpdate }) {
  const getNextAction = (status) => {
    switch (status) {
      case "assigned":
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

  const handleActionClick = (taskId, nextStatus) => {
    if (onStatusUpdate) {
      onStatusUpdate(taskId, nextStatus);
    }
  };

  const handleNavigate = (task) => {
    if (task.lat && task.lng && task.lat !== 0 && task.lng !== 0) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${task.lat},${task.lng}`, "_blank");
    } else if (task.location && task.location !== "N/A") {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(task.location)}`, "_blank");
    } else {
      alert("Location details are missing for this task.");
    }
  };

  const handleCallSupport = (number) => {
    if (!number || number === "N/A") return alert("Support number not available!");
    window.open(`tel:${number}`);
  };

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case "high":
      case "critical":
        return "bg-red-100 text-red-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="space-y-6">
      {tasks.length === 0 ? (
        <div className="text-center text-gray-500">No tasks available</div>
      ) : (
        tasks.map((task) => {
          const nextAction = getNextAction(task.status);
          return (
            <div key={task.id} className="bg-white shadow rounded overflow-hidden">
              <div className="flex justify-between items-start p-4 border-b">
                <div>
                  <div className="text-lg font-semibold">{task.displayId}</div>
                  <div className="flex gap-2 mt-1">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold ${getPriorityStyles(
                        task.priority
                      )}`}
                    >
                      {task.priority ? task.priority.toUpperCase() : "N/A"}
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
                  <div className="font-bold text-gray-800">{task.title}</div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-gray-500" />
                    <div>
                      <div className="font-medium text-sm">{task.location}</div>
                      <div className="text-xs text-gray-500">
                        Waste Type: {task.wasteType}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Estimated: {task.estimatedTime} min</span>
                  </div>

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleNavigate(task)}
                      className="flex items-center gap-1 px-3 py-1 border rounded text-sm hover:bg-gray-100"
                    >
                      <Navigation className="h-4 w-4" /> Navigate
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
                  {task.lat && task.lng ? (
                    <GoogleMap
                      mapContainerStyle={{ width: "100%", height: "100%" }}
                      center={{ lat: task.lat, lng: task.lng }}
                      zoom={15}
                      options={{ disableDefaultUI: true, zoomControl: true }}
                    >
                      <Marker position={{ lat: task.lat, lng: task.lng }} />
                    </GoogleMap>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      No location data
                    </div>
                  )}
                </div>
              </div>

              {nextAction && (
                <div className="p-4 border-t flex justify-end">
                  <button
                    onClick={() => handleActionClick(task.id, nextAction.nextStatus)}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    <nextAction.icon className="h-4 w-4" />
                    {nextAction.label}
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
