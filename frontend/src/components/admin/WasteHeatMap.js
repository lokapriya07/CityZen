// import React, { useState } from "react";

// // --- UI Component Definitions ---
// // Simplified to match the provided video's aesthetic

// const cn = (...inputs) => {
//   return inputs.filter(Boolean).join(' ');
// };

// // Cards are white with a subtle shadow and rounded corners
// const Card = ({ children, className = '' }) => (
//   <div className={`bg-white rounded-lg shadow-sm ${className}`}>
//     {children}
//   </div>
// );

// const CardHeader = ({ children, className = '' }) => (
//   <div className={`p-4 border-b border-gray-200 ${className}`}>
//     {children}
//   </div>
// );

// const CardTitle = ({ children, className = '' }) => (
//   <h3 className={`text-md font-semibold text-gray-800 ${className}`}>
//     {children}
//   </h3>
// );

// const CardContent = ({ children, className = '' }) => (
//   <div className={`p-4 ${className}`}>
//     {children}
//   </div>
// );

// // Badges with colors matching the video
// const Badge = ({ children, className = '', variant = 'default' }) => {
//   const baseClasses = "px-3 py-1 text-xs font-medium rounded-full inline-block";
//   const variants = {
//     critical: "bg-red-500 text-white",
//     high: "bg-orange-100 text-orange-800",
//     medium: "bg-yellow-100 text-yellow-800",
//     low: "bg-green-100 text-green-800",
//     default: "bg-gray-100 text-gray-800",
//     outline: "bg-white border border-gray-300 text-gray-700"
//   };
//   return (
//     <span className={`${baseClasses} ${variants[variant]} ${className}`}>
//       {children}
//     </span>
//   );
// };

// // Buttons for filtering
// const Button = ({ children, className = '', variant = 'default', size = 'default', ...props }) => {
//     const baseClasses = "inline-flex items-center justify-center rounded-md font-semibold transition-colors focus:outline-none";
//     const variants = {
//         primary: "bg-blue-500 text-white hover:bg-blue-600",
//         ghost: "bg-transparent text-gray-600 hover:bg-gray-100",
//     };
//     const sizes = {
//         default: "h-9 px-4",
//         sm: "h-8 rounded-md px-3 text-sm",
//     };
//     return (
//         <button className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
//             {children}
//         </button>
//     );
// };


// export function WasteHeatmap({ reports = [] }) {
//   const [selectedZone, setSelectedZone] = useState(null)
//   const [filterPriority, setFilterPriority] = useState("all")

//   const mockReports = [
//     {
//       id: "1",
//       type: "Overflowing Bin",
//       location: "Block A, Sector 15",
//       coordinates: { lat: 28.6149, lng: 77.2095 },
//       status: "pending",
//       priority: "high",
//       reportedAt: "2024-01-15T10:30:00Z",
//       reportedBy: "John Doe",
//       description: "Garbage bin is overflowing",
//     },
//     {
//       id: "2",
//       type: "Broken Bin",
//       location: "Park Area",
//       coordinates: { lat: 28.6119, lng: 77.2085 },
//       status: "assigned",
//       priority: "medium",
//       reportedAt: "2024-01-15T09:15:00Z",
//       reportedBy: "Jane Smith",
//       description: "Waste bin is damaged",
//     },
//     {
//       id: "3",
//       type: "Illegal Dumping",
//       location: "Sector 15",
//       coordinates: { lat: 28.6159, lng: 77.2105 },
//       status: "pending",
//       priority: "critical",
//       reportedAt: "2024-01-15T08:45:00Z",
//       reportedBy: "Mike Johnson",
//       description: "Illegal waste dumping reported",
//     },
//   ];

//   const activeReports = reports.length > 0 ? reports : mockReports;

//   const heatmapZones = [
//     { id: "zone1", name: "Block A", intensity: "high", reports: 8, coordinates: { lat: 28.6149, lng: 77.2095 } },
//     { id: "zone2", name: "Block B", intensity: "medium", reports: 4, coordinates: { lat: 28.6139, lng: 77.209 } },
//     { id: "zone3", name: "Block C", intensity: "low", reports: 2, coordinates: { lat: 28.6129, lng: 77.2295 } },
//     { id: "zone4", name: "Sector 15", intensity: "critical", reports: 12, coordinates: { lat: 28.6159, lng: 77.2105 } },
//     { id: "zone5", name: "Park Area", intensity: "medium", reports: 6, coordinates: { lat: 28.6119, lng: 77.2085 } },
//   ];

//   const getIntensityColor = (intensity) => {
//     switch (intensity) {
//       case "critical": return "bg-red-500";
//       case "high": return "bg-orange-400";
//       case "medium": return "bg-yellow-400";
//       case "low": return "bg-green-400";
//       default: return "bg-gray-400";
//     }
//   };

//   const filteredReports =
//     filterPriority === "all" ? activeReports : activeReports.filter((r) => r.priority === filterPriority);

//   return (
//     <div className="space-y-4 p-4 md:p-6 bg-gray-50 font-sans">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-xl font-bold text-gray-800">Real-Time Waste Heatmap</h2>
//           <p className="text-sm text-gray-500">Monitor waste collection hotspots across the city</p>
//         </div>
//         <div className="flex items-center space-x-1 p-1 bg-gray-200 rounded-lg">
//            {["All", "Critical", "High", "Medium"].map((priority) => (
//              <button
//                key={priority}
//                onClick={() => setFilterPriority(priority.toLowerCase())}
//                className={cn(
//                  "px-3 py-1 text-sm font-semibold rounded-md transition-colors",
//                  filterPriority === priority.toLowerCase()
//                    ? "bg-white text-gray-800 shadow-sm"
//                    : "bg-transparent text-gray-600 hover:bg-gray-100"
//                )}
//              >
//                {priority}
//              </button>
//            ))}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2">
//           <Card className="h-[600px] flex flex-col">
//             <CardHeader>
//               <CardTitle className="flex items-center justify-between">
//                 <span>City Waste Map</span>
//                 <div className="flex items-center space-x-4">
//                   <div className="flex items-center space-x-2 text-xs text-gray-600"><div className="w-3 h-3 rounded-full bg-green-400"></div><span>Low</span></div>
//                   <div className="flex items-center space-x-2 text-xs text-gray-600"><div className="w-3 h-3 rounded-full bg-yellow-400"></div><span>Medium</span></div>
//                   <div className="flex items-center space-x-2 text-xs text-gray-600"><div className="w-3 h-3 rounded-full bg-orange-400"></div><span>High</span></div>
//                   <div className="flex items-center space-x-2 text-xs text-gray-600"><div className="w-3 h-3 rounded-full bg-red-500"></div><span>Critical</span></div>
//                 </div>
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="flex-grow p-0">
//               <div className="relative w-full h-full bg-gray-100 rounded-b-lg overflow-hidden">
//                 <div className="absolute inset-0 opacity-20">
//                   <div className="grid grid-cols-10 grid-rows-8 h-full w-full">
//                     {Array.from({ length: 80 }).map((_, i) => (
//                       <div key={i} className="border-r border-b border-gray-300"></div>
//                     ))}
//                   </div>
//                 </div>

//                 {heatmapZones.map((zone) => (
//                   <div
//                     key={zone.id}
//                     className={cn(
//                       "absolute rounded-full cursor-pointer transition-all duration-300 hover:scale-110 flex items-center justify-center text-white font-bold text-xs shadow-lg",
//                       getIntensityColor(zone.intensity),
//                       selectedZone === zone.id ? "ring-4 ring-blue-400 ring-offset-2 scale-110" : "ring-2 ring-white/50",
//                       zone.intensity === "critical" ? "w-16 h-16"
//                       : zone.intensity === "high" ? "w-12 h-12"
//                       : zone.intensity === "medium" ? "w-10 h-10"
//                       : "w-8 h-8"
//                     )}
//                     style={{
//                       left: `${(zone.coordinates.lng - 77.2) * 2000 + 100}px`,
//                       top: `${(28.62 - zone.coordinates.lat) * 2000 + 50}px`,
//                       opacity: 0.85,
//                     }}
//                     onClick={() => setSelectedZone(selectedZone === zone.id ? null : zone.id)}
//                   >
//                     {zone.reports}
//                   </div>
//                 ))}

//                 {filteredReports.map((report) => (
//                   <div
//                     key={report.id}
//                     className="absolute w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white cursor-pointer hover:scale-150 transition-transform shadow"
//                     style={{
//                       left: `${(report.coordinates.lng - 77.2) * 2000 + 110}px`,
//                       top: `${(28.62 - report.coordinates.lat) * 2000 + 60}px`,
//                     }}
//                     title={`${report.type} - ${report.location}`}
//                   />
//                 ))}

//                 <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-md">
//                   <h3 className="font-semibold text-xs text-gray-800">Delhi NCR</h3>
//                   <p className="text-xs text-gray-500">Smart Waste Management Zone</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         <div className="space-y-6">
//           <Card>
//             <CardHeader><CardTitle>Zone Statistics</CardTitle></CardHeader>
//             <CardContent className="space-y-3">
//               {heatmapZones.map((zone) => (
//                 <div
//                   key={zone.id}
//                   className={cn(
//                     "p-3 rounded-lg border-2 cursor-pointer transition-all",
//                     selectedZone === zone.id ? "border-blue-500 bg-blue-50" : "border-transparent bg-gray-100 hover:bg-gray-200"
//                   )}
//                   onClick={() => setSelectedZone(selectedZone === zone.id ? null : zone.id)}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <h4 className="font-semibold text-sm text-gray-800">{zone.name}</h4>
//                       <p className="text-xs text-gray-500">{zone.reports} reports</p>
//                     </div>
//                     <Badge variant={zone.intensity}>
//                       {zone.intensity}
//                     </Badge>
//                   </div>
//                 </div>
//               ))}
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader><CardTitle>Priority Engine</CardTitle></CardHeader>
//             <CardContent className="space-y-3">
//               <div className="space-y-2">
//                 <div className="flex items-center justify-between"><span className="text-sm text-gray-600">Proximity to Schools</span><Badge variant="high">High Risk</Badge></div>
//                 <div className="flex items-center justify-between"><span className="text-sm text-gray-600">Complaint Volume</span><Badge variant="medium">Moderate</Badge></div>
//                 <div className="flex items-center justify-between"><span className="text-sm text-gray-600">Waste Type Severity</span><Badge variant="low">Low</Badge></div>
//               </div>
//               <div className="pt-3 border-t border-gray-200">
//                 <div className="flex items-center justify-between mb-1">
//                   <span className="text-sm font-semibold text-gray-700">Overall Priority Score</span>
//                   <span className="text-lg font-bold text-red-600">8.2/10</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2.5">
//                   <div className="bg-red-500 h-2.5 rounded-full" style={{ width: "82%" }}></div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
          
//           <Card>
//             <CardHeader><CardTitle>Live Updates</CardTitle></CardHeader>
//             <CardContent>
//               <div className="space-y-3">
//                  <div className="flex items-start space-x-3">
//                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
//                    <div>
//                      <p className="text-sm text-gray-700">Block A - Bin collection completed</p>
//                      <p className="text-xs text-gray-400">2 minutes ago</p>
//                    </div>
//                  </div>
//                  <div className="flex items-start space-x-3">
//                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0"></div>
//                    <div>
//                      <p className="text-sm text-gray-700">Sector 15 - New report received</p>
//                      <p className="text-xs text-gray-400">5 minutes ago</p>
//                    </div>
//                  </div>
//                  <div className="flex items-start space-x-3">
//                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></div>
//                    <div>
//                      <p className="text-sm text-gray-700">Block C - Critical priority assigned</p>
//                      <p className="text-xs text-gray-400">8 minutes ago</p>
//                    </div>
//                  </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default WasteHeatmap;

"use client";

import React, { useState } from "react";
// Note: You'll need to have these dependencies in your project.
// This is likely from a UI library like Shadcn/ui.
import { Card, CardContent, CardHeader, CardTitle } from "../citizen/ui/card";
import { Button } from "../citizen/ui/button";
import { Badge } from "../citizen/ui/badge";
import { cn } from "../citizen/lib/utils";

export function WasteHeatmap({ reports = [] }) {
  const [selectedZone, setSelectedZone] = useState(null);
  const [filterPriority, setFilterPriority] = useState("all");

  const mockReports = [
    {
      id: "1",
      type: "Overflowing Bin",
      location: "Block A, Sector 15",
      coordinates: { lat: 28.6149, lng: 77.2095 },
      status: "pending",
      priority: "high",
      reportedAt: "2024-01-15T10:30:00Z",
      reportedBy: "John Doe",
      description: "Garbage bin is overflowing",
    },
    {
      id: "2",
      type: "Broken Bin",
      location: "Park Area",
      coordinates: { lat: 28.6119, lng: 77.2085 },
      status: "assigned",
      priority: "medium",
      reportedAt: "2024-01-15T09:15:00Z",
      reportedBy: "Jane Smith",
      description: "Waste bin is damaged",
    },
    {
      id: "3",
      type: "Illegal Dumping",
      location: "Sector 15",
      coordinates: { lat: 28.6159, lng: 77.2105 },
      status: "pending",
      priority: "critical",
      reportedAt: "2024-01-15T08:45:00Z",
      reportedBy: "Mike Johnson",
      description: "Illegal waste dumping reported",
    },
  ];

  const activeReports = reports.length > 0 ? reports : mockReports;

  // Mock heatmap zones with intensity levels
  const heatmapZones = [
    { id: "zone1", name: "Block A", intensity: "high", reports: 8, coordinates: { lat: 28.6149, lng: 77.2095 } },
    { id: "zone2", name: "Block B", intensity: "medium", reports: 4, coordinates: { lat: 28.6139, lng: 77.209 } },
    { id: "zone3", name: "Block C", intensity: "low", reports: 2, coordinates: { lat: 28.6129, lng: 77.2295 } },
    { id: "zone4", name: "Sector 15", intensity: "critical", reports: 12, coordinates: { lat: 28.6159, lng: 77.2105 } },
    { id: "zone5", name: "Park Area", intensity: "medium", reports: 6, coordinates: { lat: 28.6119, lng: 77.2085 } },
  ];

  const getIntensityColor = (intensity) => {
    switch (intensity) {
      case "critical":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getIntensityTextColor = (intensity) => {
    switch (intensity) {
      case "critical":
        return "text-red-700";
      case "high":
        return "text-orange-700";
      case "medium":
        return "text-yellow-700";
      case "low":
        return "text-green-700";
      default:
        return "text-gray-700";
    }
  };

  const filteredReports =
    filterPriority === "all" ? activeReports : activeReports.filter((r) => r.priority === filterPriority);

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Real-Time Waste Heatmap</h2>
          <p className="text-muted-foreground">Monitor waste collection hotspots across the city</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Filter by Priority:</span>
            <Button
              variant={filterPriority === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterPriority("all")}
            >
              All
            </Button>
            <Button
              variant={filterPriority === "critical" ? "destructive" : "outline"}
              size="sm"
              onClick={() => setFilterPriority("critical")}
            >
              Critical
            </Button>
            <Button
              variant={filterPriority === "high" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterPriority("high")}
            >
              High
            </Button>
            <Button
              variant={filterPriority === "medium" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setFilterPriority("medium")}
            >
              Medium
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Area */}
        <div className="lg:col-span-2">
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>City Waste Map</span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Clean</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span>Pending</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span>High</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span>Critical</span>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full p-0">
              {/* Mock Map Interface */}
              <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-green-50 rounded-b-lg overflow-hidden">
                {/* Grid Background */}
                <div className="absolute inset-0 opacity-10">
                  <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div key={i} className="border border-gray-300"></div>
                    ))}
                  </div>
                </div>

                {/* Heatmap Zones */}
                {heatmapZones.map((zone) => (
                  <div
                    key={zone.id}
                    className={cn(
                      "absolute rounded-full cursor-pointer transition-all duration-300 hover:scale-110",
                      getIntensityColor(zone.intensity),
                      selectedZone === zone.id ? "ring-4 ring-primary scale-110" : "",
                      zone.intensity === "critical"
                        ? "w-16 h-16"
                        : zone.intensity === "high"
                        ? "w-12 h-12"
                        : zone.intensity === "medium"
                        ? "w-10 h-10"
                        : "w-8 h-8"
                    )}
                    style={{
                      left: `${(zone.coordinates.lng - 77.2) * 1000 + 200}px`,
                      top: `${(28.62 - zone.coordinates.lat) * 1000 + 100}px`,
                      opacity: 0.8,
                    }}
                    onClick={() => setSelectedZone(selectedZone === zone.id ? null : zone.id)}
                  >
                    <div className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-xs">
                      {zone.reports}
                    </div>
                  </div>
                ))}

                {/* Report Markers */}
                {filteredReports.map((report) => (
                  <div
                    key={report.id}
                    className="absolute w-3 h-3 rounded-full bg-primary border-2 border-white cursor-pointer hover:scale-150 transition-transform"
                    style={{
                      left: `${(report.coordinates.lng - 77.2) * 1000 + 200}px`,
                      top: `${(28.62 - report.coordinates.lat) * 1000 + 100}px`,
                    }}
                    title={`${report.type} - ${report.location}`}
                  />
                ))}

                {/* Map Labels */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <h3 className="font-semibold text-sm">Delhi NCR</h3>
                  <p className="text-xs text-muted-foreground">Smart Waste Management Zone</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Zone Details Sidebar */}
        <div className="space-y-6">
          {/* Zone Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Zone Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {heatmapZones.map((zone) => (
                <div
                  key={zone.id}
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer transition-all",
                    selectedZone === zone.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  )}
                  onClick={() => setSelectedZone(selectedZone === zone.id ? null : zone.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{zone.name}</h4>
                      <p className="text-sm text-muted-foreground">{zone.reports} reports</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "capitalize",
                        zone.intensity === "critical"
                          ? "border-red-500 text-red-700"
                          : zone.intensity === "high"
                          ? "border-orange-500 text-orange-700"
                          : zone.intensity === "medium"
                          ? "border-yellow-500 text-yellow-700"
                          : "border-green-500 text-green-700"
                      )}
                    >
                      {zone.intensity}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Priority Engine Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Priority Engine</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Proximity to Schools</span>
                  <Badge variant="destructive">High Risk</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Complaint Volume</span>
                  <Badge variant="default">Moderate</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Waste Type Severity</span>
                  <Badge variant="secondary">Low</Badge>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Overall Priority Score</span>
                  <span className="text-lg font-bold text-destructive">8.2/10</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-destructive h-2 rounded-full" style={{ width: "82%" }}></div>
                </div>
              </div>

              <Button className="w-full mt-4 bg-transparent" variant="outline">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                  />
                </svg>
                Manual Override
              </Button>
            </CardContent>
          </Card>

          {/* Live Updates */}
          <Card>
            <CardHeader>
              <CardTitle>Live Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                  <div>
                    <p className="text-sm">Block A - Bin collection completed</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2"></div>
                  <div>
                    <p className="text-sm">Sector 15 - New report received</p>
                    <p className="text-xs text-muted-foreground">5 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
                  <div>
                    <p className="text-sm">Block C - Critical priority assigned</p>
                    <p className="text-xs text-muted-foreground">8 minutes ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}