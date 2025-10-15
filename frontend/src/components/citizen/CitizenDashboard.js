import React, { useState, useEffect, useCallback } from "react";
// Import necessary UI components
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { ComplaintTracker } from "./complaint-tracker";
import { ReportForm } from "./report-form";

// Configuration
const API_BASE_URL = "http://localhost:8001/api/reports";

// =========================================================================
// AUTH & API HELPER FUNCTIONS
// =========================================================================

const getAuthToken = () => {
    // CRITICAL FIX: Use 'authToken' to match what LoginForm.js saves.
    return localStorage.getItem("authToken");
};

const UNASSIGNED_WORKER = {
    name: "Not Assigned",
    phone: "",
    avatar: "",
    currentLocation: { lat: 0, lng: 0 }
};

const fetchComplaintsFromBackend = async () => {
    const token = getAuthToken();
    if (!token) {
        throw new Error("Authentication required. Please log in.");
    }

    const response = await fetch(API_BASE_URL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        if (response.status === 401) {
            window.location.href = '/login'; // Redirect if unauthorized
            throw new Error("Session expired. Please log in again.");
        }
        throw new Error(data.message || "Failed to fetch reports.");
    }

    return data.data.map(report => ({
        id: report.complaintId || report._id,
        type: report.wasteType,
        location: report.address, // 'address' from the API is the location object/string
        status: report.status || 'submitted',
        progress: report.progress || 10,
        reportedAt: report.createdAt,
        estimatedCompletion: report.estimatedCompletion || "Pending Review",
        worker: report.worker || UNASSIGNED_WORKER,
        timeline: report.timeline || [],
        ...report
    }));
};

// ... (submitComplaintToBackend function remains the same as the corrected one from before)
const submitComplaintToBackend = async (reportData) => {
    const token = getAuthToken();
    if (!token) {
        throw new Error("Authentication required. Please log in.");
    }
    const formData = new FormData();
    for (const key in reportData) {
        if (key === 'photos' && reportData.photos) {
            formData.append('images', reportData.photos);
        } else if (reportData[key] !== null && key !== 'photos') {
            formData.append(key, reportData[key]);
        }
    }
    const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData,
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
        if (data.errors && Array.isArray(data.errors)) {
            throw new Error(`Validation Error: ${data.errors.map(e => e.msg).join(', ')}`);
        }
        throw new Error(data.message || "Failed to submit report.");
    }
    const newReport = data.data;
    return {
        id: newReport.complaintId || newReport._id,
        type: newReport.wasteType,
        location: newReport.address,
        status: newReport.status || 'submitted',
        progress: 10,
        reportedAt: newReport.createdAt,
        estimatedCompletion: "Pending Review",
        worker: UNASSIGNED_WORKER,
        timeline: [{ status: 'submitted', time: new Date(newReport.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), completed: true }],
        ...newReport
    };
};


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
                setSelectedComplaint(data[0]);
            } else {
                setSelectedComplaint(null);
            }
        } catch (err) {
            setError(err.message || "Failed to fetch reports.");
            console.error("Fetch Error:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchComplaints();
    }, [fetchComplaints]);

    const handleReportSubmit = async (formData) => {
        try {
            const newComplaint = await submitComplaintToBackend(formData);
            setComplaints((prev) => [newComplaint, ...prev]);
            setSelectedComplaint(newComplaint);
            setActiveTab("track");
        } catch (err) {
            alert(`Submission Failed: ${err.message}`);
        }
    };

    const stats = {
        total: complaints.length,
        resolved: complaints.filter((c) => c.status === "resolved").length,
        inProgress: complaints.filter((c) => c.status === "in_progress").length,
        pending: complaints.filter((c) => !["resolved", "in_progress"].includes(c.status)).length,
    };

    const getBadgeClass = (status) => {
        switch ((status || '').toLowerCase()) {
            case "resolved": return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "in_progress": return "bg-blue-100 text-blue-700 border-blue-200";
            default: return "bg-orange-100 text-orange-700 border-orange-200";
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
                {activeTab === 'track' ? (
                    <Button onClick={() => setActiveTab("report")} className="text-sm font-medium bg-emerald-500 hover:bg-emerald-600 text-white">
                        ➕ New Report
                    </Button>
                ) : (
                    <Button variant="default" onClick={() => setActiveTab("track")} className="text-sm font-medium">
                        🏠 Home
                    </Button>
                )}
            </div>
            
            <div>
                {activeTab === "track" ? (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <StatCard title="Total Reports" value={stats.total} icon="📝" />
                            <StatCard title="Resolved" value={stats.resolved} icon="✅" />
                            <StatCard title="In Progress" value={stats.inProgress} icon="🔄" />
                            <StatCard title="Pending" value={stats.pending} icon="⏳" />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1 space-y-4">
                                {/* ... Reports List Header ... */}
                                {isLoading && <p>Loading...</p>}
                                {error && <p className="text-red-500">{error}</p>}
                                {!isLoading && !error &&
                                    complaints.map((complaint) => (
                                        <Card key={complaint.id} className={`cursor-pointer transition-all ${selectedComplaint?.id === complaint.id ? "ring-2 ring-emerald-500" : ""}`} onClick={() => setSelectedComplaint(complaint)}>
                                            <CardContent className="p-5">
                                                <div className="flex justify-between">
                                                    <h3 className="font-semibold">{complaint.type}</h3>
                                                    <Badge className={getBadgeClass(complaint.status)}>{complaint.status.replace("_", " ")}</Badge>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-2">
                                                    📍 {
                                                        // CRITICAL FIX: Properly check if location is an object before rendering.
                                                        (typeof complaint.location === "object" && complaint.location !== null)
                                                            ? complaint.location.address || `Coords: ${complaint.location.coordinates?.lat}, ${complaint.location.coordinates?.lng}`
                                                            : complaint.location || "Unknown location"
                                                    }
                                                </p>
                                                <Progress value={complaint.progress} className="mt-4 h-2" />
                                                <div className="flex justify-between text-xs text-gray-500 mt-2">
                                                    <span>ID: {complaint.id}</span>
                                                    <span>{new Date(complaint.reportedAt).toLocaleDateString()}</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                }
                            </div>
                            <div className="lg:col-span-2">
                                {selectedComplaint ? <ComplaintTracker complaint={selectedComplaint} /> : <p>Select a report to see details.</p>}
                            </div>
                        </div>
                    </div>
                ) : (
                    <ReportForm onSubmit={handleReportSubmit} onCancel={() => setActiveTab("track")} />
                )}
            </div>
        </div>
    );
}