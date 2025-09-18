// import React, { useState } from "react";
// import { WasteHeatMap } from "./WasteHeatMap";
// import { PriorityEngine } from "./PriorityEngine";
// import { TaskAssignmentHub } from "./TaskAssignmentHub";
// import { CommunityEngagement } from "./CommunityEngagement";
// import { AnalyticsCharts } from "./AnalyticsCharts";

// import {
//   MapPin,
//   Users,
//   TrendingUp,
//   Award,
//   Search,LayoutDashboard,
//   Filter,
// } from "lucide-react";

// export default function AdminDashboard() {
//   const [activeTab, setActiveTab] = useState("heatmap");


//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="flex">
//         {/* Sidebar */}
//         <aside className="w-64 bg-white border-r min-h-screen p-4">
//  <div className="mb-8">
//   <br></br>
//   <h1 className="text-2xl font-bold text-blue-600 mb-2">Smart Waste</h1>
//   <p className="text-sm text-gray-500">Admin Panel</p>
//   <br>
//   </br>
//   <hr className="mt-4 border-t-2 border-gray-600 w-full" />
// </div>



//           <nav className="space-y-2">
//              <button
//               className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
//                 activeTab === "overview"
//                   ? "bg-blue-600 text-white"
//                   : "hover:bg-gray-100"
//               }`}
//               onClick={() => setActiveTab("overview")}
//             >
//               <LayoutDashboard className="mr-2 h-4 w-4" />
//               Overview
//             </button>
//             <button
//               className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
//                 activeTab === "heatmap"
//                   ? "bg-blue-600 text-white"
//                   : "hover:bg-gray-100"
//               }`}
//               onClick={() => setActiveTab("heatmap")}
//             >
//               <MapPin className="mr-2 h-4 w-4" />
//               Heatmap
//             </button>

//             <button
//               className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
//                 activeTab === "tasks"
//                   ? "bg-blue-600 text-white"
//                   : "hover:bg-gray-100"
//               }`}
//               onClick={() => setActiveTab("tasks")}
//             >
//               <Users className="mr-2 h-4 w-4" />
//               Tasks
//             </button>

//             <button
//               className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
//                 activeTab === "analytics"
//                   ? "bg-blue-600 text-white"
//                   : "hover:bg-gray-100"
//               }`}
//               onClick={() => setActiveTab("analytics")}
//             >
//               <TrendingUp className="mr-2 h-4 w-4" />
//               Analytics
//             </button>

//             <button
//               className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
//                 activeTab === "community"
//                   ? "bg-blue-600 text-white"
//                   : "hover:bg-gray-100"
//               }`}
//               onClick={() => setActiveTab("community")}
//             >
//               <Award className="mr-2 h-4 w-4" />
//               Community
//             </button>
//           </nav>

//           {/* Quick Stats */}
//           <div className="mt-8 space-y-4">
//             <div className="rounded-lg border p-4 shadow-sm bg-white">
//               <h3 className="text-sm font-semibold mb-1">Active Reports</h3>
//               <div className="text-2xl font-bold text-red-600">23</div>
//               <p className="text-xs text-gray-500">+3 from yesterday</p>
//             </div>

//             <div className="rounded-lg border p-4 shadow-sm bg-white">
//               <h3 className="text-sm font-semibold mb-1">Available Workers</h3>
//               <div className="text-2xl font-bold text-blue-600">12</div>
//               <p className="text-xs text-gray-500">8 on duty</p>
//             </div>

//             <div className="rounded-lg border p-4 shadow-sm bg-white">
//               <h3 className="text-sm font-semibold mb-1">Avg Response Time</h3>
//               <div className="text-2xl font-bold text-green-600">2.3h</div>
//               <p className="text-xs text-gray-500">-15min from last week</p>
//             </div>
//           </div>
//         </aside>

        
     

//         {/* Main Content */}
//           {activeTab === "heatmap" && (
//             <div className="space-y-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h2 className="text-3xl font-bold text-gray-900">
//                     Real-Time Waste Heatmap
//                   </h2>
//                   <p className="text-gray-500">
//                     Monitor waste hotspots across the city
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <button className="border px-3 py-1.5 rounded-md flex items-center text-sm hover:bg-gray-100">
//                     <Filter className="mr-2 h-4 w-4" />
//                     Filter
//                   </button>
//                   <button className="border px-3 py-1.5 rounded-md text-sm hover:bg-gray-100">
//                     Export
//                   </button>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//                 <div className="lg:col-span-3">
//                   <WasteHeatMap />
//                 </div>
//                 <div className="space-y-4">
//                   <PriorityEngine />
//                 </div>
//               </div>
//             </div>
//           )}


//          {activeTab === "tasks" && (
//   <div className="space-y-6">
//     <div className="flex items-center justify-between">
//       <div>
//         <h2 className="text-2xl font-bold text-foreground">
//           Admin Dashboard
//         </h2>
//         <p className="text-muted-foreground">Smart Waste Management System</p>
//       </div>
//       <div className="flex items-center gap-2">
//         <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
//           Export Data
//         </button>
//         <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
//           New Alert
//         </button>
//       </div>
      
//     </div>
//      <hr className="mt-6 border-t-2 border-gray-300 w-full" />
//     <TaskAssignmentHub />
//   </div>
// )}


//           {activeTab === "analytics" && (
//             <div className="space-y-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h2 className="text-3xl font-bold text-gray-900">
//                     Compliance & Analytics
//                   </h2>
//                   <p className="text-gray-500">
//                     Performance metrics and trends
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <select className="border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
//                     <option value="7days">Last 7 days</option>
//                     <option value="30days">Last 30 days</option>
//                     <option value="90days">Last 90 days</option>
//                   </select>
//                   <button className="border px-3 py-1.5 rounded-md text-sm hover:bg-gray-100">
//                     Export Report
//                   </button>
//                 </div>
//               </div>
//               < AnalyticsCharts />
//             </div>
//           )}

//           {activeTab === "community" && (
//             <div className="space-y-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h2 className="text-3xl font-bold text-gray-900">
//                     Community Engagement
//                   </h2>
//                   <p className="text-gray-500">
//                     Citizen participation and rewards
//                   </p>
//                 </div>
//                 <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
//                   Launch Campaign
//                 </button>
//               </div>
//               < CommunityEngagement />
//             </div>
//           )}
//         </div>
//   );
// }






import React, { useState } from "react";
import { WasteHeatMap } from "./WasteHeatMap";
import { PriorityEngine } from "./PriorityEngine";
import { TaskAssignmentHub } from "./TaskAssignmentHub";
import { CommunityEngagement } from "./CommunityEngagement";
import { AnalyticsCharts } from "./AnalyticsCharts";
import { MapPin, Users, TrendingUp, Award, LayoutDashboard, Filter } from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("heatmap");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r min-h-screen p-4">
        <div className="mb-8">
          <br />
          <h1 className="text-2xl font-bold text-blue-600 mb-2">Smart Waste</h1>
          <p className="text-sm text-gray-500">Admin Panel</p>
          <br />
          <hr className="mt-4 border-t-2 border-gray-600 w-full" />
        </div>

        <nav className="space-y-2">
          <button
            className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === "overview" ? "bg-blue-600 text-white" : "hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" /> Overview
          </button>

          <button
            className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === "heatmap" ? "bg-blue-600 text-white" : "hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("heatmap")}
          >
            <MapPin className="mr-2 h-4 w-4" /> Heatmap
          </button>

          <button
            className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === "tasks" ? "bg-blue-600 text-white" : "hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("tasks")}
          >
            <Users className="mr-2 h-4 w-4" /> Tasks
          </button>

          <button
            className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === "analytics" ? "bg-blue-600 text-white" : "hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("analytics")}
          >
            <TrendingUp className="mr-2 h-4 w-4" /> Analytics
          </button>

          <button
            className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === "community" ? "bg-blue-600 text-white" : "hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("community")}
          >
            <Award className="mr-2 h-4 w-4" /> Community
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {activeTab === "heatmap" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Real-Time Waste Heatmap</h2>
                <p className="text-gray-500">Monitor waste hotspots across the city</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="border px-3 py-1.5 rounded-md flex items-center text-sm hover:bg-gray-100">
                  <Filter className="mr-2 h-4 w-4" /> Filter
                </button>
                <button className="border px-3 py-1.5 rounded-md text-sm hover:bg-gray-100">Export</button>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <WasteHeatMap />
              </div>
              <div className="space-y-4">
                <PriorityEngine />
              </div>
            </div>
          </div>
        )}

        {activeTab === "tasks" && <TaskAssignmentHub />}
        {activeTab === "analytics" && <AnalyticsCharts />}
        {activeTab === "community" && <CommunityEngagement />}
      </main>
    </div>
  );
}


