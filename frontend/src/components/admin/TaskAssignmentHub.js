import React, { useEffect, useState } from "react";

// --- UI Components ---

const Button = ({ onClick, disabled, children, variant = "primary" }) => {
    const primaryStyles = "bg-green-600 hover:bg-green-700 text-white";
    const secondaryStyles = "bg-white text-gray-800 border border-gray-300 hover:bg-gray-100";

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`px-4 py-2 rounded-md font-medium ${variant === 'primary' ? primaryStyles : secondaryStyles
                } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
            {children}
        </button>
    );
};

const Card = ({ children, className = "" }) => (
    <div className={`bg-white shadow-md rounded-xl border border-gray-200 p-4 mb-3 ${className}`}>
        {children}
    </div>
);

const AvailabilityBadge = ({ isActive }) => {
    const bgColor = isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700";
    const text = isActive ? "Available" : "Offline";
    return <span className={`px-3 py-1 rounded-full text-sm font-medium ${bgColor}`}>{text}</span>;
};

const StatusBadge = ({ status }) => {
    const colors = {
        pending: "bg-yellow-100 text-yellow-700",
        submitted: "bg-yellow-100 text-yellow-700",
        assigned: "bg-blue-100 text-blue-700",
        "in-progress": "bg-purple-100 text-purple-700",
        completed: "bg-green-100 text-green-700",
        default: "bg-gray-100 text-gray-700",
    };
    return (
        <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${colors[status] || colors.default
                } `}
        >
            {status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown"}
        </span>
    );
};

const WorkerLocation = ({ lat, lon }) => {
    const [address, setAddress] = useState("Loading address...");

    useEffect(() => {
        if (typeof lat !== 'number' || typeof lon !== 'number') { // Check for numbers
            setAddress("No location data");
            return;
        }
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
            .then(res => res.json())
            .then(data => {
                if (data && data.address) {
                    const road = data.address.road;
                    const suburb = data.address.suburb || data.address.city_district || data.address.neighbourhood;

                    if (road && suburb) {
                        setAddress(`${road}, ${suburb}`);
                    } else if (suburb) {
                        setAddress(suburb);
                    } else if (data.display_name) {
                        setAddress(data.display_name.split(',').slice(0, 3).join(', '));
                    } else {
                        setAddress("Could not find address");
                    }
                } else if (data && data.display_name) {
                    setAddress(data.display_name.split(',').slice(0, 3).join(', '));
                } else {
                    setAddress("Could not find address");
                }
            })
            .catch(() => setAddress("Error fetching address"));
    }, [lat, lon]);

    return (
        <div className="flex items-start text-sm text-gray-600">
            <span className="w-5 text-center mt-0.5">📍</span>
            <span>{address}</span>
        </div>
    );
};


const WorkerCard = ({ worker }) => {
    const rating = (worker.stats?.avgRating || 0).toFixed(1);
    const location = worker.workerDetails?.currentLocation;

    return (
        <Card>
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-800">{worker.name}</h3>
                <AvailabilityBadge isActive={worker.isActive} />
            </div>
            <div className="mt-3 space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                    <span className="w-5 text-center">⭐</span>
                    <span>Rating: {rating} / 5.0</span>
                </div>
                <WorkerLocation lat={location?.latitude} lon={location?.longitude} />
                <div className="flex items-center text-sm text-gray-500">
                    <span className="w-5 text-center">✅</span>
                    <span>Tasks Completed: {worker.stats?.completedTasks || 0}</span>
                </div>
            </div>
        </Card>
    );
};

const AllReportCard = ({ report }) => {
    return (
        <Card>
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-medium text-gray-800">{report.address || "Unknown location"}</h2>
                    <p className="text-sm text-gray-400">{new Date(report.createdAt).toLocaleString()}</p>
                </div>
                <StatusBadge status={report.status} />
            </div>
            {report.assignedWorker && (
                <div className="mt-2 pt-2 border-t">
                    <p className="text-sm text-gray-700 font-medium">
                        👷 Assigned to: **{report.assignedWorker.name}**
                    </p>
                </div>
            )}
        </Card>
    );
};

const UnassignedReportCard = ({ report, bestMatch, onAssign, onManualAssign, isAssigning }) => {

    const handleManualClick = () => {
        onManualAssign(report);
    };

    return (
        <Card>
            <div>
                <h2 className="text-lg font-medium text-gray-800">{report.address || "Unknown location"}</h2>
                <p className="text-sm text-gray-500">Report ID: {report._id?.slice(-6)}</p>
                <p className="text-sm text-gray-400">{new Date(report.createdAt).toLocaleString()}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
                {isAssigning && (<p className="text-gray-500">Assigning...</p>)}

                {report.justAssignedTo && (
                    <p className="text-green-600 font-medium">✅ Successfully assigned to **{report.justAssignedTo}**!</p>
                )}

                {!isAssigning && !report.justAssignedTo && bestMatch && (
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-700">✅ **Best Match:** {bestMatch.name}</p>
                        <button
                            onClick={() => onAssign(report._id, bestMatch._id, bestMatch.name)}
                            className="px-3 py-1 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                        >
                            Assign to {bestMatch.name}
                        </button>
                    </div>
                )}

                {!isAssigning && !report.justAssignedTo && !bestMatch && (
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-orange-500">⚠️ No nearby workers available.</p>
                        <button
                            onClick={handleManualClick}
                            className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                        >
                            Assign
                        </button>
                    </div>
                )}
            </div>
        </Card>
    );
};


const AssignManuallyModal = ({ report, workersWithDistance, onClose, onAssign }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
                <h2 className="text-xl font-semibold mb-2">Assign Manually</h2>
                <p className="mb-4 text-gray-700">Assigning report for: **{report.address || report._id?.slice(-6)}**</p>

                <div className="max-h-64 overflow-y-auto space-y-2">
                    {workersWithDistance
                        .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))
                        .map(worker => (
                            <div
                                key={worker._id}
                                // Disable clicking if distance is null
                                onClick={worker.distance !== null ? () => onAssign(report._id, worker._id, worker.name) : undefined}
                                className={`flex justify-between items-center p-3 border rounded-lg ${worker.distance !== null ? 'hover:bg-gray-100 cursor-pointer' : 'opacity-60 cursor-not-allowed'
                                    }`}
                                title={worker.distance === null ? "Cannot assign: Location data missing" : `Assign to ${worker.name}`}
                            >
                                <div>
                                    <span className="font-medium">{worker.name}</span>
                                    <span className="text-sm text-gray-500 ml-2">({worker.email})</span>
                                    <p className={`text-sm ${worker.distance !== null ? 'text-blue-600 font-medium' : 'text-red-500'}`}>
                                        {worker.distance !== null
                                            ? `Approx. ${worker.distance.toFixed(1)} km away`
                                            // More specific error messages
                                            : (!report.location?.coordinates
                                                ? "Report has no location data"
                                                : (!worker.workerDetails?.currentLocation?.latitude || !worker.workerDetails?.currentLocation?.longitude)
                                                    ? "Worker has no location data"
                                                    : "Distance calculation error"
                                            )
                                        }
                                    </p>
                                </div>
                                <AvailabilityBadge isActive={worker.isActive} />
                            </div>
                        ))}
                </div>

                <div className="mt-6 text-right">
                    <Button onClick={onClose} variant="secondary">
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
};


// --- Main Component ---

export default function TaskAssignmentHub() {
    const [reports, setReports] = useState([]);
    const [reportsLoading, setReportsLoading] = useState(false);
    const [workers, setWorkers] = useState([]);
    const [workersLoading, setWorkersLoading] = useState(false);
    const [isAssigning, setIsAssigning] = useState(null);
    const [view, setView] = useState('unassigned');
    const [allReports, setAllReports] = useState([]);
    const [allReportsLoading, setAllReportsLoading] = useState(false);
    const [reportToAssign, setReportToAssign] = useState(null);
    const [workersWithDistance, setWorkersWithDistance] = useState([]);

    const getToken = () => localStorage.getItem('adminToken');

    // --- Helper Functions ---

    /**
     * Calculates the Haversine distance between two points on the earth.
     * @param {number} lat1 Latitude of point 1
     * @param {number} lon1 Longitude of point 1
     * @param {number} lat2 Latitude of point 2
     * @param {number} lon2 Longitude of point 2
     * @returns {number|null} Distance in km or null if coordinates are invalid
     */
    const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
        if (
            typeof lat1 !== 'number' ||
            typeof lon1 !== 'number' ||
            typeof lat2 !== 'number' ||
            typeof lon2 !== 'number'
        ) {
            return null; // Invalid coordinates
        }
        const R = 6371; // Radius of the earth in km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d;
    }

    /**
     * ✅ FIX #1: This wrapper function handles the different data structures.
     * It unpacks Report [Lng, Lat] and Worker {lat, lng} objects
     * and passes them correctly to getDistanceFromLatLonInKm.
     */
    const calculateApproxDistance = (reportCoordinates, workerLocation) => {
        if (!reportCoordinates || !workerLocation) return null;

        return getDistanceFromLatLonInKm(
            reportCoordinates[1],  // lat1: Report Latitude
            reportCoordinates[0],  // lon1: Report Longitude
            workerLocation.latitude,   // lat2: Worker Latitude
            workerLocation.longitude   // lon2: Worker Longitude
        );
    };


    const findBestWorker = (report, availableWorkers) => {
        if (!report.location?.coordinates) return null;
        let bestWorker = null;
        let minDistance = Infinity;

        const DISTANCE_THRESHOLD = 10; // 10 km threshold

        for (const worker of availableWorkers) {
            const workerLoc = worker.workerDetails?.currentLocation;
            if (!workerLoc) continue;

            // ✅ Use the fixed wrapper function
            const distance = calculateApproxDistance(report.location.coordinates, workerLoc);

            if (distance !== null && distance < minDistance) {
                minDistance = distance;
                bestWorker = worker;
            }
        }

        if (minDistance <= DISTANCE_THRESHOLD) return bestWorker;
        return null;
    };

    // --- Data Fetching ---

    const fetchReports = async () => {
        setReportsLoading(true);
        const token = getToken();
        if (!token) { return; }
        try {
            const res = await fetch("http://localhost:8001/api/admin/reports/unassigned", {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setReports(data.data);
        } catch (err) { console.error("Error fetching reports:", err); }
        setReportsLoading(false);
    };

    const fetchWorkers = async () => {
        setWorkersLoading(true);
        const token = getToken();
        if (!token) { return; }
        try {
            const res = await fetch("http://localhost:8001/api/admin/workers", {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setWorkers(data.data.workers);
        } catch (err) { console.error("Error fetching workers:", err); }
        setWorkersLoading(false);
    };

    const fetchAllReports = async () => {
        if (allReports.length > 0) return;
        setAllReportsLoading(true);
        const token = getToken();
        if (!token) { return; }
        try {
            const res = await fetch("http://localhost:8001/api/admin/reports/all", {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setAllReports(data.data);
        } catch (err) { console.error("Error fetching all reports:", err); }
        setAllReportsLoading(false);
    };

    // --- Event Handlers ---

    const handleAutoAssignAll = async () => {
        setReportsLoading(true);
        const token = getToken();
        if (!token) { return; }

        try {
            const res = await fetch("http://localhost:8001/api/admin/auto-assign", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
            });
            const result = await res.json();
            if (result.success) {
                alert(
                    `✅ Auto-Assign Complete!\nAssigned: ${result.assigned?.length || 0}\nFailed: ${result.unassigned?.length || 0}`
                );
                fetchReports();
            } else {
                alert(`❌ Auto-assign failed: ${result.message}`);
            }
        } catch (err) {
            console.error(err);
            alert("Error: " + err.message);
        }
        setReportsLoading(false);
    };

    const handleManualAssign = async (reportId, workerId, workerName) => {
        setIsAssigning(reportId);
        if (reportToAssign) handleCloseModal(); // Close modal if it's open

        const token = getToken();
        try {
            const res = await fetch(`http://localhost:8001/api/admin/reports/${reportId}/assign`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ workerId })
            });
            const data = await res.json();
            if (data.success) {
                // Show success message on the card
                setReports(prev => prev.map(r => r._id === reportId ? { ...r, justAssignedTo: workerName } : r));
                // Remove the card after a short delay
                setTimeout(() => {
                    setReports(prev => prev.filter(r => r._id !== reportId));
                }, 2000);
            } else {
                alert(`Assignment failed: ${data.message}`);
            }
        } catch (err) { alert("An error occurred during assignment."); }
        setIsAssigning(null);
    };


    const handleOpenModal = (report) => {
        const reportLoc = report.location?.coordinates; // [Lng, Lat]

        const workersWithDist = workers.map(worker => {
            const workerLoc = worker.workerDetails?.currentLocation; // { latitude, longitude }

            // ===============================================
            // ✅ FIX #2: THE FIX IS APPLIED HERE
            // Use the same fixed wrapper function
            // ===============================================
            const distance = calculateApproxDistance(reportLoc, workerLoc);

            return { ...worker, distance };
        });

        setWorkersWithDistance(workersWithDist);
        setReportToAssign(report);
    };

    const handleCloseModal = () => {
        setReportToAssign(null);
        setWorkersWithDistance([]);
    };

    // --- Initial Load Effect ---
    useEffect(() => {
        fetchReports();
        fetchWorkers();
    }, []);

    const availableWorkers = workers.filter(w => w.isActive);

    // --- Render ---
    return (
        <div className="p-6 bg-gray-50 min-h-screen">

            {reportToAssign && (
                <AssignManuallyModal
                    report={reportToAssign}
                    workersWithDistance={workersWithDistance}
                    onClose={handleCloseModal}
                    onAssign={handleManualAssign}
                />
            )}

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-700">Task Assignment Hub</h1>
                <Button onClick={handleAutoAssignAll} disabled={reportsLoading || reports.length === 0}>
                    {reportsLoading ? "Loading..." : "Auto Assign All"}
                </Button>
            </div>

            <div className="flex space-x-2 mb-6 border-b">
                <button
                    onClick={() => setView('unassigned')}
                    className={`py-2 px-4 ${view === 'unassigned' ? 'border-b-2 border-green-600 text-green-600 font-medium' : 'text-gray-500'}`}
                >
                    Unassigned Reports ({reports.length})
                </button>
                <button
                    onClick={() => { setView('all'); fetchAllReports(); }}
                    className={`py-2 px-4 ${view === 'all' ? 'border-b-2 border-green-600 text-green-600 font-medium' : 'text-gray-500'}`}
                >
                    All Reports
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* --- Column 1: Main Content (Tabs) --- */}
                <div className="md:col-span-2">
                    {view === 'unassigned' && (
                        <div className="grid gap-4">
                            {reportsLoading && <p>Loading reports...</p>}
                            {!reportsLoading && reports.length === 0 && <p>🎉 No unassigned reports!</p>}
                            {reports.map((report) => {
                                const bestMatch = findBestWorker(report, availableWorkers);
                                return (
                                    <UnassignedReportCard
                                        key={report._id}
                                        report={report}
                                        bestMatch={bestMatch}
                                        onAssign={handleManualAssign}
                                        onManualAssign={handleOpenModal}
                                        isAssigning={isAssigning === report._id}
                                    />
                                );
                            })}
                        </div>
                    )}

                    {view === 'all' && (
                        <div className="grid gap-4">
                            {allReportsLoading && <p>Loading all reports...</p>}
                            {allReports.map((report) => (
                                <AllReportCard key={report._id} report={report} />
                            ))}
                        </div>
                    )}
                </div>

                {/* --- Column 2: Workers List (Sidebar) --- */}
                <div className="md:col-span-1">
                    <h2 className="text-xl font-semibold text-gray-600 mb-4">
                        All Workers ({workers.length})
                    </h2>
                    {workersLoading && <p>Loading workers...</p>}
                    <div className="grid gap-4">
                        {workers.map((worker) => (
                            <WorkerCard key={worker._id} worker={worker} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}