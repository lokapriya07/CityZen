import React, { useState, useEffect, useCallback } from "react";
import { User, FileText, Clock, Users, Navigation, Check, X } from "lucide-react";

// --- API Utility ---
const fetchApi = async (url, method = 'GET', body = null) => {
    const finalUrl = url.startsWith('/') && !url.startsWith('//') ? `http://localhost:8001${url}` : url;
    const token = localStorage.getItem('adminToken');

    const headers = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = { method, headers };
    if (body) config.body = JSON.stringify(body);

    const response = await fetch(finalUrl, config);
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API Error ${response.status}: ${errorData.message || response.statusText}`);
    }
    return response.json();
};

// --- UI Components & Helpers ---
const cn = (...inputs) => inputs.filter(Boolean).join(' ');
const Badge = ({ children, variant }) => {
    const variants = { 
        high: "bg-orange-100 text-orange-800", 
        critical: "bg-red-500 text-white", 
        medium: "bg-yellow-100 text-yellow-800", 
        low: "bg-green-100 text-green-800", 
        distance: "bg-blue-100 text-blue-800",
        available: "bg-green-100 text-green-800",
        busy: "bg-red-100 text-red-800"
    };
    return <span className={`px-2 py-0.5 text-xs font-semibold rounded-full inline-block ${variants[variant] || 'bg-gray-100 text-gray-800'}`}>{children}</span>;
};
const Button = ({ children, ...props }) => <button className="bg-white hover:bg-gray-100 text-gray-700 text-xs font-semibold py-1 px-2 border border-gray-300 rounded-md" {...props}>{children}</button>;
const Avatar = ({ children, ...props }) => <div className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", props.className)}>{children}</div>;
const AvatarImage = ({ src, ...props }) => <img src={src} className={cn("aspect-square h-full w-full", props.className)} alt="" />;

const calculateDistance = (coord1, coord2) => {
    if (!coord1 || !coord2 || !coord1.lat || !coord1.lng || !coord2.lat || !coord2.lng) return Infinity;
    const R = 6371; // Radius of the Earth in km
    const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
    const dLon = (coord2.lng - coord1.lng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

// =========================================================================
// Main Component
// =========================================================================
export function TaskAssignmentHub() {
    const [reports, setReports] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [draggedReportId, setDraggedReportId] = useState(null);

    // State to manage the recommendation modal
    const [recommendedWorkers, setRecommendedWorkers] = useState(null);
    const [taskToAssign, setTaskToAssign] = useState(null);

    const fetchData = useCallback(async () => {
        setError(null);
        try {
            const [dashboardResponse, workersResponse] = await Promise.all([
                fetchApi("/api/admin/dashboard"),
                fetchApi("/api/admin/workers")
            ]);

            if (dashboardResponse.success && dashboardResponse.data.unassignedReports) {
                const unassignedReportsData = dashboardResponse.data.unassignedReports.map(r => ({
                    id: r._id,
                    type: r.wasteType,
                    location: r.location?.address || 'N/A',
                    coordinates: {
                        lat: r.location?.coordinates?.[1] || 0,
                        lng: r.location?.coordinates?.[0] || 0
                    },
                    priority: r.urgency,
                    reportedAt: r.createdAt,
                }));
                setReports(unassignedReportsData);
            }

            if (workersResponse.success && workersResponse.data.workers) {
                const workersData = workersResponse.data.workers.map(w => ({
                    id: w._id,
                    name: w.name,
                    status: w.isActive ? 'available' : 'busy',
                    currentLocation: {
                        lat: w.workerDetails?.currentLocation?.latitude || 0,
                        lng: w.workerDetails?.currentLocation?.longitude || 0,
                    },
                    specialization: w.workerDetails?.specialization || [],
                    rating: w.stats?.avgRating || 0,
                    points: w.workerDetails?.points || 0,
                    avatar: w.workerDetails?.avatar || `https://ui-avatars.com/api/?name=${w.name.replace(' ', '+')}&background=E0F2F1&color=00796B`,
                    tasks: w.stats?.assignedTasks || 0
                }));
                setWorkers(workersData);
            }

        } catch (err) {
            setError(`Failed to load data: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAssignment = async (reportId, workerId) => {
        const worker = workers.find(w => w.id === workerId);
        if (!worker || worker.status === 'busy') {
            alert('This worker is not available for new tasks.');
            return;
        }

        try {
            setLoading(true);
            await fetchApi(`/api/admin/reports/${reportId}/assign`, 'PUT', { workerId });
            await fetchData();
            alert(`Task successfully assigned to ${worker.name}!`);
        } catch (err) {
            setError('Assignment failed: ' + err.message);
        } finally {
            setLoading(false);
            setDraggedReportId(null);
            setRecommendedWorkers(null);
            setTaskToAssign(null);
        }
    };

    const triggerAutoAssign = (report) => {
        const rankedWorkers = getRecommendedWorkers(report);
        if (rankedWorkers && rankedWorkers.length > 0) {
            setTaskToAssign(report);
            setRecommendedWorkers(rankedWorkers);
        } else {
            alert("No available workers could be recommended for this task.");
        }
    };
    
    const getRecommendedWorkers = (report) => {
        const availableWorkers = workers.filter(w => w.status === 'available');
        if (!availableWorkers.length) return [];

        const scoredWorkers = availableWorkers.map(worker => {
            const distance = calculateDistance(report.coordinates, worker.currentLocation);
            const specializationMatch = worker.specialization.some(spec => report.type.toLowerCase().includes(spec.toLowerCase()));
            const score = (specializationMatch ? 500 : 0) + (100 - Math.min(distance, 100)) + (worker.rating * 10);
            return { ...worker, distance, score, specializationMatch };
        });

        return scoredWorkers.sort((a, b) => b.score - a.score).slice(0, 5);
    };

    if (loading && reports.length === 0) return <div className="p-8 text-center text-xl text-gray-500">Loading Task Assignment Hub...</div>;
    if (error) return <div className="p-8 text-center text-red-600 font-semibold">{error}</div>;

    return (
        <div className="space-y-8 p-1">
            {recommendedWorkers && taskToAssign && (
                <RecommendationModal
                    workers={recommendedWorkers}
                    report={taskToAssign}
                    onClose={() => { setRecommendedWorkers(null); setTaskToAssign(null); }}
                    onAssign={handleAssignment}
                />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="space-y-4 lg:col-span-1">
                    <h3 className="text-xl font-bold text-gray-800">Unassigned Tasks ({reports.length})</h3>
                    {reports.length > 0 ? reports.map((report) => {
                        const topRecommendation = getRecommendedWorkers(report)[0];
                        return (
                            <div
                                key={report.id}
                                draggable
                                onDragStart={() => setDraggedReportId(report.id)}
                                onDragEnd={() => setDraggedReportId(null)}
                                className={`p-4 rounded-lg border-2 bg-white cursor-move hover:shadow-lg transition-shadow ${draggedReportId === report.id ? 'opacity-50' : ''}`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{report.type}</h4>
                                        <p className="text-sm text-gray-500">{report.location}</p>
                                    </div>
                                    <Badge variant={report.priority}>{report.priority}</Badge>
                                </div>
                                {topRecommendation ? (
                                    <div className="bg-gray-50 rounded-md p-2 my-3 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-semibold text-gray-600 mb-1">Recommended:</p>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm font-medium text-gray-800">{topRecommendation.name}</span>
                                                <Badge variant="distance">
                                                    {isFinite(topRecommendation.distance) ? `${topRecommendation.distance.toFixed(1)}km` : 'N/A'}
                                                </Badge>
                                            </div>
                                        </div>
                                        <Button onClick={() => triggerAutoAssign(report)}>
                                            Auto-Assign
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="text-center my-3"><Button onClick={() => triggerAutoAssign(report)}>Find Worker</Button></div>
                                )}
                                <span className="text-xs text-gray-400">Reported: {new Date(report.reportedAt).toLocaleDateString()}</span>
                            </div>
                        );
                    }) : <p className="text-sm text-gray-500 italic">No new reports to assign.</p>}
                </div>

                <div className="lg:col-span-2">
                    <h3 className="text-xl font-bold text-gray-800">Workers ({workers.length})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        {workers.map((worker) => (
                            <div
                                key={worker.id}
                                onDragOver={(e) => { if (worker.status === 'available') e.preventDefault(); }}
                                onDrop={() => { if (draggedReportId) handleAssignment(draggedReportId, worker.id); }}
                                className={`p-4 rounded-lg border-2 transition-all space-y-3 ${worker.status === 'available' ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50 opacity-60'} ${draggedReportId && worker.status === 'available' ? 'border-dashed border-blue-500' : ''}`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <Avatar className="w-12 h-12"><AvatarImage src={worker.avatar} /></Avatar>
                                        <div>
                                            <p className="font-semibold text-gray-800">{worker.name}</p>
                                            <p className="text-xs text-gray-500">Tasks: {worker.tasks}</p>
                                        </div>
                                    </div>
                                    <Badge variant={worker.status}>{worker.status}</Badge>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                                    <span>Rating: {worker.rating.toFixed(1)} ★</span>
                                    <span>Points: {worker.points}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

const RecommendationModal = ({ workers, report, onClose, onAssign }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900">Recommended Workers for:</h3>
            <p className="text-sm text-gray-700 mb-4">{report.type} at {report.location}</p>
            <div className="space-y-3 max-h-64 overflow-y-auto">
                {workers.map((w) => (
                    <div key={w.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div>
                                <p className="font-semibold text-gray-800">{w.name}</p>
                                <div className="flex items-center space-x-2 text-xs text-gray-500">
                                    <span>⭐ {w.rating.toFixed(1)}</span>
                                    <span>📍 {isFinite(w.distance) ? `${w.distance.toFixed(1)} km` : 'Unknown distance'}</span>
                                    {w.specializationMatch && <span className="font-semibold text-green-600">✓ Match</span>}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => onAssign(report.id, w.id)}
                            className="bg-blue-600 text-white text-xs font-bold py-1 px-3 rounded-md hover:bg-blue-700"
                        >
                            Assign
                        </button>
                    </div>
                ))}
            </div>
            <button onClick={onClose} className="w-full mt-4 text-center py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200">
                Cancel
            </button>
        </div>
    </div>
);