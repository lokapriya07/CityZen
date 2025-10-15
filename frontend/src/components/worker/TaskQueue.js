"use client";

import React from "react";
import { MapPin, Clock, CheckCircle, Navigation, Play, Phone } from "lucide-react";
import OpenStreetMap from "./OpenStreetMap";

export default function TaskQueue({ tasks = [], onStatusUpdate }) {
  
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
    if (nextAction && onStatusUpdate) {
      onStatusUpdate(task.id, nextAction.nextStatus);
    }
  };

  const handleNavigate = (task) => {
    if (task.lat && task.lng && task.lat !== 0 && task.lng !== 0) {
      // Use OpenStreetMap's routing URL
      window.open(`https://www.openstreetmap.org/directions?from=&to=${task.lat},${task.lng}`, "_blank");
    } else {
      alert("Location coordinates missing for this task.");
    }
  };

  const handleCallSupport = (number) => {
    if (!number || number === "N/A") return alert("Support number not available!");
    window.open(`tel:${number}`);
  };

  if (tasks.length === 0) {
    return <div className="text-center p-8 text-gray-500">No active tasks assigned.</div>;
  }

  return (
    <div className="space-y-6">
      {tasks.map((task) => {
        // This is the line that likely had the typo
        const nextAction = getNextAction(task.status);
        return (
          <div key={task.id} className="bg-white shadow rounded overflow-hidden">
            <div className="flex justify-between items-start p-4 border-b">
              <div>
                <div className="text-lg font-semibold">{task.displayId}</div>
                <div className="flex gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded text-xs bg-blue-600 text-white">{task.priority.toUpperCase()}</span>
                  <span className="px-2 py-0.5 rounded text-xs border text-gray-600">{task.status.replace("-", " ").toUpperCase()}</span>
                </div>
              </div>
              <div className="text-sm text-gray-500 text-right">
                <div>Assigned: {new Date(task.assignedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                <div>Due: {new Date(task.dueTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            </div>

            <div className="p-4 grid md:grid-cols-2 gap-4 items-center">
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
                  <button onClick={() => handleNavigate(task)} className="flex items-center gap-1 px-3 py-1 border rounded text-sm hover:bg-gray-100"><MapPin className="h-4 w-4" /> Navigate</button>
                  <button onClick={() => handleCallSupport(task.supportNumber)} className="flex items-center gap-1 px-3 py-1 border rounded text-sm hover:bg-gray-100"><Phone className="h-4 w-4" /> Call Support</button>
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg h-32 w-full">
                <OpenStreetMap 
                  lat={task.lat} 
                  lng={task.lng} 
                  locationName={task.location}
                />
              </div>
            </div>

            {nextAction && (
              <div className="p-4 border-t flex justify-end">
                <button onClick={() => handleActionClick(task)} className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                  <nextAction.icon className="h-4 w-4" />
                  {nextAction.label}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}