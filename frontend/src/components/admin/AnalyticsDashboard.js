"use client";

import React from 'react';
// Note: You'll need to have these dependencies in your project.
// This is likely from a UI library like Shadcn/ui and the Recharts library.
import { Card, CardContent, CardHeader, CardTitle } from "../citizen/ui/card";
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
    { month: "May", complaints: 334, resolved: 289 },
    { month: "Jun", complaints: 298, resolved: 276 },
  ];

  const resolutionTimes = [
    { category: "Overflowing Bin", avgTime: 2.5, target: 4 },
    { category: "Illegal Dumping", avgTime: 6.2, target: 8 },
    { category: "Broken Bin", avgTime: 12.8, target: 24 },
    { category: "Missed Collection", avgTime: 1.8, target: 2 },
    { category: "Hazardous Waste", avgTime: 4.5, target: 6 },
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
    { zone: "Block C - Community Center", incidents: 8, trend: "decreasing" },
    { zone: "Block B - Shopping Complex", incidents: 6, trend: "stable" },
    { zone: "Industrial Area - Gate 3", incidents: 4, trend: "increasing" },
  ];

  const calculateAverageResolutionTime = () => {
    const resolvedReports = mockReports.filter((r) => r.status === "resolved" && r.resolvedAt);
    if (resolvedReports.length === 0) return 0;

    const totalTime = resolvedReports.reduce((acc, report) => {
      const reported = new Date(report.reportedAt);
      const resolved = new Date(report.resolvedAt);
      return acc + (resolved.getTime() - reported.getTime()) / (1000 * 60 * 60); // hours
    }, 0);

    return totalTime / resolvedReports.length;
  };

  const resolutionRate =
    mockReports.length > 0 ? (mockReports.filter((r) => r.status === "resolved").length / mockReports.length) * 100 : 0;
  const avgResolutionTime = calculateAverageResolutionTime();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Analytics & Compliance</h2>
          <p className="text-muted-foreground">Performance insights and operational metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export Report
          </Button>
          <Button size="sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{resolutionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">+2.5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Resolution Time</CardTitle>
            <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{avgResolutionTime.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">-0.8h from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Workers</CardTitle>
            <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-4">
              {mockWorkers.filter((w) => w.status !== "offline").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {mockWorkers.filter((w) => w.status === "available").length} available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Repeat Zones</CardTitle>
            <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{repeatZones.length}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Complaint Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="complaints" stroke="#dc2626" strokeWidth={2} name="New Complaints" />
                <Line type="monotone" dataKey="resolved" stroke="#84cc16" strokeWidth={2} name="Resolved" />
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
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="complaints" fill="#0891b2" name="Complaints" />
                <Bar dataKey="resolved" fill="#84cc16" name="Resolved" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Resolution Times (colorful badges) */}
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
                      <span className="text-sm text-muted-foreground">{item.avgTime}h avg</span>
                      <Badge
                        variant={item.avgTime <= item.target ? "success" : "destructive"}
                        className={`text-xs px-2 py-0.5 rounded-full ${item.avgTime <= item.target
                          ? "bg-green-100 text-green-700 border border-green-300"
                          : "bg-red-100 text-red-700 border border-red-300"
                          }`}
                      >
                        Target: {item.target}h
                      </Badge>
                    </div>
                  </div>
                  <Progress value={(item.avgTime / item.target) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>


        {/* Complaint Types Distribution */}
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
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
            <div className="space-y-4">
              {workerPerformance.map((worker) => (
                <div key={worker.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-sm">{worker.name}</h4>
                    <p className="text-xs text-muted-foreground">{worker.completed} tasks completed</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-xs font-medium">{worker.rating}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{worker.efficiency}% efficiency</p>
                    </div>
                    <Progress value={worker.efficiency} className="w-16 h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Repeat Complaint Zones */}
        <Card>
          <CardHeader>
            <CardTitle>Repeat Complaint Zones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {repeatZones.map((zone) => (
                <div key={zone.zone} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <h4 className="font-medium text-sm">{zone.zone}</h4>
                    <p className="text-xs text-muted-foreground">{zone.incidents} incidents this month</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        zone.trend === "increasing"
                          ? "destructive"
                          : zone.trend === "decreasing"
                            ? "outline"
                            : "outline"
                      }
                      className="text-xs"
                    >
                      {zone.trend === "increasing" && "↗"}
                      {zone.trend === "decreasing" && "↘"}
                      {zone.trend === "stable" && "→"}
                      {zone.trend}
                    </Badge>
                    <Button variant="outline" size="sm" className="h-6 text-xs bg-transparent">
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