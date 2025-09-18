"use client";

import React from 'react';
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

// --- UI Component Definitions ---
// These are simple functional replacements for the custom components 
// imported in the original code (e.g., from "@/components/ui/...").

const Card = ({ children, className = '' }) => (
  <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = '' }) => (
  <div className={`p-6 pb-4 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, className = '', variant = 'default' }) => {
  const baseClasses = "px-2.5 py-0.5 text-xs font-semibold rounded-full inline-block";
  const variants = {
    default: "bg-gray-100 text-gray-800",
    secondary: "bg-green-100 text-green-800",
    destructive: "bg-red-100 text-red-800",
    outline: "border border-gray-300 text-gray-700",
  };
  return (
    <span className={`${baseClasses} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Button = ({ children, className = '', variant = 'default', size = 'default', ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-800",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
  };
  return (
    <button className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Progress = ({ value, className = '' }) => (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
        <div className={`bg-blue-600 h-2 rounded-full`} style={{ width: `${value}%` }}></div>
    </div>
);

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
    <div className="space-y-6 p-6 bg-gray-50">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Analytics & Compliance</h2>
          <p className="text-gray-500">Performance insights and operational metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Resolution Rate</CardTitle>
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{resolutionRate.toFixed(1)}%</div>
            <p className="text-xs text-gray-500">+2.5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Avg Resolution Time</CardTitle>
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{avgResolutionTime.toFixed(1)}h</div>
            <p className="text-xs text-gray-500">-0.8h from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Workers</CardTitle>
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{mockWorkers.filter((w) => w.status !== "offline").length}</div>
            <p className="text-xs text-gray-500">{mockWorkers.filter((w) => w.status === "available").length} available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Repeat Zones</CardTitle>
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{repeatZones.length}</div>
            <p className="text-xs text-gray-500">Require attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle>Weekly Complaint Trends</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><LineChart data={weeklyTrends}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Line type="monotone" dataKey="complaints" stroke="#dc2626" strokeWidth={2} name="New Complaints" /><Line type="monotone" dataKey="resolved" stroke="#84cc16" strokeWidth={2} name="Resolved" /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle>Monthly Performance</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><BarChart data={monthlyTrends}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Bar dataKey="complaints" fill="#0891b2" name="Complaints" /><Bar dataKey="resolved" fill="#84cc16" name="Resolved" /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card className="lg:col-span-2"><CardHeader><CardTitle>Resolution Times by Category</CardTitle></CardHeader><CardContent><div className="space-y-4">{resolutionTimes.map((item) => (<div key={item.category} className="space-y-2"><div className="flex items-center justify-between"><span className="text-sm font-medium">{item.category}</span><div className="flex items-center space-x-2"><span className="text-sm text-gray-500">{item.avgTime}h avg</span><Badge variant={item.avgTime <= item.target ? "secondary" : "destructive"} className="text-xs">Target: {item.target}h</Badge></div></div><Progress value={(item.avgTime / item.target) * 100} /></div>))}</div></CardContent></Card>
        <Card className="lg:col-span-2"><CardHeader><CardTitle>Complaint Types Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><PieChart><Pie data={complaintTypes} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>{complaintTypes.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>
    </div>
  )
}

export default AnalyticsDashboard;

