// import React, { useState } from "react";
// import { MapPin, Clock, Camera, CheckCircle, Navigation, Play, Upload } from "lucide-react";


// function TaskQueue() {
//   const [tasks, setTasks] = useState([
//     {
//       id: "WM-001",
//       location: "Downtown Plaza, Main St & 5th Ave",
//       wasteType: "General Waste",
//       priority: "critical",
//       estimatedTime: "2h",
//       description: "Large pile of general waste near fountain area. Multiple bags scattered.",
//       status: "pending",
//       assignedTime: "09:30 AM",
//       dueTime: "12:00 PM",
//     },
//     {
//       id: "WM-002",
//       location: "Park Avenue Residential",
//       wasteType: "Recyclable",
//       priority: "medium",
//       estimatedTime: "1h",
//       description: "Overflowing recycling bins, need sorting and collection.",
//       status: "accepted",
//       assignedTime: "10:15 AM",
//       dueTime: "02:00 PM",
//     },
//     {
//       id: "WM-003",
//       location: "Industrial District Block C",
//       wasteType: "Hazardous",
//       priority: "high",
//       estimatedTime: "3h",
//       description: "Chemical waste containers require special handling and disposal.",
//       status: "on-way",
//       assignedTime: "08:00 AM",
//       dueTime: "01:00 PM",
//     },
//   ]);

//   const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
//   const [selectedTask, setSelectedTask] = useState(null);

//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case "critical":
//         return "bg-red-600 text-white";
//       case "high":
//         return "bg-orange-500 text-white";
//       case "medium":
//         return "bg-yellow-500 text-white";
//       default:
//         return "bg-blue-600 text-white";
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "completed":
//         return "text-green-600";
//       case "in-progress":
//         return "text-blue-600";
//       case "on-way":
//         return "text-orange-500";
//       case "accepted":
//         return "text-purple-600";
//       default:
//         return "text-gray-500";
//     }
//   };

//   const updateTaskStatus = (taskId, newStatus) => {
//     setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)));
//   };

//   const getNextAction = (status) => {
//     switch (status) {
//       case "pending":
//         return { label: "Accept Task", icon: CheckCircle, nextStatus: "accepted" };
//       case "accepted":
//         return { label: "On the Way", icon: Navigation, nextStatus: "on-way" };
//       case "on-way":
//         return { label: "Start Work", icon: Play, nextStatus: "in-progress" };
//       case "in-progress":
//         return { label: "Mark Complete", icon: Upload, nextStatus: "completed" };
//       default:
//         return null;
//     }
//   };

//   const handleActionClick = (task) => {
//     const nextAction = getNextAction(task.status);
//     if (nextAction) {
//       if (nextAction.nextStatus === "completed") {
//         setSelectedTask(task.id);
//         setUploadDialogOpen(true);
//       } else {
//         updateTaskStatus(task.id, nextAction.nextStatus);
//       }
//     }
//   };

//   const handleProofUpload = () => {
//     if (selectedTask) {
//       updateTaskStatus(selectedTask, "completed");
//       setUploadDialogOpen(false);
//       setSelectedTask(null);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Task Cards */}
//       <div className="grid gap-4">
//         {tasks.map((task) => {
//           const nextAction = getNextAction(task.status);

//           return (
//             <div key={task.id} className="bg-white shadow rounded overflow-hidden">
//               {/* Card Header */}
//               <div className="flex justify-between items-start p-4 border-b">
//                 <div>
//                   <div className="text-lg font-semibold">{task.id}</div>
//                   <div className="flex gap-2 mt-1">
//                     <span className={`px-2 py-0.5 rounded text-xs ${getPriorityColor(task.priority)}`}>
//                       {task.priority.toUpperCase()}
//                     </span>
//                     <span className={`px-2 py-0.5 rounded text-xs border ${getStatusColor(task.status)}`}>
//                       {task.status.replace("-", " ").toUpperCase()}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="text-sm text-gray-500 text-right">
//                   <div>Assigned: {task.assignedTime}</div>
//                   <div>Due: {task.dueTime}</div>
//                 </div>
//               </div>

//               {/* Card Content */}
//               <div className="p-4 space-y-4">
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <div className="flex items-start gap-2">
//                       <MapPin className="h-4 w-4 mt-0.5 text-gray-500" />
//                       <div>
//                         <div className="font-medium text-sm">{task.location}</div>
//                         <div className="text-xs text-gray-500">Waste Type: {task.wasteType}</div>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Clock className="h-4 w-4 text-gray-500" />
//                       <span className="text-sm">Estimated: {task.estimatedTime}</span>
//                     </div>
//                     <p className="text-sm text-gray-500">{task.description}</p>
//                   </div>

//                   <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center">
//                     <div className="text-center text-gray-500">
//                       <MapPin className="h-8 w-8 mx-auto mb-2" />
//                       <div className="text-xs">Location Map</div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Actions */}
//                 <div className="flex justify-between pt-2 border-t">
//                   <div className="flex gap-2">
//                     <button className="flex items-center gap-1 px-3 py-1 border rounded text-sm hover:bg-gray-100">
//                       <MapPin className="h-4 w-4" /> Navigate
//                     </button>
//                     <button className="px-3 py-1 border rounded text-sm hover:bg-gray-100">Call Support</button>
//                   </div>

//                   {nextAction && (
//                     <button
//                       onClick={() => handleActionClick(task)}
//                       className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
//                     >
//                       <nextAction.icon className="h-4 w-4" />
//                       {nextAction.label}
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Upload Proof Modal */}
//       {uploadDialogOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
//           <div className="bg-white rounded-lg w-full max-w-md p-6 space-y-4">
//             <h2 className="text-lg font-semibold">Upload Completion Proof</h2>
//             <p className="text-gray-500 text-sm">
//               Please upload photos showing the completed work for verification.
//             </p>

//             <div>
//               <label className="block text-sm font-medium mb-1">Before Photo</label>
//               <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer">
//                 <Camera className="h-8 w-8 mx-auto mb-2 text-gray-500" />
//                 <div className="text-xs text-gray-500">Click to upload before photo</div>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">After Photo</label>
//               <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer">
//                 <Camera className="h-8 w-8 mx-auto mb-2 text-gray-500" />
//                 <div className="text-xs text-gray-500">Click to upload after photo</div>
//               </div>
//             </div>

//             <div>
//               <label htmlFor="notes" className="block text-sm font-medium mb-1">
//                 Additional Notes (Optional)
//               </label>
//               <input
//                 id="notes"
//                 type="text"
//                 placeholder="Any additional comments about the task completion..."
//                 className="mt-1 w-full border rounded px-2 py-1 text-sm"
//               />
//             </div>

//             <div className="flex gap-2 pt-4">
//               <button
//                 onClick={() => setUploadDialogOpen(false)}
//                 className="flex-1 px-4 py-2 border rounded hover:bg-gray-100"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleProofUpload}
//                 className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//               >
//                 Submit & Complete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default TaskQueue;


import React, { useState } from "react";
import { MapPin, Clock, CheckCircle, Navigation, Play } from "lucide-react";

function TaskQueue() {
  const [tasks, setTasks] = useState([
    {
      id: "WM-001",
      location: "Downtown Plaza, Main St & 5th Ave",
      wasteType: "General Waste",
      priority: "critical",
      estimatedTime: "2h",
      description: "Large pile of general waste near fountain area. Multiple bags scattered.",
      status: "pending",
      assignedTime: "09:30 AM",
      dueTime: "12:00 PM",
    },
    {
      id: "WM-002",
      location: "Park Avenue Residential",
      wasteType: "Recyclable",
      priority: "medium",
      estimatedTime: "1h",
      description: "Overflowing recycling bins, need sorting and collection.",
      status: "accepted",
      assignedTime: "10:15 AM",
      dueTime: "02:00 PM",
    },
    {
      id: "WM-003",
      location: "Industrial District Block C",
      wasteType: "Hazardous",
      priority: "high",
      estimatedTime: "3h",
      description: "Chemical waste containers require special handling and disposal.",
      status: "on-way",
      assignedTime: "08:00 AM",
      dueTime: "01:00 PM",
    },
  ]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical":
        return "bg-red-600 text-white";
      case "high":
        return "bg-orange-500 text-white";
      case "medium":
        return "bg-yellow-500 text-white";
      default:
        return "bg-blue-600 text-white";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "in-progress":
        return "text-blue-600";
      case "on-way":
        return "text-orange-500";
      case "accepted":
        return "text-purple-600";
      default:
        return "text-gray-500";
    }
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)));
  };

  const getNextAction = (status) => {
    switch (status) {
      case "pending":
        return { label: "Accept Task", icon: CheckCircle, nextStatus: "accepted" };
      case "accepted":
        return { label: "On the Way", icon: Navigation, nextStatus: "on-way" };
      case "on-way":
        return { label: "Start Work", icon: Play, nextStatus: "in-progress" };
      case "in-progress":
        return { label: "Mark Complete", icon: CheckCircle, nextStatus: "completed" };
      default:
        return null;
    }
  };

  const handleActionClick = (task) => {
    const nextAction = getNextAction(task.status);
    if (nextAction) {
      // Directly update the status
      updateTaskStatus(task.id, nextAction.nextStatus);
    }
  };

  return (
    <div className="space-y-6">
      {/* Task Cards */}
      <div className="grid gap-4">
        {tasks.map((task) => {
          const nextAction = getNextAction(task.status);

          return (
            <div key={task.id} className="bg-white shadow rounded overflow-hidden">
              {/* Card Header */}
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

              {/* Card Content */}
              <div className="p-4 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
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
                  </div>

                  <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <MapPin className="h-8 w-8 mx-auto mb-2" />
                      <div className="text-xs">Location Map</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between pt-2 border-t">
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1 px-3 py-1 border rounded text-sm hover:bg-gray-100">
                      <MapPin className="h-4 w-4" /> Navigate
                    </button>
                    <button className="px-3 py-1 border rounded text-sm hover:bg-gray-100">Call Support</button>
                  </div>

                  {nextAction && (
                    <button
                      onClick={() => handleActionClick(task)}
                      className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      <nextAction.icon className="h-4 w-4" />
                      {nextAction.label}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TaskQueue;
