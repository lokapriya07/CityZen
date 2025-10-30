// import React, { useEffect, useState, useCallback } from "react";

// // --- UI Components ---

// const Button = ({ onClick, disabled, children, variant = "primary" }) => {
//     const primaryStyles = "bg-green-600 hover:bg-green-700 text-white";
//     const secondaryStyles = "bg-white text-gray-800 border border-gray-300 hover:bg-gray-100";

//     return (
//         <button
//             onClick={onClick}
//             disabled={disabled}
//             className={`px-4 py-2 rounded-md font-medium ${variant === 'primary' ? primaryStyles : secondaryStyles
//                 } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
//         >
//             {children}
//         </button>
//     );
// };

// const Card = ({ children, className = "" }) => (
//     <div className={`bg-white shadow-md rounded-xl border border-gray-200 p-4 mb-3 ${className}`}>
//         {children}
//     </div>
// );

// const AvailabilityBadge = ({ isActive }) => {
//     const bgColor = isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700";
//     const text = isActive ? "Available" : "Offline";
//     return <span className={`px-3 py-1 rounded-full text-sm font-medium ${bgColor}`}>{text}</span>;
// };

// const StatusBadge = ({ status }) => {
//     const colors = {
//         pending: "bg-yellow-100 text-yellow-700",
//         submitted: "bg-yellow-100 text-yellow-700",
//         assigned: "bg-blue-100 text-blue-700",
//         "in-progress": "bg-purple-100 text-purple-700",
//         completed: "bg-green-100 text-green-700",
//         default: "bg-gray-100 text-gray-700",
//     };
//     return (
//         <span
//             className={`px-3 py-1 rounded-full text-sm font-medium ${colors[status] || colors.default
//                 } `}
//         >
//             {status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown"}
//         </span>
//     );
// };

// const WorkerLocation = ({ lat, lon, storedAddress }) => {
//     const [address, setAddress] = useState(storedAddress || "Loading address...");

//     useEffect(() => {
//         if (storedAddress && storedAddress !== "Loading address...") {
//             return;
//         }

//         if (typeof lat !== 'number' || typeof lon !== 'number' || (lat === 0 && lon === 0)) {
//             setAddress("No precise location data");
//             return;
//         }

//         fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
//             .then(res => res.json())
//             .then(data => {
//                 if (data && data.address) {
//                     const road = data.address.road;
//                     const suburb = data.address.suburb || data.address.city_district || data.address.neighbourhood;

//                     if (road && suburb) {
//                         setAddress(`${road}, ${suburb}`);
//                     } else if (suburb) {
//                         setAddress(suburb);
//                     } else if (data.display_name) {
//                         setAddress(data.display_name.split(',').slice(0, 3).join(', '));
//                     } else {
//                         setAddress("Could not find address");
//                     }
//                 } else if (data && data.display_name) {
//                     setAddress(data.display_name.split(',').slice(0, 3).join(', '));
//                 } else {
//                     setAddress("Could not find address");
//                 }
//             })
//             .catch(() => setAddress("Error fetching address"));
//     }, [lat, lon, storedAddress]);

//     return (
//         <div className="flex items-start text-sm text-gray-600">
//             <span className="w-5 text-center mt-0.5">📍</span>
//             <span>{address}</span>
//         </div>
//     );
// };


// const WorkerCard = ({ worker }) => {
//     const rating = (worker.stats?.avgRating || 0).toFixed(1);
//     const location = worker.workerDetails?.currentLocation;

//     return (
//         <Card>
//             <div className="flex justify-between items-center">
//                 <h3 className="text-lg font-medium text-gray-800">{worker.name}</h3>
//                 <AvailabilityBadge isActive={worker.isActive} />
//             </div>
//             <div className="mt-3 space-y-2">
//                 <div className="flex items-center text-sm text-gray-600">
//                     <span className="w-5 text-center">⭐</span>
//                     <span>Rating: {rating} / 5.0</span>
//                 </div>
//                 <WorkerLocation
//                     lat={location?.latitude || 0}
//                     lon={location?.longitude || 0}
//                     storedAddress={location?.address || ''}
//                 />
//                 <div className="flex items-center text-sm text-gray-500">
//                     <span className="w-5 text-center">✅</span>
//                     <span>Tasks Completed: {worker.stats?.completedTasks || 0}</span>
//                 </div>
//             </div>
//         </Card>
//     );
// };

// const AllReportCard = ({ report }) => {
//     return (
//         <Card>
//             <div className="flex justify-between items-center">
//                 <div>
//                     <h2 className="text-lg font-medium text-gray-800">{report.address || "Unknown location"}</h2>
//                     <p className="text-sm text-gray-400">{new Date(report.createdAt).toLocaleString()}</p>
//                 </div>
//                 <StatusBadge status={report.status} />
//             </div>
//             {report.assignedWorker && (
//                 <div className="mt-2 pt-2 border-t">
//                     <p className="text-sm text-gray-700 font-medium">
//                         👷 Assigned to: **{report.assignedWorker.name}**
//                     </p>
//                 </div>
//             )}
//         </Card>
//     );
// };


// const UnassignedReportCard = ({ report, bestMatch, onAssign, onManualAssign, isAssigning, isGeocoding }) => {
//     const handleManualClick = () => {
//         onManualAssign(report);
//     };

//     const bestWorkerDistance = bestMatch?.distance;
//     const isLoading = isAssigning || isGeocoding;

//     return (
//         <Card>
//             <div>
//                 <h2 className="text-lg font-medium text-gray-800">{report.address || "Unknown location"}</h2>
//                 <p className="text-sm text-gray-500">Report ID: {report._id?.slice(-6)}</p>
//                 <p className="text-sm text-gray-400">{new Date(report.createdAt).toLocaleString()}</p>
//             </div>
//             <div className="mt-4 pt-4 border-t border-gray-100">
//                 {isLoading && (<p className="text-blue-500">
//                     {isGeocoding ? '🗺️ Finding coordinates from address...' : 'Assigning...'}
//                 </p>)}

//                 {!isLoading && report.justAssignedTo && (
//                     <p className="text-green-600 font-medium">✅ Successfully assigned to **{report.justAssignedTo}**!</p>
//                 )}

//                 {!isLoading && !report.justAssignedTo && bestMatch && (
//                     <div className="flex justify-between items-center">
//                         <p className="text-sm text-gray-700">
//                             ✅ **Best Match:** {bestMatch.name}
//                             <span className="font-semibold text-blue-600 ml-2">({bestWorkerDistance} km)</span>
//                         </p>
//                         <button
//                             onClick={() => onAssign(report._id, bestMatch._id, bestMatch.name)}
//                             className="px-3 py-1 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
//                         >
//                             Assign to {bestMatch.name}
//                         </button>
//                     </div>
//                 )}

//                 {!isLoading && !report.justAssignedTo && !bestMatch && (
//                     <div className="flex justify-between items-center">
//                         <p className="text-sm text-orange-500">⚠️ No nearby workers available (or no valid addresses).</p>
//                         <button
//                             onClick={handleManualClick}
//                             className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
//                         >
//                             Assign Manually
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </Card>
//     );
// };


// const AssignManuallyModal = ({ report, workersWithDistance, onClose, onAssign }) => {
//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//             <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
//                 <h2 className="text-xl font-semibold mb-2">Assign Manually</h2>
//                 <p className="mb-4 text-gray-700">Assigning report for: **{report.address || report._id?.slice(-6)}**</p>

//                 <div className="max-h-64 overflow-y-auto space-y-2">
//                     {workersWithDistance
//                         .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))
//                         .map(worker => {
//                             const canAssign = worker.distance !== null && worker.isActive;

//                             let reason = "";
//                             if (!worker.isActive) reason = "Cannot assign: Worker is offline";
//                             else if (worker.distance === null) reason = "Cannot assign: Distance unavailable (Haversine fallback)";


//                             return (
//                                 <div
//                                     key={worker._id}
//                                     onClick={canAssign ? () => onAssign(report._id, worker._id, worker.name) : undefined}
//                                     className={`flex justify-between items-center p-3 border rounded-lg ${canAssign ? 'hover:bg-gray-100 cursor-pointer' : 'opacity-60 cursor-not-allowed'
//                                         }`}
//                                     title={canAssign ? `Assign to ${worker.name}` : reason}
//                                 >
//                                     <div>
//                                         <span className="font-medium">{worker.name}</span>
//                                         <span className="text-sm text-gray-500 ml-2">({worker.email})</span>
//                                         <p className={`text-sm ${worker.distance !== null ? 'text-blue-600 font-medium' : 'text-red-500'}`}>
//                                             {worker.distance !== null
//                                                 ? `Approx. ${worker.distance.toFixed(1)} km (Straight-line)`
//                                                 : "Distance unavailable"
//                                             }
//                                         </p>
//                                     </div>
//                                     <AvailabilityBadge isActive={worker.isActive} />
//                                 </div>
//                             );
//                         })}
//                 </div>

//                 <div className="mt-6 text-right">
//                     <Button onClick={onClose} variant="secondary">
//                         Cancel
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     );
// };


// // --- Main Component ---

// export default function TaskAssignmentHub() {
//     const [reports, setReports] = useState([]);
//     const [reportsLoading, setReportsLoading] = useState(false);
//     const [workers, setWorkers] = useState([]);
//     const [workersLoading, setWorkersLoading] = useState(false);
//     const [isAssigning, setIsAssigning] = useState(null);
//     const [view, setView] = useState('unassigned');
//     const [allReports, setAllReports] = useState([]);
//     const [allReportsLoading, setAllReportsLoading] = useState(false);
//     const [reportToAssign, setReportToAssign] = useState(null);
//     const [workersWithDistance, setWorkersWithDistance] = useState([]);

//     const getToken = () => localStorage.getItem('adminToken');

//     // Client-side Haversine (straight-line) for modal proximity fallback
//     const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
//         if (typeof lat1 !== 'number' || typeof lon1 !== 'number' || typeof lat2 !== 'number' || typeof lon2 !== 'number') {
//             return null;
//         }
//         const R = 6371; // Radius of the earth in km
//         const dLat = (lat2 - lat1) * (Math.PI / 180);
//         const dLon = (lon2 - lon1) * (Math.PI / 180);
//         const a =
//             Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//             Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
//             Math.sin(dLon / 2) * Math.sin(dLon / 2);
//         const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//         const d = R * c; // Distance in km
//         return d;
//     }

//     const findBestWorker = (report) => {
//         // Relies on server-calculated 'bestMatch' data
//         return report.bestMatch || null;
//     };

//     // --- Data Fetching ---

//     const fetchReports = useCallback(async () => {
//         setReportsLoading(true);
//         const token = getToken();
//         if (!token) { setReportsLoading(false); return; }
//         try {
//             // New route: Fetches reports with server-calculated best match distance
//             const res = await fetch("http://localhost:8001/api/admin/reports/unassigned/distances", {
//                 method: "GET",
//                 headers: { 'Authorization': `Bearer ${token}` }
//             });
//             const data = await res.json();

//             if (data.success) {
//                 setReports(data.data);
//             }
//         } catch (err) { console.error("Error fetching reports with distances:", err); }
//         setReportsLoading(false);
//     }, []);

//     const fetchWorkers = useCallback(async () => {
//         setWorkersLoading(true);
//         const token = getToken();
//         if (!token) { setWorkersLoading(false); return; }
//         try {
//             const res = await fetch("http://localhost:8001/api/admin/workers", {
//                 headers: { 'Authorization': `Bearer ${token}` }
//             });
//             const data = await res.json();
//             if (data.success) setWorkers(data.data.workers.map(w => ({
//                 ...w,
//                 stats: w.stats || { avgRating: 0, completedTasks: 0 }
//             })));
//         } catch (err) { console.error("Error fetching workers:", err); }
//         setWorkersLoading(false);
//     }, []);

//     const fetchAllReports = useCallback(async () => {
//         setAllReportsLoading(true);
//         const token = getToken();
//         if (!token) { setAllReportsLoading(false); return; }
//         try {
//             const res = await fetch("http://localhost:8001/api/admin/reports/all", {
//                 headers: { 'Authorization': `Bearer ${token}` }
//             });
//             const data = await res.json();
//             if (data.success) setAllReports(data.data);
//         } catch (err) { console.error("Error fetching all reports:", err); }
//         setAllReportsLoading(false);
//     }, []);

//     const handleAutoAssignAll = async () => {
//         setReportsLoading(true);
//         const token = getToken();
//         if (!token) { setReportsLoading(false); return; }

//         try {
//             // Note: This route must be updated on the server to use road distance logic
//             const res = await fetch("http://localhost:8001/api/admin/auto-assign", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     'Authorization': `Bearer ${token}`
//                 },
//             });
//             const result = await res.json();
//             if (result.success) {
//                 alert(
//                     `✅ Auto-Assign Complete!\nAssigned: ${result.assigned?.length || 0}\nFailed: ${result.unassigned?.length || 0}`
//                 );
//                 fetchReports();
//             } else {
//                 alert(`❌ Auto-assign failed: ${result.message}`);
//             }
//         } catch (err) {
//             console.error(err);
//             alert("Error: " + err.message);
//         }
//         setReportsLoading(false);
//     };

//     const handleManualAssign = async (reportId, workerId, workerName) => {
//         setIsAssigning(reportId);
//         if (reportToAssign) handleCloseModal();

//         const token = getToken();
//         try {
//             const res = await fetch(`http://localhost:8001/api/admin/reports/${reportId}/assign`, {
//                 method: 'PUT',
//                 headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//                 body: JSON.stringify({ workerId })
//             });
//             const data = await res.json();
//             if (data.success) {
//                 setReports(prev => prev.map(r => r._id === reportId ? { ...r, justAssignedTo: workerName } : r));
//                 setTimeout(() => {
//                     setReports(prev => prev.filter(r => r._id !== reportId));
//                 }, 2000);
//             } else {
//                 alert(`Assignment failed: ${data.message}`);
//             }
//         } catch (err) { alert("An error occurred during assignment."); }
//         setIsAssigning(null);
//     };


//     const handleOpenModal = async (report) => {
//         const reportLoc = report.location?.coordinates;

//         const workersWithDist = workers
//             .filter(w => w.role === 'worker')
//             .map(worker => {
//                 const workerLoc = worker.workerDetails?.currentLocation;

//                 // Use Haversine for the manual assignment list proximity display
//                 const distance = (reportLoc && workerLoc)
//                     ? getDistanceFromLatLonInKm(reportLoc[1], reportLoc[0], workerLoc.latitude, workerLoc.longitude)
//                     : null;

//                 return { ...worker, distance };
//             });

//         setWorkersWithDistance(workersWithDist);
//         setReportToAssign(report);
//     };

//     const handleCloseModal = () => {
//         setReportToAssign(null);
//         setWorkersWithDistance([]);
//     };

//     // --- Initial Load Effect ---
//     useEffect(() => {
//         fetchReports();
//         fetchWorkers();
//     }, [fetchReports, fetchWorkers]);

//     const availableWorkers = workers.filter(w => w.isActive);

//     // --- Render ---
//     return (
//         <div className="p-6 bg-gray-50 min-h-screen">

//             {reportToAssign && (
//                 <AssignManuallyModal
//                     report={reportToAssign}
//                     workersWithDistance={workersWithDistance}
//                     onClose={handleCloseModal}
//                     onAssign={handleManualAssign}
//                 />
//             )}

//             <div className="flex justify-between items-center mb-6">
//                 <h1 className="text-2xl font-semibold text-gray-700">Task Assignment Hub</h1>
//                 <Button onClick={handleAutoAssignAll} disabled={reportsLoading || reports.length === 0}>
//                     {reportsLoading ? "Loading..." : "Auto Assign All"}
//                 </Button>
//             </div>

//             <div className="flex space-x-2 mb-6 border-b">
//                 <button
//                     onClick={() => setView('unassigned')}
//                     className={`py-2 px-4 ${view === 'unassigned' ? 'border-b-2 border-green-600 text-green-600 font-medium' : 'text-gray-500'}`}
//                 >
//                     Unassigned Reports ({reports.length})
//                 </button>
//                 <button
//                     onClick={() => { setView('all'); fetchAllReports(); }}
//                     className={`py-2 px-4 ${view === 'all' ? 'border-b-2 border-green-600 text-green-600 font-medium' : 'text-gray-500'}`}
//                 >
//                     All Reports
//                 </button>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

//                 <div className="md:col-span-2">
//                     {view === 'unassigned' && (
//                         <div className="grid gap-4">
//                             {reportsLoading && <p>Loading reports and calculating road distances...</p>}
//                             {!reportsLoading && reports.length === 0 && <p>🎉 No unassigned reports!</p>}
//                             {reports.map((report) => {
//                                 const bestMatch = findBestWorker(report);
//                                 return (
//                                     <UnassignedReportCard
//                                         key={report._id}
//                                         report={report}
//                                         bestMatch={bestMatch}
//                                         onAssign={handleManualAssign}
//                                         onManualAssign={handleOpenModal}
//                                         isAssigning={isAssigning === report._id}
//                                         isGeocoding={false}
//                                     />
//                                 );
//                             })}
//                         </div>
//                     )}

//                     {view === 'all' && (
//                         <div className="grid gap-4">
//                             {allReportsLoading && <p>Loading all reports...</p>}
//                             {allReports.map((report) => (
//                                 <AllReportCard key={report._id} report={report} />
//                             ))}
//                         </div>
//                     )}
//                 </div>

//                 <div className="md:col-span-1">
//                     <h2 className="text-xl font-semibold text-gray-600 mb-4">
//                         All Workers ({workers.length})
//                     </h2>
//                     {workersLoading && <p>Loading workers...</p>}
//                     <div className="grid gap-4">
//                         {workers.map((worker) => (
//                             <WorkerCard key={worker._id} worker={worker} />
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

import React, { useEffect, useState, useCallback } from "react";

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

const WorkerLocation = ({ lat, lon, storedAddress }) => {
    const [address, setAddress] = useState(storedAddress || "Loading address...");

    useEffect(() => {
        if (storedAddress && storedAddress !== "Loading address...") {
            return;
        }

        if (typeof lat !== 'number' || typeof lon !== 'number' || (lat === 0 && lon === 0)) {
            setAddress("No precise location data");
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
    }, [lat, lon, storedAddress]);

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
                <WorkerLocation
                    lat={location?.latitude || 0}
                    lon={location?.longitude || 0}
                    storedAddress={location?.address || ''}
                />
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
                        👷 Assigned to: <strong className="text-gray-900">{report.assignedWorker.name}</strong>
                    </p>
                </div>
            )}
        </Card>
    );
};


const UnassignedReportCard = ({ report, bestMatch, onAssign, onManualAssign, isAssigning, isGeocoding }) => {
    const handleManualClick = () => {
        onManualAssign(report);
    };

    const bestWorkerDistance = bestMatch?.distance; // This is now a string like "0.0"
    const isLoading = isAssigning || isGeocoding;

    const DISTANCE_LIMIT_KM = 5;
    // =========================================================================
    // ✅ START: CRASH FIX
    // We convert the distance string to a number for comparison
    // =========================================================================
    const isBestMatchViable = bestMatch && (Number(bestWorkerDistance) < DISTANCE_LIMIT_KM);
    // =========================================================================
    // ✅ END: CRASH FIX
    // =========================================================================

    return (
        <Card>
            <div>
                <h2 className="text-lg font-medium text-gray-800">{report.address || "Unknown location"}</h2>
                <p className="text-sm text-gray-500">Report ID: {report._id?.slice(-6)}</p>
                <p className="text-sm text-gray-400">{new Date(report.createdAt).toLocaleString()}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
                {isLoading && (<p className="text-blue-500">
                    {isGeocoding ? '🗺️ Finding coordinates from address...' : 'Assigning...'}
                </p>)}

                {!isLoading && report.justAssignedTo && (
                    <p className="text-green-600 font-medium">✅ Successfully assigned to <strong className="text-gray-900">{report.justAssignedTo}</strong>!</p>
                )}

                {/* Case 1: Viable best match found (< 5km) */}
                {!isLoading && !report.justAssignedTo && isBestMatchViable && (
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-700">
                            ✅ **Best Match:** {bestMatch.name}
                            {/* ========================================================================= */}
                            {/* ✅ START: CRASH FIX 1 - Removed .toFixed() */}
                            {/* ========================================================================= */}
                            <span className="font-semibold text-blue-600 ml-2">({bestWorkerDistance} km)</span>
                            {/* ========================================================================= */}
                            {/* ✅ END: CRASH FIX 1 */}
                            {/* ========================================================================= */}
                        </p>
                        <button
                            onClick={() => onAssign(report._id, bestMatch._id, bestMatch.name)}
                            className="px-3 py-1 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                        >
                            Assign to {bestMatch.name}
                        </button>
                    </div>
                )}

                {/* Case 2: No match OR match is too far (>= 5km) */}
                {!isLoading && !report.justAssignedTo && !isBestMatchViable && (
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-orange-500">
                            ⚠️
                            {bestMatch ?
                                /* ========================================================================= */
                                /* ✅ START: CRASH FIX 2 - Removed .toFixed() */
                                /* ========================================================================= */
                                ` No worker within ${DISTANCE_LIMIT_KM}km. (Closest: ${bestMatch.name} at ${bestWorkerDistance} km)` :
                                /* ========================================================================= */
                                /* ✅ END: CRASH FIX 2 */
                                /* ========================================================================= */
                                ` No nearby workers available (or no valid addresses).`
                            }
                        </p>
                        <button
                            onClick={handleManualClick}
                            className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                        >
                            Assign Manually
                        </button>
                    </div>
                )}

            </div>
        </Card>
    );
};

const AssignManuallyModal = ({ report, workersWithDistance, onClose, onAssign }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
                <h2 className="text-xl font-semibold mb-2">Assign Manually</h2>
                <p className="mb-4 text-gray-700">
                    Assigning report for: <strong className="text-gray-900">{report.address || report._id?.slice(-6)}</strong>
                </p>

                {/* This is the list container */}
                <div className="max-h-64 overflow-y-auto space-y-3 pr-2">
                    
                    {/* Handle case where the list is empty */}
                    {workersWithDistance.length === 0 && (
                        <p className="text-gray-500 text-center py-4">No workers found.</p>
                    )}

                    {workersWithDistance
                        .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))
                        .map(worker => {
                            const canAssign = worker.distance !== null && worker.isActive;
                            let reason = "";
                            if (!worker.isActive) reason = "Cannot assign: Worker is offline";
                            else if (worker.distance === null) reason = "Cannot assign: Distance unavailable";

                            // The outer div is now a flex container.
                            return (
                                <div
                                    key={worker._id}
                                    onClick={canAssign ? () => onAssign(report._id, worker._id, worker.name) : undefined}
                                    className={`flex justify-between items-center p-4 border border-gray-200 rounded-lg ${
                                        canAssign 
                                        ? 'hover:bg-gray-100 cursor-pointer' 
                                        : 'opacity-60 bg-gray-50 cursor-not-allowed'
                                    }`}
                                    title={canAssign ? `Assign to ${worker.name}` : reason}
                                >
                                    {/* This new div makes the left side a single "block" */}
                                    <div className="flex-1 overflow-hidden mr-3">
                                        
                                        {/* This div now uses "truncate" to prevent wrapping */}
                                        <div className="truncate">
                                            <span className="font-medium text-gray-900">{worker.name}</span>
                                            <span className="text-sm text-gray-500 ml-2">({worker.email})</span>
                                        </div>

                                        {/* Distance line */}
                                        <p className={`text-sm font-medium ${
                                            worker.distance !== null ? 'text-blue-600' : 'text-red-500'
                                        }`}>
                                            {worker.distance !== null
                                                ? `Approx. ${worker.distance.toFixed(1)} km away`
                                                : "Distance unavailable"
                                            }
                                        </p>
                                    </div>

                                    {/* The badge will always stay aligned to the right */}
                                    <AvailabilityBadge isActive={worker.isActive} /> 
                                </div>
                            );
                        })}
                </div>

                {/* Cancel Button */}
                <div className="mt-6 pt-4 border-t border-gray-200 text-right">
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

    // Client-side Haversine (straight-line) for modal proximity fallback
    const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
        if (typeof lat1 !== 'number' || typeof lon1 !== 'number' || typeof lat2 !== 'number' || typeof lon2 !== 'number') {
            return null;
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

    const findBestWorker = (report) => {
        // Relies on server-calculated 'bestMatch' data
        return report.bestMatch || null;
    };

    // --- Data Fetching ---

    const fetchReports = useCallback(async () => {
        setReportsLoading(true);
        const token = getToken();
        if (!token) { setReportsLoading(false); return; }
        try {
            const res = await fetch("http://localhost:8001/api/admin/reports/unassigned/distances", {
                method: "GET",
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();

            if (data.success) {
                setReports(data.data);
            }
        } catch (err) { console.error("Error fetching reports with distances:", err); }
        setReportsLoading(false);
    }, []);

    const fetchWorkers = useCallback(async () => {
        setWorkersLoading(true);
        const token = getToken();
        if (!token) { setWorkersLoading(false); return; }
        try {
            const res = await fetch("http://localhost:8001/api/admin/workers", {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setWorkers(data.data.workers.map(w => ({
                ...w,
                stats: w.stats || { avgRating: 0, completedTasks: 0 }
            })));
        } catch (err) { console.error("Error fetching workers:", err); }
        setWorkersLoading(false);
    }, []);

    const fetchAllReports = useCallback(async () => {
        setAllReportsLoading(true);
        const token = getToken();
        if (!token) { setAllReportsLoading(false); return; }
        try {
            const res = await fetch("http://localhost:8001/api/admin/reports/all", {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setAllReports(data.data);
        } catch (err) { console.error("Error fetching all reports:", err); }
        setAllReportsLoading(false);
    }, []);

    const handleAutoAssignAll = async () => {
        setReportsLoading(true);
        const token = getToken();
        if (!token) { setReportsLoading(false); return; }

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
                    `✅ Auto-Assign Complete!\nAssigned: ${result.assigned?.length || 0}\nFailed (no worker < 5km): ${result.unassigned?.length || 0}`
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
        if (reportToAssign) handleCloseModal();

        const token = getToken();
        try {
            const res = await fetch(`http://localhost:8001/api/admin/reports/${reportId}/assign`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ workerId })
            });
            const data = await res.json();
            if (data.success) {
                setReports(prev => prev.map(r => r._id === reportId ? { ...r, justAssignedTo: workerName } : r));
                setTimeout(() => {
                    setReports(prev => prev.filter(r => r._id !== reportId));
                }, 2000);
            } else {
                alert(`Assignment failed: ${data.message}`);
            }
        } catch (err) { alert("An error occurred during assignment."); }
        setIsAssigning(null);
    };

    // --- Initial Load Effect ---
    useEffect(() => {
        fetchReports();
        fetchWorkers();
    }, [fetchReports, fetchWorkers]);

    useEffect(() => {
        if (!reportToAssign) {
            setWorkersWithDistance([]); // Clear list when modal is closed
            return;
        }

        const reportLoc = reportToAssign.location?.coordinates; // [lng, lat]

        // Check if report location is valid (not null and not [0, 0])
        const isReportLocValid = reportLoc && (reportLoc[0] !== 0 || reportLoc[1] !== 0);

        const workersWithDist = workers
            .map(worker => {
                const workerLoc = worker.workerDetails?.currentLocation;

                // Check if worker location is valid
                const isWorkerLocValid = workerLoc && 
                                         typeof workerLoc.latitude === 'number' && 
                                         typeof workerLoc.longitude === 'number' && 
                                         (workerLoc.latitude !== 0 || workerLoc.longitude !== 0);

                // Only calculate distance if BOTH locations are valid
                const distance = (isReportLocValid && isWorkerLocValid)
                    ? getDistanceFromLatLonInKm(reportLoc[1], reportLoc[0], workerLoc.latitude, workerLoc.longitude)
                    : null; // Set to null if either location is invalid

                return { ...worker, distance };
            });

        setWorkersWithDistance(workersWithDist);

    }, [reportToAssign, workers]); // Runs when reportToAssign or workers list changes

    const handleOpenModal = (report) => {
        setReportToAssign(report);
    };

    const handleCloseModal = () => {
        setReportToAssign(null);
    };


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

                <div className="md:col-span-2">
                    {view === 'unassigned' && (
                        <div className="grid gap-4">
                            {reportsLoading && <p>Loading reports and calculating road distances...</p>}
                            {!reportsLoading && reports.length === 0 && <p>🎉 No unassigned reports!</p>}
                            {reports.map((report) => {
                                const bestMatch = findBestWorker(report);
                                return (
                                    <UnassignedReportCard
                                        key={report._id}
                                        report={report}
                                        bestMatch={bestMatch}
                                        onAssign={handleManualAssign}
                                        onManualAssign={handleOpenModal}
                                        isAssigning={isAssigning === report._id}
                                        isGeocoding={false}
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