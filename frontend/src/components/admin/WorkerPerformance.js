
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../citizen/ui/card";
import { Badge } from "../citizen/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../citizen/ui/avatar";
import { Progress } from "../citizen/ui/progress";

// --- API Utility ---
const fetchApi = async (url) => {
  const finalUrl =
    url.startsWith("/") && !url.startsWith("//")
      ? `http://localhost:8001${url}`
      : url;
  const token = localStorage.getItem("adminToken");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(finalUrl, { headers });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `API Error ${response.status}: ${errorData.message || response.statusText}`
    );
  }
  return response.json();
};

export function WorkerPerformance() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summaryStats, setSummaryStats] = useState({
    totalTasks: 0,
    totalPoints: 0,
    avgTime: 0,
  });

  useEffect(() => {
    const loadPerformanceData = async () => {
      try {
        setLoading(true);
        const response = await fetchApi("/api/admin/worker-performance");
        if (response.success) {
          setWorkers(response.data);
          const totalTasks = response.data.reduce(
            (sum, w) => sum + w.completedTasks,
            0
          );
          const totalPoints = response.data.reduce(
            (sum, w) => sum + w.totalPoints,
            0
          );
          const totalAvgTime = response.data.reduce(
            (sum, w) => sum + w.avgCompletionTime * w.completedTasks,
            0
          );
          const avgTime = totalTasks > 0 ? Math.round(totalAvgTime / totalTasks) : 0;
          setSummaryStats({ totalTasks, totalPoints, avgTime });
        }
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch worker performance:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPerformanceData();
  }, []);

  if (loading) {
    return (
      <div className="text-center p-8 text-lg text-blue-500 animate-pulse">
        Loading worker performance data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500 font-semibold">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-gradient-to-b via-white to-indigo-50 p-4 sm:p-6 md:p-8 rounded-xl shadow-inner min-h-screen text-gray-800">
      {/* HEADER */}
      <div className="text-center px-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
          Worker Performance & Rewards
        </h2>
        <p className="text-gray-600 text-xs sm:text-sm mt-1">
          Track worker efficiency, completion times, and earned points
        </p>
      </div>

      {/* WORKER CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {workers.map((worker) => (
          <Card
            key={worker.id}
            className="bg-white border border-gray-200 hover:border-indigo-300 transition-all duration-300 shadow-md hover:shadow-lg rounded-2xl"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border border-indigo-200 shadow-sm">
                    <AvatarImage src={worker.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-indigo-100 text-indigo-600 text-sm sm:text-base">
                      {worker.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">
                      {worker.name}
                    </CardTitle>
                    <div className="flex items-center space-x-1 mt-1">
                      <svg
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xs sm:text-sm font-medium text-gray-600">
                        {worker.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 sm:space-y-5">
              {/* STATS */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-center">
                  <p className="text-xs text-gray-500">Tasks</p>
                  <p className="text-lg sm:text-xl font-bold text-blue-600">
                    {worker.completedTasks}
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-100 text-center">
                  <p className="text-xs text-gray-500">Points</p>
                  <p className="text-lg sm:text-xl font-bold text-green-600">
                    {worker.totalPoints}
                  </p>
                </div>
              </div>

              {/* AVG TIME */}
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                <p className="text-xs text-gray-500 mb-1 sm:mb-2">
                  Avg Completion Time
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-base sm:text-lg font-bold text-purple-700">
                    {worker.avgCompletionTime} min
                  </span>
                  <Badge
                    variant="outline"
                    className="text-xs border border-purple-400 text-purple-700 bg-purple-100 mt-1 sm:mt-0"
                  >
                    {worker.avgCompletionTime < 45 ? "⚡ Fast" : "Standard"}
                  </Badge>
                </div>
              </div>

              {/* EFFICIENCY */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-500">Efficiency Score</p>
                  <span className="text-sm font-medium text-indigo-600">
                    {Math.round(worker.rating * 20)}%
                  </span>
                </div>
                <Progress
                  value={worker.rating * 20}
                  className="h-2 bg-gray-200"
                />
              </div>

              {/* RECENT COMPLETIONS */}
              <div className="border-t border-gray-200 pt-3">
                <p className="text-sm font-medium text-gray-800 mb-2 sm:mb-3">
                  Recent Completions
                </p>
                <div className="space-y-2">
                  {worker.recentCompletions.length > 0 ? (
                    worker.recentCompletions.map((completion) => (
                      <div
                        key={completion.taskId}
                        className="p-2 bg-gray-50 rounded text-xs border border-gray-200"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                          <span className="font-medium text-gray-700">
                            {completion.taskType}
                          </span>
                          <Badge
                            variant="secondary"
                            className="text-xs bg-indigo-100 text-indigo-700 border border-indigo-300 mt-1 sm:mt-0"
                          >
                            +{completion.pointsEarned} pts
                          </Badge>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-gray-500">
                          <span>⏱️ {completion.completionTime} min</span>
                          <span>
                            {new Date(
                              completion.completedAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-center text-gray-400">
                      No recent completions.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* SUMMARY */}
      <Card className="bg-white border border-gray-200 shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl font-semibold text-indigo-700 text-center sm:text-left">
            Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-100">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">
                {summaryStats.totalTasks}
              </div>
              <p className="text-sm sm:text-base text-blue-700">
                Total Tasks Completed
              </p>
              <p className="text-xs text-gray-500 mt-1">
                This month (all workers)
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-50 border border-green-100">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1 sm:mb-2">
                {summaryStats.totalPoints}
              </div>
              <p className="text-sm sm:text-base text-green-700">
                Total Points Distributed
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Based on completion speed
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-50 border border-purple-100">
              <div className="text-2xl sm:text-3xl font-bold text-purple-700 mb-1 sm:mb-2">
                {summaryStats.avgTime} min
              </div>
              <p className="text-sm sm:text-base text-purple-700">
                Average Completion Time
              </p>
              <p className="text-xs text-gray-500 mt-1">Across all workers</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
