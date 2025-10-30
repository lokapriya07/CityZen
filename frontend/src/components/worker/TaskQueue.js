// // "use client";

// // import React, { useState, useEffect } from "react";
// // import { MapPin, Clock, CheckCircle, Navigation, Play, Phone } from "lucide-react";
// // import { GoogleMap, Marker, DirectionsRenderer, LoadScript } from "@react-google-maps/api";

// // export default function TaskQueue({ tasks = [], onStatusUpdate }) {
// //   const [currentPosition, setCurrentPosition] = useState(null);

// //   // 📍 Get worker's current location once
// //   useEffect(() => {
// //     if (navigator.geolocation) {
// //       navigator.geolocation.getCurrentPosition(
// //         (position) => {
// //           setCurrentPosition({
// //             lat: position.coords.latitude,
// //             lng: position.coords.longitude,
// //           });
// //         },
// //         () => {
// //           console.warn("Geolocation permission denied.");
// //         }
// //       );
// //     }
// //   }, []);

// //   // 🔁 Get next action for each task status
// //   const getNextAction = (status) => {
// //     switch (status) {
// //       case "assigned":
// //         return { label: "Accept Task", icon: CheckCircle, nextStatus: "accepted" };
// //       case "accepted":
// //         return { label: "On the Way", icon: Navigation, nextStatus: "on-the-way" };
// //       case "on-the-way":
// //         return { label: "Start Work", icon: Play, nextStatus: "in-progress" };
// //       case "in-progress":
// //         return { label: "Mark Complete", icon: CheckCircle, nextStatus: "completed" };
// //       default:
// //         return null;
// //     }
// //   };

// //   const handleActionClick = (taskId, nextStatus) => {
// //     if (onStatusUpdate) onStatusUpdate(taskId, nextStatus);
// //   };

// //   // 🧭 Open Google Maps navigation
// //   const handleNavigate = (task) => {
// //     if (task.lat && task.lng && task.lat !== 0 && task.lng !== 0) {
// //       window.open(
// //         `https://www.google.com/maps/dir/?api=1&destination=${task.lat},${task.lng}`,
// //         "_blank"
// //       );
// //     } else if (task.location && task.location !== "N/A") {
// //       window.open(
// //         `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(task.location)}`,
// //         "_blank"
// //       );
// //     } else {
// //       alert("Location details are missing for this task.");
// //     }
// //   };

// //   // 📞 Call support number
// //   const handleCallSupport = (number) => {
// //     if (!number || number === "N/A") return alert("Support number not available!");
// //     window.open(`tel:${number}`);
// //   };

// //   // 🎨 Priority label colors
// //   const getPriorityStyles = (priority) => {
// //     switch (priority) {
// //       case "high":
// //       case "critical":
// //         return "bg-red-100 text-red-800";
// //       case "low":
// //         return "bg-green-100 text-green-800";
// //       default:
// //         return "bg-blue-100 text-blue-800";
// //     }
// //   };

// //   // 🗺️ Map component
// //   const TaskMap = ({ task }) => {
// //     const [directions, setDirections] = useState(null);

// //     useEffect(() => {
// //       if (currentPosition && task.lat && task.lng && window.google) {
// //         const directionsService = new window.google.maps.DirectionsService();
// //         directionsService.route(
// //           {
// //             origin: currentPosition,
// //             destination: { lat: task.lat, lng: task.lng },
// //             travelMode: window.google.maps.TravelMode.DRIVING,
// //           },
// //           (result, status) => {
// //             if (status === "OK") {
// //               setDirections(result);
// //             } else {
// //               console.error("Error fetching directions", result);
// //             }
// //           }
// //         );
// //       }
// //     }, [currentPosition, task.lat, task.lng]);

// //     const mapCenter = currentPosition || (task.lat && task.lng ? { lat: task.lat, lng: task.lng } : null);

// //     if (!mapCenter) return <div className="h-64 w-full bg-gray-100 flex items-center justify-center text-gray-500">Location not available</div>;

// //     return (
// //       <div className="h-64 w-full rounded overflow-hidden">
// //         <LoadScript googleMapsApiKey="AIzaSyAyl3YpasKmlq-QnQA_lVbvfrnW7VLNwDY">
// //           <GoogleMap
// //             mapContainerStyle={{ width: "100%", height: "100%" }}
// //             center={mapCenter}
// //             zoom={14}
// //             options={{ disableDefaultUI: false }}
// //           >
// //             {currentPosition && <Marker position={currentPosition} label="You" />}
// //             {task.lat && task.lng && <Marker position={{ lat: task.lat, lng: task.lng }} />}
// //             {directions && <DirectionsRenderer directions={directions} />}
// //           </GoogleMap>
// //         </LoadScript>
// //       </div>
// //     );
// //   };

// //   return (
// //     <div className="space-y-6">
// //       {tasks.length === 0 ? (
// //         <div className="text-center text-gray-500">No tasks available</div>
// //       ) : (
// //         tasks.map((task) => {
// //           const nextAction = getNextAction(task.status);
// //           const Icon = nextAction?.icon;

// //           return (
// //             <div key={task.id} className="bg-white shadow rounded overflow-hidden">
// //               {/* Header */}
// //               <div className="flex justify-between items-start p-4 border-b">
// //                 <div>
// //                   <div className="text-lg font-semibold">{task.displayId}</div>
// //                   <div className="flex gap-2 mt-1">
// //                     <span className={`px-2 py-0.5 rounded text-xs font-bold ${getPriorityStyles(task.priority)}`}>
// //                       {task.priority ? task.priority.toUpperCase() : "N/A"}
// //                     </span>
// //                     <span className="px-2 py-0.5 rounded text-xs border text-gray-600">
// //                       {task.status.replace("-", " ").toUpperCase()}
// //                     </span>
// //                   </div>
// //                 </div>
// //                 <div className="text-sm text-gray-500 text-right">
// //                   <div>Assigned: {task.assignedTime}</div>
// //                   <div>Due: {task.dueTime}</div>
// //                 </div>
// //               </div>

// //               {/* Task Details + Map */}
// //               <div className="p-4 space-y-4 grid md:grid-cols-2 gap-4 items-center">
// //                 <div className="space-y-2">
// //                   <div className="font-bold text-gray-800">{task.title}</div>
// //                   <div className="flex items-start gap-2">
// //                     <MapPin className="h-4 w-4 mt-0.5 text-gray-500" />
// //                     <div>
// //                       <div className="font-medium text-sm">{task.location}</div>
// //                       <div className="text-xs text-gray-500">Waste Type: {task.wasteType}</div>
// //                     </div>
// //                   </div>
// //                   <div className="flex items-center gap-2">
// //                     <Clock className="h-4 w-4 text-gray-500" />
// //                     <span className="text-sm">Estimated: {task.estimatedTime} min</span>
// //                   </div>

// //                   <div className="flex gap-2 mt-2">
// //                     <button
// //                       onClick={() => handleNavigate(task)}
// //                       className="flex items-center gap-1 px-3 py-1 border rounded text-sm hover:bg-gray-100"
// //                     >
// //                       <Navigation className="h-4 w-4" /> Navigate
// //                     </button>
// //                     <button
// //                       onClick={() => handleCallSupport(task.supportNumber)}
// //                       className="flex items-center gap-1 px-3 py-1 border rounded text-sm hover:bg-gray-100"
// //                     >
// //                       <Phone className="h-4 w-4" /> Call Support
// //                     </button>
// //                   </div>
// //                 </div>

// //                 <TaskMap task={task} />
// //               </div>

// //               {/* Footer Action */}
// //               {nextAction && (
// //                 <div className="p-4 border-t flex justify-end">
// //                   <button
// //                     onClick={() => handleActionClick(task.id, nextAction.nextStatus)}
// //                     className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
// //                   >
// //                     {Icon && <Icon className="h-4 w-4" />}
// //                     {nextAction.label}
// //                   </button>
// //                 </div>
// //               )}
// //             </div>
// //           );
// //         })
// //       )}
// //     </div>
// //   );
// // }



// "use client";

// import React from "react";
// import {
//   MapPin,
//   Clock,
//   CheckCircle,
//   Navigation,
//   Play,
//   Phone,
// } from "lucide-react";

// export default function TaskQueue({ tasks = [], onStatusUpdate }) {
//   // 🔁 Get next action for each task status
//   const getNextAction = (status) => {
//     switch (status) {
//       case "assigned":
//         return { label: "Accept Task", icon: CheckCircle, nextStatus: "accepted" };
//       case "accepted":
//         return { label: "On the Way", icon: Navigation, nextStatus: "on-the-way" };
//       case "on-the-way":
//         return { label: "Start Work", icon: Play, nextStatus: "in-progress" };
//       case "in-progress":
//         return { label: "Mark Complete", icon: CheckCircle, nextStatus: "completed" };
//       default:
//         return null;
//     }
//   };

//   const handleActionClick = (taskId, nextStatus) => {
//     if (onStatusUpdate) onStatusUpdate(taskId, nextStatus);
//   };

//   const handleNavigate = (task) => {
//     if (task.lat && task.lng) {
//       window.open(
//         `https://www.google.com/maps/dir/?api=1&destination=${task.lat},${task.lng}`,
//         "_blank"
//       );
//     } else if (task.location) {
//       window.open(
//         `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(task.location)}`,
//         "_blank"
//       );
//     } else {
//       alert("Location details are missing for this task.");
//     }
//   };

//   const handleCallSupport = (number) => {
//     if (!number || number === "N/A") return alert("Support number not available!");
//     window.open(`tel:${number}`);
//   };

//   // 🎨 Priority label colors
//   const getPriorityStyles = (priority) => {
//     switch (priority?.toLowerCase()) {
//       case "high":
//       case "critical":
//         return "bg-red-100 text-red-800";
//       case "low":
//         return "bg-green-100 text-green-800";
//       default:
//         return "bg-blue-100 text-blue-800";
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {tasks.length === 0 ? (
//         <div className="text-center text-gray-500 py-10">
//           No tasks available
//         </div>
//       ) : (
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {tasks.map((task) => {
//             const nextAction = getNextAction(task.status);
//             const Icon = nextAction?.icon;

//             return (
//               <div
//                 key={task.id}
//                 className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden flex flex-col justify-between"
//               >
//                 {/* Header */}
//                 <div className="p-4 border-b bg-gray-50 flex justify-between items-start">
//                   <div>
//                     <div className="text-lg font-semibold text-gray-800">
//                       {task.displayId || task.id}
//                     </div>
//                     <div className="flex gap-2 mt-1">
//                       <span
//                         className={`px-2 py-0.5 rounded text-xs font-bold ${getPriorityStyles(
//                           task.priority
//                         )}`}
//                       >
//                         {task.priority ? task.priority.toUpperCase() : "N/A"}
//                       </span>
//                       <span className="px-2 py-0.5 rounded text-xs border text-gray-600">
//                         {task.status.replace("-", " ").toUpperCase()}
//                       </span>
//                     </div>
//                   </div>
//                   <div className="text-xs text-gray-500 text-right">
//                     <div>Assigned: {task.assignedTime}</div>
//                     <div>Due: {task.dueTime}</div>
//                   </div>
//                 </div>

//                 {/* Details */}
//                 <div className="p-4 space-y-3 flex-1">
//                   <div className="font-bold text-gray-800 text-base">
//                     {task.title || "Untitled Task"}
//                   </div>
//                   <div className="flex items-start gap-2 text-sm">
//                     <MapPin className="h-4 w-4 mt-0.5 text-gray-500" />
//                     <div>
//                       <div className="font-medium">{task.location || "N/A"}</div>
//                       <div className="text-xs text-gray-500">
//                         Waste Type: {task.wasteType || "General"}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2 text-sm text-gray-600">
//                     <Clock className="h-4 w-4 text-gray-500" />
//                     Estimated: {task.estimatedTime || "—"} min
//                   </div>
//                 </div>

//                 {/* Footer Actions */}
//                 <div className="p-4 border-t flex justify-between items-center">
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => handleNavigate(task)}
//                       className="flex items-center gap-1 px-3 py-1 border rounded text-sm hover:bg-gray-100"
//                     >
//                       <Navigation className="h-4 w-4" /> Navigate
//                     </button>
//                     <button
//                       onClick={() => handleCallSupport(task.supportNumber)}
//                       className="flex items-center gap-1 px-3 py-1 border rounded text-sm hover:bg-gray-100"
//                     >
//                       <Phone className="h-4 w-4" /> Call
//                     </button>
//                   </div>
//                   {nextAction && (
//                     <button
//                       onClick={() =>
//                         handleActionClick(task.id, nextAction.nextStatus)
//                       }
//                       className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
//                     >
//                       {Icon && <Icon className="h-4 w-4" />}
//                       {nextAction.label}
//                     </button>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

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

export default function TaskQueue({ tasks = [], onStatusUpdate, onOpenChat }) {
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
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(task.location)}`,
        "_blank"
      );
    } else {
      alert("Location details are missing for this task.");
    }
  };

  const handleCallSupport = (number) => {
    if (!number || number === "N/A") return alert("Support number not available!");
    window.open(`tel:${number}`);
  };

  // ✅ UPDATED: Handle chat opening with proper parameters
  const handleOpenChat = (task) => {
    if (onOpenChat) {
      // Extract citizen information from the task/report
      const citizenInfo = task.report?.createdBy || task.citizen || {
        name: "Citizen",
        id: task.report?.createdBy?._id || task.createdBy
      };

      onOpenChat(task, citizenInfo);
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
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Assigned: {task.assignedTime || "Recently"}</span>
                    </div>
                    {task.dueTime && (
                      <div className="flex items-center gap-1">
                        <span>Due: {task.dueTime}</span>
                      </div>
                    )}
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

                    <button
                      onClick={() => handleCallSupport(task.supportNumber || task.report?.contactNumber)}
                      className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-white hover:shadow-sm transition-all duration-200"
                      title="Call support"
                    >
                      <Phone className="h-4 w-4" />
                      <span className="hidden sm:inline">Call</span>
                    </button>

                    {/* ✅ UPDATED CHAT BUTTON */}
                    <button
                      onClick={() => handleOpenChat(task)}
                      className="flex items-center gap-2 px-3 py-2 border border-blue-300 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 hover:shadow-sm transition-all duration-200"
                      title="Chat with citizen"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span className="hidden sm:inline">Chat</span>
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