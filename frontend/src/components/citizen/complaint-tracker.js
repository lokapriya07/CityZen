import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// Using CheckCircle (filled) and Circle (outline) from lucide-react
import { CheckCircle, Circle } from "lucide-react"; 

//=================================================================
// 1. EXACT MATCH HORIZONTAL PROGRESS TRACKER
// ✅ This version is meticulously styled to be an exact replica of your screenshot.
//=================================================================
function ExactMatchHorizontalProgressTracker({ steps, estimatedDate }) {
  const activeStepIndex = steps.findLastIndex(s => s.completed);

  return (
    <Card className="shadow-sm border bg-white">
      <CardContent className="p-6">
        {/* Date Label */}
        <div className="text-center mb-10 text-xs font-medium text-gray-500 uppercase tracking-wider">
          Estimated Completion Date: {estimatedDate}
        </div>
        
        {/* Flex container for steps */}
        <div className="flex items-start">
          {steps.map((step, index) => {
            const isCompleted = index < activeStepIndex;
            const isActive = index === activeStepIndex;
            const isPending = index > activeStepIndex;

            // This logic precisely matches the styling from the screenshot
            const iconColor = isPending ? "text-gray-300" : "text-emerald-500";
            const titleColor = isActive ? "text-emerald-600" : (isPending ? "text-gray-400" : "text-gray-800");
            const descriptionColor = isPending ? "text-gray-400" : "text-gray-500";
            const titleWeight = isActive ? "font-bold" : "font-medium";
            const IconComponent = isPending ? Circle : CheckCircle;
            const lineColor = isCompleted ? "bg-emerald-500" : "bg-gray-200";

            return (
              <React.Fragment key={step.id}>
                {/* The Step (Icon + Text) */}
                <div className="flex flex-col items-center w-1/5 min-w-0 px-1 text-center">
                  
                  {/* Icon Container */}
                  <div className="flex items-center justify-center h-10"> {/* Fixed height for alignment */}
                    <IconComponent className={`w-7 h-7 ${iconColor}`} />
                  </div>
                  
                  {/* Text */}
                  <div className="mt-3">
                    <p className={`text-sm ${titleWeight} ${titleColor}`}>{step.title}</p>
                    <p className={`text-xs mt-1 ${descriptionColor}`}>{step.description}</p>
                  </div>
                </div>

                {/* The Connecting Line (if not the last step) */}
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 ${lineColor} mt-5 transition-colors duration-300`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}


//=================================================================
// 2. MAIN COMPONENT (ComplaintTracker)
// This calls the new, exact-match tracker.
//=================================================================

const getAuthToken = () => {
    return localStorage.getItem("authToken"); 
};

export function ComplaintTracker({ complaint }) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);
    const [serviceRating, setServiceRating] = useState(0);
    const [workerRating, setWorkerRating] = useState(0); 
    const [comment, setComment] = useState("");
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

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

    const progressMap = {
        submitted: 10,
        reviewed: 30,
        assigned: 50,
        in_progress: 75,
        resolved: 100,
    };
    const displayProgress = progressMap[normalizedStatus] || 10;

    const statusInfo = {
        submitted: { icon: "📝", color: "bg-gray-200 text-gray-800" },
        reviewed: { icon: "🔍", color: "bg-blue-100 text-blue-700" },
        assigned: { icon: "👷", color: "bg-amber-100 text-amber-700" },
        in_progress: { icon: "🔧", color: "bg-purple-100 text-purple-700" },
        resolved: { icon: "✅", color: "bg-emerald-100 text-emerald-700" },
    };
    const currentStatus = statusInfo[normalizedStatus] || statusInfo.submitted;

    const formatTime = (dateString) => {
        if (!dateString) return "N/A"; 
        const date = new Date(dateString);
        return !isNaN(date.getTime()) 
            ? date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
            : "Invalid Date";
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

    const handleSubmitFeedback = async () => {
        const token = getAuthToken();
        if (!token) {
            alert("You must be logged in to submit feedback.");
            return;
        }

        const feedbackData = { serviceRating, workerRating, comments: comment };
        
        try {
            const response = await fetch(`/api/reports/${complaint.id}/feedback`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(feedbackData)
            });

            const data = await response.json(); 

            if (response.ok && data.success) {
                setFeedbackSubmitted(true);
            } else {
                let errorMessage = data.message || (data.errors ? data.errors[0].msg : "Please try again.");
                alert(`Feedback failed: ${errorMessage}`);
            }
        } catch (error) {
            alert("CRITICAL ERROR: Could not connect to server.");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header with Status and Progress */}
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

            {/* Step Tracker (Helper Component) */}
            <ExactMatchHorizontalProgressTracker
                steps={progressSteps}
                estimatedDate={
                  complaint.estimatedCompletion && !isNaN(new Date(complaint.estimatedCompletion))
                    ? new Date(complaint.estimatedCompletion).toLocaleDateString("en-US", { 
                        year: 'numeric', month: 'short', day: 'numeric' 
                      }) 
                    : "Invalid Date"
                }
            />

            {/* Assigned Worker */}
            {isWorkerAssigned && (
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <span className="text-2xl">⏰</span>
                            Assigned Worker
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-4">
                                <Avatar className="w-12 h-12 border-2 border-white shadow-md">
                                    <AvatarImage src={complaint.worker.avatar} alt={complaint.worker.name} />
                                    <AvatarFallback>{complaint.worker.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-bold text-lg">{complaint.worker.name}</p>
                                    {(complaint.worker.rating || complaint.worker.completedTasks) && (
                                        <p className="text-sm text-gray-600 flex items-center gap-1 flex-wrap">
                                            {complaint.worker.rating && (
                                                <span className="flex items-center gap-1">
                                                    <span className="text-yellow-500">⭐</span>
                                                    {complaint.worker.rating} Rating
                                                </span>
                                            )}
                                            {complaint.worker.rating && complaint.worker.completedTasks && (
                                                <span className="text-gray-300 mx-1">|</span>
                                            )}
                                            {complaint.worker.completedTasks && (
                                                <span>{complaint.worker.completedTasks}+ Completed</span>
                                            )}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                                <Button asChild variant="outline" size="sm" className="flex items-center gap-1.5">
                                    <a href={`tel:${complaint.worker.contact}`}>
                                        <span>📞</span>
                                        Call
                                    </a>
                                </Button>
                                <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                                    <span>💬</span>
                                    Chat
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

             {/* Feedback Section */}
            {normalizedStatus === "resolved" && ( 
                <Card className="border border-emerald-300 bg-emerald-50 shadow-sm">
                    <CardHeader>
                        <CardTitle>✅ Issue Resolved - Share Your Feedback</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {!showFeedbackForm && !feedbackSubmitted ? (
                            <div className="text-center space-y-4">
                                <p className="text-gray-700">
                                    Help us improve our service by sharing your feedback.
                                </p>
                                <Button onClick={() => setShowFeedbackForm(true)} className="bg-emerald-600 hover:bg-emerald-700">
                                    ⭐ Rate Our Service
                                </Button>
                            </div>
                        ) : !feedbackSubmitted ? (
                            <div className="space-y-4">
                                {/* Service Rating */}
                                <div>
                                    <h3 className="font-semibold text-lg">Rate the Service Quality</h3>
                                    <div className="flex gap-2 text-2xl mt-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span key={star} onClick={() => setServiceRating(star)} className={`cursor-pointer ${star <= serviceRating ? "text-yellow-400" : "text-gray-300"}`}>★</span>
                                        ))}
                                    </div>
                                </div>

                                {/* Worker Rating */}
                                {isWorkerAssigned && (
                                    <div>
                                        <h3 className="font-semibold text-lg mt-4">Rate the Worker's Performance</h3>
                                        <div className="flex gap-1 text-xl mt-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span key={star} onClick={() => setWorkerRating(star)} className={`cursor-pointer ${star <= workerRating ? "text-yellow-400" : "text-gray-300"}`}>★</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                <textarea
                                    className="w-full p-2 border rounded-md text-sm mt-4"
                                    rows="3"
                                    placeholder="Share your experience..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                ></textarea>

                                <div className="flex justify-end gap-2 mt-2">
                                    <Button onClick={handleSubmitFeedback} disabled={serviceRating === 0} className="bg-emerald-600 hover:bg-emerald-700">
                                        Submit Feedback
                                    </Button>
                                    <Button variant="outline" onClick={() => setShowFeedbackForm(false)}>
                                        Skip
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4 text-emerald-700 font-medium">
                                🎉 Thank you for your valuable feedback!
                            </div>
                        )}
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