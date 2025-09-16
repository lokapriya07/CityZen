import React, { useState, useEffect } from "react";

// ------------------ UI Components ------------------

const Card = ({ children, className }) => (
  <div className={`rounded-lg shadow border p-4 ${className || ""}`}>{children}</div>
);

const CardHeader = ({ children, className }) => (
  <div className={`mb-2 ${className || ""}`}>{children}</div>
);

const CardTitle = ({ children, className }) => (
  <h3 className={`text-lg font-semibold ${className || ""}`}>{children}</h3>
);

const CardContent = ({ children, className }) => <div className={`${className || ""}`}>{children}</div>;

const Badge = ({ children, className, variant }) => (
  <span
    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
      variant === "secondary" ? "bg-gray-200 text-gray-800" : "bg-blue-500 text-white"
    } ${className || ""}`}
  >
    {children}
  </span>
);

const Button = ({ children, className, variant, onClick, size, disabled }) => {
  let base = "px-4 py-2 rounded font-medium transition";
  let style =
    variant === "outline"
      ? "border border-gray-300 hover:bg-gray-100"
      : "bg-blue-500 text-white hover:bg-blue-600";
  let sizeClass = size === "sm" ? "text-sm py-1 px-3" : "text-base";

  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${style} ${sizeClass} ${className || ""}`}>
      {children}
    </button>
  );
};

const Progress = ({ value, className }) => (
  <div className={`w-full bg-gray-200 rounded-full h-3 ${className || ""}`}>
    <div className="bg-green-500 h-3 rounded-full" style={{ width: `${value}%` }}></div>
  </div>
);

const Avatar = ({ children, className }) => <div className={`rounded-full overflow-hidden ${className || ""}`}>{children}</div>;

const AvatarImage = ({ src, alt }) => <img src={src} alt={alt} className="w-full h-full object-cover" />;

const AvatarFallback = ({ children }) => (
  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600">{children}</div>
);

const Textarea = ({ className, value, onChange, placeholder }) => (
  <textarea
    className={`w-full p-2 border rounded ${className || ""}`}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
  />
);

// ------------------ Complaint Tracker ------------------

const statusConfig = {
  submitted: { color: "text-emerald-500", bg: "bg-emerald-50", label: "Report Submitted" },
  reviewed: { color: "text-blue-500", bg: "bg-blue-50", label: "Under Review" },
  assigned: { color: "text-orange-500", bg: "bg-orange-50", label: "Worker Assigned" },
  in_progress: { color: "text-purple-500", bg: "bg-purple-50", label: "Work in Progress" },
  resolved: { color: "text-green-500", bg: "bg-green-50", label: "Issue Resolved" },
};

export default function CitizenDashboard() {
  // ---------- Sample Complaint Data ----------
  const complaint = {
    id: "C12345",
    type: "Waste Collection Issue",
    location: "Sector 12, Main Road",
    status: "resolved",
    progress: 100,
    reportedAt: new Date(new Date().getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2h ago
    estimatedCompletion: new Date().toISOString(),
    worker: {
      name: "Ramesh Kumar",
      phone: "9876543210",
      avatar: "",
      currentLocation: { lat: 0, lng: 0 },
    },
    timeline: [
      { status: "submitted", time: "10:00 AM", completed: true },
      { status: "reviewed", time: "10:30 AM", completed: true },
      { status: "assigned", time: "11:00 AM", completed: true },
      { status: "in_progress", time: "12:00 PM", completed: true },
      { status: "resolved", time: "1:30 PM", completed: true },
    ],
  };

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
    return new Date(dateString).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  const getTimeAgo = (dateString) => {
    const diff = currentTime.getTime() - new Date(dateString).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) return `${hours}h ${minutes}m ago`;
    return `${minutes}m ago`;
  };

  // ------------------ JSX ------------------

  return (
    <div className="space-y-6 p-4">
      {/* Status Header */}
      <Card className="border-0 overflow-hidden" style={{ background: "linear-gradient(to right, #059669, #2563eb)", color: "white" }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">{complaint.type}</h2>
              <p className="flex items-center mt-1" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
                📍 {complaint.location}
              </p>
            </div>
            <Badge variant="secondary" className="font-medium" style={{ backgroundColor: "rgba(255,255,255,0.3)", color: "white", borderColor: "rgba(255,255,255,0.4)" }}>
              {complaint.id}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p style={{ color: "rgba(255,255,255,0.8)" }}>Reported</p>
              <p className="font-semibold">{getTimeAgo(complaint.reportedAt)}</p>
            </div>
            <div>
              <p style={{ color: "rgba(255,255,255,0.8)" }}>Expected Resolution</p>
              <p className="font-semibold">{formatTime(complaint.estimatedCompletion)}</p>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Overall Progress</span>
              <span className="font-bold">{complaint.progress}%</span>
            </div>
            <Progress value={complaint.progress} className="h-3 bg-white/20" />
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>🕐 Status Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {complaint.timeline.map((step, index) => {
              const config = statusConfig[step.status];
              return (
                <div key={index} className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full ${config.bg} flex items-center justify-center`}>
                    <span className={`text-lg ${step.completed ? config.color : "text-gray-400"}`}>{step.completed ? "✓" : "○"}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${step.completed ? "text-gray-900" : "text-gray-500"}`}>{config.label}</h4>
                    <p className="text-sm text-gray-500">{step.time}</p>
                  </div>
                  {step.completed && <span className="text-emerald-500 text-lg">✓</span>}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Worker Details */}
      {complaint.status !== "submitted" && complaint.status !== "reviewed" && (
        <Card>
          <CardHeader>
            <CardTitle>🧭 Assigned Worker</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={complaint.worker.avatar || ""} alt={complaint.worker.name} />
                <AvatarFallback>
                  {complaint.worker.name.split(" ").map((n) => n[0]).join("")}
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
          </CardContent>
        </Card>
      )}

      {/* Feedback Section */}
      {complaint.status === "resolved" && !feedbackSubmitted && (
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardHeader>
            <CardTitle className="text-emerald-700">✅ Issue Resolved - Share Your Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            {!showFeedback ? (
              <div className="text-center py-4">
                <p className="text-gray-600 mb-4">
                  Great news! Your waste management issue has been resolved. Help us improve our service by sharing your experience.
                </p>
                <Button onClick={() => setShowFeedback(true)} className="bg-emerald-500 hover:bg-emerald-600">⭐ Rate Our Service</Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Rating Section */}
                <div className="text-center">
                  <h3 className="font-semibold text-lg mb-2">Rate the Service Quality</h3>
                  <p className="text-gray-600 text-sm mb-4">How satisfied are you with the resolution?</p>
                  <div className="flex justify-center space-x-2 mb-4">
                    {[1,2,3,4,5].map(star => (
                      <button key={star} onClick={() => setRating(star)} onMouseEnter={() => setHoveredRating(star)} onMouseLeave={() => setHoveredRating(0)} className="transition-transform hover:scale-110 text-2xl">
                        <span className={star <= (hoveredRating || rating) ? "text-yellow-400" : "text-gray-300"}>⭐</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Comments (Optional)</label>
                  <Textarea value={feedbackComment} onChange={(e) => setFeedbackComment(e.target.value)} placeholder="Share your experience..." />
                </div>
                <div className="flex space-x-3">
                  <Button onClick={handleFeedbackSubmit} disabled={rating===0} className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300">✅ Submit Feedback</Button>
                  <Button variant="outline" onClick={() => setShowFeedback(false)}>Skip</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Thank You Message */}
      {feedbackSubmitted && (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="text-center py-6">
            <div className="text-6xl mb-3">✅</div>
            <h3 className="font-semibold text-lg text-emerald-700 mb-2">Thank You for Your Feedback!</h3>
            <p className="text-gray-600">Your feedback helps us improve our services. We appreciate your time and trust in our service.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


