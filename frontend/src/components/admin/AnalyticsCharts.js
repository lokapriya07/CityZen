import React from "react";

export function AnalyticsCharts() {
  const metrics = [
    { title: "Total Complaints", value: "1,234", change: "+12%", trend: "up", description: "vs last month" },
    { title: "Avg Resolution Time", value: "2.3h", change: "-15%", trend: "down", description: "vs last month" },
    { title: "Worker Efficiency", value: "94%", change: "+3%", trend: "up", description: "completion rate" },
    { title: "Repeat Complaints", value: "8%", change: "-5%", trend: "down", description: "same location" },
  ];

  const workerPerformance = [
    { name: "Maria Garcia", completed: 45, avgTime: "1.8h", rating: 4.9, efficiency: 98 },
    { name: "John Smith", completed: 42, avgTime: "2.1h", rating: 4.8, efficiency: 95 },
    { name: "David Chen", completed: 38, avgTime: "2.3h", rating: 4.7, efficiency: 92 },
    { name: "Sarah Johnson", completed: 35, avgTime: "2.5h", rating: 4.6, efficiency: 89 },
  ];

  const complaintTrends = [
    { day: "Mon", complaints: 12, resolved: 10 },
    { day: "Tue", complaints: 15, resolved: 14 },
    { day: "Wed", complaints: 8, resolved: 8 },
    { day: "Thu", complaints: 18, resolved: 16 },
    { day: "Fri", complaints: 22, resolved: 20 },
    { day: "Sat", complaints: 25, resolved: 23 },
    { day: "Sun", complaints: 14, resolved: 12 },
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className="border rounded p-4 shadow bg-white">
            <div className="text-sm font-semibold mb-2">{metric.title}</div>
            <div className="text-2xl font-bold">{metric.value}</div>
            <div className="flex items-center gap-2 mt-1 text-sm">
              <span>{metric.trend === "up" ? "📈" : "📉"}</span>
              <span className={metric.trend === "up" ? "text-green-600" : "text-red-600"}>{metric.change}</span>
              <span className="text-gray-500">{metric.description}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Complaint Trends */}
        <div className="border rounded shadow bg-white p-4">
          <div className="text-lg font-bold mb-1">Daily Complaint Trends</div>
          <div className="text-sm text-gray-500 mb-4">Complaints received vs resolved this week</div>
          <div className="space-y-3">
            {complaintTrends.map((day, idx) => {
              const percentage = Math.round((day.resolved / day.complaints) * 100);
              return (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-12 font-medium text-sm">{day.day}</div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Received: {day.complaints}</span>
                      <span className="text-gray-500">Resolved: {day.resolved}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded" style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                  <div className="text-sm font-medium">{percentage}%</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Worker Performance */}
        <div className="border rounded shadow bg-white p-4">
          <div className="text-lg font-bold mb-1">Worker Performance</div>
          <div className="text-sm text-gray-500 mb-4">Top performers this month</div>
          <div className="space-y-3">
            {workerPerformance.map((worker, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-semibold text-sm">{worker.name}</div>
                  <div className="text-xs text-gray-500">{worker.completed} tasks • Avg {worker.avgTime}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{worker.efficiency}%</div>
                  <div className="text-xs text-gray-500">⭐ {worker.rating}</div>
                </div>
                <div className={`px-2 py-1 text-xs rounded ${worker.efficiency >= 95 ? "bg-green-200" : "bg-blue-200"}`}>
                  {worker.efficiency >= 95 ? "Excellent" : "Good"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Repeat Complaint Zones */}
      <div className="border rounded shadow bg-white p-4">
        <div className="text-lg font-bold mb-1">⚠️ Repeat Complaint Zones</div>
        <div className="text-sm text-gray-500 mb-4">Areas with recurring waste issues</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border bg-red-50 text-red-600">
            <div className="font-semibold text-sm">Downtown Plaza</div>
            <div className="text-xs text-gray-500 mb-1">Commercial District</div>
            <div className="text-2xl font-bold">8</div>
            <div className="text-xs text-gray-500">complaints this week</div>
          </div>
          <div className="p-4 rounded-lg border bg-orange-50 text-orange-600">
            <div className="font-semibold text-sm">Industrial Area B</div>
            <div className="text-xs text-gray-500 mb-1">Manufacturing Zone</div>
            <div className="text-2xl font-bold">5</div>
            <div className="text-xs text-gray-500">complaints this week</div>
          </div>
          <div className="p-4 rounded-lg border bg-yellow-50 text-yellow-600">
            <div className="font-semibold text-sm">Park Avenue</div>
            <div className="text-xs text-gray-500 mb-1">Residential Area</div>
            <div className="text-2xl font-bold">3</div>
            <div className="text-xs text-gray-500">complaints this week</div>
          </div>
        </div>
      </div>
    </div>
  );
}
