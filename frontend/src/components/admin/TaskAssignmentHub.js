import React, { useState, useEffect, useCallback } from "react";

// --- API Utility Placeholder (Unchanged) ---
const fetchApi = async (url, method = 'GET', body = null) => {
    const finalUrl = url.startsWith('/') && !url.startsWith('//') ? `http://localhost:8001${url}` : url;
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4Y2MxNzg3NDA0ZDZiODJjZDBkOWUxOSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1ODIwNjAxNiwiZXhwIjoyMDczNzgyMDE2fQ.YA_AvL61L_wsYpqf4NXB2DHfPr3ltLVdKeASxXKHU-4';
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };
    const config = { method, headers };
    if (body) {
        config.body = JSON.stringify(body);
    }
    const response = await fetch(finalUrl, config);
    if (!response.ok) {
        let errorData = {};
        try { errorData = await response.json(); } catch (e) { }
        throw new Error(`API Error ${response.status}: ${errorData.message || response.statusText}`);
    }
    return response.json();
};

// --- UI Component Definitions (Helpers remain unchanged) ---

const cn = (...inputs) => {
    return inputs.filter(Boolean).join(' ');
};

const Badge = ({ children, className = '', variant = 'default' }) => {
    const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full inline-block";
    const variants = {
        high: "bg-orange-100 text-orange-800",
        critical: "bg-red-500 text-white",
        medium: "bg-yellow-100 text-yellow-800",
        specialization: "bg-green-100 text-green-800",
        distance: "bg-green-100 text-green-800",
        outline: "bg-white border border-gray-300 text-gray-700",
    };
    return (
        <span className={`${baseClasses} ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};

const Button = ({ children, className = '', ...props }) => (
    <button className={`bg-transparent hover:bg-gray-100 text-gray-600 text-xs font-semibold py-1 px-3 border border-gray-300 rounded-lg ${className}`} {...props}>
        {children}
    </button>
);

const Avatar = ({ children, className = '' }) => (
    <div className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}>
        {children}
    </div>
);

const AvatarImage = ({ src, className = '', ...props }) => (
    <img src={src} className={cn("aspect-square h-full w-full", className)} {...props} />
);

const AvatarFallback = ({ children, className = '' }) => (
    <span className={cn("flex h-full w-full items-center justify-center rounded-full bg-gray-200", className)}>
        {children}
    </span>
);

const calculateDistance = (coord1, coord2) => {
    const R = 6371; // Radius of Earth in kilometers
    if (!coord1 || !coord2 || (coord1.lat === 0 && coord1.lng === 0) || (coord2.lat === 0 && coord2.lng === 0)) {
        return 10000;
    }

    const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
    const dLon = ((coord2.lng - coord1.lng) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((coord1.lat * Math.PI) / 180) * Math.cos((coord2.lat * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

// =========================================================================
// Task Assignment Hub Component
// =========================================================================
export function TaskAssignmentHub() {
    const [reports, setReports] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [draggedTask, setDraggedTask] = useState(null);
    const [assignments, setAssignments] = useState({});

    // 🚨 NEW STATES: For the modal view
    const [recommendedWorkers, setRecommendedWorkers] = useState(null);
    const [taskToAssign, setTaskToAssign] = useState(null);

    // --- Data Fetching Effect ---
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // 1. Fetch Reports
            const reportsResponse = await fetchApi("http://localhost:8001/api/admin/dashboard");

            const unassignedReportsData = reportsResponse.data.recentReports
                .filter(report =>
                    !report.assignedWorker && (
                        report.status === 'submitted' || report.status === 'pending' || !report.status
                    )
                )
                .map(r => ({
                    id: r._id,
                    type: r.wasteType,
                    location: r.address || r.location?.area || 'N/A',
                    coordinates: r.gpsCoordinates ? { lat: r.gpsCoordinates.latitude, lng: r.gpsCoordinates.longitude } : { lat: 0, lng: 0 },
                    status: r.status,
                    priority: r.urgency,
                    reportedAt: r.createdAt,
                    reportedBy: r.reporter?.name || 'User',
                    description: r.description,
                }));
            setReports(unassignedReportsData);


            // 2. Fetch Workers
            const workersResponse = await fetchApi("/api/admin/workers");
            const enhancedWorkersData = workersResponse.data.workers.map(w => ({
                id: w._id,
                name: w.name,
                phone: w.workerDetails?.phone || 'N/A',
                avatar: w.workerDetails?.avatar || `https://placehold.co/100x100/A7C7E7/333333?text=${w.name.split(" ").map((n) => n[0]).join("")}`,
                status: w.isActive ? 'available' : 'busy',
                // Extract location and timestamp (CRITICAL)
                currentLocation: w.workerDetails?.currentLocation ? {
                    lat: w.workerDetails.currentLocation.latitude,
                    lng: w.workerDetails.currentLocation.longitude,
                    timestamp: w.workerDetails.currentLocation.timestamp
                } : { lat: 0, lng: 0, timestamp: null },
                specialization: w.workerDetails?.specialization || ['general waste'],
                rating: w.stats?.avgRating || 0,
                completedTasks: w.stats?.completedTasks || 0,
                efficiency: w.stats?.completionRate || 0,
                points: w.workerDetails?.points || 0,
            }));
            setWorkers(enhancedWorkersData);

        } catch (err) {
            console.error("Data fetching error:", err);
            setError(`Failed to load tasks or workers: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const unassignedReports = reports.filter((report) => !Object.values(assignments).flat().includes(report.id));

    // --- Assignment & Drag/Drop Logic ---

    const handleDragStart = (taskId) => {
        setDraggedTask(taskId);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    // 🚨 Handles the final assignment click from modal or drag-and-drop
    const handleAssignment = async (reportId, workerId) => {
        const worker = workers.find(w => w.id === workerId);

        // Clear recommendation list on assignment attempt
        setRecommendedWorkers(null);
        setTaskToAssign(null);

        if (!worker || worker.status === 'busy') {
            alert('Cannot assign task to a busy worker.');
            setDraggedTask(null);
            return;
        }

        if (window.confirm(`Confirm assigning report ID ${reportId} to ${worker.name}?`)) {
            try {
                setLoading(true);
                await fetchApi(`/api/admin/reports/${reportId}/assign`, 'PUT', { workerId });
                setAssignments((prev) => {
                    const newAssignments = prev[workerId] ? [...prev[workerId], reportId] : [reportId];
                    return { ...prev, [workerId]: newAssignments };
                });
                await fetchData();
                alert(`Task successfully assigned to ${worker.name}!`);
            } catch (err) {
                setError('Assignment failed: ' + err.message);
                alert('Assignment failed. See console for details.');
            } finally {
                setLoading(false);
                setDraggedTask(null);
            }
        } else {
            setDraggedTask(null);
        }
    };

    const handleDrop = (workerId) => {
        if (draggedTask) {
            handleAssignment(draggedTask, workerId);
        }
    };

    // 🚨 MODIFIED: Triggers the recommendation modal 
    const triggerAutoAssign = (reportId) => {
        const report = reports.find((r) => r.id === reportId);
        if (!report) return;

        // Get ranked list of recommended workers
        const rankedWorkers = getRecommendedWorker(report);

        if (rankedWorkers.length > 0) {
            setTaskToAssign(report);
            setRecommendedWorkers(rankedWorkers);
        } else {
            alert("No suitable worker could be automatically recommended at this time (missing location data or all workers busy/unsuitable).");
        }
    };

    // --- Recommendation Logic (Includes Staleness Check) ---
    const getRecommendedWorker = (report) => {
        const STALE_LIMIT_MS = 10 * 60 * 1000; // 10 minutes
        const now = new Date().getTime();

        const availableWorkers = workers.filter((w) => {
            if (w.status !== "available") return false;

            const { lat, lng, timestamp } = w.currentLocation;
            const locationTimestamp = timestamp ? new Date(timestamp).getTime() : 0;

            // Check 1: Location must be fresh (not stale)
            if (!timestamp || (now - locationTimestamp > STALE_LIMIT_MS)) {
                return false;
            }
            // Check 2: Location must be valid
            if (lat === 0 && lng === 0) return false;

            return true;
        });

        if (availableWorkers.length === 0) return [];

        const reportCoords = report.coordinates;
        if (reportCoords.lat === 0 && reportCoords.lng === 0) return [];

        const scoredWorkers = availableWorkers.map((worker) => {
            const distance = calculateDistance(report.coordinates, worker.currentLocation);
            const specializationMatch = worker.specialization.some((spec) => report.type.toLowerCase().includes(spec.toLowerCase()));

            // Scoring: Higher score is better
            const specializationScore = specializationMatch ? 100 : 0;
            const distanceScore = Math.max(0, 50 - distance);
            const ratingScore = worker.rating * 10;

            const score = specializationScore + distanceScore + ratingScore;

            return { ...worker, score, distance, specializationMatch };
        });

        // Return the top 5 ranked workers
        return scoredWorkers.sort((a, b) => b.score - a.score).slice(0, 5);
    };

    // --- Recommendation Modal Component (Nested) ---
    const RecommendationList = ({ workers, report, onClose, onAssign }) => {
        if (!workers || workers.length === 0) return null;

        return (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 space-y-4">
                    <h3 className="text-xl font-bold text-gray-800">Assign Task: {report.type}</h3>
                    <p className="text-sm text-gray-600">Location: {report.location}</p>
                    <hr />
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                        {workers.map((worker, index) => (
                            <div key={worker.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-blue-50 transition">
                                <div className="flex items-center space-x-3">
                                    <span className="font-bold text-lg text-blue-600">{index + 1}.</span>
                                    <AvatarImage src={worker.avatar} className="w-8 h-8" />
                                    <div>
                                        <p className="font-semibold text-gray-900">{worker.name}</p>
                                        <p className="text-xs text-gray-500">Score: {worker.score.toFixed(0)}</p>
                                    </div>
                                </div>
                                <div className="text-right space-y-1">
                                    <Badge variant="distance" className="mr-1">{worker.distance.toFixed(1)} km</Badge>
                                    {worker.specializationMatch && <Badge variant="specialization">Match</Badge>}
                                    <Button onClick={() => onAssign(report.id, worker.id)} className="bg-blue-500 text-white border-blue-500 hover:bg-blue-600">
                                        Assign
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button onClick={onClose} className="w-full mt-4 bg-gray-200 text-gray-700 border-gray-400 hover:bg-gray-300">
                        Cancel & Close
                    </Button>
                </div>
            </div>
        );
    };

    // --- Style Helpers (remains unchanged) ---
    const getPriorityStyles = (priority) => {
        switch (priority) {
            case "critical": return "border-red-400 bg-red-50";
            case "high": return "border-orange-400 bg-orange-50";
            case "medium": return "border-yellow-400 bg-yellow-50";
            default: return "border-gray-300 bg-gray-50";
        }
    };

    const getWorkerStatusStyles = (status) => {
        switch (status) {
            case "available": return "border-green-400 bg-green-50";
            case "busy": return "border-orange-400 bg-orange-50";
            default: return "border-gray-300 bg-gray-50";
        }
    };

    // --- Render Logic ---
    // Helper to only show the single best worker recommendation on the card
    const getSingleRecommendedWorker = (report) => getRecommendedWorker(report)[0];

    if (loading) {
        return <div className="p-8 text-center text-xl text-blue-600">Loading Task Assignment Hub...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-600 font-semibold">Error: {error}</div>;
    }

    return (
        <div className="space-y-6 p-4 md:p-6 bg-gray-50 font-sans">
            {/* Recommendation Modal Render */}
            {recommendedWorkers && taskToAssign && (
                <RecommendationList
                    workers={recommendedWorkers}
                    report={taskToAssign}
                    onClose={() => { setRecommendedWorkers(null); setTaskToAssign(null); }}
                    onAssign={handleAssignment}
                />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Unassigned Tasks Column */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700">Unassigned Tasks ({unassignedReports.length})</h3>
                    {unassignedReports.length === 0 && <p className="text-sm text-gray-500 italic">No new unassigned reports!</p>}
                    {unassignedReports.map((report) => {
                        const recommendedWorker = getSingleRecommendedWorker(report);
                        return (
                            <div
                                key={report.id}
                                draggable
                                onDragStart={() => handleDragStart(report.id)}
                                className={cn(
                                    "p-4 rounded-lg border-2 border-dashed cursor-move transition-all hover:shadow-lg",
                                    getPriorityStyles(report.priority),
                                    draggedTask === report.id ? "opacity-50 scale-95" : ""
                                )}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h4 className="font-semibold text-gray-800">{report.type}</h4>
                                        <p className="text-xs text-gray-500">{report.location}</p>
                                    </div>
                                    <Badge variant={report.priority}>{report.priority}</Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{report.description}</p>

                                {recommendedWorker && (
                                    <div className="bg-white/70 rounded-lg p-2 mb-3">
                                        <p className="text-xs font-semibold text-gray-600 mb-1">Recommended:</p>
                                        <div className="flex items-center space-x-2">
                                            <AvatarImage src={recommendedWorker.avatar} className="w-5 h-5 rounded-full" />
                                            <span className="text-xs font-medium text-gray-800">{recommendedWorker.name}</span>
                                            <Badge variant="distance">{recommendedWorker.distance.toFixed(1)}km</Badge>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>{new Date(report.reportedAt).toLocaleDateString()}</span>
                                    <Button onClick={() => triggerAutoAssign(report.id)}>Auto-Assign</Button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Workers Column */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700">Workers ({workers.length})</h3>
                    {workers.length === 0 && <p className="text-sm text-gray-500 italic">No workers available.</p>}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {workers.map((worker) => (
                            <div
                                key={worker.id}
                                onDragOver={handleDragOver}
                                onDrop={() => handleDrop(worker.id)}
                                className={cn(
                                    "p-4 rounded-lg border-2 border-dashed transition-all space-y-3",
                                    getWorkerStatusStyles(worker.status),
                                    draggedTask && worker.status === 'available' ? 'border-blue-500 bg-blue-100 shadow-xl' : ''
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="relative">
                                            <Avatar className="w-12 h-12">
                                                <AvatarImage src={worker.avatar} />
                                                <AvatarFallback>{worker.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                                            </Avatar>
                                            <div className={cn("absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white", worker.status === 'available' ? 'bg-green-500' : 'bg-orange-500')}></div>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-800">{worker.name}</h4>
                                            <p className="text-xs text-gray-500 capitalize">{worker.status}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center space-x-1 text-yellow-500">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                            <span className="text-sm font-semibold text-gray-700">{worker.rating.toFixed(1)}</span>
                                        </div>
                                        <p className="text-xs text-gray-500">{worker.points} pts</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-center">
                                    <div className="bg-white/80 p-2 rounded-lg">
                                        <p className="text-xs text-gray-500">Completed</p>
                                        <p className="font-semibold text-gray-800 text-lg">{worker.completedTasks}</p>
                                    </div>
                                    <div className="bg-white/80 p-2 rounded-lg">
                                        <p className="text-xs text-gray-500">Efficiency</p>
                                        <p className="font-semibold text-gray-800 text-lg">{worker.efficiency}%</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Specializations:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {worker.specialization.map((spec) => (
                                            <Badge key={spec} variant="specialization" className="capitalize">{spec}</Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TaskAssignmentHub;