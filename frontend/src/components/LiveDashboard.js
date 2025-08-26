"use client"

import { useState, useEffect } from "react"
import { Activity, MapPin, Clock, CheckCircle } from "lucide-react"

const LiveDashboard = () => {
  const [reports, setReports] = useState([
    { id: 1, location: "Park Avenue", status: "In Progress", time: "2 hours ago", priority: "High" },
    { id: 2, location: "Main Street", status: "Completed", time: "4 hours ago", priority: "Medium" },
    { id: 3, location: "Oak Road", status: "Assigned", time: "6 hours ago", priority: "Low" },
    { id: 4, location: "Pine Street", status: "Reported", time: "8 hours ago", priority: "High" },
  ])

  const [stats, setStats] = useState({
    active: 12,
    completed: 45,
    pending: 8,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        active: prev.active + Math.floor(Math.random() * 3) - 1,
        completed: prev.completed + Math.floor(Math.random() * 2),
        pending: prev.pending + Math.floor(Math.random() * 3) - 1,
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "text-green-600 bg-green-100"
      case "In Progress":
        return "text-blue-600 bg-blue-100"
      case "Assigned":
        return "text-yellow-600 bg-yellow-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-600"
      case "Medium":
        return "text-yellow-600"
      default:
        return "text-green-600"
    }
  }

  return (
    <section id="dashboard" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Activity className="h-6 w-6 text-green-500" />
            <span className="text-sm font-medium text-green-500 uppercase tracking-wide">Live Dashboard</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Real-Time Waste Tracking</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Monitor cleanup progress across your community in real-time
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Reports</p>
                <p className="text-3xl font-bold text-blue-600">{stats.active}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Today</p>
                <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Assignment</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Recent Reports</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live Updates</span>
            </div>
          </div>

          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{report.location}</p>
                    <p className="text-sm text-gray-600">{report.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-medium ${getPriorityColor(report.priority)}`}>
                    {report.priority} Priority
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default LiveDashboard
