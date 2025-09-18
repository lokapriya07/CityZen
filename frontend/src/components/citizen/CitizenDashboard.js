
import React, { useState, useEffect, useCallback } from "react";
// Import necessary UI components
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { ComplaintTracker } from "./complaint-tracker";
import { ReportForm } from "./report-form";

// Configuration - adjust this to your backend's URL
const API_BASE_URL = "http://localhost:8001/api/reports";

// =========================================================================
// AUTH & API HELPER FUNCTIONS
// =========================================================================

const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Default worker object for unassigned complaints
const UNASSIGNED_WORKER = {
  name: "Not Assigned",
  phone: "",
  avatar: "",
  currentLocation: { lat: 0, lng: 0 }
};

/**
 * Fetches all reports for the logged-in user from the backend.
 */
const fetchComplaintsFromBackend = async () => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Authentication required. Please log in.");
  }

  const response = await fetch(API_BASE_URL, {
    method: "GET", // CORRECT METHOD: GET
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`, // Corrected spacing
    },
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    if (response.status === 401) {
      throw new Error("Session expired or token invalid. Please log in again.");
    }
    throw new Error(data.message || "Failed to fetch reports.");
  }

  // Map and transform the reports
  const reports = data.data.map(report => {
    // Logic to determine worker assignment based on status
    const isAssignedOrInProgress = ['assigned', 'in_progress', 'resolved'].includes(report.status);

    // 🚨 CORE CHANGE: Conditionally assign worker data 
    const workerData = isAssignedOrInProgress && report.worker
      ? report.worker // Use actual worker data if available in the backend response
      : UNASSIGNED_WORKER;

    return {
      // Core fields from the database
      id: report.complaintId,
      type: report.wasteType,
      location: report.address,
      status: report.status || 'submitted',
      progress: report.progress || 10,
      reportedAt: report.createdAt,

      // Mapped data for the UI
      estimatedCompletion: report.estimatedCompletion || "Pending Review",
      worker: workerData, // Apply conditional worker data
      timeline: report.timeline || [{
        status: 'submitted',
        time: new Date(report.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        completed: true
      }],
      ...report
    }
  });

  return reports;
};

/**
 * Submits a new complaint report to the backend.
 */
const submitComplaintToBackend = async (newComplaintData) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Authentication required. Please log in.");
  }

  const formData = new FormData();
  for (const key in newComplaintData) {
    if (newComplaintData[key] instanceof File) {
      formData.append(key, newComplaintData[key]);
    } else if (newComplaintData[key] !== null && newComplaintData[key] !== undefined) {
      formData.append(key, newComplaintData[key]);
    }
  }

  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`, // Corrected spacing
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    if (data.errors && Array.isArray(data.errors)) {
      throw new Error(`Validation Error: ${data.errors.map(e => e.msg).join(', ')}`);
    }
    throw new Error(data.message || "Failed to submit report.");
  }

  // Map the new report object returned from the backend to the frontend structure
  const newReport = data.data;
  return {
    id: newReport.complaintId,
    type: newReport.wasteType,
    location: newReport.address,
    status: newReport.status || 'submitted',
    progress: newReport.progress || 10,
    reportedAt: newReport.createdAt,
    estimatedCompletion: "Pending Review",
    // Set worker to UNASSIGNED_WORKER upon initial submission
    worker: UNASSIGNED_WORKER,
    timeline: [{ status: 'submitted', time: new Date(newReport.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), completed: true }],
    ...newReport
  };
};

// Simple StatCard component for the top row
const StatCard = ({ title, value, icon }) => (
  <Card className="shadow-lg">
    <CardContent className="p-5 flex justify-between items-center">
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className="text-3xl text-emerald-500 p-2 bg-emerald-50 rounded-lg">
        {icon}
      </div>
    </CardContent>
  </Card>
);
// =========================================================================


export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("track");
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchComplaints = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchComplaintsFromBackend();
      setComplaints(data);

      if (data.length > 0) {
        if (!selectedComplaint) {
          setSelectedComplaint(data[0]);
        } else {
          const freshComplaint = data.find(c => c.id === selectedComplaint.id);
          if (freshComplaint) setSelectedComplaint(freshComplaint);
        }
      } else {
        setSelectedComplaint(null);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch reports.");
      console.error("Fetch Error:", err);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchComplaints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReportSubmit = async (formData) => {
    try {
      setIsLoading(true);
      const newComplaint = await submitComplaintToBackend(formData);

      setComplaints((prevComplaints) => [newComplaint, ...prevComplaints]);
      setSelectedComplaint(newComplaint);

      setActiveTab("track");
      alert(`Report ${newComplaint.id} submitted successfully!`);
    } catch (err) {
      alert(`Submission Failed: ${err.message}`);
      console.error("Submission Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = {
    total: complaints.length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
    inProgress: complaints.filter((c) => c.status === "in_progress").length,
    // Pending = All complaints that are NOT resolved AND NOT in_progress
    pending: complaints.filter(
      (c) => c.status !== "resolved" && c.status !== "in_progress"
    ).length,
  };

  const getBadgeClass = (status) => {
    switch ((status || '').toLowerCase()) {
      case "resolved":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "in_progress":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-orange-100 text-orange-700 border-orange-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      <header className="bg-white/90 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900">WasteTrack</h1>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                {activeTab === 'track' ? (
                  <Button
                    onClick={() => setActiveTab("report")}
                    className="text-sm font-medium bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    ➕ New Report
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    onClick={() => setActiveTab("track")}
                    className="text-sm font-medium"
                  >
                    🏠 Home
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "track" ? (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard title="Total Reports" value={stats.total} icon="📝" />
              <StatCard title="Resolved" value={stats.resolved} icon="✅" />
              <StatCard title="In Progress" value={stats.inProgress} icon="🔄" />
              <StatCard title="Pending" value={stats.pending} icon="⏳" />
            </div>

            {/* Complaints List + ComplaintTracker */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Your Reports</h2>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                    {complaints.length} Active
                  </Badge>
                </div>

                {/* Loading/Error State */}
                {isLoading && (
                  <Card><CardContent className="p-6 text-center text-gray-500">Loading reports...</CardContent></Card>
                )}
                {error && !isLoading && (
                  <Card className="border-red-400 bg-red-50">
                    <CardContent className="p-6 text-center text-red-700">
                      <span className="font-bold">⚠️ {error}</span>
                      <Button variant="link" onClick={fetchComplaints} className="text-emerald-600 hover:text-emerald-700">Try Again</Button>
                    </CardContent>
                  </Card>
                )}
                {!isLoading && !error && complaints.length === 0 && (
                  <Card><CardContent className="p-6 text-center text-gray-500">No reports found. Report a new issue using the ➕ button!</CardContent></Card>
                )}

                {/* Complaints List */}
                <div className="space-y-4">
                  {complaints.map((complaint) => (
                    <Card
                      key={complaint.id}
                      className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${selectedComplaint && selectedComplaint.id === complaint.id
                          ? "ring-2 ring-emerald-500 shadow-xl bg-emerald-50/50"
                          : "hover:shadow-lg bg-white"
                        }`}
                      onClick={() => setSelectedComplaint(complaint)}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-lg">{complaint.type}</h3>
                            <p className="text-sm text-gray-500 flex items-center mt-2">📍 {complaint.location}</p>
                          </div>
                          <Badge
                            variant={
                              complaint.status === "resolved"
                                ? "default"
                                : complaint.status === "in_progress"
                                  ? "secondary"
                                  : "outline"
                            }
                            className={`capitalize font-medium ${getBadgeClass(complaint.status)}`}
                          >
                            {complaint.status.replace("_", " ")}
                          </Badge>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 font-medium">Progress</span>
                            <span className="font-bold text-emerald-600">{complaint.progress}%</span>
                          </div>
                          <Progress value={complaint.progress} className="h-3 bg-gray-100" />
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-500 font-medium">ID: {complaint.id}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(complaint.reportedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Complaint Tracker */}
              <div className="lg:col-span-2">
                {selectedComplaint ? (
                  // Pass the conditional worker data to the tracker
                  <ComplaintTracker complaint={selectedComplaint} />
                ) : (
                  <Card><CardContent className="p-6 text-center text-gray-500 h-full flex items-center justify-center min-h-[300px]">Select a report to view its details and timeline.</CardContent></Card>
                )}
              </div>
            </div>
          </div>
        ) : (
          <ReportForm onSubmit={handleReportSubmit} onCancel={() => setActiveTab("track")} />
        )}
      </main>
    </div>
  );
}
