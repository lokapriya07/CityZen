
"use client";

import React from "react";
import {
  MapPin,
  Clock,
  CheckCircle,
  Navigation,
  Play,
  Phone,
  MessageSquare,
} from "lucide-react";

export default function TaskQueue({
  tasks = [],
  onStatusUpdate,
  onOpenChat,
  onOpenCall,
}) {

  const getNextAction = (status) => {
    switch (status) {
      case "assigned":
        return {
          label: "Accept Task",
          icon: CheckCircle,
          nextStatus: "accepted",
        };
      case "accepted":
        return {
          label: "On the Way",
          icon: Navigation,
          nextStatus: "on-the-way",
        };
      case "on-the-way":
        return { label: "Start Work", icon: Play, nextStatus: "in-progress" };
      case "in-progress":
        return {
          label: "Mark Complete",
          icon: CheckCircle,
          nextStatus: "completed",
        };
      default:
        return null;
    }
  };

  const handleActionClick = (taskId, nextStatus) => {
    if (onStatusUpdate) onStatusUpdate(taskId, nextStatus);
  };

  const handleNavigate = (task) => {
    if (task.lat && task.lng) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${task.lat},${task.lng}`,
        "_blank"
      );
    } else if (task.location) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
          task.location
        )}`,
        "_blank"
      );
    } else {
      alert("Location details are missing for this task.");
    }
  };

  // ✅ FIXED: Enhanced chat opening with proper task data
  const handleOpenChat = (task) => {
    if (onOpenChat) {
      // Extract proper task information
      const taskData = {
        id: task._id || task.id,
        _id: task._id || task.id,
        displayId: task.displayId,
        title: task.title,
        status: task.status,
        // Include report data if available
        report: task.report ? {
          id: task.report._id || task.report.id,
          createdBy: task.report.createdBy,
          location: task.report.location,
          description: task.report.description
        } : null
      };

      // Extract citizen information
      const citizenInfo = task.report?.createdBy || task.citizen || {
        name: "Citizen",
        id: task.report?.createdBy?._id || task.createdBy
      };

      console.log("💬 Opening chat for task:", taskData);

      // Pass the task data and citizen info to parent
      onOpenChat(taskData, citizenInfo);
    }
  };

  const getPriorityStyles = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
      case "critical":
        return "bg-red-100 text-red-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "on-the-way":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "accepted":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "assigned":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {tasks.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          <div className="text-4xl mb-4">📋</div>
          <p className="text-lg font-medium text-gray-600">No tasks assigned</p>
          <p className="text-sm text-gray-500 mt-1">New tasks will appear here when assigned to you</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {tasks.map((task) => {
            const nextAction = getNextAction(task.status);
            const Icon = nextAction?.icon;

            return (
              <div
                key={task.id || task._id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col justify-between group"
              >
                {/* Header */}
                <div className="p-4 border-b bg-gradient-to-r from-gray-50 to-white flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div className="flex-1">
                    <div className="text-lg font-bold text-gray-900 font-mono">
                      {task.displayId || task.id || task._id?.slice(-6)}
                    </div>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${getPriorityStyles(
                          task.priority
                        )}`}
                      >
                        {task.priority ? task.priority.toUpperCase() : "N/A"}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusStyles(task.status)}`}>
                        {task.status.replace(/-/g, " ").toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    <div>
                      Assigned: {new Date(task.assignedTime).toLocaleString()}
                    </div>
                    <div>Due: {new Date(task.dueTime).toLocaleString()}</div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 sm:p-5 space-y-4 flex-1">
                  <div className="font-bold text-gray-900 text-lg leading-tight">
                    {task.title || "Maintenance Task"}
                  </div>

                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="font-medium text-gray-800 break-words">
                        {task.location || task.report?.location?.address || "Location not specified"}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Waste Type: <span className="font-medium">{task.wasteType || "General"}</span>
                      </div>
                      {task.report?.description && (
                        <div className="text-xs text-gray-500 mt-2 line-clamp-2">
                          {task.report.description}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>Estimated: <strong>{task.estimatedTime || "30"}</strong> minutes</span>
                  </div>

                  {/* Citizen Info (if available) */}
                  {(task.report?.createdBy || task.citizen) && (
                    <div className="flex items-center gap-3 text-sm p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {(task.report?.createdBy?.name?.[0] || task.citizen?.name?.[0] || "C").toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-blue-800">
                          {task.report?.createdBy?.name || task.citizen?.name || "Citizen"}
                        </div>
                        <div className="text-xs text-blue-600">
                          {task.report?.createdBy?.phone || task.citizen?.phone || "Contact available"}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleNavigate(task)}
                      className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-white hover:shadow-sm transition-all duration-200"
                      title="Open in Google Maps"
                    >
                      <Navigation className="h-4 w-4" />
                      <span className="hidden sm:inline">Navigate</span>
                    </button>

                    {/* Call Button */}
                    <button
                      onClick={() => onOpenCall(task)}
                      className="flex items-center gap-1 px-3 py-1 border rounded text-sm hover:bg-gray-100"
                    >
                      <Phone className="h-4 w-4" /> Call
                    </button>

                    <button
                      onClick={() => handleOpenChat(task)}
                      className="flex items-center gap-1 px-3 py-1 border rounded text-sm hover:bg-gray-100"
                    >
                      <MessageSquare className="h-4 w-4" /> Chat
                    </button>
                  </div>

                  {nextAction && (
                    <button
                      onClick={() =>
                        handleActionClick(task.id || task._id, nextAction.nextStatus)
                      }
                      className="flex items-center justify-center gap-2 px-4 py-2 w-full sm:w-auto bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                      {nextAction.label}
                    </button>
                  )}
                </div>

                {/* Progress indicator for in-progress tasks */}
                {(task.status === "in-progress" || task.status === "on-the-way") && (
                  <div className="px-4 pb-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${task.status === "on-the-way" ? "bg-purple-500 w-1/3" : "bg-blue-500 w-2/3"
                          } transition-all duration-500`}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 text-center">
                      {task.status === "on-the-way" ? "On the way to location" : "Work in progress"}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}