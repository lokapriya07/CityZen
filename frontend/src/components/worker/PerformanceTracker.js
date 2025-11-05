
import React, { useState, useEffect } from "react";
import { Award, TrendingUp, Clock, Star, Target, Zap, Loader2 } from "lucide-react";

function PerformanceTracker() {
  // Use state for dynamic values, initialized to null for loading
  const [tasksCompleted, setTasksCompleted] = useState(null);
  const [totalPoints, setTotalPoints] = useState(null);

  // State for loading and errors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Other stats remain static as per the original code
  const weeklyStats = {
    onTimePercentage: 94,
    averageRating: 4.8,
  };

  // --- All other data (badges, recentPerformance, achievements) remains unchanged ---
  const badges = [
    { name: "Speed Demon", description: "Complete 5 tasks in one day", earned: true, icon: Zap },
    { name: "Perfect Week", description: "100% on-time completion", earned: true, icon: Target },
    { name: "Community Hero", description: "50+ tasks completed", earned: false, icon: Award, progress: 76 },
    { name: "5-Star Service", description: "Maintain 4.8+ rating", earned: true, icon: Star },
  ];

  const recentPerformance = [
    { date: "Today", tasks: 3, onTime: 3, rating: 4.9 },
    { date: "Yesterday", tasks: 4, onTime: 4, rating: 4.8 },
    { date: "2 days ago", tasks: 5, onTime: 4, rating: 4.7 },
    { date: "3 days ago", tasks: 4, onTime: 4, rating: 4.8 },
    { date: "4 days ago", tasks: 6, onTime: 5, rating: 4.9 },
  ];

  const achievements = [
    { title: "Weekly Champion", description: "Top performer this week", date: "2 days ago" },
    { title: "Efficiency Expert", description: "Completed all tasks 30min early", date: "1 week ago" },
    { title: "Customer Favorite", description: "Received 10 five-star ratings", date: "2 weeks ago" },
  ];
  // ---------------------------------------------------------------------------------

  // Add useEffect to fetch data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Retrieve your auth token.
        const token = localStorage.getItem('token');

        if (!token) {
          setError("Authentication token not found. Please log in.");
          setLoading(false);
          return;
        }

        // Fetch data from your backend endpoint
        const response = await fetch('/api/worker/dashboard', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ token } `
          }
        });

        // --- START OF FIX: Handle non-JSON responses ---
        // Get the raw text from the response first.
        const responseBody = await response.text();

        if (!response.ok) {
          let errorMessage = responseBody; // Default to the raw text (e.g., "Proxy erro...")

          // Try to parse it as JSON in case the backend *did* send a JSON error
          try {
            const errorJson = JSON.parse(responseBody);
            if (errorJson.message) {
              errorMessage = errorJson.message;
            }
          } catch (e) {
            // It wasn't JSON, so we'll just use the raw text. This is fine.
          }
          
          // Truncate the error if it's a giant HTML page
          if (errorMessage.length > 200) {
            errorMessage = `${ errorMessage.substring(0, 200) }...`;
          }

          throw new Error(errorMessage || `HTTP error! status: ${ response.status } `);
        }

        // If we get here, the response was OK (200) and we have the text.
        // Now we can safely parse it.
        const result = JSON.parse(responseBody);
        // --- END OF FIX ---

        if (result.success && result.data) {
          // Set state from the backend data
          setTasksCompleted(result.data.overview.completedTasks);
          setTotalPoints(result.data.achievements.totalPoints);
        } else {
          throw new Error(result.message || "Failed to parse dashboard data.");
        }

      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        // This will now show your clean error message
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="space-y-6 p-4 md:p-6 bg-gray-50 font-sans">

      {/* Display a global error message if fetching fails */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
          <strong className="font-bold">Fetch Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Tasks Completed (Dynamic from Backend) */}
        <div className="bg-white p-4 rounded-lg shadow-md transition-all hover:shadow-lg">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Target className="h-4 w-4" /> Tasks Completed
          </div>
          {loading ? (
            <div className="flex items-center justify-start h-10">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="text-3xl font-bold text-blue-600">{tasksCompleted ?? '...'}</div>
          )}
          <div className="text-xs text-gray-500">This week</div>
        </div>

        {/* On-Time Rate (Static) */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Clock className="h-4 w-4" /> On-Time Rate
          </div>
          <div className="text-3xl font-bold text-green-600">{weeklyStats.onTimePercentage}%</div>
          <div className="text-xs text-gray-500">Above target (90%)</div>
        </div>

        {/* Average Rating (Static) */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Star className="h-4 w-4" /> Average Rating
          </div>
          <div className="text-3xl font-bold text-yellow-500">{weeklyStats.averageRating}</div>
          <div className="text-xs text-gray-500">Out of 5.0</div>
        </div>

        {/* Total Points (Dynamic from Backend) */}
        <div className="bg-white p-4 rounded-lg shadow-md transition-all hover:shadow-lg">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Award className="h-4 w-4" /> Total Points
          </div>
          {loading ? (
            <div className="flex items-center justify-start h-10">
              <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
            </div>
          ) : (
            <div className="text-3xl font-bold text-purple-600">{totalPoints ?? '...'}</div>
          )}
          <div className="text-xs text-gray-500">+180 this week</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Badge Progress */}
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <div className="flex items-center gap-2 font-semibold text-gray-800 mb-2">
            <Award className="h-5 w-5" /> Badge Progress
          </div>
          {badges.map((badge, index) => (
            <div key={index} className="flex items-start sm:items-center gap-4 p-3 rounded-lg border border-gray-200">
              <div
                className={`p - 2 rounded - full flex - shrink - 0 ${
  badge.earned ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"
} `}
              >
                <badge.icon className="h-5 w-5" />
              </div>
              {/* ✅ FIX: Added min-w-0 to allow content to wrap */}
              <div className="flex-1 min-w-0">
                {/* ✅ FIX: Added flex-wrap to allow badge to wrap on mobile */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                  <span className="font-semibold text-sm text-gray-900">{badge.name}</span>
                  {badge.earned && (
                    <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Earned</span>
                  )}
                </div>
                <div className="text-xs text-gray-500 mb-2">{badge.description}</div>
                {!badge.earned && badge.progress && (
                  <div className="space-y-1">
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${ badge.progress }% ` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 text-right">{badge.progress}% complete</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Performance */}
        <div className="bg-white p-4 rounded-lg shadow space-y-3">
          <div className="flex items-center gap-2 font-semibold text-gray-800 mb-2">
            <TrendingUp className="h-5 w-5" /> Recent Performance
          </div>
          {recentPerformance.map((day, index) => (
            // ✅ FIX: Stack vertically on mobile, row on larger screens
            <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg border border-gray-200 gap-2 sm:gap-4">
              <div>
                <div className="font-semibold text-sm text-gray-900">{day.date}</div>
                <div className="text-xs text-gray-500">
                  {day.tasks} tasks • {day.onTime}/{day.tasks} on time
                </div>
              </div>
              {/* ✅ FIX: Align text left on mobile, right on larger screens */}
              <div className="text-left sm:text-right w-full sm:w-auto">
                <div className="flex items-center justify-start sm:justify-end gap-1 text-gray-800">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{day.rating}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {Math.round((day.onTime / day.tasks) * 100)}% on time
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-2 font-semibold text-gray-800 mb-4">
          <Award className="h-5 w-5" /> Recent Achievements
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {achievements.map((ach, index) => (
            <div key={index} className="p-4 rounded-lg border border-gray-200 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <div className="font-semibold text-sm text-gray-900 mb-1">{ach.title}</div>
              <div className="text-xs text-gray-500 mb-2">{ach.description}</div>
              <div className="text-xs text-gray-400">{ach.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PerformanceTracker;
