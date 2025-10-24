import React, { useEffect, useState } from "react";

export default function WasteHeatmap() {
  const [reports, setReports] = useState([]);
  const [isLeafletReady, setIsLeafletReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const MAP_ID = "leaflet-heatmap";
  const CENTER = { lat: 17.385, lng: 78.4867 };
  const ZOOM = 12;

  // ✅ Catch external script errors for debugging
  useEffect(() => {
    const handleGlobalError = (e) => {
      console.error("⚠️ Global script error caught:", e.message, e.filename);
    };
    window.addEventListener("error", handleGlobalError);
    return () => window.removeEventListener("error", handleGlobalError);
  }, []);

  // ✅ Dynamically load Leaflet and Heatmap scripts safely
  useEffect(() => {
    const loadLeafletAssets = async () => {
      try {
        if (window.L && window.L.heatLayer) {
          setIsLeafletReady(true);
          return;
        }

        // Load Leaflet CSS
        if (!document.getElementById("leaflet-css")) {
          const link = document.createElement("link");
          link.id = "leaflet-css";
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          link.crossOrigin = "anonymous"; // ✅ prevent CORS errors
          document.head.appendChild(link);
        }

        // Load Leaflet JS
        if (!document.getElementById("leaflet-js")) {
          const script = document.createElement("script");
          script.id = "leaflet-js";
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          script.crossOrigin = "anonymous";
          document.body.appendChild(script);
          await new Promise((res) => (script.onload = res));
        }

        // Load Heatmap Plugin
        if (!document.getElementById("leaflet-heat-js")) {
          const heatScript = document.createElement("script");
          heatScript.id = "leaflet-heat-js";
          heatScript.src = "https://unpkg.com/leaflet.heat/dist/leaflet-heat.js";
          heatScript.crossOrigin = "anonymous";
          document.body.appendChild(heatScript);
          await new Promise((res) => (heatScript.onload = res));
        }

        if (window.L && window.L.heatLayer) {
          console.log("✅ Leaflet and Heatmap loaded successfully");
          setIsLeafletReady(true);
        } else {
          console.warn("⚠️ Leaflet or heatLayer not available yet");
        }
      } catch (err) {
        console.error("❌ Leaflet loading failed:", err);
      }
    };

    loadLeafletAssets();
  }, []);

  // ✅ Fetch reports periodically from backend
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await fetch("/api/reports", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();

        if (result.success && result.data) {
          setReports(result.data);
        } else {
          console.warn("Failed to fetch reports:", result.message);
        }
      } catch (err) {
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
    const interval = setInterval(fetchReports, 15000); // every 15 seconds
    return () => clearInterval(interval);
  }, []);

  // ✅ Initialize map safely after scripts + data are ready
  useEffect(() => {
    const initializeMap = () => {
      try {
        const L = window.L;
        if (!L || !L.heatLayer) return;

        if (window._heatmap_map) window._heatmap_map.remove();

        const map = L.map(MAP_ID, { attributionControl: false }).setView(
          [CENTER.lat, CENTER.lng],
          ZOOM
        );

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 18,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        const heatPoints = reports
          .filter((r) => r.location && Array.isArray(r.location.coordinates))
          .map((r) => {
            const [lng, lat] = r.location.coordinates;
            const intensity =
              r.urgency === "high"
                ? 0.9
                : r.urgency === "medium"
                  ? 0.6
                  : 0.3;
            return [lat, lng, intensity];
          });

        if (heatPoints.length > 0) {
          L.heatLayer(heatPoints, {
            radius: 30,
            blur: 20,
            maxZoom: 17,
            minOpacity: 0.3,
          }).addTo(map);
        }

        window._heatmap_map = map;
      } catch (err) {
        console.error("❌ Map initialization failed:", err);
      }
    };

    let checkInterval;
    if (isLeafletReady) {
      checkInterval = setInterval(() => {
        if (window.L && window.L.heatLayer) {
          initializeMap();
          clearInterval(checkInterval);
        }
      }, 200);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
      if (window._heatmap_map) {
        window._heatmap_map.remove();
        window._heatmap_map = null;
      }
    };
  }, [isLeafletReady, reports]);

  // ✅ Loading Spinner Component
  const Spinner = () => (
    <div className="flex flex-col items-center justify-center space-y-2 py-6 text-gray-600">
      <svg
        className="animate-spin h-8 w-8 text-green-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        ></path>
      </svg>
      <p className="text-sm font-medium">
        {isLeafletReady
          ? "Fetching latest waste reports..."
          : "Loading map scripts..."}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Header */}
        <div className="bg-white p-4 rounded-xl shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              🗺️ Waste Reports Heatmap
            </h2>
            <p className="text-sm text-gray-600">
              Live visualization of all submitted waste reports.
            </p>
          </div>
          <p className="text-gray-700 text-sm mt-2 sm:mt-0">
            Total Reports:{" "}
            <span className="font-semibold">{reports.length}</span>
          </p>
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="h-[650px]" id={MAP_ID}>
            {(!isLeafletReady || loading) && <Spinner />}
          </div>
        </div>
      </div>
    </div>
  );
}
