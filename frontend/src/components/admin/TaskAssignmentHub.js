import React from "react";
import { MapPin, Clock, User } from "lucide-react";

export function TaskAssignmentHub() {
  const workers = [
    { id: 1, name: "John Smith", status: "available", specialization: "General", currentTasks: 2, rating: 4.8 },
    { id: 2, name: "Maria Garcia", status: "busy", specialization: "Hazardous", currentTasks: 1, rating: 4.9 },
    { id: 3, name: "David Chen", status: "available", specialization: "Recyclable", currentTasks: 0, rating: 4.7 },
    { id: 4, name: "Sarah Johnson", status: "offline", specialization: "General", currentTasks: 0, rating: 4.6 },
  ];

  const tasks = [
    {
      id: "WM-001",
      location: "Downtown Plaza",
      wasteType: "General",
      priority: "high",
      estimatedTime: "2h",
      status: "unassigned",
      description: "Large pile of general waste near fountain",
    },
    {
      id: "WM-002",
      location: "School District 5",
      wasteType: "Hazardous",
      priority: "critical",
      estimatedTime: "3h",
      status: "assigned",
      assignedTo: "Maria Garcia",
      description: "Chemical waste containers need proper disposal",
    },
    {
      id: "WM-003",
      location: "Park Avenue",
      wasteType: "Recyclable",
      priority: "medium",
      estimatedTime: "1h",
      status: "in-progress",
      assignedTo: "David Chen",
      description: "Overflowing recycling bins",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "busy":
        return "bg-orange-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical":
        return "bg-red-500 text-white";
      case "high":
        return "bg-yellow-400 text-black";
      case "medium":
        return "bg-blue-200 text-black";
      default:
        return "bg-gray-200 text-black";
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "assigned":
        return "bg-blue-200 text-black";
      case "in-progress":
        return "bg-green-200 text-black";
      case "unassigned":
        return "bg-gray-200 text-black";
      default:
        return "bg-gray-200 text-black";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Workers Sidebar */}
      <div className="border rounded shadow p-4 bg-white">
        <h2 className="text-lg font-bold flex items-center gap-2 mb-3">
          <User className="h-5 w-5" />
          Available Workers
        </h2>
        <div className="space-y-3">
          {workers.map((worker) => (
            <div key={worker.id} className="flex items-center gap-3 border p-3 rounded shadow-sm">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                  {worker.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(worker.status)}`}></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{worker.name}</div>
                <div className="text-xs text-gray-500">{worker.specialization}</div>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                  <span className="px-2 py-1 border rounded">{worker.currentTasks} tasks</span>
                  <span>⭐ {worker.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Board */}
      <div className="lg:col-span-2 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Unassigned Tasks */}
          <div className="border rounded shadow p-4 bg-white">
            <h3 className="text-sm font-bold mb-3">Unassigned</h3>
            <div className="space-y-3">
              {tasks
                .filter((task) => task.status === "unassigned")
                .map((task) => (
                  <div key={task.id} className="border p-3 rounded hover:shadow transition-shadow cursor-move">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-sm">{task.id}</span>
                      <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                    </div>
                    <div className="space-y-1 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {task.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Est. {task.estimatedTime}
                      </div>
                      <p>{task.description}</p>
                      <span className="px-2 py-1 border rounded text-xs">{task.wasteType}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Assigned Tasks */}
          <div className="border rounded shadow p-4 bg-white">
            <h3 className="text-sm font-bold mb-3">Assigned</h3>
            <div className="space-y-3">
              {tasks
                .filter((task) => task.status === "assigned")
                .map((task) => (
                  <div key={task.id} className="border p-3 rounded shadow-sm">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-sm">{task.id}</span>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusBadgeColor(task.status)}`}>{task.status}</span>
                    </div>
                    <div className="space-y-1 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {task.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" /> {task.assignedTo}
                      </div>
                      <p>{task.description}</p>
                      <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* In Progress Tasks */}
          <div className="border rounded shadow p-4 bg-white">
            <h3 className="text-sm font-bold mb-3">In Progress</h3>
            <div className="space-y-3">
              {tasks
                .filter((task) => task.status === "in-progress")
                .map((task) => (
                  <div key={task.id} className="border p-3 rounded shadow-sm">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-sm">{task.id}</span>
                      <span className="px-2 py-1 rounded text-xs bg-green-200">Active</span>
                    </div>
                    <div className="space-y-1 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {task.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" /> {task.assignedTo}
                      </div>
                      <p>{task.description}</p>
                      <div className="flex justify-between">
                        <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                        <button className="text-xs px-2 py-1 border rounded">Track</button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
