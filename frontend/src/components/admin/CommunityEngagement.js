"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../citizen/ui/card";
import { Button } from "../citizen/ui/button";
import { Badge } from "../citizen/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../citizen/ui/avatar";
import { Progress } from "../citizen/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../citizen/ui/tabs";

export default function CommunityEngagement() {
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  // Mock community data
  const topReporters = [
    {
      id: "1",
      name: "Sarah Wilson",
      avatar: "/placeholder.svg",
      reports: 45,
      points: 1250,
      badges: ["eco-warrior", "community-champion", "clean-streets"],
      area: "Block A",
      joinedDate: "2023-08-15",
    },
    {
      id: "2",
      name: "Mike Johnson",
      avatar: "/placeholder.svg",
      reports: 38,
      points: 980,
      badges: ["vigilant-citizen", "green-guardian"],
      area: "Sector 15",
      joinedDate: "2023-09-22",
    },
    {
      id: "3",
      name: "Priya Patel",
      avatar: "/placeholder.svg",
      reports: 32,
      points: 850,
      badges: ["neighborhood-hero", "clean-streets"],
      area: "Block C",
      joinedDate: "2023-07-10",
    },
    {
      id: "4",
      name: "John Doe",
      avatar: "/placeholder.svg",
      reports: 28,
      points: 720,
      badges: ["eco-warrior"],
      area: "Park Area",
      joinedDate: "2023-10-05",
    },
    {
      id: "5",
      name: "Lisa Chen",
      avatar: "/placeholder.svg",
      reports: 24,
      points: 650,
      badges: ["green-guardian", "vigilant-citizen"],
      area: "Block B",
      joinedDate: "2023-11-12",
    },
  ];

  const topAreas = [
    { area: "Block A", reports: 156, residents: 1200, engagement: 85 },
    { area: "Sector 15", reports: 134, residents: 980, engagement: 78 },
    { area: "Block C", reports: 98, residents: 850, engagement: 72 },
    { area: "Park Area", reports: 87, residents: 650, engagement: 68 },
    { area: "Block B", reports: 76, residents: 720, engagement: 65 },
  ];

  const campaigns = [
    {
      id: "1",
      title: "Clean Streets Initiative",
      description: "Report overflowing bins and illegal dumping to keep our streets clean",
      startDate: "2024-01-01",
      endDate: "2024-03-31",
      status: "active",
      participants: 234,
      reportsGenerated: 567,
      target: 800,
      rewards: ["Clean Streets Badge", "50 Bonus Points", "City Recognition"],
    },
    {
      id: "2",
      title: "Green Neighborhood Challenge",
      description: "Promote recycling and proper waste segregation in residential areas",
      startDate: "2024-02-15",
      endDate: "2024-04-15",
      status: "active",
      participants: 189,
      reportsGenerated: 234,
      target: 400,
      rewards: ["Green Guardian Badge", "75 Bonus Points", "Eco-Friendly Kit"],
    },
    {
      id: "3",
      title: "Zero Waste Week",
      description: "Special campaign to minimize waste generation and maximize recycling",
      startDate: "2024-01-15",
      endDate: "2024-01-22",
      status: "completed",
      participants: 456,
      reportsGenerated: 123,
      target: 100,
      rewards: ["Zero Waste Warrior Badge", "100 Bonus Points"],
    },
  ];

  const badges = [
    { id: "eco-warrior", name: "Eco Warrior", description: "Reported 25+ environmental issues", icon: "🌱", rarity: "common", holders: 45 },
    { id: "community-champion", name: "Community Champion", description: "Top reporter in your area for 3 months", icon: "🏆", rarity: "rare", holders: 12 },
    { id: "clean-streets", name: "Clean Streets", description: "Participated in Clean Streets Initiative", icon: "🧹", rarity: "common", holders: 234 },
    { id: "vigilant-citizen", name: "Vigilant Citizen", description: "Consistently reports issues within 24 hours", icon: "👁️", rarity: "uncommon", holders: 28 },
    { id: "green-guardian", name: "Green Guardian", description: "Focuses on recycling and waste segregation", icon: "♻️", rarity: "uncommon", holders: 67 },
    { id: "neighborhood-hero", name: "Neighborhood Hero", description: "Helped resolve 50+ community issues", icon: "🦸", rarity: "epic", holders: 8 },
  ];

  const getBadgeInfo = (badgeId) => badges.find((b) => b.id === badgeId);

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case "common": return "bg-gray-100 text-gray-700 border-gray-300";
      case "uncommon": return "bg-green-100 text-green-700 border-green-300";
      case "rare": return "bg-blue-100 text-blue-700 border-blue-300";
      case "epic": return "bg-purple-100 text-purple-700 border-purple-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Community Engagement</h2>
          <p className="text-muted-foreground">Recognize active citizens and promote community participation</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">➕ New Campaign</Button>
          <Button size="sm">🎁 Send Rewards</Button>
        </div>
      </div>

      <Tabs defaultValue="leaderboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="leaderboard">Leaderboards</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="badges">Badges & Rewards</TabsTrigger>
          <TabsTrigger value="insights">Community Insights</TabsTrigger>
        </TabsList>

        {/* Leaderboards */}
        <TabsContent value="leaderboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Reporters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Top Reporters</span>
                  <Badge variant="secondary">This Month</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {topReporters.map((r, i) => (
                  <div key={r.id} className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${i===0?"bg-yellow-500 text-white":i===1?"bg-gray-400 text-white":i===2?"bg-orange-500 text-white":"bg-muted text-muted-foreground"}`}>{i+1}</div>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={r.avatar} />
                      <AvatarFallback>{r.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{r.name}</h4>
                      <p className="text-xs text-muted-foreground">{r.area}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">{r.points} pts</p>
                      <p className="text-xs text-muted-foreground">{r.reports} reports</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {r.badges.slice(0, 2).map((b) => {
                        const badge = getBadgeInfo(b);
                        return <div key={b} title={badge?.name} className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center text-xs">{badge?.icon}</div>;
                      })}
                      {r.badges.length > 2 && <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">+{r.badges.length-2}</div>}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Top Areas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Most Active Areas</span>
                  <Badge variant="secondary">Engagement</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {topAreas.map((a, i) => (
                  <div key={a.area} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 flex items-center justify-center rounded-full font-bold ${i===0?"bg-yellow-500 text-white":i===1?"bg-gray-400 text-white":i===2?"bg-orange-500 text-white":"bg-muted text-muted-foreground"}`}>{i+1}</div>
                        <div>
                          <h4 className="font-medium text-sm">{a.area}</h4>
                          <p className="text-xs text-muted-foreground">{a.reports} reports • {a.residents} residents</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-secondary">{a.engagement}%</p>
                    </div>
                    <Progress value={a.engagement} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Campaigns */}
        <TabsContent value="campaigns" className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {campaigns.map((c) => (
            <Card key={c.id} className={`cursor-pointer hover:shadow-lg ${selectedCampaign===c.id?"ring-2 ring-primary":""}`} onClick={() => setSelectedCampaign(selectedCampaign===c.id?null:c.id)}>
              <CardHeader className="flex justify-between items-start">
                <CardTitle className="text-lg">{c.title}</CardTitle>
                <Badge variant={c.status==="active"?"default":"secondary"}>{c.status}</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{c.description}</p>
                <Progress value={(c.reportsGenerated/c.target)*100} className="h-2 my-2" />
                <p className="text-xs text-muted-foreground">{new Date(c.startDate).toLocaleDateString()} - {new Date(c.endDate).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Badges */}
        <TabsContent value="badges" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map((b) => (
            <Card key={b.id}>
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3">{b.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{b.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{b.description}</p>
                <Badge variant="outline" className={getRarityColor(b.rarity)}>{b.rarity}</Badge>
                <p className="text-xs text-muted-foreground mt-2">{b.holders} holders</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Insights */}
        <TabsContent value="insights">
          <Card>
            <CardHeader><CardTitle>Community Impact</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Track growth and participation trends here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
