import React from "react";
import { AlertTriangle, MapPin, Users } from "lucide-react";

export function PriorityEngine() {
  const priorityTasks = [
    {
      id: "WM-001",
      location: "School District 5",
      wasteType: "Hazardous",
      proximity: "Near Hospital",
      complaints: 12,
      urgency: 95,
      autoAssigned: true,
    },
    {
      id: "WM-002",
      location: "Downtown Plaza",
      wasteType: "General",
      proximity: "Commercial Area",
      complaints: 8,
      urgency: 78,
      autoAssigned: false,
    },
    {
      id: "WM-003",
      location: "Residential Block C",
      wasteType: "Recyclable",
      proximity: "Residential",
      complaints: 3,
      urgency: 45,
      autoAssigned: true,
    },
  ];

  const getUrgencyColor = (urgency) => {
    if (urgency >= 80) return "bg-red-500 text-white";
    if (urgency >= 60) return "bg-orange-400 text-white";
    return "bg-gray-300 text-gray-700";
  };

  return (
    <div className="border rounded-lg shadow bg-white p-4 space-y-4">
      <div className="flex items-center gap-2 text-lg font-bold">
        <AlertTriangle className="w-5 h-5" />
        Priority Engine
      </div>

      <div className="flex items-center justify-between">
        <span>Auto Assignment</span>
        <input type="checkbox" defaultChecked className="toggle" />
      </div>

      <div className="space-y-3">
        {priorityTasks.map((task) => (
          <div key={task.id} className="border rounded p-3 space-y-2 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="font-semibold">{task.id}</span>
              <span className={`px-2 py-1 text-xs rounded ${getUrgencyColor(task.urgency)}`}>
                {task.urgency}% urgent
              </span>
            </div>

            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {task.location}
              </div>
              <div className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> {task.wasteType} waste
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" /> {task.complaints} complaints
              </div>
            </div>

            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>{task.proximity}</span>
              {!task.autoAssigned && (
                <button className="px-2 py-1 border rounded text-xs">Manual Override</button>
              )}
            </div>
          </div>
        ))}
      </div>

      <button className="w-full border px-3 py-2 rounded text-sm">View All Priority Tasks</button>
    </div>
  );
}
