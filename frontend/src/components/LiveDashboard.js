"use client"

import { useState, useEffect } from "react"
import { Activity } from "lucide-react"

const LiveDashboard = () => {
  const [reports, setReports] = useState([
    { id: 1, location: "Overflowing bin - Park Street", status: "In Progress", time: "Reported 5 min ago", color: "bg-orange-400" },
    { id: 2, location: "Illegal dumping - Main Ave", status: "Assigned", time: "Reported 12 min ago", color: "bg-green-600" },
    { id: 3, location: "Litter cleanup - City Center", status: "Resolved", time: "Completed 1 hour ago", color: "bg-green-500" },
  ])

  const [stats, setStats] = useState({
    filed: 24,
    resolved: 18,
    collected: 156,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        filed: prev.filed + Math.floor(Math.random() * 3),
        resolved: prev.resolved + Math.floor(Math.random() * 2),
        collected: prev.collected + Math.floor(Math.random() * 10),
      }))
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  const getStatusClass = (status) => {
    switch (status) {
      case "Resolved":
        return "border border-green-600 text-green-600 bg-green-50"
      case "Assigned":
        return "bg-green-700 text-white"
      case "In Progress":
        return "bg-yellow-400 text-black"
      default:
        return "text-gray-600"
    }
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Live Dashboard</h2>
          <p className="text-gray-600">Track waste complaints in real-time, just like order tracking</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Reports */}
          <div className="bg-green-50 p-6 rounded-xl shadow-sm border border-green-100">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-green-700" />
              <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
            </div>
            <div className="space-y-5">
              {reports.map((report) => (
                <div key={report.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className={`h-2.5 w-2.5 rounded-full ${report.color}`} />
                    <div>
                      <p className="font-medium text-gray-800">{report.location}</p>
                      <p className="text-sm text-gray-500">{report.time}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-md text-xs font-medium ${getStatusClass(report.status)}`}>
                    {report.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Impact */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Today's Impact</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-700">{stats.filed}</p>
                <p className="text-sm text-gray-600">Reports Filed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-700">{stats.resolved}</p>
                <p className="text-sm text-gray-600">Issues Resolved</p>
              </div>
            </div>
            <div className="bg-green-50 p-6 rounded-lg text-center border border-green-100">
              <p className="text-3xl font-bold text-green-700">{stats.collected} kg</p>
              <p className="text-sm text-gray-700 mt-1">Waste Collected Today</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LiveDashboard
