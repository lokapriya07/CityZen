// "use client";

// import React, { useState, useEffect } from "react";
// import { MapPin, Clock, CheckCircle, Navigation, Play, Phone } from "lucide-react";
// import { GoogleMap, Marker, DirectionsRenderer, LoadScript } from "@react-google-maps/api";

// export default function TaskQueue({ tasks = [], onStatusUpdate }) {
//   const [currentPosition, setCurrentPosition] = useState(null);

//   // 📍 Get worker's current location once
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setCurrentPosition({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           });
//         },
//         () => {
//           console.warn("Geolocation permission denied.");
//         }
//       );
//     }
//   }, []);

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

//   // 🧭 Open Google Maps navigation
//   const handleNavigate = (task) => {
//     if (task.lat && task.lng && task.lat !== 0 && task.lng !== 0) {
//       window.open(
//         `https://www.google.com/maps/dir/?api=1&destination=${task.lat},${task.lng}`,
//         "_blank"
//       );
//     } else if (task.location && task.location !== "N/A") {
//       window.open(
//         `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(task.location)}`,
//         "_blank"
//       );
//     } else {
//       alert("Location details are missing for this task.");
//     }
//   };

//   // 📞 Call support number
//   const handleCallSupport = (number) => {
//     if (!number || number === "N/A") return alert("Support number not available!");
//     window.open(`tel:${number}`);
//   };

//   // 🎨 Priority label colors
//   const getPriorityStyles = (priority) => {
//     switch (priority) {
//       case "high":
//       case "critical":
//         return "bg-red-100 text-red-800";
//       case "low":
//         return "bg-green-100 text-green-800";
//       default:
//         return "bg-blue-100 text-blue-800";
//     }
//   };

//   // 🗺️ Map component
//   const TaskMap = ({ task }) => {
//     const [directions, setDirections] = useState(null);

//     useEffect(() => {
//       if (currentPosition && task.lat && task.lng && window.google) {
//         const directionsService = new window.google.maps.DirectionsService();
//         directionsService.route(
//           {
//             origin: currentPosition,
//             destination: { lat: task.lat, lng: task.lng },
//             travelMode: window.google.maps.TravelMode.DRIVING,
//           },
//           (result, status) => {
//             if (status === "OK") {
//               setDirections(result);
//             } else {
//               console.error("Error fetching directions", result);
//             }
//           }
//         );
//       }
//     }, [currentPosition, task.lat, task.lng]);

//     const mapCenter = currentPosition || (task.lat && task.lng ? { lat: task.lat, lng: task.lng } : null);

//     if (!mapCenter) return <div className="h-64 w-full bg-gray-100 flex items-center justify-center text-gray-500">Location not available</div>;

//     return (
//       <div className="h-64 w-full rounded overflow-hidden">
//         <LoadScript googleMapsApiKey="AIzaSyAyl3YpasKmlq-QnQA_lVbvfrnW7VLNwDY">
//           <GoogleMap
//             mapContainerStyle={{ width: "100%", height: "100%" }}
//             center={mapCenter}
//             zoom={14}
//             options={{ disableDefaultUI: false }}
//           >
//             {currentPosition && <Marker position={currentPosition} label="You" />}
//             {task.lat && task.lng && <Marker position={{ lat: task.lat, lng: task.lng }} />}
//             {directions && <DirectionsRenderer directions={directions} />}
//           </GoogleMap>
//         </LoadScript>
//       </div>
//     );
//   };

//   return (
//     <div className="space-y-6">
//       {tasks.length === 0 ? (
//         <div className="text-center text-gray-500">No tasks available</div>
//       ) : (
//         tasks.map((task) => {
//           const nextAction = getNextAction(task.status);
//           const Icon = nextAction?.icon;

//           return (
//             <div key={task.id} className="bg-white shadow rounded overflow-hidden">
//               {/* Header */}
//               <div className="flex justify-between items-start p-4 border-b">
//                 <div>
//                   <div className="text-lg font-semibold">{task.displayId}</div>
//                   <div className="flex gap-2 mt-1">
//                     <span className={`px-2 py-0.5 rounded text-xs font-bold ${getPriorityStyles(task.priority)}`}>
//                       {task.priority ? task.priority.toUpperCase() : "N/A"}
//                     </span>
//                     <span className="px-2 py-0.5 rounded text-xs border text-gray-600">
//                       {task.status.replace("-", " ").toUpperCase()}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="text-sm text-gray-500 text-right">
//                   <div>Assigned: {task.assignedTime}</div>
//                   <div>Due: {task.dueTime}</div>
//                 </div>
//               </div>

//               {/* Task Details + Map */}
//               <div className="p-4 space-y-4 grid md:grid-cols-2 gap-4 items-center">
//                 <div className="space-y-2">
//                   <div className="font-bold text-gray-800">{task.title}</div>
//                   <div className="flex items-start gap-2">
//                     <MapPin className="h-4 w-4 mt-0.5 text-gray-500" />
//                     <div>
//                       <div className="font-medium text-sm">{task.location}</div>
//                       <div className="text-xs text-gray-500">Waste Type: {task.wasteType}</div>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Clock className="h-4 w-4 text-gray-500" />
//                     <span className="text-sm">Estimated: {task.estimatedTime} min</span>
//                   </div>

//                   <div className="flex gap-2 mt-2">
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
//                       <Phone className="h-4 w-4" /> Call Support
//                     </button>
//                   </div>
//                 </div>

//                 <TaskMap task={task} />
//               </div>

//               {/* Footer Action */}
//               {nextAction && (
//                 <div className="p-4 border-t flex justify-end">
//                   <button
//                     onClick={() => handleActionClick(task.id, nextAction.nextStatus)}
//                     className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
//                   >
//                     {Icon && <Icon className="h-4 w-4" />}
//                     {nextAction.label}
//                   </button>
//                 </div>
//               )}
//             </div>
//           );
//         })
//       )}
//     </div>
//   );
// }



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
import { MapPin, Clock, CheckCircle, Navigation, Play, Phone } from "lucide-react";

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
    if (onStatusUpdate) onStatusUpdate(taskId, nextStatus);
  };

  const handleNavigate = (task) => {
    if (task.lat && task.lng) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${task.lat},${task.lng}`, "_blank");
    } else if (task.location) {
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

  return (
    <div className="space-y-6">
      {tasks.length === 0 ? (
        <div className="text-center text-gray-500 py-10">No tasks available</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {tasks.map((task) => {
            const nextAction = getNextAction(task.status);
            const Icon = nextAction?.icon;

            return (
              <div
                key={task.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden flex flex-col justify-between"
              >
                {/* Header */}
                <div className="p-4 border-b bg-gray-50 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div>
                    <div className="text-lg font-semibold text-gray-800">
                      {task.displayId || task.id}
                    </div>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold ${getPriorityStyles(task.priority)}`}
                      >
                        {task.priority ? task.priority.toUpperCase() : "N/A"}
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs border text-gray-600">
                        {task.status.replace("-", " ").toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    <div>Assigned: {task.assignedTime}</div>
                    <div>Due: {task.dueTime}</div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-3 sm:p-4 space-y-3 flex-1">
                  <div className="font-bold text-gray-800 text-base sm:text-lg">
                    {task.title || "Untitled Task"}
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 mt-0.5 text-gray-500" />
                    <div>
                      <div className="font-medium break-words">{task.location || "N/A"}</div>
                      <div className="text-xs text-gray-500">
                        Waste Type: {task.wasteType || "General"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4 text-gray-500" />
                    Estimated: {task.estimatedTime || "—"} min
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex flex-wrap gap-2">
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
                      <Phone className="h-4 w-4" /> Call
                    </button>
                  </div>

                  {nextAction && (
                    <button
                      onClick={() => handleActionClick(task.id, nextAction.nextStatus)}
                      className="flex items-center justify-center gap-2 px-3 py-2 w-full sm:w-auto bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                      {nextAction.label}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
