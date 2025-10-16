import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { EnhancedProgressTracker } from "./enhanced-progress-tracker";

export function ComplaintTracker({ complaint }) {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // 🧭 Normalize backend → frontend status
    const statusMap = {
        submitted: "submitted",
        reviewed: "reviewed",
        assigned: "assigned",
        "in-progress": "in_progress",
        "in_progress": "in_progress",
        completed: "resolved",
        resolved: "resolved",
    };

    const normalizedStatus = statusMap[complaint.status] || "submitted";

    // 🎯 Map statuses to progress %
    const progressMap = {
        submitted: 10,
        reviewed: 30,
        assigned: 50,
        in_progress: 75,
        resolved: 100,
    };
    const displayProgress = progressMap[normalizedStatus] || 10;

    // ✨ Status icons + badge colors
    const statusInfo = {
        submitted: { icon: "📝", color: "bg-gray-200 text-gray-800" },
        reviewed: { icon: "🔍", color: "bg-blue-100 text-blue-700" },
        assigned: { icon: "👷", color: "bg-amber-100 text-amber-700" },
        in_progress: { icon: "🔧", color: "bg-purple-100 text-purple-700" },
        resolved: { icon: "✅", color: "bg-emerald-100 text-emerald-700" },
    };

    const currentStatus = statusInfo[normalizedStatus] || statusInfo.submitted;

    const formatTime = (dateString) => {
        if (!dateString || dateString.toLowerCase().includes("invalid")) return "N/A";
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
        return "Just now";
    };

    const progressSteps = [
        { id: "submitted", title: "Submitted", description: "Report received", completed: true },
        { id: "reviewed", title: "Under Review", description: "Being evaluated", completed: ["reviewed", "assigned", "in_progress", "resolved"].includes(normalizedStatus) },
        { id: "assigned", title: "Worker Assigned", description: "Team dispatched", completed: ["assigned", "in_progress", "resolved"].includes(normalizedStatus) },
        { id: "in_progress", title: "In Progress", description: "Work underway", completed: ["in_progress", "resolved"].includes(normalizedStatus) },
        { id: "resolved", title: "Resolved", description: "Issue completed", completed: normalizedStatus === "resolved" },
    ];

    const isWorkerAssigned = complaint.worker && complaint.worker.name !== "Not Assigned";

    const displayLocation =
        typeof complaint.location === "object" && complaint.location !== null
            ? complaint.location.address ||
            `Coords: ${complaint.location.coordinates?.lat}, ${complaint.location.coordinates?.lng}`
            : complaint.location || "Unknown location";

    return (
        <div className="space-y-6">
            {/* 🟢 Header with Status and Progress */}
            <Card className="border-0 overflow-hidden bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 shadow-sm">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 capitalize">
                                {complaint.type}
                            </h2>
                            <p className="flex items-center mt-1 text-gray-700">
                                📍 {displayLocation}
                            </p>
                        </div>
                        <Badge className={`font-medium border ${currentStatus.color}`}>
                            {currentStatus.icon} {normalizedStatus.replace("_", " ")}
                        </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-600">Reported</p>
                            <p className="font-semibold text-gray-900">
                                {getTimeAgo(complaint.reportedAt)}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600">Expected Resolution</p>
                            <p className="font-semibold text-gray-900">
                                {formatTime(complaint.estimatedCompletion)}
                            </p>
                        </div>
                    </div>

                    {/* 🔁 Dynamic Progress Bar */}
                    <div className="mt-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-700">Overall Progress</span>
                            <span className="font-bold text-emerald-600">
                                {displayProgress}%
                            </span>
                        </div>
                        <Progress value={displayProgress} className="h-3 bg-white/60" />
                    </div>
                </CardContent>
            </Card>

            {/* 🔄 Step Tracker */}
            <EnhancedProgressTracker
                steps={progressSteps}
                estimatedDate={formatTime(complaint.estimatedCompletion)}
            />

            {/* 🧑‍🔧 Assigned Worker */}
            {isWorkerAssigned && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">🧭 Assigned Worker</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <Avatar>
                                <AvatarImage src={complaint.worker.avatar} alt={complaint.worker.name} />
                                <AvatarFallback>{complaint.worker.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{complaint.worker.name}</p>
                                <p className="text-sm text-gray-600">{complaint.worker.contact}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* ⚡ Quick Actions */}
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
