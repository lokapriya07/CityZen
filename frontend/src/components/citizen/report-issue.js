import React, { useState } from "react";

export function ReportIssue({ complaint, onClose, onSubmit }) {
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const issueTypes = [
    "Worker not responding",
    "Wrong location",
    "Delayed service",
    "Quality issues",
    "Safety concerns",
    "Other"
  ];

  const handleSubmit = async () => {
    if (!issueType || !description.trim()) {
      alert("Please select an issue type and provide description");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Call the onSubmit prop if provided
      if (onSubmit) {
        await onSubmit({
          issueType,
          description,
          priority,
          complaintId: complaint.id,
          timestamp: new Date().toISOString()
        });
      }
      
      // Show success message
      alert("Issue reported successfully!");
      onClose();
    } catch (error) {
      console.error("Error reporting issue:", error);
      alert("Failed to report issue. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b bg-gradient-to-r from-orange-50 to-red-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-orange-600 text-lg">⚠️</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Report Issue</h3>
                <p className="text-xs text-gray-600">Complaint ID: {complaint.id}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-1 rounded"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
          {/* Issue Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issue Type *
            </label>
            <select
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
            >
              <option value="">Select issue type</option>
              {issueTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <div className="flex space-x-2">
              {[
                { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
                { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
                { value: "high", label: "High", color: "bg-red-100 text-red-800" }
              ].map((priorityOption) => (
                <button
                  key={priorityOption.value}
                  onClick={() => setPriority(priorityOption.value)}
                  className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                    priority === priorityOption.value
                      ? `${priorityOption.color} border-current`
                      : "bg-gray-100 text-gray-600 border-gray-300"
                  }`}
                >
                  {priorityOption.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Please describe the issue in detail..."
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              {description.length}/500 characters
            </p>
          </div>

          {/* Complaint Info */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Complaint Details</h4>
            <div className="space-y-1 text-xs text-gray-600">
              <p><span className="font-medium">Type:</span> {complaint.type}</p>
              <p><span className="font-medium">Location:</span> {complaint.location?.address || "Unknown"}</p>
              <p><span className="font-medium">Status:</span> {complaint.status}</p>
              {complaint.worker?.name && (
                <p><span className="font-medium">Worker:</span> {complaint.worker.name}</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-4">
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !issueType || !description.trim()}
              className="flex-1 py-2 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Reporting...
                </>
              ) : (
                "Report Issue"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}