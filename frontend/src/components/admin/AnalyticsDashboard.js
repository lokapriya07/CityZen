"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../citizen/ui/card";
import { Badge } from "../citizen/ui/badge";
import { Button } from "../citizen/ui/button";
import { Progress } from "../citizen/ui/progress";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export function AnalyticsDashboard({ reports = [], workers = [] }) {
  // --- Mock data for demonstration ---
  const mockWorkers =
    workers.length > 0
      ? workers
      : [
        {
          id: "1",
          name: "John Smith",
          phone: "+1234567890",
          avatar: "/male-worker.jpg",
          status: "available",
          currentLocation: { lat: 40.7128, lng: -74.006 },
          specialization: ["Bin Collection", "Street Cleaning"],
          rating: 4.8,
          completedTasks: 156,
          currentTask: null,
        },
        {
          id: "2",
          name: "Sarah Johnson",
          phone: "+1234567891",
          avatar: "/female-worker.jpg",
          status: "busy",
          currentLocation: { lat: 40.7589, lng: -73.9851 },
          specialization: ["Hazardous Waste", "Recycling"],
          rating: 4.9,
          completedTasks: 203,
          currentTask: "TASK-001",
        },
        {
          id: "3",
          name: "Mike Davis",
          phone: "+1234567892",
          avatar: "/hardworking-construction-worker.png",
          status: "available",
          currentLocation: { lat: 40.7505, lng: -73.9934 },
          specialization: ["Bin Repair", "Equipment Maintenance"],
          rating: 4.6,
          completedTasks: 134,
          currentTask: null,
        },
      ];

  const mockReports =
    reports.length > 0
      ? reports
      : [
        {
          id: "1",
          type: "Overflowing Bin",
          location: "Park Street, Block A",
          coordinates: { lat: 40.7128, lng: -74.006 },
          status: "resolved",
          priority: "high",
          reportedAt: "2024-01-15T08:30:00Z",
          reportedBy: "user123",
          description: "Bin is overflowing with garbage",
          assignedWorker: "John Smith",
          resolvedAt: "2024-01-15T10:45:00Z",
        },
        {
          id: "2",
          type: "Illegal Dumping",
          location: "Main Road, Sector 15",
          coordinates: { lat: 40.7589, lng: -73.9851 },
          status: "in-progress",
          priority: "critical",
          reportedAt: "2024-01-15T09:15:00Z",
          reportedBy: "user456",
          description: "Large furniture dumped illegally",
          assignedWorker: "Sarah Johnson",
        },
      ];

  const weeklyTrends = [
    { day: "Mon", complaints: 12, resolved: 8 },
    { day: "Tue", complaints: 19, resolved: 15 },
    { day: "Wed", complaints: 8, resolved: 12 },
    { day: "Thu", complaints: 15, resolved: 11 },
    { day: "Fri", complaints: 22, resolved: 18 },
    { day: "Sat", complaints: 18, resolved: 16 },
    { day: "Sun", complaints: 9, resolved: 7 },
  ];

  const monthlyTrends = [
    { month: "Jan", complaints: 245, resolved: 198 },
    { month: "Feb", complaints: 289, resolved: 234 },
    { month: "Mar", complaints: 312, resolved: 267 },
    { month: "Apr", complaints: 278, resolved: 245 },
  ];

  const resolutionTimes = [
    { category: "Overflowing Bin", avgTime: 2.5, target: 4 },
    { category: "Illegal Dumping", avgTime: 6.2, target: 8 },
  ];

  const workerPerformance = mockWorkers.map((worker) => ({
    name: worker.name,
    completed: worker.completedTasks,
    rating: worker.rating,
    efficiency: Math.floor(worker.rating * 20),
  }));

  const complaintTypes = [
    { name: "Overflowing Bin", value: 35, color: "#0891b2" },
    { name: "Illegal Dumping", value: 25, color: "#dc2626" },
    { name: "Broken Bin", value: 20, color: "#f59e0b" },
    { name: "Missed Collection", value: 15, color: "#84cc16" },
    { name: "Other", value: 5, color: "#6b7280" },
  ];

  const repeatZones = [
    { zone: "Block A - Park Street", incidents: 15, trend: "increasing" },
    { zone: "Sector 15 - Main Road", incidents: 12, trend: "stable" },
  ];

  const calculateAverageResolutionTime = () => {
    const resolvedReports = mockReports.filter(
      (r) => r.status === "resolved" && r.resolvedAt
    );
    if (resolvedReports.length === 0) return 0;
    const totalTime = resolvedReports.reduce((acc, report) => {
      const reported = new Date(report.reportedAt);
      const resolved = new Date(report.resolvedAt);
      return acc + (resolved - reported) / (1000 * 60 * 60);
    }, 0);
    return totalTime / resolvedReports.length;
  };

  const resolutionRate =
    mockReports.length > 0
      ? (mockReports.filter((r) => r.status === "resolved").length /
        mockReports.length) *
      100
      : 0;

  const avgResolutionTime = calculateAverageResolutionTime();

  // --- Responsive Layout ---
  return (
    <div className="space-y-6 p-3 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground text-center sm:text-left">
            Analytics & Compliance
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base text-center sm:text-left">
            Performance insights and operational metrics
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            📄 Export Report
          </Button>
          <Button size="sm" className="w-full sm:w-auto">
            🔄 Refresh Data
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Resolution Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {resolutionRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              +2.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Resolution Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {avgResolutionTime.toFixed(1)}h
            </div>
            <p className="text-xs text-muted-foreground">
              -0.8h from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Active Workers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {mockWorkers.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {mockWorkers.filter((w) => w.status === "available").length}{" "}
              available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Repeat Zones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {repeatZones.length}
            </div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Complaint Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="complaints" stroke="#dc2626" />
                <Line type="monotone" dataKey="resolved" stroke="#84cc16" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="complaints" fill="#0891b2" />
                <Bar dataKey="resolved" fill="#84cc16" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Resolution Times & Complaint Types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resolution Times */}
        <Card>
          <CardHeader>
            <CardTitle>Resolution Times by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {resolutionTimes.map((item) => (
                <div key={item.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.category}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        {item.avgTime}h avg
                      </span>
                      <Badge
                        className={`text-xs px-2 py-0.5 rounded-full ${item.avgTime <= item.target
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : "bg-red-100 text-red-700 border border-red-300"
                          }`}
                      >
                        Target: {item.target}h
                      </Badge>
                    </div>
                  </div>
                  <Progress
                    value={(item.avgTime / item.target) * 100}
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Complaint Types */}
        <Card>
          <CardHeader>
            <CardTitle>Complaint Types Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={complaintTypes}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {complaintTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Worker Performance & Repeat Zones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Worker Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Worker Performance Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {workerPerformance.map((worker) => (
                <div
                  key={worker.name}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg gap-2"
                >
                  <div>
                    <h4 className="font-medium text-sm">{worker.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {worker.completed} tasks completed
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-yellow-600">
                      ⭐ {worker.rating}
                    </span>
                    <Progress value={worker.efficiency} className="w-20 h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Repeat Zones */}
        <Card>
          <CardHeader>
            <CardTitle>Repeat Complaint Zones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {repeatZones.map((zone) => (
                <div
                  key={zone.zone}
                  className="flex items-center justify-between p-3 border border-border rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-sm">{zone.zone}</h4>
                    <p className="text-xs text-muted-foreground">
                      {zone.incidents} incidents this month
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      className={`text-xs ${zone.trend === "increasing"
                          ? "bg-red-100 text-red-700"
                          : zone.trend === "decreasing"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {zone.trend === "increasing" && "↗"}
                      {zone.trend === "decreasing" && "↘"}
                      {zone.trend === "stable" && "→"} {zone.trend}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 text-xs bg-transparent"
                    >
                      Investigate
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
