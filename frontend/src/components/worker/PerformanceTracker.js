import React from "react";
import { Award, TrendingUp, Clock, Star, Target, Zap } from "lucide-react";

function PerformanceTracker() {
  const weeklyStats = {
    tasksCompleted: 28,
    onTimePercentage: 94,
    averageRating: 4.8,
    totalPoints: 1420,
  };

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

  return (
    <div className="space-y-6">
      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tasks Completed */}
        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-center gap-2 text-sm font-semibold mb-2">
            <Target className="h-4 w-4" /> Tasks Completed
          </div>
          <div className="text-2xl font-bold text-blue-600">{weeklyStats.tasksCompleted}</div>
          <div className="text-xs text-gray-500">This week</div>
        </div>

        {/* On-Time Rate */}
        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-center gap-2 text-sm font-semibold mb-2">
            <Clock className="h-4 w-4" /> On-Time Rate
          </div>
          <div className="text-2xl font-bold text-green-600">{weeklyStats.onTimePercentage}%</div>
          <div className="text-xs text-gray-500">Above target (90%)</div>
        </div>

        {/* Average Rating */}
        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-center gap-2 text-sm font-semibold mb-2">
            <Star className="h-4 w-4" /> Average Rating
          </div>
          <div className="text-2xl font-bold text-yellow-600">{weeklyStats.averageRating}</div>
          <div className="text-xs text-gray-500">Out of 5.0</div>
        </div>

        {/* Total Points */}
        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-center gap-2 text-sm font-semibold mb-2">
            <Award className="h-4 w-4" /> Total Points
          </div>
          <div className="text-2xl font-bold text-purple-600">{weeklyStats.totalPoints}</div>
          <div className="text-xs text-gray-500">+180 this week</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Badge Progress */}
        <div className="bg-white p-4 rounded shadow space-y-4">
          <div className="flex items-center gap-2 font-semibold mb-2">
            <Award className="h-5 w-5" /> Badge Progress
          </div>
          {badges.map((badge, index) => (
            <div key={index} className="flex items-center gap-4 p-3 rounded-lg border">
              <div
                className={`p-2 rounded-full ${
                  badge.earned ? "bg-blue-100 text-blue-600" : "bg-gray-200 text-gray-500"
                }`}
              >
                <badge.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{badge.name}</span>
                  {badge.earned && (
                    <span className="text-xs bg-gray-200 text-gray-700 px-1 rounded">Earned</span>
                  )}
                </div>
                <div className="text-xs text-gray-500 mb-2">{badge.description}</div>
                {!badge.earned && badge.progress && (
                  <div className="space-y-1">
                    <div className="w-full bg-gray-200 h-2 rounded">
                      <div
                        className="bg-blue-600 h-2 rounded"
                        style={{ width: `${badge.progress}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">{badge.progress}% complete</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Performance */}
        <div className="bg-white p-4 rounded shadow space-y-3">
          <div className="flex items-center gap-2 font-semibold mb-2">
            <TrendingUp className="h-5 w-5" /> Recent Performance
          </div>
          {recentPerformance.map((day, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <div className="font-semibold text-sm">{day.date}</div>
                <div className="text-xs text-gray-500">
                  {day.tasks} tasks • {day.onTime}/{day.tasks} on time
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-400" />
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
      <div className="bg-white p-4 rounded shadow">
        <div className="flex items-center gap-2 font-semibold mb-4">
          <Award className="h-5 w-5" /> Recent Achievements
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {achievements.map((ach, index) => (
            <div key={index} className="p-4 rounded-lg border text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <div className="font-semibold text-sm mb-1">{ach.title}</div>
              <div className="text-xs text-gray-500 mb-2">{ach.description}</div>
              <div className="text-xs text-gray-500">{ach.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PerformanceTracker;
