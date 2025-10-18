// "use client";

// import { Card, CardContent, CardHeader, CardTitle } from "../citizen/ui/card";
// import { Badge } from "../citizen/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "../citizen/ui/avatar";
// import { Progress } from "../citizen/ui/progress";

// const mockWorkerPerformance = [
//   {
//     id: "w1",
//     name: "Alex Rodriguez",
//     avatar: "/placeholder.svg",
//     completedTasks: 156,
//     totalPoints: 1656,
//     avgCompletionTime: 45,
//     rating: 4.8,
//     recentCompletions: [
//       {
//         taskId: "t1",
//         taskType: "Overflowing Bin",
//         completionTime: 38,
//         pointsEarned: 112,
//         completedAt: "2024-01-15T14:30:00",
//       },
//       {
//         taskId: "t2",
//         taskType: "Illegal Dumping",
//         completionTime: 52,
//         pointsEarned: 98,
//         completedAt: "2024-01-15T13:00:00",
//       },
//       {
//         taskId: "t3",
//         taskType: "Missed Collection",
//         completionTime: 45,
//         pointsEarned: 105,
//         completedAt: "2024-01-14T16:20:00",
//       },
//     ],
//   },
//   {
//     id: "w2",
//     name: "Sarah Chen",
//     avatar: "/placeholder.svg",
//     completedTasks: 203,
//     totalPoints: 2128,
//     avgCompletionTime: 38,
//     rating: 4.9,
//     recentCompletions: [
//       {
//         taskId: "t4",
//         taskType: "Hazardous Waste",
//         completionTime: 35,
//         pointsEarned: 115,
//         completedAt: "2024-01-15T15:45:00",
//       },
//       {
//         taskId: "t5",
//         taskType: "Illegal Dumping",
//         completionTime: 40,
//         pointsEarned: 110,
//         completedAt: "2024-01-15T12:15:00",
//       },
//     ],
//   },
//   {
//     id: "w3",
//     name: "David Kim",
//     avatar: "/placeholder.svg",
//     completedTasks: 134,
//     totalPoints: 1432,
//     avgCompletionTime: 52,
//     rating: 4.6,
//     recentCompletions: [
//       {
//         taskId: "t6",
//         taskType: "Organic Waste",
//         completionTime: 48,
//         pointsEarned: 102,
//         completedAt: "2024-01-15T11:30:00",
//       },
//     ],
//   },
// ];

// export function WorkerPerformance() {
//   return (
//     <div className="space-y-6">
//       <div>
//         <h2 className="text-2xl font-bold text-foreground">Worker Performance & Rewards</h2>
//         <p className="text-muted-foreground">Track worker efficiency, completion times, and earned points</p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {mockWorkerPerformance.map((worker) => (
//           <Card key={worker.id}>
//             <CardHeader>
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-3">
//                   <Avatar className="w-10 h-10">
//                     <AvatarImage src={worker.avatar || "/placeholder.svg"} />
//                     <AvatarFallback>
//                       {worker.name
//                         .split(" ")
//                         .map((n) => n[0])
//                         .join("")}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div>
//                     <CardTitle className="text-lg">{worker.name}</CardTitle>
//                     <div className="flex items-center space-x-1 mt-1">
//                       <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
//                         <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                       </svg>
//                       <span className="text-xs font-medium">{worker.rating}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {/* Performance Stats */}
//               <div className="grid grid-cols-2 gap-3">
//                 <div className="p-3 bg-blue-50 rounded-lg">
//                   <p className="text-xs text-muted-foreground">Completed Tasks</p>
//                   <p className="text-lg font-bold text-blue-600">{worker.completedTasks}</p>
//                 </div>
//                 <div className="p-3 bg-green-50 rounded-lg">
//                   <p className="text-xs text-muted-foreground">Total Points</p>
//                   <p className="text-lg font-bold text-green-600">{worker.totalPoints}</p>
//                 </div>
//               </div>

//               {/* Avg Completion Time */}
//               <div className="p-3 bg-purple-50 rounded-lg">
//                 <p className="text-xs text-muted-foreground mb-2">Avg Completion Time</p>
//                 <div className="flex items-center justify-between">
//                   <span className="text-lg font-bold text-purple-600">{worker.avgCompletionTime} min</span>
//                   <Badge variant="outline" className="text-xs">
//                     {worker.avgCompletionTime < 45 ? "⚡ Fast" : "Standard"}
//                   </Badge>
//                 </div>
//               </div>

//               {/* Efficiency Score */}
//               <div>
//                 <div className="flex items-center justify-between mb-2">
//                   <p className="text-xs text-muted-foreground">Efficiency Score</p>
//                   <span className="text-sm font-medium">{Math.round(worker.rating * 20)}%</span>
//                 </div>
//                 <Progress value={worker.rating * 20} className="h-2" />
//               </div>

//               {/* Recent Completions */}
//               <div className="border-t pt-4">
//                 <p className="text-sm font-medium mb-3">Recent Completions</p>
//                 <div className="space-y-2">
//                   {worker.recentCompletions.map((completion) => (
//                     <div key={completion.taskId} className="p-2 bg-muted/50 rounded text-xs">
//                       <div className="flex items-center justify-between mb-1">
//                         <span className="font-medium">{completion.taskType}</span>
//                         <Badge variant="secondary" className="text-xs">
//                           +{completion.pointsEarned} pts
//                         </Badge>
//                       </div>
//                       <div className="flex items-center justify-between text-muted-foreground">
//                         <span>⏱️ {completion.completionTime} min</span>
//                         <span>{new Date(completion.completedAt).toLocaleDateString()}</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Performance Summary */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Performance Summary</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="text-center p-4 bg-blue-50 rounded-lg">
//               <div className="text-3xl font-bold text-blue-600 mb-2">493</div>
//               <p className="text-sm text-blue-700">Total Tasks Completed</p>
//               <p className="text-xs text-muted-foreground mt-1">By all workers this month</p>
//             </div>
//             <div className="text-center p-4 bg-green-50 rounded-lg">
//               <div className="text-3xl font-bold text-green-600 mb-2">5,216</div>
//               <p className="text-sm text-green-700">Total Points Distributed</p>
//               <p className="text-xs text-muted-foreground mt-1">Based on completion time</p>
//             </div>
//             <div className="text-center p-4 bg-purple-50 rounded-lg">
//               <div className="text-3xl font-bold text-purple-600 mb-2">45 min</div>
//               <p className="text-sm text-purple-700">Average Completion Time</p>
//               <p className="text-xs text-muted-foreground mt-1">Across all workers</p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect } from "react"; // <-- CORRECTED: Added useState and useEffect here
import { Card, CardContent, CardHeader, CardTitle } from "../citizen/ui/card";
import { Badge } from "../citizen/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../citizen/ui/avatar";
import { Progress } from "../citizen/ui/progress";

// --- API Utility (can be moved to a shared file later) ---
const fetchApi = async (url) => {
    const finalUrl = url.startsWith('/') && !url.startsWith('//') ? `http://localhost:8001${url}` : url;
    const token = localStorage.getItem('adminToken');
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(finalUrl, { headers });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API Error ${response.status}: ${errorData.message || response.statusText}`);
    }
    return response.json();
};


export function WorkerPerformance() {
    // State for holding dynamic data, loading, and errors
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [summaryStats, setSummaryStats] = useState({
        totalTasks: 0,
        totalPoints: 0,
        avgTime: 0
    });

    useEffect(() => {
        const loadPerformanceData = async () => {
            try {
                setLoading(true);
                const response = await fetchApi('/api/admin/worker-performance');
                if (response.success) {
                    setWorkers(response.data);
                    
                    // Calculate summary stats after fetching
                    const totalTasks = response.data.reduce((sum, worker) => sum + worker.completedTasks, 0);
                    const totalPoints = response.data.reduce((sum, worker) => sum + worker.totalPoints, 0);
                    const totalAvgTime = response.data.reduce((sum, worker) => sum + (worker.avgCompletionTime * worker.completedTasks), 0);
                    const avgTime = totalTasks > 0 ? Math.round(totalAvgTime / totalTasks) : 0;
                    
                    setSummaryStats({ totalTasks, totalPoints, avgTime });
                }
            } catch (err) {
                setError(err.message);
                console.error("Failed to fetch worker performance:", err);
            } finally {
                setLoading(false);
            }
        };

        loadPerformanceData();
    }, []);

    if (loading) {
        return <div className="text-center p-8">Loading worker performance data...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-600">Error: {error}</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-foreground">Worker Performance & Rewards</h2>
                <p className="text-muted-foreground">Track worker efficiency, completion times, and earned points</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {workers.map((worker) => (
                    <Card key={worker.id}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <Avatar className="w-10 h-10">
                                        <AvatarImage src={worker.avatar || "/placeholder.svg"} />
                                        <AvatarFallback>
                                            {worker.name.split(" ").map((n) => n[0]).join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-lg">{worker.name}</CardTitle>
                                        <div className="flex items-center space-x-1 mt-1">
                                            <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <span className="text-xs font-medium">{worker.rating}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <p className="text-xs text-muted-foreground">Completed Tasks</p>
                                    <p className="text-lg font-bold text-blue-600">{worker.completedTasks}</p>
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <p className="text-xs text-muted-foreground">Total Points</p>
                                    <p className="text-lg font-bold text-green-600">{worker.totalPoints}</p>
                                </div>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-lg">
                                <p className="text-xs text-muted-foreground mb-2">Avg Completion Time</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-bold text-purple-600">{worker.avgCompletionTime} min</span>
                                    <Badge variant="outline" className="text-xs">
                                        {worker.avgCompletionTime < 45 ? "⚡ Fast" : "Standard"}
                                    </Badge>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-xs text-muted-foreground">Efficiency Score</p>
                                    <span className="text-sm font-medium">{Math.round(worker.rating * 20)}%</span>
                                </div>
                                <Progress value={worker.rating * 20} className="h-2" />
                            </div>
                            <div className="border-t pt-4">
                                <p className="text-sm font-medium mb-3">Recent Completions</p>
                                <div className="space-y-2">
                                    {worker.recentCompletions.length > 0 ? worker.recentCompletions.map((completion) => (
                                        <div key={completion.taskId} className="p-2 bg-muted/50 rounded text-xs">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-medium">{completion.taskType}</span>
                                                <Badge variant="secondary" className="text-xs">
                                                    +{completion.pointsEarned} pts
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between text-muted-foreground">
                                                <span>⏱️ {completion.completionTime} min</span>
                                                <span>{new Date(completion.completedAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    )) : <p className="text-xs text-center text-gray-500">No recent completions.</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Performance Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-3xl font-bold text-blue-600 mb-2">{summaryStats.totalTasks}</div>
                            <p className="text-sm text-blue-700">Total Tasks Completed</p>
                            <p className="text-xs text-muted-foreground mt-1">By all workers this month</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-3xl font-bold text-green-600 mb-2">{summaryStats.totalPoints}</div>
                            <p className="text-sm text-green-700">Total Points Distributed</p>
                            <p className="text-xs text-muted-foreground mt-1">Based on completion time</p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-3xl font-bold text-purple-600 mb-2">{summaryStats.avgTime} min</div>
                            <p className="text-sm text-purple-700">Average Completion Time</p>
                            <p className="text-xs text-muted-foreground mt-1">Across all workers</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}