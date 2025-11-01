

import React, { useEffect, useState, useMemo, useRef } from "react";
// Import Chart.js components and the Pie chart component
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Register Chart.js components needed for the Pie chart
ChartJS.register(ArcElement, Tooltip, Legend);

export default function WasteHeatmap() {
    // --- State Variables ---
    const [reports, setReports] = useState([]); // Stores fetched report data
    const [isLeafletReady, setIsLeafletReady] = useState(false); // Tracks if Leaflet scripts are loaded
    const [loading, setLoading] = useState(true); // Tracks data fetching status

    // --- Constants ---
    const MAP_ID = "leaflet-heatmap"; // ID for the map container div
    const CENTER = { lat: 17.385, lng: 78.4867 }; // Map center (Hyderabad)
    const ZOOM = 12; // Initial map zoom level

    // --- Refs ---
    const mapRef = useRef(null); // Holds the Leaflet map instance
    const heatLayerRef = useRef(null); // Holds the Leaflet heatmap layer instance

    // --- Effect for Loading Leaflet & Heatmap Scripts via CDN ---
    useEffect(() => {
        const handleGlobalError = (e) => {
            console.error("⚠️ Global script error caught:", e.message, e.filename);
        };
        window.addEventListener("error", handleGlobalError);

        const loadLeafletAssets = async () => {
            try {
                // Check if already loaded
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
                    link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
                    link.crossOrigin = "anonymous";
                    document.head.appendChild(link);
                }

                // Load Leaflet JS (only if window.L doesn't exist)
                if (!window.L && !document.getElementById("leaflet-js")) {
                    const script = document.createElement("script");
                    script.id = "leaflet-js";
                    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
                    script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
                    script.crossOrigin = "anonymous";
                    document.body.appendChild(script);
                    await new Promise((resolve, reject) => {
                         script.onload = resolve; script.onerror = reject;
                    });
                }

                // Load Heatmap Plugin JS (only if window.L exists but L.heatLayer doesn't)
                if (window.L && !window.L.heatLayer && !document.getElementById("leaflet-heat-js")) {
                    const heatScript = document.createElement("script");
                    heatScript.id = "leaflet-heat-js";
                    heatScript.src = "https://unpkg.com/leaflet.heat/dist/leaflet-heat.js";
                    heatScript.crossOrigin = "anonymous";
                    document.body.appendChild(heatScript);
                    await new Promise((resolve, reject) => {
                        heatScript.onload = resolve; heatScript.onerror = reject;
                    });
                }


                // Final check
                if (window.L && window.L.heatLayer) {
                    console.log("✅ Leaflet and Heatmap loaded successfully via CDN");
                    setIsLeafletReady(true);
                } else {
                    console.warn("⚠️ Leaflet or heatLayer not available after loading attempts");
                }
            } catch (err) {
                console.error("❌ Leaflet/Heatmap CDN loading failed:", err);
            }
        };

        loadLeafletAssets();

        // Cleanup global error listener
        return () => window.removeEventListener("error", handleGlobalError);
    }, []); // Run only once on component mount

    // --- Effect for Fetching Report Data ---
    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("adminToken"); // Make sure this is the correct token key
                // Use the correct admin endpoint
                const res = await fetch("http://localhost:8001/api/admin/reports/all", {
                    headers: {
                        "Content-Type": "application/json",
                        ...(token && { Authorization: `Bearer ${token}` }) // Conditionally add Auth header
                    },
                });

                if (!res.ok) {
                    throw new Error(`API Error ${res.status}: ${res.statusText}`);
                }

                const result = await res.json();

                if (result.success && Array.isArray(result.data)) {
                    console.log("Fetched Reports:", result.data); // Debug log
                    setReports(result.data);
                } else {
                    console.warn("Failed to fetch reports or data format incorrect:", result.message || "Unknown API response");
                    setReports([]); // Set empty array on failure
                }
            } catch (err) {
                console.error("Error fetching reports:", err);
                setReports([]); // Set empty array on error
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
        // Removed interval fetching, fetches once on mount
    }, []); // Run only once on component mount

    // --- Memoized Calculation for Grouped Pie Chart Data (with Area Names) ---
    const chartData = useMemo(() => {
        if (loading || reports.length === 0) {
            return {
                labels: [],
                datasets: [{ data: [], backgroundColor: [], areaNames: [] }] // Add areaNames array
            };
        }

        const counts = reports.reduce((acc, report) => {
            const addressKey = report.address ? report.address.trim().toLowerCase() : 'unknown';
             if (!addressKey || addressKey === 'unknown' || /^\d+\.\d+, [-]?\d+\.\d+$/.test(addressKey)) {
                 return acc;
             }
            acc[addressKey] = (acc[addressKey] || 0) + 1;
            return acc;
        }, {});

        const sortedLocations = Object.entries(counts)
            .map(([address, count]) => ({ address, count }))
            .sort((a, b) => b.count - a.count);

        // --- Define Frequency Thresholds ---
        const highFrequencyThreshold = 5;
        const mediumFrequencyThreshold = 2;

        // --- Categorize and Aggregate (including area names) ---
        let highFreqCount = 0;
        let highFreqAreasList = []; // Store names
        let mediumFreqCount = 0;
        let mediumFreqAreasList = []; // Store names
        let lowFreqCount = 0;
        let lowFreqAreasList = []; // Store names

        sortedLocations.forEach(loc => {
            if (loc.count >= highFrequencyThreshold) {
                highFreqCount += loc.count;
                highFreqAreasList.push(loc.address); // Add name to list
            } else if (loc.count >= mediumFrequencyThreshold) {
                mediumFreqCount += loc.count;
                mediumFreqAreasList.push(loc.address); // Add name to list
            } else { // Count = 1
                lowFreqCount += loc.count;
                lowFreqAreasList.push(loc.address); // Add name to list
            }
        });

        // --- Prepare data structure for Chart.js Pie chart (Grouped) ---
        const labels = [];
        const dataPoints = [];
        const backgroundColors = [];
        const areaNamesPerSlice = []; // Store the list of names for each slice

        // Add High Frequency Slice
        if (highFreqAreasList.length > 0) {
            labels.push(`High Frequency (${highFreqAreasList.length} area${highFreqAreasList.length > 1 ? 's' : ''})`);
            dataPoints.push(highFreqCount);
            backgroundColors.push('rgba(239, 68, 68, 0.8)'); // Red
            areaNamesPerSlice.push(highFreqAreasList); // Store corresponding names
        }

        // Add Medium Frequency Slice
         if (mediumFreqAreasList.length > 0) {
            labels.push(`Medium Frequency (${mediumFreqAreasList.length} area${mediumFreqAreasList.length > 1 ? 's' : ''})`);
            dataPoints.push(mediumFreqCount);
            backgroundColors.push('rgba(245, 158, 11, 0.8)'); // Amber/Orange
            areaNamesPerSlice.push(mediumFreqAreasList); // Store corresponding names
        }

        // Add Low Frequency Slice
        if (lowFreqAreasList.length > 0) {
            labels.push(`Low Frequency (${lowFreqAreasList.length} area${lowFreqAreasList.length > 1 ? 's' : ''})`);
            dataPoints.push(lowFreqCount);
            backgroundColors.push('rgba(59, 130, 246, 0.7)'); // Blue
            areaNamesPerSlice.push(lowFreqAreasList); // Store corresponding names
        }

        return {
            labels: labels,
            datasets: [
                {
                    label: '# of Reports',
                    data: dataPoints,
                    backgroundColor: backgroundColors,
                    borderColor: backgroundColors.map(color => color.replace(/rgba\((\d+,\s*\d+,\s*\d+),[^)]+\)/, 'rgba($1, 1)')),
                    borderWidth: 1,
                    // *** Store area names in the dataset ***
                    areaNames: areaNamesPerSlice
                },
            ],
        };
    }, [reports, loading]); // Recalculate when reports or loading state change


    // --- Effect for Initializing Map & Updating Heatmap Layer ---
    useEffect(() => {
        // Wait until Leaflet scripts are loaded
        if (!isLeafletReady) {
            console.log("Leaflet not ready, skipping map effect.");
            return;
        }

        // Initialize map instance if it hasn't been created yet
        if (!mapRef.current) {
            const mapContainer = document.getElementById(MAP_ID);
            if (mapContainer && window.L) { // Double check L exists
                console.log("🗺️ Initializing Leaflet map...");
                mapRef.current = window.L.map(MAP_ID, { attributionControl: false }).setView(
                    [CENTER.lat, CENTER.lng],
                    ZOOM
                );
                window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    maxZoom: 18,
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                }).addTo(mapRef.current);
            } else {
                 console.warn("Map container or Leaflet (L) not found during initialization attempt.");
                return; // Exit if map cannot be created
            }
        }

        // --- Heatmap Layer Update Logic ---
        const map = mapRef.current;
        // Ensure map and L.heatLayer exist before proceeding
        if (map && window.L?.heatLayer) {
             // Update layer only when data is not loading
             if (!loading) {
                 try {
                    // Filter reports for valid coordinates and flip to [lat, lng]
                    const heatPoints = reports
                        .filter(r =>
                            r.location?.coordinates?.length === 2 &&
                            typeof r.location.coordinates[0] === 'number' &&
                            typeof r.location.coordinates[1] === 'number' &&
                            (r.location.coordinates[0] !== 0 || r.location.coordinates[1] !== 0) // Exclude [0,0]
                        )
                        .map(r => {
                             const [lng, lat] = r.location.coordinates;
                             return [lat, lng]; // Use just [lat, lng] for density
                         });

                    console.log("Heat Points for Layer:", heatPoints); // Debug log

                    // Remove previous layer if it exists
                    if (heatLayerRef.current) {
                        map.removeLayer(heatLayerRef.current);
                        heatLayerRef.current = null;
                        console.log("🧹 Removed old heatmap layer.");
                    }

                    // Add new layer only if there are valid points
                    if (heatPoints.length > 0) {
                        // Ensure L.heatLayer is available before calling it
                         if (window.L.heatLayer) {
                             heatLayerRef.current = window.L.heatLayer(heatPoints, {
                                 radius: 35, // bigger radius for smoother blending
                                 blur: 25,   // stronger blur to merge nearby points
                                 maxZoom: 17,
                                 minOpacity: 0.3,
                                 max: 1.0,   // ensure normalization of intensity (important)
                                 gradient: {
                                     0.2: 'blue',
                                     0.6: 'yellow',
                                     0.8: 'orange',
                                     1.0: 'red'
                                 }
                             }).addTo(map);

                            console.log(`✅ Heatmap layer added/updated with ${heatPoints.length} points.`);
                         } else {
                              console.warn("L.heatLayer function not found when trying to add layer.");
                         }
                    } else {
                        console.log("ℹ️ No valid points to display on heatmap.");
                    }
                } catch (err) {
                    console.error("❌ Error updating heatmap layer:", err);
                }
            } else {
                console.log("Map exists, but still loading data (should show spinner)...");
            }
        } else {
            console.warn("Map instance or L.heatLayer not ready for heatmap update.");
        }

        // Cleanup: Remove map instance on component unmount
        return () => {
            if (mapRef.current) {
                console.log("🧹 Cleaning up map instance on unmount.");
                 if (mapRef.current && mapRef.current.remove) {
                    mapRef.current.remove();
                 }
                mapRef.current = null;
                heatLayerRef.current = null;
            }
        };
    // Dependencies ensure effect runs when Leaflet ready state changes, reports data updates, or loading finishes
    }, [isLeafletReady, reports, loading]);

    // --- Spinner Component ---
    const Spinner = () => (
        <div className="flex flex-col items-center justify-center space-y-2 py-6 text-gray-600 h-full">
            <svg className="animate-spin h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
            <p className="text-sm font-medium">{!isLeafletReady ? "Loading map scripts..." : "Fetching reports..."}</p>
        </div>
    );

    // --- Chart Options ---
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false, // Allows chart height to be controlled by container
        plugins: {
            legend: {
                position: 'right', // Display legend to the side
                labels: {
                    boxWidth: 20, // Smaller color boxes
                    padding: 15 // Spacing between items
                }
            },
            tooltip: {
                // Ensure tooltip context is passed correctly
                callbacks: {
                    // Title for the tooltip (Frequency Level)
                    title: function(tooltipItems) {
                        if (tooltipItems.length > 0) {
                            return tooltipItems[0].label;
                        }
                        return '';
                    },
                    // Body of the tooltip (Area names + Total count)
                    label: function(context) {
                        // Clear the default label line
                        return '';
                    },
                    footer: function(tooltipItems) {
                         if (tooltipItems.length > 0) {
                            const tooltipItem = tooltipItems[0]; // Get the first item
                            const dataIndex = tooltipItem.dataIndex;
                            // Access dataset using tooltipItem.datasetIndex
                            const dataset = tooltipItem.chart.data.datasets[tooltipItem.datasetIndex];
                            const totalReports = dataset.data[dataIndex];
                            // *** Retrieve area names from the dataset ***
                            const areas = dataset.areaNames[dataIndex] || [];

                            let footerText = [`Total Reports: ${totalReports}`];

                            // Add area names (limit for readability)
                            const maxAreasToShow = 5;
                            if (areas.length > 0) {
                                footerText.push(''); // Add a separator line
                                footerText.push('Locations Included:');
                                areas.slice(0, maxAreasToShow).forEach(name => {
                                    // Capitalize first letter of each word
                                    const capitalizedName = name.replace(/\b\w/g, char => char.toUpperCase());
                                    footerText.push(` - ${capitalizedName}`);
                                });
                                if (areas.length > maxAreasToShow) {
                                    footerText.push(` - and ${areas.length - maxAreasToShow} more...`);
                                }
                            }
                            return footerText;
                        }
                        return '';
                    }
                }
            },
            title: {
                display: false, // Title is handled by the section header
            },
        },
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 font-sans overflow-hidden">
            <div className="max-w-6xl mx-auto space-y-4">
                {/* Header */}
                 <div className="bg-white p-4 rounded-xl shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div><h2 className="text-2xl font-bold text-gray-800">🗺️ Waste Reports Heatmap & Stats</h2><p className="text-sm text-gray-600">Visualization of report density and frequency.</p></div>
                    <p className="text-gray-700 text-sm mt-2 sm:mt-0">Total Reports: <span className="font-semibold">{reports.length}</span></p>
                </div>

                {/* --- MOVED: Pie Chart Section (Now Above Map) --- */}
                 {!loading && reports.length > 0 && (
                    <div className="bg-white p-4 rounded-xl shadow-md">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center border-b pb-2">Location Report Frequency</h3>
                        <div className="relative h-72 md:h-80 lg:h-96"> {/* Chart container height */}
                             {chartData.labels.length > 0 ? (
                                <Pie data={chartData} options={chartOptions} />
                             ) : (
                                <p className="text-center text-gray-500 pt-10 italic">No valid address data found in reports to display frequency chart.</p>
                             )}
                        </div>
                    </div>
                )}
                 {!loading && reports.length === 0 && (
                    <div className="bg-white p-4 rounded-xl shadow-md text-center text-gray-500 italic">
                        No reports found to display statistics.
                    </div>
                 )}
                 {/* --- END MOVED SECTION --- */}

                {/* Map Section (Now Below Chart) */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="h-[550px] md:h-[650px] w-full relative" id={MAP_ID}>
                        {/* Spinner Overlay */}
                        {(!isLeafletReady || loading) && (
                            <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-[1000]">
                                <Spinner />
                            </div>
                        )}
                        {/* Map container itself */}
                    </div>
                </div>

            </div>
        </div>
    );
}