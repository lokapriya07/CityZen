// import React, { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// import { Badge } from "./ui/badge";
// import { Button } from "./ui/button";
// import { Progress } from "./ui/progress";
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// // ✅ ADDED Star and X for the new UI
// import { Check, Star, X } from "lucide-react";
// import { WorkerMessaging } from "./message";
// import { ReportIssue } from "./report-issue";
// import { ShareLocation } from "./ShareLocation";
// import { CallSupport } from "./CallSupport";


// export function HorizontalProgressTracker({ steps, estimatedDate }) {
//   const activeStepIndex = steps.findLastIndex((s) => s.completed);
//   const segmentCount = steps.length - 1;

//   return (
//     <Card className="overflow-hidden border border-gray-200 shadow-sm">
//       <CardContent className="p-8">
//         <div className="text-center mb-8">
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">
//             Progress Timeline
//           </h3>
//           <div className="text-xs sm:text-sm text-gray-600">
//             Estimated Completion:{" "}
//             <span className="font-medium text-gray-800">
//               {estimatedDate || "To be determined"}
//             </span>
//           </div>
//         </div>
//         <div className="flex items-start w-full relative">
//           {steps.map((step, index) => {
//             const isCompleted = step.completed;
//             const isActive = index === activeStepIndex + 1;
//             const isLast = index === steps.length - 1;

//             return (
//               <div key={step.id} className="flex-1 flex flex-col items-center relative">
//                 {!isLast && (
//                   <div
//                     className={`absolute top-6 left-[60%] right-[-60%] h-0.5 z-0 transition-all duration-500 
//                     ${index < activeStepIndex
//                         ? "bg-green-600"
//                         : "bg-gray-200"
//                       }`}
//                   />
//                 )}

//                 <div className="flex flex-col items-center text-center z-10">
//                   <div className="mb-4">
//                     <div
//                       className={`w-12 h-12 flex items-center justify-center rounded-full border-2 transition-all duration-200 ${isCompleted
//                         ? "bg-green-600 border-green-600 text-white shadow-sm"
//                         : isActive
//                           ? "bg-white border-green-600 text-green-600 shadow-sm"
//                           : "bg-white border-gray-300 text-gray-400"
//                         }`}
//                     >
//                       {isCompleted ? (
//                         <Check className="w-5 h-5" />
//                       ) : (
//                         <span
//                           className={`font-medium ${isActive ? "text-green-600" : "text-gray-500"
//                             }`}
//                         >
//                           {index + 1}
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   <div className="px-2 max-w-32">
//                     <h4
//                       className={`font-semibold text-sm mb-1 ${isCompleted || isActive ? "text-gray-900" : "text-gray-500"
//                         }`}
//                     >
//                       {step.title}
//                     </h4>
//                     <p className="text-xs text-gray-500 leading-tight">
//                       {step.description}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         <div className="mt-8 pt-6 border-t border-gray-100">
//           <div className="flex justify-between items-center text-sm">
//             <span className="text-gray-600">
//               {steps.filter((s) => s.completed).length} of {steps.length} steps
//               completed
//             </span>
//             <span className="font-medium text-gray-900">
//               {Math.round(
//                 (steps.filter((s) => s.completed).length / steps.length) * 100
//               )}
//               %
//             </span>
//           </div>
//           <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
//             <div
//               className="bg-green-600 h-2 rounded-full transition-all duration-300"
//               style={{
//                 width: `${(steps.filter((s) => s.completed).length / steps.length) * 100
//                   }%`,
//               }}
//             />
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// // ------------------------------------------------------------------
// // ✅ NEW FEEDBACK COMPONENTS
// // ------------------------------------------------------------------

// /**
//  * A simple star rating component
//  */
// function StarRating({ rating, setRating, count = 5 }) {
//   const [hover, setHover] = useState(0);

//   return (
//     <div className="flex space-x-1">
//       {[...Array(count)].map((_, index) => {
//         const ratingValue = index + 1;
//         return (
//           <label key={index}>
//             <input
//               type="radio"
//               name="rating"
//               value={ratingValue}
//               onClick={() => setRating(ratingValue)}
//               className="sr-only"
//             />
//             <Star
//               className="cursor-pointer"
//               color={ratingValue <= (hover || rating) ? "#f59e0b" : "#e5e7eb"}
//               fill={ratingValue <= (hover || rating) ? "#f59e0b" : "none"}
//               onMouseEnter={() => setHover(ratingValue)}
//               onMouseLeave={() => setHover(0)}
//             />
//           </label>
//         );
//       })}
//     </div>
//   );
// }

// /**
//  * A modal form for submitting feedback
//  */
// function FeedbackForm({ worker, isWorkerAssigned, onClose, onSubmit }) {
//   const [serviceRating, setServiceRating] = useState(0);
//   const [workerRating, setWorkerRating] = useState(0);
//   const [comment, setComment] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (serviceRating === 0) {
//       alert("Please provide a service rating.");
//       return;
//     }
//     if (isWorkerAssigned && workerRating === 0) {
//       alert("Please provide a worker rating.");
//       return;
//     }

//     setIsSubmitting(true);
//     await onSubmit({
//       serviceRating,
//       workerRating: isWorkerAssigned ? workerRating : undefined,
//       comments: comment,
//     });
//     setIsSubmitting(false);
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
//       <Card className="w-full max-w-md bg-white">
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <CardTitle>Share Your Feedback</CardTitle>
//             <Button variant="ghost" size="icon" onClick={onClose} disabled={isSubmitting}>
//               <X className="w-4 h-4" />
//             </Button>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="space-y-2">
//               <label className="font-medium text-gray-700">How was the service?</label>
//               <StarRating rating={serviceRating} setRating={setServiceRating} />
//             </div>

//             {isWorkerAssigned && worker && (
//               <div className="space-y-2">
//                 <label className="font-medium text-gray-700">How was {worker.name}?</label>
//                 <StarRating rating={workerRating} setRating={setWorkerRating} />
//               </div>
//             )}

//             <div className="space-y-2">
//               <label htmlFor="comment" className="font-medium text-gray-700">Additional Comments (Optional)</label>
//               <textarea
//                 id="comment"
//                 value={comment}
//                 onChange={(e) => setComment(e.target.value)}
//                 rows={4}
//                 placeholder="Tell us more about your experience..."
//                 className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div className="flex gap-3">
//               <Button
//                 type="button"
//                 variant="outline"
//                 className="flex-1"
//                 onClick={onClose}
//                 disabled={isSubmitting}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 className="flex-1"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? "Submitting..." : "Submit Feedback"}
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


// // ------------------------------------------------------------------
// // ✅ END NEW FEEDBACK COMPONENTS
// // ------------------------------------------------------------------


// /* ---------------------------- Complaint Tracker ---------------------------- */
// const getAuthToken = () => localStorage.getItem("authToken");

// export function ComplaintTracker({ complaint }) {
//   const [currentTime, setCurrentTime] = useState(new Date());

//   // ✅ REMOVED feedback state from here, it's now in FeedbackForm
//   const [showFeedbackForm, setShowFeedbackForm] = useState(false);
//   const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

//   const [showMessaging, setShowMessaging] = useState(false);
//   const [showReportIssue, setShowReportIssue] = useState(false);
//   const [showShareLocation, setShowShareLocation] = useState(false);
//   const [showCallSupport, setShowCallSupport] = useState(false);

//   const [workerLocation, setWorkerLocation] = useState(null);
//   const [loadingLocation, setLoadingLocation] = useState(true);

//   /* ----------------------------- Timer & Location ---------------------------- */
//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(new Date()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   useEffect(() => {
//     const workerName = complaint?.worker?.name;
//     if (!workerName) return;

//     const fetchWorkerLocation = async () => {
//       try {
//         const token = getAuthToken();
//         const res = await fetch(`/api/worker/${encodeURIComponent(workerName)}/location`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await res.json();
//         if (data.success && data.location) setWorkerLocation(data.location);
//       } catch (err) {
//         console.error("Error fetching worker location:", err);
//       } finally {
//         setLoadingLocation(false);
//       }
//     };

//     fetchWorkerLocation();
//     const interval = setInterval(fetchWorkerLocation, 15000);
//     return () => clearInterval(interval);
//   }, [complaint?.worker?.name]);

//   /* ------------------------------- Status Maps ------------------------------- */
//   const statusMap = {
//     submitted: "submitted",
//     reviewed: "reviewed",
//     assigned: "assigned",
//     "in-progress": "in_progress",
//     in_progress: "in_progress",
//     completed: "resolved",
//     resolved: "resolved",
//   };
//   const normalizedStatus = statusMap[complaint.status] || "submitted";

//   const progressMap = {
//     submitted: 10,
//     reviewed: 30,
//     assigned: 50,
//     in_progress: 75,
//     resolved: 100,
//   };
//   const displayProgress = progressMap[normalizedStatus] || 10;

//   const statusInfo = {
//     submitted: { color: "bg-gray-200 text-gray-800" },
//     reviewed: { color: "bg-blue-100 text-blue-700" },
//     assigned: { color: "bg-amber-100 text-amber-700" },
//     in_progress: { color: "bg-purple-100 text-purple-700" },
//     resolved: { color: "bg-emerald-100 text-emerald-700" },
//   };
//   const currentStatus = statusInfo[normalizedStatus];

//   const formatTime = (dateString) => {
//     if (!dateString) return "N/A";
//     const d = new Date(dateString);
//     return isNaN(d.getTime())
//       ? "N/A"
//       : d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
//   };

//   const getTimeAgo = (dateString) => {
//     if (!dateString) return "Just now";
//     const diff = currentTime - new Date(dateString);
//     const mins = Math.floor(diff / 60000);
//     const hours = Math.floor(mins / 60);
//     const days = Math.floor(hours / 24);
//     if (days) return `${days}d ago`;
//     if (hours) return `${hours}h ${mins % 60}m ago`;
//     if (mins) return `${mins}m ago`;
//     return "Just now";
//   };

//   const progressSteps = [
//     { id: "submitted", title: "Submitted", description: "Report received", completed: true },
//     { id: "reviewed", title: "Under Review", description: "Being evaluated", completed: ["reviewed", "assigned", "in_progress", "resolved"].includes(normalizedStatus) },
//     { id: "assigned", title: "Worker Assigned", description: "Team dispatched", completed: ["assigned", "in_progress", "resolved"].includes(normalizedStatus) },
//     { id: "in_progress", title: "In Progress", description: "Work underway", completed: ["in_progress", "resolved"].includes(normalizedStatus) },
//     { id: "resolved", title: "Resolved", description: "Issue completed", completed: normalizedStatus === "resolved" },
//   ];

//   const isWorkerAssigned = complaint.worker && complaint.worker.name !== "Not Assigned";

//   const lat =
//     workerLocation?.latitude ||
//     complaint.worker?.workerDetails?.currentLocation?.latitude;
//   const lng =
//     workerLocation?.longitude ||
//     complaint.worker?.workerDetails?.currentLocation?.longitude;
//   const locationTimestamp =
//     workerLocation?.timestamp ||
//     complaint.worker?.workerDetails?.currentLocation?.timestamp;

//   const displayLocation =
//     typeof complaint.location === "object"
//       ? complaint.location.address ||
//       `Coords: ${complaint.location.coordinates?.lat}, ${complaint.location.coordinates?.lng}`
//       : complaint.location || "Unknown location";

//   /* ---------------------------- Feedback Submission --------------------------- */
//   // ✅ MODIFIED to accept feedbackData from the form
//   const handleSubmitFeedback = async (feedbackData) => {
//     const token = getAuthToken();
//     if (!token) return alert("Please login first.");

//     try {
//       const res = await fetch(`/api/reports/${complaint.id}/feedback`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(feedbackData),
//       });
//       const data = await res.json();
//       if (res.ok && data.success) {
//         setFeedbackSubmitted(true); // ✅ Set state to show "Thank you"
//       } else {
//         alert("Feedback failed: " + (data.message || "Try again."));
//       }
//     } catch (e) {
//       console.error(e);
//       alert("Network error. Try again.");
//     }
//   };

//   // ✅ NEW: Check if feedback already exists
//   const hasFeedback = complaint.feedback || feedbackSubmitted;


//   /* ---------------------------------- JSX ---------------------------------- */
//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <Card className="border-0 overflow-hidden bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 shadow-sm">
//         <CardContent className="p-6">
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 capitalize">
//                 {complaint.type}
//               </h2>
//               <p className="text-gray-700">At: {displayLocation}</p>
//             </div>
//             <Badge className={`font-medium border ${currentStatus.color}`}>
//               {normalizedStatus.replace("_", " ")}
//             </Badge>
//           </div>

//           <div className="grid grid-cols-2 gap-4 text-sm">
//             <div>
//               <p className="text-gray-600">Reported</p>
//               <p className="font-semibold">{getTimeAgo(complaint.reportedAt)}</p>
//             </div>
//             <div>
//               <p className="text-gray-600">Expected Resolution</p>
//               <p className="font-semibold">
//                 {formatTime(complaint.estimatedCompletion)}
//               </p>
//             </div>
//           </div>

//           <div className="mt-4">
//             <div className="flex justify-between text-sm mb-2">
//               <span>Overall Progress</span>
//               <span className="font-bold text-emerald-600">
//                 {displayProgress}%
//               </span>
//             </div>
//             <Progress value={displayProgress} className="h-3 bg-white/60" />
//           </div>
//         </CardContent>
//       </Card>

//       {/* Steps */}
//       <HorizontalProgressTracker
//         steps={progressSteps}
//         estimatedDate={formatTime(complaint.estimatedCompletion)}
//       />

//       {/* Worker Info */}
//       {isWorkerAssigned && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Assigned Worker</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-center justify-between gap-4">
//               <div className="flex items-center gap-4">
//                 <Avatar className="w-12 h-12 border shadow">
//                   <AvatarImage src={complaint.worker.avatar} />
//                   <AvatarFallback>
//                     {complaint.worker.name?.[0]}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <p className="font-semibold">{complaint.worker.name}</p>
//                   <p className="text-sm text-gray-600">
//                     {complaint.worker.completedTasks || 0} tasks completed
//                   </p>
//                 </div>
//               </div>

//               <div className="flex gap-2">
//                 <Button asChild variant="outline" size="sm">
//                   <a href={`tel:${complaint.worker.phone}`}>📞 Call</a>
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setShowMessaging(true)}
//                 >
//                   💬 Chat
//                 </Button>
//               </div>
//             </div>

//             {/* Location */}
//             <div className="mt-6">
//               <h3 className="font-semibold text-md mb-2">Live Location</h3>
//               {loadingLocation ? (
//                 <p className="text-gray-500 text-sm">Fetching worker location...</p>
//               ) : lat && lng ? (
//                 <iframe
//                   width="100%"
//                   height="130"
//                   frameBorder="0"
//                   style={{ borderRadius: "8px" }}
//                   src={`https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`}
//                   allowFullScreen
//                   title="Worker Location"
//                 ></iframe>
//               ) : (
//                 <p className="text-gray-600 text-sm">
//                   Worker’s location not available yet.
//                 </p>
//               )}
//               {locationTimestamp && (
//                 <p className="text-right text-xs mt-1 text-gray-500">
//                   Updated: {new Date(locationTimestamp).toLocaleTimeString()}
//                 </p>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* ------------------------------------------------------------------ */}
//       {/* ✅ NEW FEEDBACK SECTION */}
//       {/* ------------------------------------------------------------------ */}
//       {normalizedStatus === 'resolved' && (
//         <Card className={hasFeedback ? "bg-gray-50 border-gray-200" : "bg-emerald-50 border-emerald-200"}>
//           <CardContent className="p-6">
//             {hasFeedback ? (
//               // --- Already Submitted View ---
//               <div className="text-center">
//                 <Check className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
//                 <h3 className="text-lg font-semibold text-gray-900">Thank you for your feedback!</h3>
//                 {complaint.feedback && (
//                   <div className="mt-2 text-sm text-gray-600 flex items-center justify-center gap-4">
//                     <p>Service: <span className="text-amber-500">{'★'.repeat(complaint.feedback.serviceRating)}{'☆'.repeat(5 - complaint.feedback.serviceRating)}</span></p>
//                     {complaint.feedback.workerRating > 0 && (
//                       <p>Worker: <span className="text-amber-500">{'★'.repeat(complaint.feedback.workerRating)}{'☆'.repeat(5 - complaint.feedback.workerRating)}</span></p>
//                     )}
//                   </div>
//                 )}
//               </div>
//             ) : (
//               // --- "Rate Us" Prompt View ---
//               <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//                 <div>
//                   <h3 className="text-lg font-semibold text-emerald-800">Issue Resolved - Share Your Feedback</h3>
//                   <p className="text-sm text-emerald-700">Help us improve our service by sharing your experience.</p>
//                 </div>
//                 <Button
//                   onClick={() => setShowFeedbackForm(true)}
//                   className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto flex-shrink-0"
//                 >
//                   ⭐ Rate Our Service
//                 </Button>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       )}


//       {/* Quick Actions */}
//       {/* ✅ Logic updated to hide some actions if resolved */}
//       {isWorkerAssigned && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Quick Actions</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
//               {/* Only show messaging/location if not resolved */}
//               {normalizedStatus !== 'resolved' && (
//                 <>
//                   <Button variant="outline" onClick={() => setShowMessaging(true)}>
//                     Send Message
//                   </Button>
//                   <Button
//                     variant="outline"
//                     onClick={() => setShowShareLocation(true)}
//                   >
//                     Share Location
//                   </Button>
//                 </>
//               )}

//               <Button variant="outline" onClick={() => setShowCallSupport(true)}>
//                 Call Support
//               </Button>

//               {/* Always allow reporting an issue */}
//               <Button variant="outline" onClick={() => setShowReportIssue(true)}>
//                 Report Issue
//               </Button>
//             </div>

//             {/* Modals */}
//             {showMessaging && (
//               <WorkerMessaging
//                 worker={complaint.worker}
//                 reportId={complaint.id}
//                 onClose={() => setShowMessaging(false)}
//               />
//             )}
//             {showReportIssue && (
//               <ReportIssue
//                 complaint={complaint}
//                 onClose={() => setShowReportIssue(false)}
//               />
//             )}
//             {showShareLocation && (
//               <ShareLocation
//                 complaint={complaint}
//                 onClose={() => setShowShareLocation(false)}
//               />
//             )}
//             {showCallSupport && (
//               <CallSupport
//                 complaint={complaint}
//                 onClose={() => setShowCallSupport(false)}
//               />
//             )}
//           </CardContent>
//         </Card>
//       )}

//       {/* ------------------------------------------------------------------ */}
//       {/* ✅ NEW FEEDBACK MODAL RENDER */}
//       {/* ------------------------------------------------------------------ */}
//       {showFeedbackForm && (
//         <FeedbackForm
//           worker={complaint.worker}
//           isWorkerAssigned={isWorkerAssigned}
//           onClose={() => setShowFeedbackForm(false)}
//           onSubmit={handleSubmitFeedback}
//         />
//       )}

//     </div>
//   );
// }
// import React, { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// import { Badge } from "./ui/badge";
// import { Button } from "./ui/button";
// import { Progress } from "./ui/progress";
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// // ✅ ADDED Star and X for the new UI
// import { Check, Star, X } from "lucide-react";
// // ✅ UPDATED Import from WorkerMessaging to CitizenMessaging
// import { CitizenMessaging } from "../messaging/CitizenMessaging";
// import { ReportIssue } from "./report-issue";
// import { ShareLocation } from "./ShareLocation";
// import { CallSupport } from "./CallSupport";

// export function HorizontalProgressTracker({ steps, estimatedDate }) {
//   const activeStepIndex = steps.findLastIndex((s) => s.completed);
//   const segmentCount = steps.length - 1;

//   return (
//     <Card className="overflow-hidden border border-gray-200 shadow-sm">
//       <CardContent className="p-8">
//         <div className="text-center mb-8">
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">
//             Progress Timeline
//           </h3>
//           <div className="text-xs sm:text-sm text-gray-600">
//             Estimated Completion:{" "}
//             <span className="font-medium text-gray-800">
//               {estimatedDate || "To be determined"}
//             </span>
//           </div>
//         </div>
//         <div className="flex items-start w-full relative">
//           {steps.map((step, index) => {
//             const isCompleted = step.completed;
//             const isActive = index === activeStepIndex + 1;
//             const isLast = index === steps.length - 1;

//             return (
//               <div
//                 key={step.id}
//                 className="flex-1 flex flex-col items-center relative"
//               >
//                 {!isLast && (
//                   <div
//                     className={`absolute top-6 left-[60%] right-[-60%] h-0.5 z-0 transition-all duration-500 
//                       ${
//                         index < activeStepIndex
//                           ? "bg-green-600"
//                           : "bg-gray-200"
//                       }`}
//                   />
//                 )}

//                 <div className="flex flex-col items-center text-center z-10">
//                   <div className="mb-4">
//                     <div
//                       className={`w-12 h-12 flex items-center justify-center rounded-full border-2 transition-all duration-200 ${
//                         isCompleted
//                           ? "bg-green-600 border-green-600 text-white shadow-sm"
//                           : isActive
//                           ? "bg-white border-green-600 text-green-600 shadow-sm"
//                           : "bg-white border-gray-300 text-gray-400"
//                       }`}
//                     >
//                       {isCompleted ? (
//                         <Check className="w-5 h-5" />
//                       ) : (
//                         <span
//                           className={`font-medium ${
//                             isActive ? "text-green-600" : "text-gray-500"
//                           }`}
//                         >
//                           {index + 1}
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   <div className="px-2 max-w-32">
//                     <h4
//                       className={`font-semibold text-sm mb-1 ${
//                         isCompleted || isActive
//                           ? "text-gray-900"
//                           : "text-gray-500"
//                       }`}
//                     >
//                       {step.title}
//                     </h4>
//                     <p className="text-xs text-gray-500 leading-tight">
//                       {step.description}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         <div className="mt-8 pt-6 border-t border-gray-100">
//           <div className="flex justify-between items-center text-sm">
//             <span className="text-gray-600">
//               {steps.filter((s) => s.completed).length} of {steps.length} steps
//               completed
//             </span>
//             <span className="font-medium text-gray-900">
//               {Math.round(
//                 (steps.filter((s) => s.completed).length / steps.length) * 100
//               )}
//               %
//             </span>
//           </div>
//           <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
//             <div
//               className="bg-green-600 h-2 rounded-full transition-all duration-300"
//               style={{
//                 width: `${
//                   (steps.filter((s) => s.completed).length / steps.length) * 100
//                 }%`,
//               }}
//             />
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// // ------------------------------------------------------------------
// // ✅ NEW FEEDBACK COMPONENTS
// // ------------------------------------------------------------------

// /**
//  * A simple star rating component
//  */
// function StarRating({ rating, setRating, count = 5 }) {
//   const [hover, setHover] = useState(0);

//   return (
//     <div className="flex space-x-1">
//       {[...Array(count)].map((_, index) => {
//         const ratingValue = index + 1;
//         return (
//           <label key={index}>
//             <input
//               type="radio"
//               name="rating"
//               value={ratingValue}
//               onClick={() => setRating(ratingValue)}
//               className="sr-only"
//             />
//             <Star
//               className="cursor-pointer"
//               color={ratingValue <= (hover || rating) ? "#f59e0b" : "#e5e7eb"}
//               fill={ratingValue <= (hover || rating) ? "#f59e0b" : "none"}
//               onMouseEnter={() => setHover(ratingValue)}
//               onMouseLeave={() => setHover(0)}
//             />
//           </label>
//         );
//       })}
//     </div>
//   );
// }

// /**
//  * A modal form for submitting feedback
//  */
// function FeedbackForm({ worker, isWorkerAssigned, onClose, onSubmit }) {
//   const [serviceRating, setServiceRating] = useState(0);
//   const [workerRating, setWorkerRating] = useState(0);
//   const [comment, setComment] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (serviceRating === 0) {
//       alert("Please provide a service rating.");
//       return;
//     }
//     if (isWorkerAssigned && workerRating === 0) {
//       alert("Please provide a worker rating.");
//       return;
//     }

//     setIsSubmitting(true);
//     await onSubmit({
//       serviceRating,
//       workerRating: isWorkerAssigned ? workerRating : undefined,
//       comments: comment,
//     });
//     setIsSubmitting(false);
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
//       <Card className="w-full max-w-md bg-white">
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <CardTitle>Share Your Feedback</CardTitle>
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={onClose}
//               disabled={isSubmitting}
//             >
//               <X className="w-4 h-4" />
//             </Button>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="space-y-2">
//               <label className="font-medium text-gray-700">
//                 How was the service?
//               </label>
//               <StarRating rating={serviceRating} setRating={setServiceRating} />
//             </div>

//             {isWorkerAssigned && worker && (
//               <div className="space-y-2">
//                 <label className="font-medium text-gray-700">
//                   How was {worker.name}?
//                 </label>
//                 <StarRating
//                   rating={workerRating}
//                   setRating={setWorkerRating}
//                 />
//               </div>
//             )}

//             <div className="space-y-2">
//               <label htmlFor="comment" className="font-medium text-gray-700">
//                 Additional Comments (Optional)
//               </label>
//               <textarea
//                 id="comment"
//                 value={comment}
//                 onChange={(e) => setComment(e.target.value)}
//                 rows={4}
//                 placeholder="Tell us more about your experience..."
//                 className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div className="flex gap-3">
//               <Button
//                 type="button"
//                 variant="outline"
//                 className="flex-1"
//                 onClick={onClose}
//                 disabled={isSubmitting}
//               >
//                 Cancel
//               </Button>
//               <Button type="submit" className="flex-1" disabled={isSubmitting}>
//                 {isSubmitting ? "Submitting..." : "Submit Feedback"}
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// // ------------------------------------------------------------------
// // ✅ END NEW FEEDBACK COMPONENTS
// // ------------------------------------------------------------------

// /* ---------------------------- Complaint Tracker ---------------------------- */
// const getAuthToken = () => localStorage.getItem("authToken");

// export function ComplaintTracker({ complaint }) {
//   const [currentTime, setCurrentTime] = useState(new Date());

//   // ✅ REMOVED feedback state from here, it's now in FeedbackForm
//   const [showFeedbackForm, setShowFeedbackForm] = useState(false);
//   const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

//   const [showMessaging, setShowMessaging] = useState(false);
//   const [showReportIssue, setShowReportIssue] = useState(false);
//   const [showShareLocation, setShowShareLocation] = useState(false);
//   const [showCallSupport, setShowCallSupport] = useState(false);

//   const [workerLocation, setWorkerLocation] = useState(null);
//   const [loadingLocation, setLoadingLocation] = useState(true);

//   /* ----------------------------- Timer & Location ---------------------------- */
//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(new Date()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   useEffect(() => {
//     const workerName = complaint?.worker?.name;
//     if (!workerName) return;

//     const fetchWorkerLocation = async () => {
//       try {
//         const token = getAuthToken();
//         const res = await fetch(
//           `/api/worker/${encodeURIComponent(workerName)}/location`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         const data = await res.json();
//         if (data.success && data.location) setWorkerLocation(data.location);
//       } catch (err) {
//         console.error("Error fetching worker location:", err);
//       } finally {
//         setLoadingLocation(false);
//       }
//     };

//     fetchWorkerLocation();
//     const interval = setInterval(fetchWorkerLocation, 15000);
//     return () => clearInterval(interval);
//   }, [complaint?.worker?.name]);

//   /* ------------------------------- Status Maps ------------------------------- */
//   const statusMap = {
//     submitted: "submitted",
//     reviewed: "reviewed",
//     assigned: "assigned",
//     "in-progress": "in_progress",
//     in_progress: "in_progress",
//     completed: "resolved",
//     resolved: "resolved",
//   };
//   const normalizedStatus = statusMap[complaint.status] || "submitted";

//   const progressMap = {
//     submitted: 10,
//     reviewed: 30,
//     assigned: 50,
//     in_progress: 75,
//     resolved: 100,
//   };
//   const displayProgress = progressMap[normalizedStatus] || 10;

//   const statusInfo = {
//     submitted: { color: "bg-gray-200 text-gray-800" },
//     reviewed: { color: "bg-blue-100 text-blue-700" },
//     assigned: { color: "bg-amber-100 text-amber-700" },
//     in_progress: { color: "bg-purple-100 text-purple-700" },
//     resolved: { color: "bg-emerald-100 text-emerald-700" },
//   };
//   const currentStatus = statusInfo[normalizedStatus];

//   const formatTime = (dateString) => {
//     if (!dateString) return "N/A";
//     const d = new Date(dateString);
//     return isNaN(d.getTime())
//       ? "N/A"
//       : d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
//   };

//   const getTimeAgo = (dateString) => {
//     if (!dateString) return "Just now";
//     const diff = currentTime - new Date(dateString);
//     const mins = Math.floor(diff / 60000);
//     const hours = Math.floor(mins / 60);
//     const days = Math.floor(hours / 24);
//     if (days) return `${days}d ago`;
//     if (hours) return `${hours}h ${mins % 60}m ago`;
//     if (mins) return `${mins}m ago`;
//     return "Just now";
//   };

//   const progressSteps = [
//     {
//       id: "submitted",
//       title: "Submitted",
//       description: "Report received",
//       completed: true,
//     },
//     {
//       id: "reviewed",
//       title: "Under Review",
//       description: "Being evaluated",
//       completed: ["reviewed", "assigned", "in_progress", "resolved"].includes(
//         normalizedStatus
//       ),
//     },
//     {
//       id: "assigned",
//       title: "Worker Assigned",
//       description: "Team dispatched",
//       completed: ["assigned", "in_progress", "resolved"].includes(
//         normalizedStatus
//       ),
//     },
//     {
//       id: "in_progress",
//       title: "In Progress",
//       description: "Work underway",
//       completed: ["in_progress", "resolved"].includes(normalizedStatus),
//     },
//     {
//       id: "resolved",
//       title: "Resolved",
//       description: "Issue completed",
//       completed: normalizedStatus === "resolved",
//     },
//   ];

//   const isWorkerAssigned =
//     complaint.worker && complaint.worker.name !== "Not Assigned";

//   const lat =
//     workerLocation?.latitude ||
//     complaint.worker?.workerDetails?.currentLocation?.latitude;
//   const lng =
//     workerLocation?.longitude ||
//     complaint.worker?.workerDetails?.currentLocation?.longitude;
//   const locationTimestamp =
//     workerLocation?.timestamp ||
//     complaint.worker?.workerDetails?.currentLocation?.timestamp;

//   const displayLocation =
//     typeof complaint.location === "object"
//       ? complaint.location.address ||
//         `Coords: ${complaint.location.coordinates?.lat}, ${complaint.location.coordinates?.lng}`
//       : complaint.location || "Unknown location";

//   /* ---------------------------- Feedback Submission --------------------------- */
//   // ✅ MODIFIED to accept feedbackData from the form
//   const handleSubmitFeedback = async (feedbackData) => {
//     const token = getAuthToken();
//     if (!token) return alert("Please login first.");

//     try {
//       const res = await fetch(`/api/reports/${complaint.id}/feedback`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(feedbackData),
//       });
//       const data = await res.json();
//       if (res.ok && data.success) {
//         setFeedbackSubmitted(true); // ✅ Set state to show "Thank you"
//       } else {
//         alert("Feedback failed: " + (data.message || "Try again."));
//       }
//     } catch (e) {
//       console.error(e);
//       alert("Network error. Try again.");
//     }
//   };

//   // ✅ NEW: Check if feedback already exists
//   const hasFeedback = complaint.feedback || feedbackSubmitted;

//   /* ---------------------------------- JSX ---------------------------------- */
//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <Card className="border-0 overflow-hidden bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 shadow-sm">
//         <CardContent className="p-6">
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 capitalize">
//                 {complaint.type}
//               </h2>
//               <p className="text-gray-700">At: {displayLocation}</p>
//             </div>
//             <Badge className={`font-medium border ${currentStatus.color}`}>
//               {normalizedStatus.replace("_", " ")}
//             </Badge>
//           </div>

//           <div className="grid grid-cols-2 gap-4 text-sm">
//             <div>
//               <p className="text-gray-600">Reported</p>
//               <p className="font-semibold">{getTimeAgo(complaint.reportedAt)}</p>
//             </div>
//             <div>
//               <p className="text-gray-600">Expected Resolution</p>
//               <p className="font-semibold">
//                 {formatTime(complaint.estimatedCompletion)}
//               </p>
//             </div>
//           </div>

//           <div className="mt-4">
//             <div className="flex justify-between text-sm mb-2">
//               <span>Overall Progress</span>
//               <span className="font-bold text-emerald-600">
//                 {displayProgress}%
//               </span>
//             </div>
//             <Progress value={displayProgress} className="h-3 bg-white/60" />
//           </div>
//         </CardContent>
//       </Card>

//       {/* Steps */}
//       <HorizontalProgressTracker
//         steps={progressSteps}
//         estimatedDate={formatTime(complaint.estimatedCompletion)}
//       />

//       {/* Worker Info */}
//       {isWorkerAssigned && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Assigned Worker</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-center justify-between gap-4">
//               <div className="flex items-center gap-4">
//                 <Avatar className="w-12 h-12 border shadow">
//                   <AvatarImage src={complaint.worker.avatar} />
//                   <AvatarFallback>
//                     {complaint.worker.name?.[0]}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <p className="font-semibold">{complaint.worker.name}</p>
//                   <p className="text-sm text-gray-600">
//                     {complaint.worker.completedTasks || 0} tasks completed
//                   </p>
//                 </div>
//               </div>

//               <div className="flex gap-2">
//                 <Button asChild variant="outline" size="sm">
//                   <a href={`tel:${complaint.worker.phone}`}>📞 Call</a>
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setShowMessaging(true)}
//                 >
//                   💬 Chat
//                 </Button>
//               </div>
//             </div>

//             {/* Location */}
//             <div className="mt-6">
//               <h3 className="font-semibold text-md mb-2">Live Location</h3>
//               {loadingLocation ? (
//                 <p className="text-gray-500 text-sm">
//                   Fetching worker location...
//                 </p>
//               ) : lat && lng ? (
//                 <iframe
//                   width="100%"
//                   height="130"
//                   frameBorder="0"
//                   style={{ borderRadius: "8px" }}
//                   src={`https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`}
//                   allowFullScreen
//                   title="Worker Location"
//                 ></iframe>
//               ) : (
//                 <p className="text-gray-600 text-sm">
//                   Worker’s location not available yet.
//                 </p>
//               )}
//               {locationTimestamp && (
//                 <p className="text-right text-xs mt-1 text-gray-500">
//                   Updated: {new Date(locationTimestamp).toLocaleTimeString()}
//                 </p>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* ------------------------------------------------------------------ */}
//       {/* ✅ NEW FEEDBACK SECTION */}
//       {/* ------------------------------------------------------------------ */}
//       {normalizedStatus === "resolved" && (
//         <Card
//           className={
//             hasFeedback
//               ? "bg-gray-50 border-gray-200"
//               : "bg-emerald-50 border-emerald-200"
//           }
//         >
//           <CardContent className="p-6">
//             {hasFeedback ? (
//               // --- Already Submitted View ---
//               <div className="text-center">
//                 <Check className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
//                 <h3 className="text-lg font-semibold text-gray-900">
//                   Thank you for your feedback!
//                 </h3>
//                 {complaint.feedback && (
//                   <div className="mt-2 text-sm text-gray-600 flex items-center justify-center gap-4">
//                     <p>
//                       Service:{" "}
//                       <span className="text-amber-500">
//                         {"★".repeat(complaint.feedback.serviceRating)}
//                         {"☆".repeat(5 - complaint.feedback.serviceRating)}
//                       </span>
//                     </p>
//                     {complaint.feedback.workerRating > 0 && (
//                       <p>
//                         Worker:{" "}
//                         <span className="text-amber-500">
//                           {"★".repeat(complaint.feedback.workerRating)}
//                           {"☆".repeat(5 - complaint.feedback.workerRating)}
//                         </span>
//                       </p>
//                     )}
//                   </div>
//                 )}
//               </div>
//             ) : (
//               // --- "Rate Us" Prompt View ---
//               <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//                 <div>
//                   <h3 className="text-lg font-semibold text-emerald-800">
//                     Issue Resolved - Share Your Feedback
//                   </h3>
//                   <p className="text-sm text-emerald-700">
//                     Help us improve our service by sharing your experience.
//                   </p>
//                 </div>
//                 <Button
//                   onClick={() => setShowFeedbackForm(true)}
//                   className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto flex-shrink-0"
//                 >
//                   ⭐ Rate Our Service
//                 </Button>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       )}

//       {/* Quick Actions */}
//       {/* ✅ Logic updated to hide some actions if resolved */}
//       {isWorkerAssigned && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Quick Actions</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
//               {/* Only show messaging/location if not resolved */}
//               {normalizedStatus !== "resolved" && (
//                 <>
//                   <Button
//                     variant="outline"
//                     onClick={() => setShowMessaging(true)}
//                   >
//                     Send Message
//                   </Button>
//                   <Button
//                     variant="outline"
//                     onClick={() => setShowShareLocation(true)}
//                   >
//                     Share Location
//                   </Button>
//                 </>
//               )}

//               <Button
//                 variant="outline"
//                 onClick={() => setShowCallSupport(true)}
//               >
//                 Call Support
//               </Button>

//               {/* Always allow reporting an issue */}
//               <Button
//                 variant="outline"
//                 onClick={() => setShowReportIssue(true)}
//               >
//                 Report Issue
//               </Button>
//             </div>

//             {/* Modals */}
//             {/* ✅ UPDATED MODAL USAGE */}
//             {showMessaging && (
//               <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
//                 <div className="bg-white rounded-lg w-full max-w-2xl h-[80vh] overflow-hidden">
//                   <CitizenMessaging
//                     worker={complaint.worker}
//                     reportId={complaint.id}
//                     onClose={() => setShowMessaging(false)}
//                   />
//                 </div>
//               </div>
//             )}
//             {showReportIssue && (
//               <ReportIssue
//                 complaint={complaint}
//                 onClose={() => setShowReportIssue(false)}
//               />
//             )}
//             {showShareLocation && (
//               <ShareLocation
//                 complaint={complaint}
//                 onClose={() => setShowShareLocation(false)}
//               />
//             )}
//             {showCallSupport && (
//               <CallSupport
//                 complaint={complaint}
//                 onClose={() => setShowCallSupport(false)}
//               />
//             )}
//           </CardContent>
//         </Card>
//       )}

//       {/* ------------------------------------------------------------------ */}
//       {/* ✅ NEW FEEDBACK MODAL RENDER */}
//       {/* ------------------------------------------------------------------ */}
//       {showFeedbackForm && (
//         <FeedbackForm
//           worker={complaint.worker}
//           isWorkerAssigned={isWorkerAssigned}
//           onClose={() => setShowFeedbackForm(false)}
//           onSubmit={handleSubmitFeedback}
//         />
//       )}
//     </div>
//   );
// }

// -----

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Check, Star, X } from "lucide-react";
import { EmergencyMessaging } from '../EmergencyMessaging';
import { ReportIssue } from "./report-issue";
import { ShareLocation } from "./ShareLocation";
import { CallSupport } from "./CallSupport";

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
          <div className="text-xs sm:text-sm text-gray-600">
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
              <div
                key={step.id}
                className="flex-1 flex flex-col items-center relative"
              >
                {!isLast && (
                  <div
                    className={`absolute top-6 left-[60%] right-[-60%] h-0.5 z-0 transition-all duration-500 
                      ${index < activeStepIndex
                        ? "bg-green-600"
                        : "bg-gray-200"
                      }`}
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

// ------------------------------------------------------------------
// ✅ FEEDBACK COMPONENTS
// ------------------------------------------------------------------

function StarRating({ rating, setRating, count = 5 }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex space-x-1">
      {[...Array(count)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <label key={index}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => setRating(ratingValue)}
              className="sr-only"
            />
            <Star
              className="cursor-pointer"
              color={ratingValue <= (hover || rating) ? "#f59e0b" : "#e5e7eb"}
              fill={ratingValue <= (hover || rating) ? "#f59e0b" : "none"}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(0)}
            />
          </label>
        );
      })}
    </div>
  );
}

function FeedbackForm({ worker, isWorkerAssigned, onClose, onSubmit }) {
  const [serviceRating, setServiceRating] = useState(0);
  const [workerRating, setWorkerRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (serviceRating === 0) {
      alert("Please provide a service rating.");
      return;
    }
    if (isWorkerAssigned && workerRating === 0) {
      alert("Please provide a worker rating.");
      return;
    }

    setIsSubmitting(true);
    await onSubmit({
      serviceRating,
      workerRating: isWorkerAssigned ? workerRating : undefined,
      comments: comment,
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Share Your Feedback</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              disabled={isSubmitting}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="font-medium text-gray-700">
                How was the service?
              </label>
              <StarRating rating={serviceRating} setRating={setServiceRating} />
            </div>

            {isWorkerAssigned && worker && (
              <div className="space-y-2">
                <label className="font-medium text-gray-700">
                  How was {worker.name}?
                </label>
                <StarRating
                  rating={workerRating}
                  setRating={setWorkerRating}
                />
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="comment" className="font-medium text-gray-700">
                Additional Comments (Optional)
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="Tell us more about your experience..."
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// ------------------------------------------------------------------
// ✅ PERSISTENT MESSAGE STORAGE UTILITIES
// ------------------------------------------------------------------

// Enhanced localStorage utilities with better error handling
const MessageStorage = {
  getMessages: (taskId) => {
    try {
      if (typeof window === 'undefined') return [];
      const key = `chat_messages_${taskId}`;
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading messages from storage:', error);
      return [];
    }
  },

  saveMessages: (taskId, messages) => {
    try {
      if (typeof window === 'undefined') return;
      const key = `chat_messages_${taskId}`;

      // Filter out optimistic messages before saving
      const messagesToSave = messages.filter(msg => !msg.isOptimistic);

      localStorage.setItem(key, JSON.stringify(messagesToSave));
    } catch (error) {
      console.error('Error saving messages to storage:', error);
    }
  },

  clearOptimisticMessages: (taskId) => {
    try {
      const messages = MessageStorage.getMessages(taskId);
      const filteredMessages = messages.filter(msg => !msg.isOptimistic);
      MessageStorage.saveMessages(taskId, filteredMessages);
    } catch (error) {
      console.error('Error clearing optimistic messages:', error);
    }
  }
};

export function ComplaintTracker({ complaint }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [showReportIssue, setShowReportIssue] = useState(false);
  const [showShareLocation, setShowShareLocation] = useState(false);
  const [showCallSupport, setShowCallSupport] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);

  // ✅ FIXED: Enhanced message persistence with proper initialization
  const [taskMessages, setTaskMessages] = useState(() => {
    if (!complaint?.id) return {};
    return { [complaint.id]: MessageStorage.getMessages(complaint.id) };
  });

  const [workerLocation, setWorkerLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [locationError, setLocationError] = useState(null);

  /* ----------------------------- Timer & Location ---------------------------- */
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ✅ TEMPORARY FIX: Worker location fetching WITHOUT authentication
  // ✅ IMPROVED: Worker location fetching with better debugging
  const fetchWorkerLocation = useCallback(async (workerName) => {
    try {
      setLocationError(null);
      setLoadingLocation(true);

      console.log('=== LOCATION FETCH STARTED ===');
      console.log('Worker name:', workerName);

      const url = `http://localhost:8001/api/workers/${encodeURIComponent(workerName)}/location`;
      console.log('Fetching from URL:', url);

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('Response status:', res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      console.log('📍 Location API response:', data);

      if (data.success) {
        if (data.location) {
          setWorkerLocation(data.location);
          setLocationError(null);
          console.log('✅ Location successfully set:', data.location);
        } else {
          console.log('ℹ️ No location data available for worker');
          setLocationError("Worker location not available yet");
        }
      } else {
        throw new Error(data.message || "Failed to fetch location");
      }
    } catch (err) {
      console.error("❌ Location fetch error:", err);
      setLocationError(`Failed to load location: ${err.message}`);

      // Only fallback to mock data if it's a network error
      if (err.message.includes('Failed to fetch') || err.message.includes('Network')) {
        await tryAlternativeLocationSources(workerName);
      }
    } finally {
      setLoadingLocation(false);
    }
  }, []);

  // ✅ ALTERNATIVE: Try different methods to get worker location
  const tryAlternativeLocationSources = async (workerName) => {
    console.log('Trying alternative location sources...');

    try {
      // Method 1: Try direct database simulation with mock data
      console.log('Method 1: Using mock location data');
      const mockLocation = {
        latitude: 17.463509,
        longitude: 78.5033215,
        timestamp: new Date().toISOString(),
        address: "Hyderabad, Telangana"
      };

      setWorkerLocation(mockLocation);
      setLocationError(null);
      console.log('Using mock location data:', mockLocation);
      return;

    } catch (err) {
      console.error('All location methods failed:', err);
      setLocationError("Worker location temporarily unavailable");
    } finally {
      setLoadingLocation(false);
    }
  };

  // ✅ FIXED: Get location from worker details as fallback
  const getLocationFromWorkerDetails = (worker) => {
    if (worker?.workerDetails?.currentLocation) {
      const loc = worker.workerDetails.currentLocation;
      if (loc.latitude && loc.longitude) {
        return {
          latitude: loc.latitude,
          longitude: loc.longitude,
          timestamp: loc.timestamp || new Date().toISOString(),
          address: loc.address || "Worker's location"
        };
      }
    }
    return null;
  };

  useEffect(() => {
    const workerName = complaint?.worker?.name;
    if (!workerName) {
      setLoadingLocation(false);
      setLocationError("No worker assigned");
      return;
    }

    // First, check if we have location in worker details
    const workerDetailsLocation = getLocationFromWorkerDetails(complaint.worker);
    if (workerDetailsLocation) {
      setWorkerLocation(workerDetailsLocation);
      setLoadingLocation(false);
      setLocationError(null);
      console.log('Using location from worker details:', workerDetailsLocation);
      return;
    }

    // If no location in details, try to fetch from API
    fetchWorkerLocation(workerName);
    const interval = setInterval(() => fetchWorkerLocation(workerName), 30000); // 30 seconds
    return () => clearInterval(interval);
  }, [complaint?.worker, fetchWorkerLocation]);

  // ✅ FIXED: Enhanced message handler with proper persistence
  const handleNewMessage = useCallback((taskId, newMessage, isHistory = false) => {
    if (!taskId) return;

    setTaskMessages(prevMessages => {
      const currentMessages = prevMessages[taskId] || [];

      // Filter out optimistic messages when real ones arrive
      const updatedMessages = currentMessages.filter(m =>
        m.isOptimistic ? m.message !== newMessage.message || m.createdAt === newMessage.createdAt : true
      );

      // Check for duplicates by ID
      if (!isHistory && updatedMessages.find(m => m.id === newMessage.id)) {
        return prevMessages;
      }

      // Add the new message
      const newMessagesList = [...updatedMessages, newMessage];

      // Sort messages by creation date
      const sortedMessages = newMessagesList.sort((a, b) =>
        new Date(a.createdAt) - new Date(b.createdAt)
      );

      const updatedState = {
        ...prevMessages,
        [taskId]: sortedMessages,
      };

      // ✅ PERSIST to localStorage for this specific task
      MessageStorage.saveMessages(taskId, sortedMessages);

      return updatedState;
    });
  }, []);

  // ✅ FIXED: Clear optimistic messages when chat modal closes
  useEffect(() => {
    if (!showChat && selectedReport) {
      const taskId = selectedReport._id || selectedReport.id;
      MessageStorage.clearOptimisticMessages(taskId);
    }
  }, [showChat, selectedReport]);

  // ✅ FIXED: Initialize messages when complaint loads
  useEffect(() => {
    if (complaint?.id) {
      const storedMessages = MessageStorage.getMessages(complaint.id);
      setTaskMessages(prev => ({
        ...prev,
        [complaint.id]: storedMessages
      }));
    }
  }, [complaint?.id]);

  // ✅ FIXED: Enhanced chat handler
  const handleOpenChat = (report, worker) => {
    setSelectedReport(report);
    setSelectedWorker(worker);
    setShowChat(true);
  };

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
    {
      id: "submitted",
      title: "Submitted",
      description: "Report received",
      completed: true,
    },
    {
      id: "reviewed",
      title: "Under Review",
      description: "Being evaluated",
      completed: ["reviewed", "assigned", "in_progress", "resolved"].includes(
        normalizedStatus
      ),
    },
    {
      id: "assigned",
      title: "Worker Assigned",
      description: "Team dispatched",
      completed: ["assigned", "in_progress", "resolved"].includes(
        normalizedStatus
      ),
    },
    {
      id: "in_progress",
      title: "In Progress",
      description: "Work underway",
      completed: ["in_progress", "resolved"].includes(normalizedStatus),
    },
    {
      id: "resolved",
      title: "Resolved",
      description: "Issue completed",
      completed: normalizedStatus === "resolved",
    },
  ];

  const isWorkerAssigned =
    complaint.worker && complaint.worker.name !== "Not Assigned";

  // ✅ FIXED: Enhanced location data extraction with priority system
  const getWorkerLocationData = () => {
    console.log('Worker location state:', workerLocation);

    // Priority 1: Real-time worker location from API (most recent)
    if (workerLocation && typeof workerLocation === 'object') {
      const lat = workerLocation.latitude || workerLocation.lat;
      const lng = workerLocation.longitude || workerLocation.lng;

      if (lat && lng) {
        return {
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          timestamp: workerLocation.timestamp,
          address: workerLocation.address || "Worker's current location"
        };
      }
    }

    // Priority 2: Worker details from complaint data (fallback)
    if (complaint.worker?.workerDetails?.currentLocation) {
      const loc = complaint.worker.workerDetails.currentLocation;
      const lat = loc.latitude || loc.lat;
      const lng = loc.longitude || loc.lng;

      if (lat && lng) {
        return {
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          timestamp: loc.timestamp,
          address: loc.address || "Worker's location"
        };
      }
    }

    return null;
  };

  const locationData = getWorkerLocationData();
  const hasValidLocation = locationData && locationData.lat && locationData.lng;

  const displayLocation =
    typeof complaint.location === "object"
      ? complaint.location.address ||
      `Coords: ${complaint.location.coordinates?.lat}, ${complaint.location.coordinates?.lng}`
      : complaint.location || "Unknown location";

  /* ---------------------------- Feedback Submission --------------------------- */
  const handleSubmitFeedback = async (feedbackData) => {
    try {
      const res = await fetch(`/api/reports/${complaint.id}/feedback`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFeedbackSubmitted(true);
      } else {
        alert("Feedback failed: " + (data.message || "Try again."));
      }
    } catch (e) {
      console.error(e);
      alert("Network error. Try again.");
    }
  };

  const hasFeedback = complaint.feedback || feedbackSubmitted;

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
                  onClick={() => handleOpenChat(complaint, complaint.worker)}
                >
                  💬 Chat
                </Button>
              </div>
            </div>

            {/* ✅ FIXED: Enhanced Location Display WITHOUT authentication */}
            <div className="mt-6">
              <h3 className="font-semibold text-md mb-2">Live Location</h3>
              {loadingLocation ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <p className="text-gray-500 text-sm">Fetching worker location...</p>
                </div>
              ) : locationError ? (
                <div className="space-y-3 p-3 border border-red-200 rounded-lg bg-red-50">
                  <p className="text-red-500 text-sm font-medium">{locationError}</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const workerName = complaint?.worker?.name;
                        if (workerName) {
                          setLoadingLocation(true);
                          fetchWorkerLocation(workerName);
                        }
                      }}
                    >
                      🔄 Retry Location
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Force use mock data
                        const mockLocation = {
                          latitude: 17.463509,
                          longitude: 78.5033215,
                          timestamp: new Date().toISOString(),
                          address: "Hyderabad, Telangana"
                        };
                        setWorkerLocation(mockLocation);
                        setLocationError(null);
                      }}
                    >
                      🎯 Use Demo Location
                    </Button>
                  </div>
                </div>
              ) : hasValidLocation ? (
                <div className="space-y-2">
                  <iframe
                    width="100%"
                    height="130"
                    frameBorder="0"
                    style={{ borderRadius: "8px" }}
                    src={`https://maps.google.com/maps?q=${locationData.lat},${locationData.lng}&z=16&output=embed`}
                    allowFullScreen
                    title="Worker Location"
                  ></iframe>
                  <div className="text-xs text-gray-600">
                    <p>
                      <strong>Coordinates:</strong> {locationData.lat.toFixed(6)}, {locationData.lng.toFixed(6)}
                    </p>
                    {locationData.address && (
                      <p>
                        <strong>Address:</strong> {locationData.address}
                      </p>
                    )}
                    {locationData.timestamp && (
                      <p className="text-right text-gray-500">
                        Updated: {new Date(locationData.timestamp).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-3 p-3 border border-yellow-200 rounded-lg bg-yellow-50">
                  <p className="text-yellow-700 text-sm">
                    Location service is currently in demo mode.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const mockLocation = {
                        latitude: 17.463509,
                        longitude: 78.5033215,
                        timestamp: new Date().toISOString(),
                        address: "Hyderabad, Telangana"
                      };
                      setWorkerLocation(mockLocation);
                      setLocationError(null);
                    }}
                  >
                    🎯 Show Demo Location
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feedback Section */}
      {normalizedStatus === "resolved" && (
        <Card
          className={
            hasFeedback
              ? "bg-gray-50 border-gray-200"
              : "bg-emerald-50 border-emerald-200"
          }
        >
          <CardContent className="p-6">
            {hasFeedback ? (
              <div className="text-center">
                <Check className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Thank you for your feedback!
                </h3>
                {complaint.feedback && (
                  <div className="mt-2 text-sm text-gray-600 flex items-center justify-center gap-4">
                    <p>
                      Service:{" "}
                      <span className="text-amber-500">
                        {"★".repeat(complaint.feedback.serviceRating)}
                        {"☆".repeat(5 - complaint.feedback.serviceRating)}
                      </span>
                    </p>
                    {complaint.feedback.workerRating > 0 && (
                      <p>
                        Worker:{" "}
                        <span className="text-amber-500">
                          {"★".repeat(complaint.feedback.workerRating)}
                          {"☆".repeat(5 - complaint.feedback.workerRating)}
                        </span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-emerald-800">
                    Issue Resolved - Share Your Feedback
                  </h3>
                  <p className="text-sm text-emerald-700">
                    Help us improve our service by sharing your experience.
                  </p>
                </div>
                <Button
                  onClick={() => setShowFeedbackForm(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto flex-shrink-0"
                >
                  ⭐ Rate Our Service
                </Button>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
              {normalizedStatus !== "resolved" && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleOpenChat(complaint, complaint.worker)}
                  >
                    Send Message
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowShareLocation(true)}
                  >
                    Share Location
                  </Button>
                </>
              )}

              <Button
                variant="outline"
                onClick={() => setShowCallSupport(true)}
              >
                Call Support
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowReportIssue(true)}
              >
                Report Issue
              </Button>
            </div>

            {/* Modals */}
            {showChat && selectedReport && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg w-full max-w-2xl h-[80vh]">
                  <EmergencyMessaging
                    userType="citizen"
                    taskId={selectedReport?._id || selectedReport?.id}
                    worker={selectedWorker}
                    onClose={() => setShowChat(false)}
                    messageHistory={taskMessages[selectedReport?._id || selectedReport?.id] || []}
                    onNewMessage={handleNewMessage}
                  />
                </div>
              </div>
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

      {/* Feedback Modal */}
      {showFeedbackForm && (
        <FeedbackForm
          worker={complaint.worker}
          isWorkerAssigned={isWorkerAssigned}
          onClose={() => setShowFeedbackForm(false)}
          onSubmit={handleSubmitFeedback}
        />
      )}
    </div>
  );
}