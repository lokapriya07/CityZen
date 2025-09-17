// "use client"

// import { useState } from "react";
// import { Card, CardContent } from "./ui/card";
// import { Badge } from "./ui/badge";
// import { Button } from "./ui/button";
// import { Progress } from "./ui/progress";
// import { ComplaintTracker } from "./complaint-tracker";
// import { ReportForm } from "./report-form";
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// import { Textarea } from "./ui/textarea";

// const mockComplaints = [
//   {
//     id: "WC004",
//     type: "Broken Waste Bin",
//     location: "Community Center, Block C",
//     status: "submitted",
//     progress: 20,
//     reportedAt: "2024-01-15T14:45:00Z",
//     estimatedCompletion: "2024-01-16T12:00:00Z",
//     worker: {
//       name: "Not Assigned",
//       phone: "",
//       avatar: "",
//       currentLocation: { lat: 0, lng: 0 },
//     },
//     timeline: [
//       { status: "submitted", time: "2:45 PM", completed: true },
//       { status: "reviewed", time: "Pending", completed: false },
//       { status: "assigned", time: "Pending", completed: false },
//       { status: "in_progress", time: "Pending", completed: false },
//       { status: "resolved", time: "Expected Tomorrow 12:00 PM", completed: false },
//     ],
//   },
//   {
//     id: "WC001",
//     type: "Overflowing Bin",
//     location: "Park Street, Block A",
//     status: "in_progress",
//     progress: 75,
//     reportedAt: "2024-01-15T10:30:00Z",
//     estimatedCompletion: "2024-01-15T16:00:00Z",
//     worker: {
//       name: "Rajesh Kumar",
//       phone: "+91 98765 43210",
//       avatar: "/hardworking-construction-worker.png",
//       currentLocation: { lat: 28.6139, lng: 77.209 },
//     },
//     timeline: [
//       { status: "submitted", time: "10:30 AM", completed: true },
//       { status: "reviewed", time: "11:15 AM", completed: true },
//       { status: "assigned", time: "12:00 PM", completed: true },
//       { status: "in_progress", time: "2:30 PM", completed: true },
//       { status: "resolved", time: "Expected 4:00 PM", completed: false },
//     ],
//   },
//   {
//     id: "WC002",
//     type: "Illegal Dumping",
//     location: "Main Road, Sector 15",
//     status: "resolved",
//     progress: 100,
//     reportedAt: "2024-01-14T09:00:00Z",
//     estimatedCompletion: "2024-01-14T18:00:00Z",
//     worker: {
//       name: "Priya Sharma",
//       phone: "+91 87654 32109",
//       avatar: "/female-worker.jpg",
//       currentLocation: { lat: 28.6129, lng: 77.2295 },
//     },
//     timeline: [
//       { status: "submitted", time: "9:00 AM", completed: true },
//       { status: "reviewed", time: "9:45 AM", completed: true },
//       { status: "assigned", time: "10:30 AM", completed: true },
//       { status: "in_progress", time: "2:00 PM", completed: true },
//       { status: "resolved", time: "5:30 PM", completed: true },
//     ],
//   },
//   {
//     id: "WC003",
//     type: "Missed Collection",
//     location: "Residential Complex, Gate 2",
//     status: "assigned",
//     progress: 40,
//     reportedAt: "2024-01-15T08:00:00Z",
//     estimatedCompletion: "2024-01-15T20:00:00Z",
//     worker: {
//       name: "Amit Singh",
//       phone: "+91 76543 21098",
//       avatar: "/male-worker.jpg",
//       currentLocation: { lat: 28.6149, lng: 77.209 },
//     },
//     timeline: [
//       { status: "submitted", time: "8:00 AM", completed: true },
//       { status: "reviewed", time: "8:30 AM", completed: true },
//       { status: "assigned", time: "9:15 AM", completed: true },
//       { status: "in_progress", time: "Pending", completed: false },
//       { status: "resolved", time: "Expected 8:00 PM", completed: false },
//     ],
//   },
// ];

// export default function Dashboard() {
//   const [activeTab, setActiveTab] = useState("track");
//   const [selectedComplaint, setSelectedComplaint] = useState(mockComplaints[0]);

//   const stats = {
//     total: mockComplaints.length,
//     resolved: mockComplaints.filter((c) => c.status === "resolved").length,
//     inProgress: mockComplaints.filter((c) => c.status === "in_progress").length,
//     pending: mockComplaints.filter(
//       (c) => c.status === "assigned" || c.status === "submitted" || c.status === "reviewed"
//     ).length,
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
//       <header className="bg-white/90 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-50 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             <div className="flex items-center space-x-4">
//               <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg">
//                 <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
//                   <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
//                   <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
//                 </svg>
//               </div>
              
//             </div>

//             <div className="flex items-center space-x-6">
//               <div className="flex items-center space-x-3">
                
//                 {activeTab === 'track' ? (
//                 <Button
//                   onClick={() => setActiveTab("report")}
//                   className="text-sm font-medium bg-emerald-500 hover:bg-emerald-600 text-white"
//                 >
//                   ➕ New Report
//                 </Button>
//               ) : (
//                 <Button
//                   variant="default"
//                   onClick={() => setActiveTab("track")}
//                   className="text-sm font-medium"
//                 >
//                   🏠 Home
//                 </Button>
//               )}
//               </div>

              
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {activeTab === "track" ? (
//           <div className="space-y-8">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//               <Card className="border-0 overflow-hidden bg-blue-50 border border-blue-200">
//                 <div className="p-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-blue-700 text-sm font-medium">Total Reports</p>
//                       <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
//                     </div>
//                     <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
//                       <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
//                         <path
//                           fillRule="evenodd"
//                           d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     </div>
//                   </div>
//                 </div>
//               </Card>

//               <Card className="border-0 overflow-hidden bg-emerald-50 border border-emerald-200">
//                 <div className="p-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-emerald-700 text-sm font-medium">Resolved</p>
//                       <p className="text-3xl font-bold text-emerald-900">{stats.resolved}</p>
//                     </div>
//                     <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
//                       <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
//                         <path
//                           fillRule="evenodd"
//                           d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     </div>
//                   </div>
//                 </div>
//               </Card>

//               <Card className="border-0 overflow-hidden bg-orange-50 border border-orange-200">
//                 <div className="p-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-orange-700 text-sm font-medium">In Progress</p>
//                       <p className="text-3xl font-bold text-orange-900">{stats.inProgress}</p>
//                     </div>
//                     <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
//                       <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
//                         <path
//                           fillRule="evenodd"
//                           d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     </div>
//                   </div>
//                 </div>
//               </Card>

//               <Card className="border-0 overflow-hidden bg-amber-50 border border-amber-200">
//                 <div className="p-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-amber-700 text-sm font-medium">Pending</p>
//                       <p className="text-3xl font-bold text-amber-900">{stats.pending}</p>
//                     </div>
//                     <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
//                       <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
//                         <path
//                           fillRule="evenodd"
//                           d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     </div>
//                   </div>
//                 </div>
//               </Card>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//               <div className="lg:col-span-1 space-y-6">
//                 <div className="flex items-center justify-between">
//                   <h2 className="text-2xl font-bold text-gray-900">Your Reports</h2>
//                   <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
//                     {mockComplaints.length} Active
//                   </Badge>
//                 </div>

//                 <div className="space-y-4">
//                   {mockComplaints.map((complaint) => (
//                     <Card
//                       key={complaint.id}
//                       className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
//                         selectedComplaint.id === complaint.id
//                           ? "ring-2 ring-emerald-500 shadow-xl bg-emerald-50/50"
//                           : "hover:shadow-lg bg-white"
//                       }`}
//                       onClick={() => setSelectedComplaint(complaint)}
//                     >
//                       <CardContent className="p-5">
//                         <div className="flex items-start justify-between mb-4">
//                           <div className="flex-1">
//                             <h3 className="font-semibold text-gray-900 text-lg">{complaint.type}</h3>
//                             <p className="text-sm text-gray-500 flex items-center mt-2">📍 {complaint.location}</p>
//                           </div>
//                           <Badge
//                             variant={
//                               complaint.status === "resolved"
//                                 ? "default"
//                                 : complaint.status === "in_progress"
//                                 ? "secondary"
//                                 : "outline"
//                             }
//                             className={`capitalize font-medium ${
//                               complaint.status === "resolved"
//                                 ? "bg-emerald-100 text-emerald-700 border-emerald-200"
//                                 : complaint.status === "in_progress"
//                                 ? "bg-blue-100 text-blue-700 border-blue-200"
//                                 : "bg-orange-100 text-orange-700 border-orange-200"
//                             }`}
//                           >
//                             {complaint.status.replace("_", " ")}
//                           </Badge>
//                         </div>

//                         <div className="space-y-3">
//                           <div className="flex items-center justify-between text-sm">
//                             <span className="text-gray-600 font-medium">Progress</span>
//                             <span className="font-bold text-emerald-600">{complaint.progress}%</span>
//                           </div>
//                           <Progress value={complaint.progress} className="h-3 bg-gray-100" />
//                         </div>

//                         <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
//                           <p className="text-xs text-gray-500 font-medium">ID: {complaint.id}</p>
//                           <p className="text-xs text-gray-500">{new Date(complaint.reportedAt).toLocaleDateString()}</p>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))}
//                 </div>
//               </div>

//               <div className="lg:col-span-2">
//                 <ComplaintTracker complaint={selectedComplaint} />
//               </div>
//             </div>
//           </div>
//         ) : (
//           <ReportForm />
//         )}
//       </main>
//     </div>
//   );
// }
import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { ComplaintTracker } from "./complaint-tracker";
import { ReportForm } from "./report-form";

const mockComplaints = [
  {
    id: "WC004",
    type: "Broken Waste Bin",
    location: "Community Center, Block C",
    status: "submitted",
    progress: 20,
    reportedAt: "2024-01-15T14:45:00Z",
    estimatedCompletion: "2024-01-16T12:00:00Z",
    worker: {
      name: "Not Assigned",
      phone: "",
      avatar: "",
      currentLocation: { lat: 0, lng: 0 },
    },
    timeline: [
      { status: "submitted", time: "2:45 PM", completed: true },
      { status: "reviewed", time: "Pending", completed: false },
      { status: "assigned", time: "Pending", completed: false },
      { status: "in_progress", time: "Pending", completed: false },
      { status: "resolved", time: "Expected Tomorrow 12:00 PM", completed: false },
    ],
  },
  {
    id: "WC001",
    type: "Overflowing Bin",
    location: "Park Street, Block A",
    status: "in_progress",
    progress: 75,
    reportedAt: "2024-01-15T10:30:00Z",
    estimatedCompletion: "2024-01-15T16:00:00Z",
    worker: {
      name: "Rajesh Kumar",
      phone: "+91 98765 43210",
      avatar: "/hardworking-construction-worker.png",
      currentLocation: { lat: 28.6139, lng: 77.209 },
    },
    timeline: [
      { status: "submitted", time: "10:30 AM", completed: true },
      { status: "reviewed", time: "11:15 AM", completed: true },
      { status: "assigned", time: "12:00 PM", completed: true },
      { status: "in_progress", time: "2:30 PM", completed: true },
      { status: "resolved", time: "Expected 4:00 PM", completed: false },
    ],
  },
  {
    id: "WC002",
    type: "Illegal Dumping",
    location: "Main Road, Sector 15",
    status: "resolved",
    progress: 100,
    reportedAt: "2024-01-14T09:00:00Z",
    estimatedCompletion: "2024-01-14T18:00:00Z",
    worker: {
      name: "Priya Sharma",
      phone: "+91 87654 32109",
      avatar: "/female-worker.jpg",
      currentLocation: { lat: 28.6129, lng: 77.2295 },
    },
    timeline: [
      { status: "submitted", time: "9:00 AM", completed: true },
      { status: "reviewed", time: "9:45 AM", completed: true },
      { status: "assigned", time: "10:30 AM", completed: true },
      { status: "in_progress", time: "2:00 PM", completed: true },
      { status: "resolved", time: "5:30 PM", completed: true },
    ],
  },
  {
    id: "WC003",
    type: "Missed Collection",
    location: "Residential Complex, Gate 2",
    status: "assigned",
    progress: 40,
    reportedAt: "2024-01-15T08:00:00Z",
    estimatedCompletion: "2024-01-15T20:00:00Z",
    worker: {
      name: "Amit Singh",
      phone: "+91 76543 21098",
      avatar: "/male-worker.jpg",
      currentLocation: { lat: 28.6149, lng: 77.209 },
    },
    timeline: [
      { status: "submitted", time: "8:00 AM", completed: true },
      { status: "reviewed", time: "8:30 AM", completed: true },
      { status: "assigned", time: "9:15 AM", completed: true },
      { status: "in_progress", time: "Pending", completed: false },
      { status: "resolved", time: "Expected 8:00 PM", completed: false },
    ],
  },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("track");
  const [selectedComplaint, setSelectedComplaint] = useState(mockComplaints[1]);

  const stats = {
    total: mockComplaints.length,
    resolved: mockComplaints.filter((c) => c.status === "resolved").length,
    inProgress: mockComplaints.filter((c) => c.status === "in_progress").length,
    pending: mockComplaints.filter(
      (c) => c.status === "assigned" || c.status === "submitted" || c.status === "reviewed"
    ).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      <header className="bg-white/90 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
                </svg>
              </div>
              
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                {activeTab === 'track' ? (
                <Button
                  onClick={() => setActiveTab("report")}
                  className="text-sm font-medium bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  ➕ New Report
                </Button>
              ) : (
                <Button
                  variant="default"
                  onClick={() => setActiveTab("track")}
                  className="text-sm font-medium"
                >
                  🏠 Home
                </Button>
              )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "track" ? (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* ... (Stats cards code stays same as your original) */}
            </div>

            {/* Complaints List + ComplaintTracker */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Your Reports</h2>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                    {mockComplaints.length} Active
                  </Badge>
                </div>

                <div className="space-y-4">
                  {mockComplaints.map((complaint) => (
                    <Card
                      key={complaint.id}
                      className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                        selectedComplaint.id === complaint.id
                          ? "ring-2 ring-emerald-500 shadow-xl bg-emerald-50/50"
                          : "hover:shadow-lg bg-white"
                      }`}
                      onClick={() => setSelectedComplaint(complaint)}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-lg">{complaint.type}</h3>
                            <p className="text-sm text-gray-500 flex items-center mt-2">📍 {complaint.location}</p>
                          </div>
                          <Badge
                            variant={
                              complaint.status === "resolved"
                                ? "default"
                                : complaint.status === "in_progress"
                                ? "secondary"
                                : "outline"
                            }
                            className={`capitalize font-medium ${
                              complaint.status === "resolved"
                                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                : complaint.status === "in_progress"
                                ? "bg-blue-100 text-blue-700 border-blue-200"
                                : "bg-orange-100 text-orange-700 border-orange-200"
                            }`}
                          >
                            {complaint.status.replace("_", " ")}
                          </Badge>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 font-medium">Progress</span>
                            <span className="font-bold text-emerald-600">{complaint.progress}%</span>
                          </div>
                          <Progress value={complaint.progress} className="h-3 bg-gray-100" />
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-500 font-medium">ID: {complaint.id}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(complaint.reportedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2">
                <ComplaintTracker complaint={selectedComplaint} />
              </div>
            </div>
          </div>
        ) : (
          <ReportForm />
        )}
      </main>
    </div>
  );
}
