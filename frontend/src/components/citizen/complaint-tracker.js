import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// Using the 'Check' icon for a cleaner look
import { Check } from "lucide-react";

//=================================================================
// 1. HELPER COMPONENT (HorizontalProgressTracker)
// ✅ This component has been redesigned for a more beautiful and modern look.
//=================================================================
function HorizontalProgressTracker({ steps, estimatedDate }) {
  // Find the index of the last step that is marked as 'completed'.
  const activeStepIndex = steps.findLastIndex(s => s.completed);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        {/* Date Label at the Top */}
        <div className="text-center mb-10 text-sm text-gray-500">
          Estimated Completion Date: <span className="font-semibold text-gray-800">{estimatedDate || 'N/A'}</span>
        </div>
        
        <div className="flex items-start">
          {steps.map((step, index) => {
            const isCompleted = index <= activeStepIndex;
            const isLineCompleted = index < activeStepIndex;
            
            return (
              <React.Fragment key={step.id}>
                {/* The Step (Icon + Text) */}
                <div className="flex flex-col items-center text-center w-1/5 min-w-0 px-2">
                  
                  {/* Icon with beautiful gradients and shadows */}
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center border-2
                    transition-all duration-500 ease-in-out
                    ${isCompleted 
                      ? 'bg-gradient-to-br from-emerald-500 to-green-500 border-emerald-600 shadow-lg shadow-emerald-500/30' 
                      : 'border-gray-200 bg-white'
                    }
                  `}>
                    {isCompleted && <Check className="w-6 h-6 text-white transform transition-transform duration-500 scale-100" />}
                  </div>
                  
                  {/* Text Container */}
                  <div className="mt-3">
                    <p className={`font-semibold text-sm transition-colors duration-500 ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500 leading-tight mt-1 transition-opacity duration-500 h-8">
                      {isCompleted ? step.description : ''}
                    </p>
                  </div>
                </div>

                {/* The Connecting Line with Gradient */}
                {index < steps.length - 1 && (
                  <div className="flex-auto h-1 bg-gray-200 mt-[18px] rounded-full overflow-hidden">
                     <div
                        className={`h-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-500 ease-in-out`}
                        style={{ width: isLineCompleted ? '100%' : '0%' }}
                      />
                  </div>
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
// No changes needed here.
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

    // --- Status and Progress Logic ---
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

    // --- Helper Functions ---
    const formatTime = (dateString) => {
        if (!dateString) return "N/A"; 
        const date = new Date(dateString);
        if (isNaN(date.getTime())) { 
            return "N/A"; 
        }
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

    // --- Data for Helper Component ---
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

    // --- API Call for Feedback ---
    const handleSubmitFeedback = async () => {
        const token = getAuthToken();
        if (!token) {
            alert("You must be logged in to submit feedback.");
            return;
        }

        const feedbackData = {
            serviceRating: serviceRating,
            workerRating: workerRating,
            comments: comment
        };
        
        console.log("Submitting feedback for complaint ID:", complaint.id);
        console.log("Submitting this data:", JSON.stringify(feedbackData, null, 2));

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
                console.error("Feedback submission failed. Server response:", data);
                let errorMessage = data.message || (data.errors ? data.errors[0].msg : "Please try again.");
                alert(`Feedback failed: ${errorMessage}`);
            }
        } catch (error) {
            console.error("A network or other critical error occurred:", error);
            alert("CRITICAL ERROR: Could not connect to server. Check console.");
        }
    };

    // --- Render JSX ---
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

            {/* 🔄 Step Tracker (Helper Component) */}
            <HorizontalProgressTracker
                steps={progressSteps}
                estimatedDate={formatTime(complaint.estimatedCompletion)}
            />

            {/* 🧑‍🔧 Assigned Worker (NEW DESIGN) */}
            {isWorkerAssigned && (
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <span className="text-2xl">⏰</span>
                            Assigned Worker
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* --- Worker Info & Actions --- */}
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

                        {/* --- Live Location Section --- */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-md">Live Location</h3>
                                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300 shadow-sm">
                                    <span className="relative flex h-2 w-2 mr-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    Live
                                </Badge>
                            </div>

                            <div className="relative h-32 rounded-lg bg-gradient-to-r from-blue-100 via-teal-50 to-green-100 p-4 flex items-center justify-between overflow-hidden border border-gray-200">
                                <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-blue-300 transform -translate-y-1/2"></div>
                                <div className="absolute left-1/3 top-1/2 transform -translate-x-1/2 -translate-y-full text-center">
                                    <span className="text-4xl text-pink-500" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>📍</span>
                                    <div className="p-1.5 px-2 bg-white/70 rounded-md backdrop-blur-sm shadow-md mt-1">
                                        <p className="text-xs font-semibold text-gray-800 whitespace-nowrap">Worker Location</p>
                                        {complaint.worker.location?.distance && (
                                            <p className="text-xs text-gray-600 whitespace-nowrap">
                                                {complaint.worker.location.distance} km from you
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="absolute right-1/4 top-1/2 transform -translate-y-1/2">
                                    <span className="flex h-5 w-5 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-5 w-5 bg-green-600 border-2 border-white shadow-lg"></span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* --- Location & ETA Details --- */}
                        <div className="mt-4 space-y-2">
                            {complaint.worker.location?.currentAddress && (
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">📍</span>
                                    <span className="text-sm text-gray-700">
                                        Currently at: <span className="font-medium text-gray-900">{complaint.worker.location.currentAddress}</span>
                                    </span>
                                </div>
                            )}
                            {complaint.worker.location?.eta && (
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">⏱️</span>
                                    <span className="text-sm text-gray-700">
                                        ETA to your location: <span className="font-medium text-gray-900">{complaint.worker.location.eta}</span>
                                    </span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* 🌟 Feedback Section (Visible when resolved) */}
            {complaint.status === "completed" && ( 
                <Card className="border border-emerald-300 bg-emerald-50 shadow-sm">
                    <CardHeader>
                        <CardTitle>✅ Issue Resolved - Share Your Feedback</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {!showFeedbackForm && !feedbackSubmitted ? (
                            <div className="text-center space-y-4">
                                <p className="text-gray-700">
                                    Great news! Your issue has been resolved. Help us improve our service by sharing your feedback.
                                </p>
                                <Button onClick={() => setShowFeedbackForm(true)} className="bg-emerald-600 hover:bg-emerald-700">
                                    ⭐ Rate Our Service
                                </Button>
                            </div>
                        ) : !feedbackSubmitted ? (
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg">Rate the Service Quality</h3>
                                <p className="text-gray-600">How satisfied are you with the resolution?</p>
                                <div className="flex gap-2 text-2xl">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={star}
                                            onClick={() => setServiceRating(star)}
                                            className={`cursor-pointer ${star <= serviceRating ? "text-yellow-400" : "text-gray-300"}`}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>

                                {isWorkerAssigned && (
                                    <div className="flex items-center gap-3 mt-3">
                                        <Avatar>
                                            <AvatarImage src={complaint.worker.avatar} />
                                            <AvatarFallback>{complaint.worker.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold">{complaint.worker.name}</p>
                                            <p className="text-sm text-gray-600">Rate the worker's performance</p>
                                            <div className="flex gap-1 text-xl mt-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <span
                                                        key={star}
                                                        onClick={() => setWorkerRating(star)}
                                                        className={`cursor-pointer ${star <= workerRating ? "text-yellow-400" : "text-gray-300"}`}
                                                    >
                                                        ★
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <textarea
                                    className="w-full p-2 border rounded-md text-sm mt-4"
                                    rows="3"
                                    placeholder="Share your experience, suggestions, or any feedback..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                ></textarea>

                                <div className="flex justify-end gap-2 mt-2">
                                    <Button
                                        onClick={handleSubmitFeedback}
                                        disabled={serviceRating === 0} // Must rate service to submit
                                        className="bg-emerald-600 hover:bg-emerald-700"
                                    >
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