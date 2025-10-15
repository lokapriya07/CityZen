import React, { useState } from "react";
import { ChevronUp, AlertTriangle } from "lucide-react";
import TaskQueue from "./TaskQueue";
import PerformanceTracker from "./PerformanceTracker";
import ResourceHub from "./ResourceHub";

function WorkerDashboard() {
  const [activeView, setActiveView] = useState("tasks");
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
  });

  const handleStatsUpdate = (stats) => {
    setTaskStats(stats);
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
        {/* Collapsible Resource Sidebar */}
        <div
          className={`transition-all duration-300 ${resourcesOpen ? "w-80" : "w-16"
            } border-r border-gray-300`}
        >
          <div className="p-4">
            <button
              className="w-full flex justify-between items-center p-2 bg-gray-100 rounded hover:bg-gray-200"
              onClick={() => setResourcesOpen(!resourcesOpen)}
            >
              {resourcesOpen ? (
                <>
                  <span className="font-semibold">Resources</span>
                  <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
            </button>
            {resourcesOpen && <div className="mt-4"><ResourceHub /></div>}
          </div>
        </div>

        {/* Main Area */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Smart Taskboard</h1>
            <p className="text-gray-600">Manage your waste collection tasks efficiently</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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

          {/* Navigation */}
          <div className="flex gap-2 mb-6">
            <button
              className={`px-4 py-2 rounded ${activeView === "tasks"
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-300 text-gray-700"
                }`}
              onClick={() => setActiveView("tasks")}
            >
              My Tasks
            </button>
            <button
              className={`px-4 py-2 rounded ${activeView === "performance"
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-300 text-gray-700"
                }`}
              onClick={() => setActiveView("performance")}
            >
              Performance
            </button>
          </div>

          {/* Content */}
          {activeView === "tasks" && <TaskQueue onStatsUpdate={handleStatsUpdate} />}
          {activeView === "performance" && <PerformanceTracker />}
        </main>
      </div>
    </div>
  );
}

export default WorkerDashboard;
