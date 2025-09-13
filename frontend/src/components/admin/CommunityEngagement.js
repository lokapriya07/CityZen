import React from "react";

export function CommunityEngagement() {
  const leaderboard = [
    { rank: 1, name: "Green Warriors Community", reports: 45, points: 2250, badge: "Eco Champion" },
    { rank: 2, name: "Downtown Clean Team", reports: 38, points: 1900, badge: "Clean Crusader" },
    { rank: 3, name: "Park Avenue Residents", reports: 32, points: 1600, badge: "Neighborhood Hero" },
    { rank: 4, name: "Student Environmental Club", reports: 28, points: 1400, badge: "Future Leader" },
    { rank: 5, name: "Business District Alliance", reports: 25, points: 1250, badge: "Corporate Partner" },
  ];

  const campaigns = [
    { title: "Clean City Challenge", description: "Monthly community cleanup initiative", participants: 234, status: "active", progress: 78, reward: "500 points" },
    { title: "Recycling Heroes", description: "Promote recycling awareness", participants: 156, status: "active", progress: 45, reward: "300 points" },
    { title: "Zero Waste Week", description: "Reduce waste generation", participants: 89, status: "upcoming", progress: 0, reward: "750 points" },
  ];

  const topReporters = [
    { name: "Alice Johnson", reports: 23, streak: 7, level: "Gold" },
    { name: "Bob Smith", reports: 19, streak: 5, level: "Silver" },
    { name: "Carol Davis", reports: 16, streak: 12, level: "Gold" },
    { name: "David Wilson", reports: 14, streak: 3, level: "Bronze" },
  ];

  const getLevelColor = (level) => {
    switch (level) {
      case "Gold": return "text-yellow-600";
      case "Silver": return "text-gray-500";
      case "Bronze": return "text-orange-600";
      default: return "text-gray-400";
    }
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case "Eco Champion": return "bg-green-500 text-white";
      case "Clean Crusader": return "bg-blue-500 text-white";
      case "Neighborhood Hero": return "bg-purple-500 text-white";
      default: return "bg-gray-300 text-black";
    }
  };

  return (
    <div className="space-y-6">
      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border rounded p-4 shadow bg-white">
          <div className="text-sm font-semibold mb-2">Active Users</div>
          <div className="text-2xl font-bold">1,247</div>
          <div className="text-sm text-green-600 mt-1">+18% this month</div>
        </div>
        <div className="border rounded p-4 shadow bg-white">
          <div className="text-sm font-semibold mb-2">Total Reports</div>
          <div className="text-2xl font-bold">3,456</div>
          <div className="text-sm text-green-600 mt-1">+25% this month</div>
        </div>
        <div className="border rounded p-4 shadow bg-white">
          <div className="text-sm font-semibold mb-2">Points Awarded</div>
          <div className="text-2xl font-bold">45,678</div>
          <div className="text-sm text-gray-500 mt-1">total points</div>
        </div>
        <div className="border rounded p-4 shadow bg-white">
          <div className="text-sm font-semibold mb-2">Active Campaigns</div>
          <div className="text-2xl font-bold">3</div>
          <div className="text-sm text-gray-500 mt-1">running now</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leaderboard */}
        <div className="border rounded shadow p-4 bg-white">
          <div className="text-lg font-bold mb-2">Community Leaderboard</div>
          <div className="text-sm text-gray-500 mb-4">Top performing communities this month</div>
          <div className="space-y-3">
            {leaderboard.map((entry) => (
              <div key={entry.rank} className="flex items-center gap-4 p-3 rounded-lg border">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${getBadgeColor(entry.badge)}`}>{entry.rank}</div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{entry.name}</div>
                  <div className="text-xs text-gray-500">{entry.reports} reports • {entry.points} points</div>
                </div>
                <div className={`px-2 py-1 text-xs rounded ${getBadgeColor(entry.badge)}`}>{entry.badge}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Campaigns */}
        <div className="border rounded shadow p-4 bg-white">
          <div className="text-lg font-bold mb-2">Active Campaigns</div>
          <div className="text-sm text-gray-500 mb-4">Community engagement initiatives</div>
          <div className="space-y-3">
            {campaigns.map((c, i) => (
              <div key={i} className="border rounded p-3">
                <div className="flex justify-between mb-2">
                  <div>
                    <div className="font-semibold text-sm">{c.title}</div>
                    <div className="text-xs text-gray-500">{c.description}</div>
                  </div>
                  <div className={`px-2 py-1 text-xs rounded ${c.status==="active"?"bg-green-200":"bg-gray-200"}`}>{c.status}</div>
                </div>
                <div className="text-xs flex justify-between mb-1">
                  <span>{c.participants} participants</span>
                  <span>{c.progress}% complete</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded mb-2">
                  <div className="bg-green-500 h-2 rounded" style={{ width: `${c.progress}%` }}></div>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Reward: {c.reward}</span>
                  <button className="text-xs border px-2 py-1 rounded">View Details</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Individual Contributors */}
      <div className="border rounded shadow p-4 bg-white">
        <div className="text-lg font-bold mb-2">Top Individual Contributors</div>
        <div className="text-sm text-gray-500 mb-4">Most active community members</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {topReporters.map((rep, i) => (
            <div key={i} className="border rounded p-3 text-center">
              <div className="h-12 w-12 mx-auto rounded-full bg-gray-300 flex items-center justify-center mb-2 font-bold">
                {rep.name.split(" ").map(n=>n[0]).join("")}
              </div>
              <div className="font-semibold text-sm">{rep.name}</div>
              <div className="text-xs text-gray-500 mb-1">{rep.reports} reports</div>
              <div className="text-xs mb-1">{rep.streak} day streak</div>
              <div className={`text-sm font-medium ${getLevelColor(rep.level)}`}>{rep.level} Level</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
