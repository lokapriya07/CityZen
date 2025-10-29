import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Check } from "lucide-react";
import { WorkerMessaging } from "./message";
import { ReportIssue } from "./report-issue";
import { ShareLocation } from "./ShareLocation";
import { CallSupport } from "./CallSupport";

export function HorizontalProgressTracker({ steps, estimatedDate }) {
  const activeStepIndex = steps.findLastIndex((s) => s.completed);
  const segmentCount = steps.length - 1;
  const progressPercentage = segmentCount > 0 ? (activeStepIndex / segmentCount) * 100 : 0;

  return (
    <Card className="overflow-hidden border border-gray-200 shadow-sm">
      <CardContent className="p-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Progress Timeline
          </h3>
          <div className="text-sm text-gray-600">
            Estimated Completion:{" "}
            <span className="font-medium text-gray-800">
              {estimatedDate || "To be determined"}
            </span>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex items-start w-full relative">
          {steps.map((step, index) => {
            const isCompleted = index <= activeStepIndex;
            const isActive = index === activeStepIndex + 1;
            const isLast = index === steps.length - 1;

            return (
              <div key={step.id} className="flex-1 flex flex-col items-center relative">
                {/* Connecting Line */}
                {!isLast && (
                  <div
                    className={`absolute top-6 left-1/2 w-full h-0.5 -translate-y-1/2 z-0 ${index < activeStepIndex ? "bg-green-600" : "bg-gray-200"}`}
                    style={{ left: "calc(50% + 24px)" }}
                  />
                )}

                {/* Step Content */}
                <div className="flex flex-col items-center text-center z-10">
                  {/* Step Indicator */}
                  <div className="mb-4">
                    <div
                      className={`w-12 h-12 flex items-center justify-center rounded-full border-2 transition-all duration-200 ${isCompleted
                        ? "bg-green-600 border-green-600 text-white shadow-sm"
                        : isActive
                          ? "bg-white border-green-600 text-green-600 shadow-sm"
                          : "bg-white border-gray-300 text-gray-400"
                        }`}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <span className={`font-medium ${isActive ? "text-green-600" : "text-gray-500"}`}>
                          {index + 1}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Step Information */}
                  <div className="px-2 max-w-32">
                    <h4
                      className={`font-semibold text-sm mb-1 ${isCompleted || isActive
                        ? "text-gray-900"
                        : "text-gray-500"
                        }`}
                    >
                      {step.title}
                    </h4>
                    <p className="text-xs text-gray-500 leading-tight">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Status */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">
              {steps.filter((s) => s.completed).length} of {steps.length} steps completed
            </span>
            <span className="font-medium text-gray-900">
              {Math.round((steps.filter((s) => s.completed).length / steps.length) * 100)}%
            </span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(steps.filter((s) => s.completed).length / steps.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

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

  const [showMessaging, setShowMessaging] = useState(false);
  const [showReportIssue, setShowReportIssue] = useState(false);
  const [showShareLocation, setShowShareLocation] = useState(false);
  const [showCallSupport, setShowCallSupport] = useState(false);

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportText, setReportText] = useState("");

  const [workerLocation, setWorkerLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Get the worker name instead of ID
    const workerName = complaint?.worker?.name;
    console.log("workerName for API:", workerName);

    const fetchWorkerLocation = async () => {
      if (!workerName) {
        setLoadingLocation(false);
        return;
      }
      try {
        const token = getAuthToken();
        console.log("Using token:", token);
        const res = await fetch(`/api/worker/${encodeURIComponent(workerName)}/location`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        const data = await res.json();
        console.log("API Response for worker location:", data);
        if (data.success && data.location) {
          setWorkerLocation(data.location);
          console.log("Set worker location:", data.location);
        } else {
          console.log("Location not found in API response.");
        }
      } catch (err) {
        console.error("Error fetching worker location:", err);
      } finally {
        setLoadingLocation(false);
      }
    };

    fetchWorkerLocation();
    const interval = setInterval(fetchWorkerLocation, 15000);
    return () => clearInterval(interval);
  }, [complaint?.worker?.name]);


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

  const progressSteps = [
    { id: "submitted", title: "Submitted", description: "Report received", completed: true },
    { id: "reviewed", title: "Under Review", description: "Being evaluated", completed: ["reviewed", "assigned", "in_progress", "resolved"].includes(normalizedStatus) },
    { id: "assigned", title: "Worker Assigned", description: "Team dispatched", completed: ["assigned", "in_progress", "resolved"].includes(normalizedStatus) },
    { id: "in_progress", title: "In Progress", description: "Work underway", completed: ["in_progress", "resolved"].includes(normalizedStatus) },
    { id: "resolved", title: "Resolved", description: "Issue completed", completed: normalizedStatus === "resolved" },
  ];

  const isWorkerAssigned = complaint.worker && complaint.worker.name !== "Not Assigned";

  // --- Location Map Section ---
  const lat =
    workerLocation?.latitude ||
    complaint.worker?.workerDetails?.currentLocation?.latitude;
  const lng =
    workerLocation?.longitude ||
    complaint.worker?.workerDetails?.currentLocation?.longitude;
  const locationTimestamp =
    workerLocation?.timestamp ||
    complaint.worker?.workerDetails?.currentLocation?.timestamp;

  // ---- Console logs for debugging ----
  console.log("workerLocation state:", workerLocation);
  console.log("lat:", lat, "lng:", lng);

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
      {/* Header with Status and Progress */}
      <Card className="border-0 overflow-hidden bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 capitalize">
                {complaint.type}
              </h2>
              <p className="flex items-center mt-1 text-gray-700">
                At: {displayLocation}
              </p>
            </div>
            <Badge className={`font-medium border ${currentStatus.color}`}>
              {normalizedStatus.replace("_", " ")}
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

      {/* Step Tracker */}
      <HorizontalProgressTracker
        steps={progressSteps}
        estimatedDate={formatTime(complaint.estimatedCompletion)}
      />

      {/* Assigned Worker */}
      {isWorkerAssigned && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
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
                          <span className="text-yellow-500">Star</span>
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
                  <a href={`tel:${complaint.worker.phone}`}>
                    Call
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="justify-start bg-transparent"
                  onClick={() => setShowMessaging(true)}>
                  Chat
                </Button>
              </div>
            </div>

            {/* Worker Location Map (updated block) */}
            <div className="mt-3">
              <p className="font-semibold text-gray-700">Worker Location</p>
              {loadingLocation ? (
                <div className="h-32 flex items-center justify-center text-gray-500">
                  Fetching worker location...
                </div>
              ) : lat && lng ? (
                <iframe
                  width="100%"
                  height="130"
                  frameBorder="0"
                  style={{ border: 0, borderRadius: "8px" }}
                  // --- THIS IS THE FIX ---
                  src={`https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`}
                  allowFullScreen
                  title="Worker Location"
                ></iframe>
              ) : (
                <div className="relative h-32 rounded-lg bg-gray-100 p-4 flex items-center justify-center overflow-hidden border border-gray-200">
                  <p className="text-gray-600">Worker’s location not available yet.</p>
                </div>
              )}
              {/* Show updated time */}
              {locationTimestamp && (
                <div className="text-right text-xs mt-1 text-gray-500">
                  Updated: {new Date(locationTimestamp).toLocaleTimeString()}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feedback Section */}
      {complaint.status === "completed" && (
        <Card className="border border-emerald-300 bg-emerald-50 shadow-sm">
          <CardHeader>
            <CardTitle>Issue Resolved - Share Your Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            {!showFeedbackForm && !feedbackSubmitted ? (
              <div className="text-center space-y-4">
                <p className="text-gray-700">
                  Great news! Your issue has been resolved. Help us improve our service by sharing your feedback.
                </p>
                <Button onClick={() => setShowFeedbackForm(true)} className="bg-emerald-600 hover:bg-emerald-700">
                  Rate Our Service
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
                      Star
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
                            Star
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
                    disabled={serviceRating === 0}
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
                Thank you for your valuable feedback!
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      {isWorkerAssigned && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="justify-start bg-transparent"
                onClick={() => setShowMessaging(true)}
              >
                Send Message
              </Button>
              <Button
                variant="outline"
                className="justify-start bg-transparent"
                onClick={() => setShowCallSupport(true)}
              >
                Call Support
              </Button>
              <Button
                variant="outline"
                className="justify-start bg-transparent"
                onClick={() => setShowShareLocation(true)}
              >
                Share Location
              </Button>
              <Button
                variant="outline"
                className="justify-start bg-transparent"
                onClick={() => setShowReportIssue(true)}
              >
                Report Issue
              </Button>
            </div>

            {showMessaging && isWorkerAssigned && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
                <div className="bg-white rounded-lg w-full max-w-2xl h-[80vh] overflow-hidden">
                  <WorkerMessaging
                    worker={{
                      name: complaint.worker.name,
                      avatar: complaint.worker.avatar,
                      phone: complaint.worker.phone,
                      rating: complaint.worker.rating,
                      completedTasks: complaint.worker.completedTasks,
                    }}
                    reportId={complaint.id}
                    onClose={() => setShowMessaging(false)}
                  />
                </div>
              </div>
            )}

            {showReportIssue && (
              <ReportIssue
                complaint={complaint}
                onClose={() => setShowReportIssue(false)}
                onSubmit={async (reportData) => {
                  const token = getAuthToken();
                  try {
                    const response = await fetch(`/api/reports/${complaint.id}/report-issue`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                      },
                      body: JSON.stringify(reportData),
                    });
                    const data = await response.json();
                    if (response.ok && data.success) {
                      return true;
                    } else {
                      throw new Error(data.message || "Failed to report issue");
                    }
                  } catch (error) {
                    console.error("Error reporting issue:", error);
                    throw error;
                  }
                }}
              />
            )}

            {showShareLocation && (
              <ShareLocation
                complaint={complaint}
                onClose={() => setShowShareLocation(false)}
                onSubmit={async (locationData) => {
                  const token = getAuthToken();
                  try {
                    const response = await fetch(`/api/reports/${complaint.id}/share-location`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                      },
                      body: JSON.stringify(locationData),
                    });
                    const data = await response.json();
                    if (response.ok && data.success) {
                      return true;
                    } else {
                      throw new Error(data.message || "Failed to share location");
                    }
                  } catch (error) {
                    console.error("Error sharing location:", error);
                    throw error;
                  }
                }}
              />
            )}

            {showCallSupport && (
              <CallSupport
                complaint={complaint}
                onClose={() => setShowCallSupport(false)}
                onCall={async (contact) => {
                  const token = getAuthToken();
                  try {
                    await fetch(`/api/reports/${complaint.id}/call-log`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        contactType: contact.type,
                        contactName: contact.name,
                        phoneNumber: contact.number,
                        timestamp: new Date().toISOString(),
                      }),
                    });
                    return true;
                  } catch (error) {
                    console.error("Error logging call:", error);
                    return true;
                  }
                }}
              />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}