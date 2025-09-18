import React, { useState } from "react";

// --- UI Component Definitions ---
// Updated to match the new design from the image.

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

const defaultReports = [
    {
        id: "1",
        type: "Overflowing Bin",
        location: "Main Street & 5th Ave",
        coordinates: { lat: 40.7128, lng: -74.006 },
        status: "submitted",
        priority: "high",
        reportedAt: new Date(2025, 8, 18).toISOString(),
        reportedBy: "John Doe",
        description: "Large waste bin is overflowing with garbage spilling onto sidewalk",
    },
    {
        id: "2",
        type: "Illegal Dumping",
        location: "Park Avenue",
        coordinates: { lat: 40.7589, lng: -73.9851 },
        status: "submitted",
        priority: "critical",
        reportedAt: new Date(2025, 8, 18).toISOString(),
        reportedBy: "Jane Smith",
        description: "Construction debris dumped illegally near residential area",
    },
    {
        id: "3",
        type: "Missed Collection",
        location: "Oak Street",
        coordinates: { lat: 40.7505, lng: -73.9934 },
        status: "submitted",
        priority: "medium",
        reportedAt: new Date(2025, 8, 18).toISOString(),
        reportedBy: "Mike Johnson",
        description: "Scheduled waste collection was missed this morning",
    },
];

const defaultWorkers = [
    {
        id: "w1",
        name: "Alex Rodriguez",
        phone: "+1-555-0101",
        avatar: "https://placehold.co/100x100/A7C7E7/333333?text=AR",
        status: "available",
        currentLocation: { lat: 40.7128, lng: -74.006 },
        specialization: ["general waste", "recycling"],
        rating: 4.8,
        completedTasks: 156,
        currentTask: null,
        points: 1656,
    },
    {
        id: "w2",
        name: "Sarah Chen",
        phone: "+1-555-0102",
        avatar: "https://placehold.co/100x100/F2D2BD/333333?text=SC",
        status: "available",
        currentLocation: { lat: 40.7589, lng: -73.9851 },
        specialization: ["hazardous waste", "illegal dumping"],
        rating: 4.9,
        completedTasks: 203,
        currentTask: null,
        points: 2128,
    },
    {
        id: "w3",
        name: "David Kim",
        phone: "+1-555-0103",
        avatar: "https://placehold.co/100x100/C1E1C1/333333?text=DK",
        status: "busy",
        currentLocation: { lat: 40.7505, lng: -73.9934 },
        specialization: ["organic waste", "composting"],
        rating: 4.6,
        completedTasks: 134,
        currentTask: "Cleaning up spill on Broadway",
        points: 1432,
    },
];

export function TaskAssignmentHub({ reports = defaultReports, workers = defaultWorkers }) {
    const [draggedTask, setDraggedTask] = useState(null)
    const [assignments, setAssignments] = useState({})

    const safeReports = reports || []
    const safeWorkers = workers || []

    const enhancedWorkers = safeWorkers.map((worker) => ({
        ...worker,
        efficiency: worker.completedTasks > 0 ? Math.floor(worker.rating * 20) : 0,
    }));

    const unassignedReports = safeReports.filter((report) => !Object.values(assignments).includes(report.id));

    const handleDragStart = (taskId) => {
        setDraggedTask(taskId);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (workerId) => {
        const worker = enhancedWorkers.find(w => w.id === workerId);
        if (draggedTask && worker && worker.status === 'available') {
            setAssignments((prev) => ({
                ...prev,
                [workerId]: [...(prev[workerId] || []), draggedTask]
            }));
            setDraggedTask(null);
        }
    };

    const calculateDistance = (coord1, coord2) => {
        const R = 6371;
        const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
        const dLon = ((coord2.lng - coord1.lng) * Math.PI) / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((coord1.lat * Math.PI) / 180) * Math.cos((coord2.lat * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const getRecommendedWorker = (report) => {
        const availableWorkers = enhancedWorkers.filter((w) => w.status === "available");
        if (availableWorkers.length === 0) return null;
        const scoredWorkers = availableWorkers.map((worker) => {
            const distance = calculateDistance(report.coordinates, worker.currentLocation);
            const specializationMatch = worker.specialization.some((spec) => report.type.toLowerCase().includes(spec));
            const score = (specializationMatch ? 50 : 0) + worker.rating * 10 + (10 - Math.min(distance, 10));
            return { ...worker, score, distance };
        });
        return scoredWorkers.sort((a, b) => b.score - a.score)[0];
    };

    const autoAssignTask = (taskId) => {
        const report = safeReports.find((r) => r.id === taskId);
        if (!report) return;
        const recommendedWorker = getRecommendedWorker(report);
        if (recommendedWorker) {
            handleDrop(recommendedWorker.id);
        }
    };
    
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

    return (
        <div className="space-y-6 p-4 md:p-6 bg-gray-50 font-sans">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Unassigned Tasks Column */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700">Unassigned Tasks</h3>
                    {unassignedReports.map((report) => {
                        const recommendedWorker = getRecommendedWorker(report);
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
                                    <Button onClick={() => autoAssignTask(report.id)}>Auto-Assign</Button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Workers Column */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700">Workers</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {enhancedWorkers.map((worker) => (
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
                                            <span className="text-sm font-semibold text-gray-700">{worker.rating}</span>
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

