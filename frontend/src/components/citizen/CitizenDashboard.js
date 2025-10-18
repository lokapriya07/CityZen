import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ComplaintTracker } from "./complaint-tracker";
import {ReportForm } from  "./report-form";
import Reward from "./rewards";




const API_BASE_URL = "http://localhost:8001/api/reports";

// =========================================================================
// AUTH & API HELPER FUNCTIONS
// =========================================================================
const getAuthToken = () => {
    return localStorage.getItem("authToken");
};

const fetchApi = async (url, options = {}) => {
    const token = getAuthToken();
    if (!token) throw new Error("Authentication required. Please log in.");

    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json" 
        },
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
        if (response.status === 401) window.location.href = '/login';
        throw new Error(data.message || "An API error occurred.");
    }
    return data;
};

const calculateProgress = (status) => {
    switch (status) {
        case 'submitted': return 10;
        case 'pending': return 25;
        case 'assigned': return 50;
        case 'in-progress': case 'on-the-way': case 'accepted': return 75;
        case 'completed': return 100;
        default: return 0;
    }
};

const StatCard = ({ title, value, icon }) => (
    <Card className="shadow-sm">
        <CardContent className="p-5 flex justify-between items-center">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-3xl font-bold text-gray-800">{value}</p>
            </div>
            <div className="text-3xl p-3 bg-gray-100 rounded-lg">
                {icon}
            </div>
        </CardContent>
    </Card>
);

export default function CitizenDashboard() {
    const [activeTab, setActiveTab] = useState("track");
    const [complaints, setComplaints] = useState([]);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const fetchComplaints = useCallback(async () => {
        setIsLoading(true);
        setError(null); 
        try {
            // This URL fetches all reports for the user
            const responseData = await fetchApi(API_BASE_URL); 
            
            // ✅ THIS IS THE CRITICAL FIX ✅
            // Your API sends 'assignedWorker'. We must read it here.
            const mappedData = responseData.data.map(report => {
                
                // This 'report.assignedWorker' comes from your API call
                const workerDataFromApi = report.assignedWorker; 
                
                return {
                    id: report._id, 
                    complaintId: report.complaintId, 
                    type: report.wasteType,
                    location: report.location, 
                    status: report.status || 'pending',
                    progress: calculateProgress(report.status),
                    reportedAt: report.createdAt,
                    estimatedCompletion: report.estimatedCompletion || "Pending Review",
                    timeline: report.timeline || [],
                    
                    // Here, we format the worker data for the ComplaintTracker
                    worker: workerDataFromApi ? {
                        name: workerDataFromApi.name || "Not Assigned",
                        avatar: workerDataFromApi.avatarUrl || workerDataFromApi.avatar,
                        contact: workerDataFromApi.contact || workerDataFromApi.phone,
                        rating: workerDataFromApi.rating,
                        completedTasks: workerDataFromApi.completedTasks,
                        location: {
                            currentAddress: workerDataFromApi.currentLocation?.address,
                            distance: workerDataFromApi.currentLocation?.distance,
                            eta: workerDataFromApi.currentLocation?.eta
                        }
                    } : { name: "Not Assigned" } // Provide a safe fallback
                };
            });
            
            setComplaints(mappedData);
            
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []); 

    useEffect(() => {
        fetchComplaints();
    }, [fetchComplaints]);

    useEffect(() => {
        if (!selectedComplaint && complaints.length > 0) {
            setSelectedComplaint(complaints[0]);
        }
    }, [complaints, selectedComplaint]);

    const handleReportSubmit = async (formData) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await fetchApi(API_BASE_URL, {
                method: "POST",
                body: JSON.stringify(formData),
            });
            alert("✅ Report submitted successfully!");
            await fetchComplaints(); 
            setActiveTab("track");
        } catch (err) {
            alert(`❌ Submission Failed: ${err.message}`);
            setError(err.message); 
        } finally {
            setIsSubmitting(false);
        }
    };

    const stats = {
        total: complaints.length,
        resolved: complaints.filter((c) => c.status === "completed").length,
        inProgress: complaints.filter((c) => ["in-progress", "assigned", "accepted", "on-the-way"].includes(c.status)).length,
        pending: complaints.filter((c) => ["pending", "submitted"].includes(c.status)).length,
    };

    const getBadgeClass = (status) => {
        switch ((status || '').toLowerCase()) {
            case "completed": return "bg-emerald-100 text-emerald-800";
            case "in-progress": case "assigned": case "accepted": case "on-the-way": return "bg-blue-100 text-blue-800";
            default: return "bg-orange-100 text-orange-800";
        }
    };

    return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="mb-6 flex justify-between w-full">
    {activeTab !== 'track' && (
        <Button 
            variant="default" 
            onClick={() => setActiveTab("track")} 
            className="text-sm font-medium"
        >
            🏠 Home
        </Button>
    )}
    {activeTab === 'track' && (
        <div className="flex space-x-4">
            <Button 
                onClick={() => setActiveTab("report")} 
                className="text-sm font-medium bg-emerald-500 hover:bg-emerald-600 text-white"
            >
                ➕ New Report
            </Button>
            <Button 
                onClick={() => setActiveTab("rewards")} 
                className="text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white"
            >
                🎁 Rewards
            </Button>
        </div>
    )}
</div>

            <div>
                {activeTab === "track" && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard title="Total Reports" value={stats.total} icon="📝" />
                            <StatCard title="Resolved" value={stats.resolved} icon="✅" />
                            <StatCard title="In Progress" value={stats.inProgress} icon="🔄" />
                            <StatCard title="Pending" value={stats.pending} icon="⏳" />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1 space-y-4 overflow-y-auto pr-2">
                                {isLoading && <p>Loading your reports...</p>}
                                {error && <p className="text-red-500">{error}</p>}
                                {!isLoading && !error && complaints.length > 0 ? (
                                    complaints.map((complaint) => (
                                        <Card key={complaint.id} className={`cursor-pointer transition-all hover:shadow-md ${selectedComplaint?.id === complaint.id ? "ring-2 ring-emerald-500" : "shadow-sm"}`} onClick={() => setSelectedComplaint(complaint)}>
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-semibold capitalize">{complaint.type}</h3>
                                                    <Badge className={getBadgeClass(complaint.status)}>{complaint.status.replace(/_/g, " ")}</Badge>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-2">📍 {complaint.location?.address || complaint.location?.toString() || 'Unknown Location'}</p>
                                                <div className="flex justify-between text-xs text-gray-400 mt-4">
                                                    {/* This correctly displays the custom ID */}
                                                    <span>{complaint.complaintId}</span>
                                                    <span>{new Date(complaint.reportedAt).toLocaleDateString()}</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    !isLoading && <p className="text-gray-500">You haven't submitted any reports yet.</p>
                                )}
                            </div>
                            <div className="lg:col-span-2">
                                {selectedComplaint ? <ComplaintTracker complaint={selectedComplaint} /> : <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg"><p>Select a report to see details.</p></div>}
                            </div>
                        </div>
                    </div>
                ) 
                }
                {activeTab === "report" && (
    <ReportForm onSubmit={handleReportSubmit} onCancel={() => setActiveTab("track")} />
  )}

  {activeTab === "rewards" && (
    <Reward />  // <-- import Reward from './Reward' at the top
  )}
    
            </div>
        </div>
    );
 }

