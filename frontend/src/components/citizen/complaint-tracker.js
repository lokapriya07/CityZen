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

/* ----------------------------- Progress Tracker ---------------------------- */
export function HorizontalProgressTracker({ steps, estimatedDate }) {
  const activeStepIndex = steps.findLastIndex((s) => s.completed);
  const segmentCount = steps.length - 1;

  return (
    <Card className="overflow-hidden border border-gray-200 shadow-sm">
      <CardContent className="p-8">
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

        <div className="flex items-start w-full relative">
          {steps.map((step, index) => {
            const isCompleted = step.completed;
            const isActive = index === activeStepIndex + 1;
            const isLast = index === steps.length - 1;

            return (
              <div key={step.id} className="flex-1 flex flex-col items-center relative">
                {!isLast && (
                  <div
                    className={`absolute top-6 left-1/2 w-full h-0.5 -translate-y-1/2 z-0 ${index < activeStepIndex ? "bg-green-600" : "bg-gray-200"
                      }`}
                    style={{ left: "calc(50% + 24px)" }}
                  />
                )}

                <div className="flex flex-col items-center text-center z-10">
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
                        <span
                          className={`font-medium ${isActive ? "text-green-600" : "text-gray-500"
                            }`}
                        >
                          {index + 1}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="px-2 max-w-32">
                    <h4
                      className={`font-semibold text-sm mb-1 ${isCompleted || isActive ? "text-gray-900" : "text-gray-500"
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

        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">
              {steps.filter((s) => s.completed).length} of {steps.length} steps
              completed
            </span>
            <span className="font-medium text-gray-900">
              {Math.round(
                (steps.filter((s) => s.completed).length / steps.length) * 100
              )}
              %
            </span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(steps.filter((s) => s.completed).length / steps.length) * 100
                  }%`,
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ---------------------------- Complaint Tracker ---------------------------- */
const getAuthToken = () => localStorage.getItem("authToken");

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

  const [workerLocation, setWorkerLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  /* ----------------------------- Timer & Location ---------------------------- */
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const workerName = complaint?.worker?.name;
    if (!workerName) return;

    const fetchWorkerLocation = async () => {
      try {
        const token = getAuthToken();
        const res = await fetch(`/api/worker/${encodeURIComponent(workerName)}/location`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success && data.location) setWorkerLocation(data.location);
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

  /* ------------------------------- Status Maps ------------------------------- */
  const statusMap = {
    submitted: "submitted",
    reviewed: "reviewed",
    assigned: "assigned",
    "in-progress": "in_progress",
    in_progress: "in_progress",
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
    submitted: { color: "bg-gray-200 text-gray-800" },
    reviewed: { color: "bg-blue-100 text-blue-700" },
    assigned: { color: "bg-amber-100 text-amber-700" },
    in_progress: { color: "bg-purple-100 text-purple-700" },
    resolved: { color: "bg-emerald-100 text-emerald-700" },
  };
  const currentStatus = statusInfo[normalizedStatus];

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    return isNaN(d.getTime())
      ? "N/A"
      : d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return "Just now";
    const diff = currentTime - new Date(dateString);
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (days) return `${days}d ago`;
    if (hours) return `${hours}h ${mins % 60}m ago`;
    if (mins) return `${mins}m ago`;
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

  const lat =
    workerLocation?.latitude ||
    complaint.worker?.workerDetails?.currentLocation?.latitude;
  const lng =
    workerLocation?.longitude ||
    complaint.worker?.workerDetails?.currentLocation?.longitude;
  const locationTimestamp =
    workerLocation?.timestamp ||
    complaint.worker?.workerDetails?.currentLocation?.timestamp;

  const displayLocation =
    typeof complaint.location === "object"
      ? complaint.location.address ||
      `Coords: ${complaint.location.coordinates?.lat}, ${complaint.location.coordinates?.lng}`
      : complaint.location || "Unknown location";

  /* ---------------------------- Feedback Submission --------------------------- */
  const handleSubmitFeedback = async () => {
    const token = getAuthToken();
    if (!token) return alert("Please login first.");

    const feedbackData = {
      serviceRating,
      workerRating,
      comments: comment,
    };

    try {
      const res = await fetch(`/api/reports/${complaint.id}/feedback`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(feedbackData),
      });
      const data = await res.json();
      if (res.ok && data.success) setFeedbackSubmitted(true);
      else alert("Feedback failed: " + (data.message || "Try again."));
    } catch (e) {
      console.error(e);
      alert("Network error. Try again.");
    }
  };

  /* ---------------------------------- JSX ---------------------------------- */
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 overflow-hidden bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 capitalize">
                {complaint.type}
              </h2>
              <p className="text-gray-700">At: {displayLocation}</p>
            </div>
            <Badge className={`font-medium border ${currentStatus.color}`}>
              {normalizedStatus.replace("_", " ")}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Reported</p>
              <p className="font-semibold">{getTimeAgo(complaint.reportedAt)}</p>
            </div>
            <div>
              <p className="text-gray-600">Expected Resolution</p>
              <p className="font-semibold">
                {formatTime(complaint.estimatedCompletion)}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Overall Progress</span>
              <span className="font-bold text-emerald-600">
                {displayProgress}%
              </span>
            </div>
            <Progress value={displayProgress} className="h-3 bg-white/60" />
          </div>
        </CardContent>
      </Card>

      {/* Steps */}
      <HorizontalProgressTracker
        steps={progressSteps}
        estimatedDate={formatTime(complaint.estimatedCompletion)}
      />

      {/* Worker Info */}
      {isWorkerAssigned && (
        <Card>
          <CardHeader>
            <CardTitle>Assigned Worker</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12 border shadow">
                  <AvatarImage src={complaint.worker.avatar} />
                  <AvatarFallback>
                    {complaint.worker.name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{complaint.worker.name}</p>
                  <p className="text-sm text-gray-600">
                    {complaint.worker.completedTasks || 0} tasks completed
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <a href={`tel:${complaint.worker.phone}`}>📞 Call</a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMessaging(true)}
                >
                  💬 Chat
                </Button>
              </div>
            </div>

            {/* Location */}
            <div className="mt-6">
              <h3 className="font-semibold text-md mb-2">Live Location</h3>
              {loadingLocation ? (
                <p className="text-gray-500 text-sm">Fetching worker location...</p>
              ) : lat && lng ? (
                <iframe
                  width="100%"
                  height="130"
                  frameBorder="0"
                  style={{ borderRadius: "8px" }}
                  src={`https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`}
                  allowFullScreen
                  title="Worker Location"
                ></iframe>
              ) : (
                <p className="text-gray-600 text-sm">
                  Worker’s location not available yet.
                </p>
              )}
              {locationTimestamp && (
                <p className="text-right text-xs mt-1 text-gray-500">
                  Updated: {new Date(locationTimestamp).toLocaleTimeString()}
                </p>
              )}
            </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
              <Button variant="outline" onClick={() => setShowMessaging(true)}>
                Send Message
              </Button>
              <Button variant="outline" onClick={() => setShowCallSupport(true)}>
                Call Support
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowShareLocation(true)}
              >
                Share Location
              </Button>
              <Button variant="outline" onClick={() => setShowReportIssue(true)}>
                Report Issue
              </Button>
            </div>

            {/* Modals */}
            {showMessaging && (
              <WorkerMessaging
                worker={complaint.worker}
                reportId={complaint.id}
                onClose={() => setShowMessaging(false)}
              />
            )}
            {showReportIssue && (
              <ReportIssue
                complaint={complaint}
                onClose={() => setShowReportIssue(false)}
              />
            )}
            {showShareLocation && (
              <ShareLocation
                complaint={complaint}
                onClose={() => setShowShareLocation(false)}
              />
            )}
            {showCallSupport && (
              <CallSupport
                complaint={complaint}
                onClose={() => setShowCallSupport(false)}
              />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
