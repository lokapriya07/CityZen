import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { EnhancedProgressTracker } from "./enhanced-progress-tracker";

// ✅ Removed TypeScript interfaces, using plain JS props now
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
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeAgo = (dateString) => {
    const diff = currentTime.getTime() - new Date(dateString).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) return `${hours}h ${minutes}m ago`;
    return `${minutes}m ago`;
  };

  const progressSteps = [
    {
      id: "submitted",
      title: "Submitted",
      description: "Report received",
      date: complaint.timeline.find((t) => t.status === "submitted")?.time || "Pending",
      completed: ["submitted", "reviewed", "assigned", "in_progress", "resolved"].includes(complaint.status),
      current: complaint.status === "submitted",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      id: "reviewed",
      title: "Under Review",
      description: "Being evaluated",
      date: complaint.timeline.find((t) => t.status === "reviewed")?.time || "Pending",
      completed: ["reviewed", "assigned", "in_progress", "resolved"].includes(complaint.status),
      current: complaint.status === "reviewed",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      id: "assigned",
      title: "Worker Assigned",
      description: "Team dispatched",
      date: complaint.timeline.find((t) => t.status === "assigned")?.time || "Pending",
      completed: ["assigned", "in_progress", "resolved"].includes(complaint.status),
      current: complaint.status === "assigned",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      id: "in_progress",
      title: "In Progress",
      description: "Work underway",
      date: complaint.timeline.find((t) => t.status === "in_progress")?.time || "Pending",
      completed: ["in_progress", "resolved"].includes(complaint.status),
      current: complaint.status === "in_progress",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
        </svg>
      ),
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
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

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

      {/* Worker Details */}
      {/* ... keep rest of the JSX as is, no TS types remain ... */}
      <Card>
<CardHeader>
<CardTitle>Quick Actions</CardTitle>
</CardHeader>
<CardContent>
<div className="grid grid-cols-2 gap-3">
<Button variant="outline" className="justify-start bg-transparent">
💬 Send Message
</Button>
<Button variant="outline" className="justify-start bg-transparent">
📞 Call Support
</Button>
<Button variant="outline" className="justify-start bg-transparent">
📍 Share Location
</Button>
<Button variant="outline" className="justify-start bg-transparent">
⚠️ Report Issue
</Button>
</div>
</CardContent>
</Card>
    </div>
  );
}
