
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { EnhancedProgressTracker } from "./enhanced-progress-tracker";

const statusConfig = {
 submitted: { color: "text-emerald-500", bg: "bg-emerald-50", label: "Report Submitted" },
 reviewed: { color: "text-blue-500", bg: "bg-blue-50", label: "Under Review" },
 assigned: { color: "text-orange-500", bg: "bg-orange-50", label: "Worker Assigned" },
 in_progress: { color: "text-purple-500", bg: "bg-purple-50", label: "Work in Progress" },
 resolved: { color: "text-green-500", bg: "bg-green-50", label: "Issue Resolved" },
};

export function ComplaintTracker({ complaint }) {
 const [currentTime, setCurrentTime] = useState(new Date());
 const [showFeedback, setShowFeedback] = useState(false);
 const [rating, setRating] = useState(0);
 const [hoveredRating, setHoveredRating] = useState(0);
 const [feedbackComment, setFeedbackComment] = useState("");
 const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

 useEffect(() => {
  const timer = setInterval(() => setCurrentTime(new Date()), 1000);
  return () => clearInterval(timer);
 }, []);

 const handleFeedbackSubmit = () => {
  console.log("[v0] Feedback submitted:", { rating, comment: feedbackComment });
  setFeedbackSubmitted(true);
  setTimeout(() => setShowFeedback(false), 2000);
 };

 const formatTime = (dateString) => {
  if (!dateString || dateString.toLowerCase().includes('invalid')) return "N/A";

  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
 hour: "2-digit",
 minute: "2-digit",
  });
 };

 const getTimeAgo = (dateString) => {
  if (!dateString) return "Just now";
  
  const diff = currentTime.getTime() - new Date(dateString).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${ days }d ago`;
  if (hours > 0) return `${ hours }h ${ minutes % 60 }m ago`;
  if (minutes > 0) return `${ minutes }m ago`;
  return `Just now`;
 };

 const statusArray = ["submitted", "reviewed", "assigned", "in_progress", "resolved"];

 const progressSteps = [
  {
 id: "submitted",
 title: "Submitted",
      description: "Report received",
 date: complaint.timeline.find((t) => t.status === "submitted")?.time || "Pending",
 // ✅ FIX: Submitted stage is always complete
 completed: true,
 current: complaint.status === "submitted",
  },
  {
 id: "reviewed",
 title: "Under Review",
 description: "Being evaluated",
 date: complaint.timeline.find((t) => t.status === "reviewed")?.time || "Pending",
 completed: statusArray.slice(1).includes(complaint.status), 
 current: complaint.status === "reviewed",
  },
  {
 id: "assigned",
 title: "Worker Assigned",
 description: "Team dispatched",
 date: complaint.timeline.find((t) => t.status === "assigned")?.time || "Pending",
 completed: statusArray.slice(2).includes(complaint.status), 
 current: complaint.status === "assigned",
  },
  {
 id: "in_progress",
 title: "In Progress",
 description: "Work underway",
 date: complaint.timeline.find((t) => t.status === "in_progress")?.time || "Pending",
 completed: statusArray.slice(3).includes(complaint.status), 
 current: complaint.status === "in_progress",
  },
  {
 id: "resolved",
 title: "Resolved",
 description: "Issue completed",
 date:
  complaint.timeline.find((t) => t.status === "resolved")?.time ||
  "Expected " + formatTime(complaint.estimatedCompletion),
 completed: complaint.status === "resolved",
 current: complaint.status === "resolved",
  },
 ];

 // ✅ Worker Assignment Check
 const isWorkerAssigned = complaint.worker && complaint.worker.name !== "Not Assigned";


 return (
  <div className="space-y-6">
 {/* Status Header */}
 <Card className="border-0 overflow-hidden bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200">
  <CardContent className="p-6">
   <div className="flex items-center justify-between mb-4">
  <div>
   <h2 className="text-2xl font-bold text-gray-900">{complaint.type}</h2>
   <p className="flex items-center mt-1 text-gray-700">📍 {complaint.location}</p>
  </div>
  <Badge variant="secondary" className="font-medium bg-white/80 text-gray-700 border-gray-300">
   {complaint.id}
  </Badge>
   </div>

   <div className="grid grid-cols-2 gap-4 text-sm">
  <div>
   <p className="text-gray-600">Reported</p>
   <p className="font-semibold text-gray-900">{getTimeAgo(complaint.reportedAt)}</p>
  </div>
  <div>
   <p className="text-gray-600">Expected Resolution</p>
   <p className="font-semibold text-gray-900">{formatTime(complaint.estimatedCompletion)}</p>
  </div>
   </div>

   <div className="mt-4">
  <div className="flex items-center justify-between text-sm mb-2">
   <span className="text-gray-700">Overall Progress</span>
   <span className="font-bold text-emerald-600">{complaint.progress}%</span>
  </div>
  <Progress value={complaint.progress} className="h-3 bg-white/60" />
   </div>
  </CardContent>
 </Card>

 <EnhancedProgressTracker steps={progressSteps} estimatedDate={formatTime(complaint.estimatedCompletion)} />

 {/* 🚨 FIX: Only show Worker Details if isWorkerAssigned is TRUE. */}
 {isWorkerAssigned && (
      <Card>
       <CardHeader>
         {/* FIX: Removed extra closing </CardTitle> tag */}
         <CardTitle className="flex items-center">🧭 Assigned Worker</CardTitle>
       </CardHeader>
       <CardContent>
         <div className="flex items-center space-x-4 mb-4">
           <Avatar className="w-16 h-16">
             <AvatarImage src={complaint.worker.avatar || "/placeholder.svg"} alt={complaint.worker.name} />
             <AvatarFallback>
               {complaint.worker.name
                 .split(" ")
                 .map((n) => n[0])
                 .join("")}
             </AvatarFallback>
           </Avatar>
           <div className="flex-1">
             <h3 className="font-semibold text-lg">{complaint.worker.name}</h3>
             <div className="flex items-center text-sm text-gray-500 mt-1">⭐ 4.8 Rating • 150+ Completed</div>
           </div>
           <div className="flex space-x-2">
             <Button size="sm" variant="outline">📞 Call</Button>
             <Button size="sm" variant="outline">💬 Chat</Button>
           </div>
         </div>

         {/* Live Location Mock */}
         <div className="bg-gray-50 rounded-lg p-4">
           <div className="flex items-center justify-between mb-3">
             <h4 className="font-medium text-gray-900">Live Location</h4>
             <Badge variant="secondary" className="bg-green-100 text-green-800">
               <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
               Live
             </Badge>
           </div>
           <div className="bg-blue-100 rounded-lg h-48 flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-emerald-200"></div>
             <div className="relative z-10 text-center">
               <div className="text-4xl mb-2">📍</div>
               <p className="text-sm font-medium text-gray-700">Worker Location</p>
               <p className="text-xs text-gray-500">2.3 km from your location</p>
             </div>
           </div>
           <div className="mt-3 text-sm text-gray-600">
             <p>📍 Currently at: Sector 12, Main Road</p>
             <p>🕐 ETA: 15-20 minutes</p>
           </div>
         </div>
       </CardContent>
      </Card>
    )}

 {/* Quick Actions */}
 <Card>
  <CardHeader>
   <CardTitle>Quick Actions</CardTitle>
  </CardHeader>
  <CardContent>
   <div className="grid grid-cols-2 gap-3">
  <Button variant="outline" className="justify-start bg-transparent">💬 Send Message</Button>
  <Button variant="outline" className="justify-start bg-transparent">📞 Call Support</Button>
  <Button variant="outline" className="justify-start bg-transparent">📍 Share Location</Button>
  <Button variant="outline" className="justify-start bg-transparent">⚠️ Report Issue</Button>
   </div>
  </CardContent>
 </Card>
  </div>
 );
}
