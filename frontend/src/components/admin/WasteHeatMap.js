import React from "react";
import { MapPin } from "lucide-react";

export function WasteHeatMap() {
  const hotspots = [
    { id: 1, location: "Downtown Plaza", severity: "critical", reports: 8, lat: 40.7128, lng: -74.006 },
    { id: 2, location: "Central Park East", severity: "medium", reports: 3, lat: 40.7829, lng: -73.9654 },
    { id: 3, location: "Industrial District", severity: "high", reports: 5, lat: 40.6892, lng: -74.0445 },
    { id: 4, location: "Residential Area A", severity: "low", reports: 1, lat: 40.7505, lng: -73.9934 },
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical":
        return "bg-red-600";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      default:
        return "bg-blue-600";
    }
  };

  return (
    <div className="h-[600px] rounded-lg border shadow-sm bg-white">
      {/* Header */}
      <div className="border-b px-4 py-3">
        <h2 className="flex items-center gap-2 font-semibold text-lg">
          <MapPin className="h-5 w-5" />
          City Waste Heatmap
        </h2>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="relative h-[500px] bg-gray-100 rounded-lg overflow-hidden">
          {/* Map background with grid */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50">
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%" className="text-gray-300">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
          </div>

          {/* Hotspot markers */}
          {hotspots.map((hotspot, index) => (
            <div
              key={hotspot.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{
                left: `${20 + index * 20}%`,
                top: `${30 + index * 15}%`,
              }}
            >
              {/* Pulsing circles */}
              <div className={`w-8 h-8 rounded-full ${getSeverityColor(hotspot.severity)} opacity-60 animate-pulse`} />
              <div className={`absolute inset-0 w-8 h-8 rounded-full ${getSeverityColor(hotspot.severity)} opacity-80`} />

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white border rounded-lg p-3 shadow-lg min-w-48">
                  <div className="font-semibold text-sm">{hotspot.location}</div>
                  <div className="text-xs text-gray-500 mt-1">{hotspot.reports} active reports</div>
                  <span
                    className={`inline-block mt-2 px-2 py-1 text-xs rounded-md ${
                      hotspot.severity === "critical"
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {hotspot.severity.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white border rounded-lg p-4 shadow-lg">
            <div className="text-sm font-semibold mb-2">Severity Levels</div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-600"></div> Critical
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div> High
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div> Medium
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div> Low
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="absolute top-4 right-4 space-y-2">
            <button className="border px-3 py-1.5 rounded-md text-sm bg-white hover:bg-gray-100">
              Refresh
            </button>
            <button className="border px-3 py-1.5 rounded-md text-sm bg-white hover:bg-gray-100">
              Fullscreen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
