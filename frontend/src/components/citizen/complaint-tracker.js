import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { EnhancedProgressTracker } from "./enhanced-progress-tracker";

// ... (statusConfig remains the same)

export function ComplaintTracker({ complaint }) {
    const [currentTime, setCurrentTime] = useState(new Date());
    // ... (other state hooks remain the same)

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // ... (handleFeedbackSubmit, formatTime, getTimeAgo functions remain the same)
    const formatTime = (dateString) => {
        if (!dateString || dateString.toLowerCase().includes('invalid')) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    };
    
    const getTimeAgo = (dateString) => {
        if (!dateString) return "Just now";
        const diff = currentTime.getTime() - new Date(dateString).getTime();
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ${minutes % 60}m ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return `Just now`;
    };


    const statusArray = ["submitted", "reviewed", "assigned", "in_progress", "resolved"];

    const progressSteps = [
        { id: "submitted", title: "Submitted", description: "Report received", date: complaint.timeline.find((t) => t.status === "submitted")?.time || "Pending", completed: true, current: complaint.status === "submitted" },
        { id: "reviewed", title: "Under Review", description: "Being evaluated", date: complaint.timeline.find((t) => t.status === "reviewed")?.time || "Pending", completed: statusArray.slice(1).includes(complaint.status), current: complaint.status === "reviewed" },
        { id: "assigned", title: "Worker Assigned", description: "Team dispatched", date: complaint.timeline.find((t) => t.status === "assigned")?.time || "Pending", completed: statusArray.slice(2).includes(complaint.status), current: complaint.status === "assigned" },
        { id: "in_progress", title: "In Progress", description: "Work underway", date: complaint.timeline.find((t) => t.status === "in_progress")?.time || "Pending", completed: statusArray.slice(3).includes(complaint.status), current: complaint.status === "in_progress" },
        { id: "resolved", title: "Resolved", description: "Issue completed", date: complaint.timeline.find((t) => t.status === "resolved")?.time || "Expected " + formatTime(complaint.estimatedCompletion), completed: complaint.status === "resolved", current: complaint.status === "resolved" },
    ];

    const isWorkerAssigned = complaint.worker && complaint.worker.name !== "Not Assigned";
    
    // This helper variable makes the JSX cleaner
    const displayLocation = (typeof complaint.location === "object" && complaint.location !== null)
        ? complaint.location.address || `Coords: ${complaint.location.coordinates?.lat}, ${complaint.location.coordinates?.lng}`
        : complaint.location || "Unknown location";

    return (
        <div className="space-y-6">
            {/* Status Header */}
            <Card className="border-0 overflow-hidden bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{complaint.type}</h2>
                            {/* --- THIS IS THE FIX --- */}
                            {/* Use the safe 'displayLocation' variable instead of the raw object */}
                            <p className="flex items-center mt-1 text-gray-700">📍 {displayLocation}</p>
                            {/* ---------------------- */}
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

            {/* Assigned Worker Card */}
            {isWorkerAssigned && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">🧭 Assigned Worker</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* ... content for worker details ... */}
                    </CardContent>
                </Card>
            )}

            {/* Quick Actions Card */}
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