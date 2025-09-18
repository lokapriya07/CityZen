import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "./lib/utils"; // ✅ correct



const defaultReports = [
  {
    id: "1",
    type: "Overflowing Bin",
    location: "Main Street & 5th Ave",
    coordinates: { lat: 40.7128, lng: -74.006 },
    status: "submitted",
    priority: "high",
    reportedAt: new Date().toISOString(),
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
    reportedAt: new Date().toISOString(),
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
    reportedAt: new Date().toISOString(),
    reportedBy: "Mike Johnson",
    description: "Scheduled waste collection was missed this morning",
  },
]

const defaultWorkers = [
  {
    id: "w1",
    name: "Alex Rodriguez",
    phone: "+1-555-0101",
    avatar: "/placeholder.svg",
    status: "available",
    currentLocation: { lat: 40.7128, lng: -74.006 },
    specialization: ["general_waste", "recycling"],
    rating: 4.8,
    completedTasks: 156,
    currentTask: null,
    points: 1656,
  },
  {
    id: "w2",
    name: "Sarah Chen",
    phone: "+1-555-0102",
    avatar: "/placeholder.svg",
    status: "available",
    currentLocation: { lat: 40.7589, lng: -73.9851 },
    specialization: ["hazardous_waste", "illegal_dumping"],
    rating: 4.9,
    completedTasks: 203,
    currentTask: null,
    points: 2128,
  },
  {
    id: "w3",
    name: "David Kim",
    phone: "+1-555-0103",
    avatar: "/placeholder.svg",
    status: "busy",
    currentLocation: { lat: 40.7505, lng: -73.9934 },
    specialization: ["organic_waste", "composting"],
    rating: 4.6,
    completedTasks: 134,
    currentTask: "Cleaning up spill on Broadway",
    points: 1432,
  },
]

export function TaskAssignmentHub({ reports = defaultReports, workers = defaultWorkers }) {
  const [draggedTask, setDraggedTask] = useState(null)
  const [assignments, setAssignments] = useState({})
  const [selectedWorker, setSelectedWorker] = useState(null)

  const safeReports = reports || []
  const safeWorkers = workers || []

  // Enhanced workers with points system
  const enhancedWorkers = safeWorkers.map((worker) => ({
    ...worker,
    points: worker.completedTasks * 10 + Math.floor(worker.rating * 20),
    efficiency: worker.completedTasks > 0 ? Math.floor(worker.rating * 20) : 0,
  }))

  const unassignedReports = safeReports.filter((report) => report.status === "submitted" && !assignments[report.id])

  const handleDragStart = (taskId) => {
    setDraggedTask(taskId)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (workerId) => {
    if (draggedTask) {
      setAssignments((prev) => ({
        ...prev,
        [draggedTask]: workerId,
      }))
      setDraggedTask(null)
    }
  }

  const calculateDistance = (coord1, coord2) => {
    const R = 6371
    const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180
    const dLon = ((coord2.lng - coord1.lng) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((coord1.lat * Math.PI) / 180) *
        Math.cos((coord2.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const getRecommendedWorker = (report) => {
    const availableWorkers = enhancedWorkers.filter((w) => w.status === "available")
    if (availableWorkers.length === 0) return null

    const scoredWorkers = availableWorkers.map((worker) => {
      const distance = calculateDistance(report.coordinates, worker.currentLocation)
      const specializationMatch = worker.specialization.some((spec) =>
        report.type.toLowerCase().includes(spec.replace("_", " ")),
      )

      const score = (specializationMatch ? 50 : 0) + worker.rating * 10 + (10 - Math.min(distance, 10))

      return { ...worker, score, distance }
    })

    return scoredWorkers.sort((a, b) => b.score - a.score)[0]
  }

  const autoAssignTask = (taskId) => {
    const report = safeReports.find((r) => r.id === taskId)
    if (!report) return

    const recommendedWorker = getRecommendedWorker(report)
    if (recommendedWorker) {
      setAssignments((prev) => ({
        ...prev,
        [taskId]: recommendedWorker.id,
      }))
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical":
        return "border-red-500 bg-red-50"
      case "high":
        return "border-orange-500 bg-orange-50"
      case "medium":
        return "border-yellow-500 bg-yellow-50"
      default:
        return "border-gray-300 bg-gray-50"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-500"
      case "busy":
        return "bg-orange-500"
      case "offline":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Task Assignment Hub</h2>
          <p className="text-muted-foreground">Drag and drop tasks to assign workers efficiently</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            Auto-Assign All
          </Button>
          <Button size="sm">Add Worker</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Unassigned Tasks */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Unassigned Tasks</span>
                <Badge variant="destructive">{unassignedReports.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
              {unassignedReports.map((report) => {
                const recommendedWorker = getRecommendedWorker(report)
                return (
                  <div
                    key={report.id}
                    draggable
                    onDragStart={() => handleDragStart(report.id)}
                    className={cn(
                      "p-4 rounded-lg border-2 border-dashed cursor-move transition-all hover:shadow-md",
                      getPriorityColor(report.priority),
                      draggedTask === report.id ? "opacity-50 scale-95" : "",
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-sm">{report.type}</h4>
                        <p className="text-xs text-muted-foreground">{report.location}</p>
                      </div>
                      <Badge variant="outline" className="capitalize text-xs">
                        {report.priority}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{report.description}</p>

                    {recommendedWorker && (
                      <div className="bg-white/80 rounded p-2 mb-2">
                        <p className="text-xs font-medium text-green-700">Recommended:</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Avatar className="w-5 h-5">
                            <AvatarImage src={recommendedWorker.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-xs">
                              {recommendedWorker.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs">{recommendedWorker.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {recommendedWorker.distance.toFixed(1)}km
                          </Badge>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {new Date(report.reportedAt).toLocaleDateString()}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 text-xs bg-transparent"
                        onClick={() => autoAssignTask(report.id)}
                      >
                        Auto-Assign
                      </Button>
                    </div>
                  </div>
                )
              })}

              {unassignedReports.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>All tasks have been assigned!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Workers */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Available Workers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {enhancedWorkers.map((worker) => {
                  const assignedTasks = Object.entries(assignments)
                    .filter(([_, workerId]) => workerId === worker.id)
                    .map(([taskId]) => safeReports.find((r) => r.id === taskId))
                    .filter(Boolean)

                  return (
                    <div
                      key={worker.id}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(worker.id)}
                      className={cn(
                        "p-4 rounded-lg border-2 border-dashed transition-all",
                        worker.status === "available"
                          ? "border-green-300 bg-green-50 hover:border-green-500"
                          : worker.status === "busy"
                          ? "border-orange-300 bg-orange-50"
                          : "border-gray-300 bg-gray-50",
                        selectedWorker === worker.id ? "ring-2 ring-primary" : "",
                        draggedTask ? "border-primary bg-primary/5" : "",
                      )}
                      onClick={() => setSelectedWorker(selectedWorker === worker.id ? null : worker.id)}
                    >
                      {/* Worker Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={worker.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {worker.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className={cn(
                                "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white",
                                getStatusColor(worker.status),
                              )}
                            ></div>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">{worker.name}</h4>
                            <p className="text-xs text-muted-foreground capitalize">{worker.status}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            <span className="text-xs font-medium">{worker.rating}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{worker.points} pts</p>
                        </div>
                      </div>

                      {/* Worker Stats */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="text-center p-2 bg-white/50 rounded">
                          <p className="text-xs text-muted-foreground">Completed</p>
                          <p className="font-medium text-sm">{worker.completedTasks}</p>
                        </div>
                        <div className="text-center p-2 bg-white/50 rounded">
                          <p className="text-xs text-muted-foreground">Efficiency</p>
                          <p className="font-medium text-sm">{worker.efficiency}%</p>
                        </div>
                      </div>

                      {/* Specializations */}
                      <div className="mb-3">
                        <p className="text-xs text-muted-foreground mb-1">Specializations:</p>
                        <div className="flex flex-wrap gap-1">
                          {worker.specialization.map((spec) => (
                            <Badge key={spec} variant="secondary" className="text-xs">
                              {spec.replace("_", " ")}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Assigned Tasks */}
                      {assignedTasks.length > 0 && (
                        <div className="border-t pt-3">
                          <p className="text-xs text-muted-foreground mb-2">Assigned Tasks:</p>
                          <div className="space-y-2">
                            {assignedTasks.map((task) => (
                              <div key={task?.id} className="bg-white/80 rounded p-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-medium">{task?.type}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {task?.priority}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">{task?.location}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Drop Zone Indicator */}
                      {draggedTask && worker.status === "available" && (
                        <div className="border-t pt-3 mt-3">
                          <div className="text-center py-2 bg-primary/10 rounded border-2 border-dashed border-primary">
                            <p className="text-xs text-primary font-medium">Drop task here to assign</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
