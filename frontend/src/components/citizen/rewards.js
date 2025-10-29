"use client";

import React, { useState, useEffect } from "react" // Added useEffect
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

import { AlertCircle, Gift, Zap, Leaf, Ticket } from "lucide-react"

// =========================================================================
// API UTILITY TO FETCH USER'S REAL POINTS
// =========================================================================
const fetchApi = async (url) => {
  const finalUrl =
    url.startsWith("/") && !url.startsWith("//")
      ? `http://localhost:8001${url}` // Assumes same backend port
      : url;
  // IMPORTANT: Assumes user token is stored as 'token'
  // If you store it as 'userToken', change 'token' below
  const token = localStorage.getItem("token");
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


const mockRewards = [
  {
    id: "metro-500",
    name: "Metro Card Recharge",
    description: "Rs.50 metro card recharge for public transport",
    pointsRequired: 500,
    category: "transport",
    icon: <Zap className="w-6 h-6" />,
    value: "Rs.50",
    partner: "City Metro Authority",
    available: true,
  },
  {
    id: "eco-tote",
    name: "Eco Tote Bag",
    description: "Premium reusable eco-friendly tote bag",
    pointsRequired: 300,
    category: "merchandise",
    icon: <Leaf className="w-6 h-6" />,
    value: "Premium Quality",
    partner: "EcoGoods Co.",
    available: true,
  },
  {
    id: "marathon-pass",
    name: "Clean City Marathon Pass",
    description: "Free entry to annual Clean City Marathon event",
    pointsRequired: 300,
    category: "event",
    icon: <Gift className="w-6 h-6" />,
    value: "Event Pass",
    partner: "City Events",
    available: true,
  },
  {
    id: "cafe-coupon",
    name: "Eco Cafe Voucher",
    description: "Rs.200 voucher at partner eco-friendly cafes",
    pointsRequired: 400,
    category: "coupon",
    icon: <Ticket className="w-6 h-6" />,
    value: "Rs.200",
    partner: "Green Cafe Network",
    available: true,
  },
  {
    id: "plant-kit",
    name: "Home Garden Starter Kit",
    description: "Complete kit with seeds and tools for home gardening",
    pointsRequired: 600,
    category: "merchandise",
    icon: <Leaf className="w-6 h-6" />,
    value: "Full Kit",
    partner: "Urban Gardening Co.",
    available: true,
  },
  {
    id: "bus-pass",
    name: "Monthly Bus Pass",
    description: "Unlimited city bus travel for one month",
    pointsRequired: 750,
    category: "transport",
    icon: <Zap className="w-6 h-6" />,
    value: "Monthly Pass",
    partner: "City Transport",
    available: true,
  },
  {
    id: "env-workshop",
    name: "Environmental Workshop",
    description: "Free entry to sustainability and waste management workshop",
    pointsRequired: 250,
    category: "event",
    icon: <Gift className="w-6 h-6" />,
    value: "Workshop Pass",
    partner: "Green Academy",
    available: true,
  },
  {
    id: "water-bottle",
    name: "Premium Water Bottle",
    description: "Insulated stainless steel water bottle (1L)",
    pointsRequired: 200,
    category: "merchandise",
    icon: <Leaf className="w-6 h-6" />,
    value: "Premium Quality",
    partner: "EcoGoods Co.",
    available: true,
  },
]

const mockRedemptionHistory = [
  {
    id: "red-001",
    rewardName: "Metro Card Recharge",
    pointsSpent: 500,
    redeemedAt: "2024-01-10T14:30:00Z",
    status: "completed",
  },
  {
    id: "red-002",
    rewardName: "Eco Tote Bag",
    pointsSpent: 300,
    redeemedAt: "2024-01-05T10:15:00Z",
    status: "completed",
  },
  {
    id: "red-003",
    rewardName: "Environmental Workshop",
    pointsSpent: 250,
    redeemedAt: "2024-01-15T09:00:00Z",
    status: "pending",
  },
]

const categoryColors = {
  transport: "bg-gradient-to-r from-sky-400 to-blue-500 text-white",
  event: "bg-gradient-to-r from-purple-400 to-pink-500 text-white",
  merchandise: "bg-gradient-to-r from-green-400 to-emerald-500 text-white",
  coupon: "bg-gradient-to-r from-amber-400 to-orange-500 text-white",
}

const categoryLabels = {
  transport: "Transport",
  event: "Events",
  merchandise: "Merchandise",
  coupon: "Coupons",
}

export default function RewardsStore() {
  // Initialize points at 0 and add loading/error states
  const [userPoints, setUserPoints] = useState(0)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState(null)
  const [redemptionHistory, setRedemptionHistory] = useState(mockRedemptionHistory)
  const [activeTab, setActiveTab] = useState("store")
  const [redeemingId, setRedeemingId] = useState(null)

  // Add useEffect to fetch the user's data on load
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        // IMPORTANT: You need a route on your backend (e.g., in your user routes)
        // at '/api/users/profile' that returns the logged-in user's data.
        // It should return: { success: true, data: { name: "...", points: 123 } }
        const response = await fetchApi("/api/users/profile");

        if (response.success) {
          setUserPoints(response.data.points || 0); // Set real points from API
        } else {
          throw new Error("Failed to fetch user points");
        }
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch user data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []); // Runs only on component mount


  const filteredRewards = selectedCategory
    ? mockRewards.filter((r) => r.category === selectedCategory)
    : mockRewards

  const handleRedeem = (reward) => {
    if (userPoints >= reward.pointsRequired) {
      setRedeemingId(reward.id)
      setTimeout(() => {
        // This updates the points in the UI. 
        // For a full fix, you should also make an API call here
        // to update the points in the database.
        setUserPoints(userPoints - reward.pointsRequired)
        setRedemptionHistory([
          {
            id: `red-${Date.now()}`,
            rewardName: reward.name,
            pointsSpent: reward.pointsRequired,
            redeemedAt: new Date().toISOString(),
            status: "pending",
          },
          ...redemptionHistory,
        ])
        setRedeemingId(null)
      }, 600)
    }
  }

  // Add loading and error UI
  if (loading) {
    return (
      <div className="text-center p-8 text-lg text-emerald-500 animate-pulse">
        Loading your reward points...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500 font-semibold">
        Error: {error}
        <p className="text-sm text-gray-600 mt-2">Could not load your points. Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Points Balance Card */}
      <Card className="border-0 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium mb-2">Your Reward Points</p>
              {/* This will now show the REAL points */}
              <p className="text-5xl font-bold">{userPoints.toLocaleString()}</p>
              <p className="text-emerald-100 text-sm mt-2">Available for redemption</p>
            </div>
            <div className="text-right">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                <Gift className="w-10 h-10" />
              </div>
              <p className="text-emerald-100 text-xs mt-3">Earn more by reporting issues</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      {/* <div className="flex gap-2 border-b border-gray-200">
        <Button
          onClick={() => setActiveTab("store")}
          className={`${activeTab === "store"
            ? "bg-teal-500 hover:bg-teal-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
        >
          Rewards Store
        </Button>

        <Button
          onClick={() => setActiveTab("history")}
          className={`${activeTab === "history"
            ? "bg-teal-500 hover:bg-teal-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
        >
          Redemption History
        </Button>

      </div> */}
      {/* Tabs */}
      <div className="flex flex-wrap justify-center sm:justify-start gap-2 border-b border-gray-200 p-2">
        <Button
          onClick={() => setActiveTab("store")}
          className={`flex-shrink-0 text-sm sm:text-base ${activeTab === "store"
              ? "bg-teal-500 hover:bg-teal-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
        >
          🏪 Rewards Store
        </Button>

        <Button
          onClick={() => setActiveTab("history")}
          className={`flex-shrink-0 text-sm sm:text-base ${activeTab === "history"
              ? "bg-teal-500 hover:bg-teal-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
        >
          📋 Redemption History
        </Button>
      </div>


      {activeTab === "store" ? (
        <div className="space-y-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setSelectedCategory(null)}
              className={`${selectedCategory === null
                ? "bg-teal-500 hover:bg-teal-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              All Rewards
            </Button>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <Button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`${selectedCategory === key
                  ? key === "transport"
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : key === "event"
                      ? "bg-purple-500 hover:bg-purple-600 text-white"
                      : key === "merchandise"
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : key === "coupon"
                          ? "bg-yellow-400 hover:bg-yellow-500 text-white"
                          : "bg-gray-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {label}
              </Button>

            ))}
          </div>

          {/* Rewards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRewards.map((reward) => {
              const canRedeem = userPoints >= reward.pointsRequired
              const isRedeeming = redeemingId === reward.id

              return (
                <Card
                  key={reward.id}
                  className={`overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col h-full ${!canRedeem ? "opacity-75" : ""
                    }`}
                >
                  <CardHeader className={`pb-3 ${categoryColors[reward.category]}`}>
                    <div className="flex items-start justify-between">
                      <div className="text-3xl">{reward.icon}</div>
                      <Badge variant="secondary" className="text-xs">
                        {categoryLabels[reward.category]}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="p-5 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="font-bold text-white-900 text-lg">{reward.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{reward.description}</p>

                      <div className="flex items-center justify-between py-3 border-t border-b border-gray-200 mt-3">
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Points Required</p>
                          <p className="text-2xl font-bold text-emerald-600">{reward.pointsRequired}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 font-medium">Value</p>
                          <p className="text-lg font-bold text-gray-900">{reward.value}</p>
                        </div>
                      </div>

                      {reward.partner && (
                        <p className="text-xs text-gray-500 mt-2">
                          <span className="font-medium">Partner:</span> {reward.partner}
                        </p>
                      )}
                    </div>

                    <Button
                      onClick={() => handleRedeem(reward)}
                      disabled={!canRedeem || isRedeeming}
                      className={`w-full font-medium transition-all mt-4 ${canRedeem
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                      {isRedeeming ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="animate-spin">...</span> Redeeming...
                        </span>
                      ) : !canRedeem ? (
                        `Need ${reward.pointsRequired - userPoints} more points`
                      ) : (
                        "Redeem Now"
                      )}
                    </Button>
                  </CardContent>
                </Card>

              )
            })}
          </div>

          {/* Info Banner */}
          <Card className="border-l-4 border-l-blue-500 bg-blue-50">
            <CardContent className="p-5 flex gap-4">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">How it works:</p>
                <p>
                  Report waste issues and complete tasks to earn points. Redeem your points for real rewards from our
                  partner network. All rewards are processed within 24-48 hours.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          {redemptionHistory.length > 0 ? (
            redemptionHistory.map((record) => (
              <Card key={record.id} className="overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{record.rewardName}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(record.redeemedAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-600">-{record.pointsSpent}</p>
                      <Badge
                        variant={
                          record.status === "completed"
                            ? "default"
                            : record.status === "pending"
                              ? "secondary"
                              : "outline"
                        }
                        className={`mt-2 ${record.status === "completed"
                          ? "bg-emerald-100 text-emerald-700"
                          : record.status === "pending"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                          }`}
                      >
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Gift className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No redemptions yet</p>
                <p className="text-sm text-gray-400 mt-1">Start earning points by reporting waste issues!</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}