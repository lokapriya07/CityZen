// "use client";

// import React, { useState } from "react";
// // Note: You may need to adjust these import paths to match your project, e.g., "@/components/ui/card"
// import { Card, CardContent, CardHeader, CardTitle } from "../citizen/ui/card";
// import { Button } from "../citizen/ui/button";
// import { Badge } from "../citizen/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "../citizen/ui/avatar";
// import { Progress } from "../citizen/ui/progress";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../citizen/ui/tabs";

// export function CommunityEngagement() {
//     const [selectedCampaign, setSelectedCampaign] = useState(null);
//     const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
//     const [showRewardModal, setShowRewardModal] = useState(false);
//     const [showBulkRewardModal, setShowBulkRewardModal] = useState(false);
//     const [showAutomatedRulesModal, setShowAutomatedRulesModal] = useState(false);
//     const [selectedUsers, setSelectedUsers] = useState([]);
//     const [newCampaignData, setNewCampaignData] = useState({
//         title: "",
//         description: "",
//         endDate: "",
//         target: "",
//     });
//     const [rewardData, setRewardData] = useState({
//         selectedUser: "",
//         rewardType: "points",
//         amount: "",
//         reason: "",
//     });
//     const [bulkRewardData, setBulkRewardData] = useState({
//         rewardType: "points",
//         amount: "",
//         reason: "",
//     });
//     const [automatedRuleData, setAutomatedRuleData] = useState({
//         ruleName: "",
//         criteria: "reports",
//         threshold: "",
//         rewardType: "points",
//         rewardAmount: "",
//     });
//     const [campaigns, setCampaigns] = useState([
//         { id: "1", title: "Clean Streets Initiative", description: "Report overflowing bins and illegal dumping to keep our streets clean", startDate: "2024-01-01", endDate: "2024-03-31", status: "active", participants: 234, reportsGenerated: 567, target: 800, rewards: ["Clean Streets Badge", "50 Bonus Points", "City Recognition"] },
//         { id: "2", title: "Green Neighborhood Challenge", description: "Promote recycling and proper waste segregation in residential areas", startDate: "2024-02-15", endDate: "2024-04-15", status: "active", participants: 189, reportsGenerated: 234, target: 400, rewards: ["Green Guardian Badge", "75 Bonus Points", "Eco-Friendly Kit"] },
//         { id: "3", title: "Zero Waste Week", description: "Special campaign to minimize waste generation and maximize recycling", startDate: "2024-01-15", endDate: "2024-01-22", status: "completed", participants: 456, reportsGenerated: 123, target: 100, rewards: ["Zero Waste Warrior Badge", "100 Bonus Points"] },
//     ]);

//     const topReporters = [
//         { id: "1", name: "Sarah Wilson", avatar: "/placeholder.svg", reports: 45, points: 1250, badges: ["eco-warrior", "community-champion", "clean-streets"], area: "Block A", joinedDate: "2023-08-15" },
//         { id: "2", name: "Mike Johnson", avatar: "/placeholder.svg", reports: 38, points: 980, badges: ["vigilant-citizen", "green-guardian"], area: "Sector 15", joinedDate: "2023-09-22" },
//         { id: "3", name: "Priya Patel", avatar: "/placeholder.svg", reports: 32, points: 850, badges: ["neighborhood-hero", "clean-streets"], area: "Block C", joinedDate: "2023-07-10" },
//         { id: "4", name: "John Doe", avatar: "/placeholder.svg", reports: 28, points: 720, badges: ["eco-warrior"], area: "Park Area", joinedDate: "2023-10-05" },
//         { id: "5", name: "Lisa Chen", avatar: "/placeholder.svg", reports: 24, points: 650, badges: ["green-guardian", "vigilant-citizen"], area: "Block B", joinedDate: "2023-11-12" },
//     ];

//     const topAreas = [
//         { area: "Block A", reports: 156, residents: 1200, engagement: 85 },
//         { area: "Sector 15", reports: 134, residents: 980, engagement: 78 },
//         { area: "Block C", reports: 98, residents: 850, engagement: 72 },
//         { area: "Park Area", reports: 87, residents: 650, engagement: 68 },
//         { area: "Block B", reports: 76, residents: 720, engagement: 65 },
//     ];

//     const badges = [
//         { id: "eco-warrior", name: "Eco Warrior", description: "Reported 25+ environmental issues", icon: "🌱", rarity: "common", holders: 45 },
//         { id: "community-champion", name: "Community Champion", description: "Top reporter in your area for 3 months", icon: "🏆", rarity: "rare", holders: 12 },
//         { id: "clean-streets", name: "Clean Streets", description: "Participated in Clean Streets Initiative", icon: "🧹", rarity: "common", holders: 234 },
//         { id: "vigilant-citizen", name: "Vigilant Citizen", description: "Consistently reports issues within 24 hours", icon: "👁️", rarity: "uncommon", holders: 28 },
//         { id: "green-guardian", name: "Green Guardian", description: "Focuses on recycling and waste segregation", icon: "♻️", rarity: "uncommon", holders: 67 },
//         { id: "neighborhood-hero", name: "Neighborhood Hero", description: "Helped resolve 50+ community issues", icon: "🦸", rarity: "epic", holders: 8 },
//     ];

//     const getBadgeInfo = (badgeId) => {
//         return badges.find((b) => b.id === badgeId);
//     };

//     const getRarityColor = (rarity) => {
//         switch (rarity) {
//             case "common": return "bg-gray-100 text-gray-700 border-gray-300";
//             case "uncommon": return "bg-green-100 text-green-700 border-green-300";
//             case "rare": return "bg-blue-100 text-blue-700 border-blue-300";
//             case "epic": return "bg-purple-100 text-purple-700 border-purple-300";
//             default: return "bg-gray-100 text-gray-700 border-gray-300";
//         }
//     };

//     const handleCreateCampaign = () => { /* Your logic */ setShowNewCampaignModal(false); };
//     const handleSendReward = () => { /* Your logic */ setShowRewardModal(false); };
//     const handleBulkReward = () => { /* Your logic */ setShowBulkRewardModal(false); };
//     const handleCreateAutomatedRule = () => { /* Your logic */ setShowAutomatedRulesModal(false); };
//     const toggleUserSelection = (userId) => setSelectedUsers(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
//     const selectAllUsers = () => setSelectedUsers(selectedUsers.length === topReporters.length ? [] : topReporters.map(r => r.id));

//     return (
//         <div className="space-y-6">
//             {/* Header */}
//             <div className="flex items-center justify-between">
//                 <div>
//                     <h2 className="text-2xl font-bold text-foreground">Community Engagement</h2>
//                     <p className="text-muted-foreground">Recognize active citizens and promote community participation</p>
//                 </div>
//                 <div className="flex items-center space-x-3">
//                     <Button variant="outline" size="sm" onClick={() => setShowNewCampaignModal(true)}>New Campaign</Button>
//                     <Button variant="outline" size="sm" onClick={() => setShowBulkRewardModal(true)}>Bulk Rewards</Button>
//                     <Button variant="outline" size="sm" onClick={() => setShowAutomatedRulesModal(true)}>Auto Rules</Button>
//                     <Button size="sm" onClick={() => setShowRewardModal(true)}>Send Reward</Button>
//                 </div>
//             </div>

//             {/* Modals */}
//             {showNewCampaignModal && (
//                  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
//                     <Card className="w-full max-w-md bg-white">
//                         <CardHeader><CardTitle>Create New Campaign</CardTitle></CardHeader>
//                         <CardContent className="space-y-4">
//                             <div>
//                                 <label className="text-sm font-medium text-gray-700">Campaign Title</label>
//                                 <input type="text" placeholder="e.g., Clean Streets Initiative" value={newCampaignData.title} onChange={(e) => setNewCampaignData({ ...newCampaignData, title: e.target.value })} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
//                             </div>
//                             <div>
//                                 <label className="text-sm font-medium text-gray-700">Description</label>
//                                 <textarea placeholder="Describe the campaign goals and benefits" value={newCampaignData.description} onChange={(e) => setNewCampaignData({ ...newCampaignData, description: e.target.value })} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} />
//                             </div>
//                             <div>
//                                 <label className="text-sm font-medium text-gray-700">End Date</label>
//                                 <input type="date" value={newCampaignData.endDate} onChange={(e) => setNewCampaignData({ ...newCampaignData, endDate: e.target.value })} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
//                             </div>
//                             <div>
//                                 <label className="text-sm font-medium text-gray-700">Target Reports</label>
//                                 <input type="number" placeholder="e.g., 500" value={newCampaignData.target} onChange={(e) => setNewCampaignData({ ...newCampaignData, target: e.target.value })} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
//                             </div>
//                             <div className="flex gap-3 pt-4">
//                                 <Button variant="outline" className="flex-1" onClick={() => setShowNewCampaignModal(false)}>Cancel</Button>
//                                 <Button className="flex-1" onClick={handleCreateCampaign}>Create Campaign</Button>
//                             </div>
//                         </CardContent>
//                     </Card>
//                 </div>
//             )}
//             {showRewardModal && (
//                  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
//                     <Card className="w-full max-w-md bg-white">
//                         <CardHeader><CardTitle>Send Reward</CardTitle></CardHeader>
//                         <CardContent className="space-y-4">
//                              <div>
//                                 <label className="text-sm font-medium text-gray-700">Select User</label>
//                                 <select value={rewardData.selectedUser} onChange={(e) => setRewardData({ ...rewardData, selectedUser: e.target.value })} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
//                                     <option value="">Choose a user...</option>
//                                     {topReporters.map((reporter) => ( <option key={reporter.id} value={reporter.id}>{reporter.name} ({reporter.points} pts)</option> ))}
//                                 </select>
//                             </div>
//                             <div>
//                                 <label className="text-sm font-medium text-gray-700">Reward Type</label>
//                                 <select value={rewardData.rewardType} onChange={(e) => setRewardData({ ...rewardData, rewardType: e.target.value })} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
//                                     <option value="points">Bonus Points</option>
//                                     <option value="badge">Badge</option>
//                                 </select>
//                             </div>
//                             <div>
//                                 <label className="text-sm font-medium text-gray-700">Amount / Value</label>
//                                 <input type="text" placeholder="e.g., 100 or 'special-badge-id'" value={rewardData.amount} onChange={(e) => setRewardData({ ...rewardData, amount: e.target.value })} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
//                             </div>
//                             <div>
//                                 <label className="text-sm font-medium text-gray-700">Reason</label>
//                                 <textarea placeholder="Why are you giving this reward?" value={rewardData.reason} onChange={(e) => setRewardData({ ...rewardData, reason: e.target.value })} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" rows={2} />
//                             </div>
//                             <div className="flex gap-3 pt-4">
//                                 <Button variant="outline" className="flex-1" onClick={() => setShowRewardModal(false)}>Cancel</Button>
//                                 <Button className="flex-1" onClick={handleSendReward}>Send</Button>
//                             </div>
//                         </CardContent>
//                     </Card>
//                 </div>
//             )}
//             {showBulkRewardModal && (
//                 <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
//                     <Card className="w-full max-w-2xl bg-white max-h-[90vh] flex flex-col">
//                         <CardHeader><CardTitle>Send Bulk Rewards</CardTitle></CardHeader>
//                         <CardContent className="flex-1 overflow-y-auto space-y-4 p-6">
//                             <div className="flex items-center p-2 border rounded-md">
//                                 <input type="checkbox" id="selectAll" checked={selectedUsers.length === topReporters.length} onChange={selectAllUsers} className="w-4 h-4 mr-3" />
//                                 <label htmlFor="selectAll" className="text-sm font-medium">Select All / Deselect All</label>
//                             </div>
//                             <div className="space-y-2 border rounded-md p-2 max-h-60 overflow-y-auto">
//                                 {topReporters.map((reporter) => (
//                                     <div key={reporter.id} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 cursor-pointer" onClick={() => toggleUserSelection(reporter.id)}>
//                                         <input type="checkbox" checked={selectedUsers.includes(reporter.id)} readOnly className="w-4 h-4" />
//                                         <Avatar className="w-8 h-8"><AvatarImage src={reporter.avatar} /><AvatarFallback>{reporter.name.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
//                                         <div className="flex-1"><p className="text-sm font-medium">{reporter.name}</p><p className="text-xs text-gray-500">{reporter.points} pts • {reporter.reports} reports</p></div>
//                                     </div>
//                                 ))}
//                             </div>
//                             <div>
//                                 <label className="text-sm font-medium text-gray-700">Reward Type</label>
//                                 <select value={bulkRewardData.rewardType} onChange={(e) => setBulkRewardData({ ...bulkRewardData, rewardType: e.target.value })} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
//                                     <option value="points">Bonus Points</option>
//                                     <option value="badge">Badge</option>
//                                 </select>
//                             </div>
//                             <div>
//                                 <label className="text-sm font-medium text-gray-700">Amount / Value (per user)</label>
//                                 <input type="text" placeholder="e.g., 50 or 'campaign-badge'" value={bulkRewardData.amount} onChange={(e) => setBulkRewardData({ ...bulkRewardData, amount: e.target.value })} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
//                             </div>
//                             <div>
//                                 <label className="text-sm font-medium text-gray-700">Reason</label>
//                                 <textarea placeholder="e.g., End of quarter bonus" value={bulkRewardData.reason} onChange={(e) => setBulkRewardData({ ...bulkRewardData, reason: e.target.value })} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" rows={2} />
//                             </div>
//                         </CardContent>
//                         <div className="flex gap-3 p-6 border-t">
//                             <Button variant="outline" className="flex-1" onClick={() => setShowBulkRewardModal(false)}>Cancel</Button>
//                             <Button className="flex-1" onClick={handleBulkReward} disabled={selectedUsers.length === 0}>Send to {selectedUsers.length} Users</Button>
//                         </div>
//                     </Card>
//                 </div>
//             )}
//             {showAutomatedRulesModal && (
//                  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
//                     <Card className="w-full max-w-md bg-white">
//                         <CardHeader><CardTitle>Create Automated Reward Rule</CardTitle></CardHeader>
//                         <CardContent className="space-y-4">
//                              <div>
//                                 <label className="text-sm font-medium text-gray-700">Rule Name</label>
//                                 <input type="text" placeholder="e.g., Monthly Top Reporter" value={automatedRuleData.ruleName} onChange={(e) => setAutomatedRuleData({ ...automatedRuleData, ruleName: e.target.value })} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
//                             </div>
//                             <div>
//                                 <label className="text-sm font-medium text-gray-700">Reward Criteria</label>
//                                 <select value={automatedRuleData.criteria} onChange={(e) => setAutomatedRuleData({ ...automatedRuleData, criteria: e.target.value })} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
//                                     <option value="reports">Reports Count</option>
//                                     <option value="points">Total Points</option>
//                                 </select>
//                             </div>
//                             <div>
//                                 <label className="text-sm font-medium text-gray-700">Threshold ({'>='})</label>
//                                 <input type="number" placeholder="e.g., 50" value={automatedRuleData.threshold} onChange={(e) => setAutomatedRuleData({ ...automatedRuleData, threshold: e.target.value })} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
//                             </div>
//                             <div>
//                                 <label className="text-sm font-medium text-gray-700">Reward Value</label>
//                                 <input type="text" placeholder="e.g., 100 or 'top-reporter-badge'" value={automatedRuleData.rewardAmount} onChange={(e) => setAutomatedRuleData({ ...automatedRuleData, rewardAmount: e.target.value })} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
//                             </div>
//                             <div className="flex gap-3 pt-4">
//                                 <Button variant="outline" className="flex-1" onClick={() => setShowAutomatedRulesModal(false)}>Cancel</Button>
//                                 <Button className="flex-1" onClick={handleCreateAutomatedRule}>Create Rule</Button>
//                             </div>
//                         </CardContent>
//                     </Card>
//                 </div>
//             )}
            
//             <Tabs defaultValue="leaderboard" className="space-y-6">
//                 <TabsList className="grid w-full grid-cols-4">
//                     <TabsTrigger value="leaderboard">Leaderboards</TabsTrigger>
//                     <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
//                     <TabsTrigger value="badges">Badges & Rewards</TabsTrigger>
//                     <TabsTrigger value="insights">Community Insights</TabsTrigger>
//                 </TabsList>

//                 {/* --- Leaderboards Tab --- */}
//                 <TabsContent value="leaderboard" className="space-y-6">
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                         <Card>
//                             <CardHeader>
//                                 <CardTitle className="flex items-center justify-between"><span>Top Reporters</span><Badge variant="secondary">This Month</Badge></CardTitle>
//                             </CardHeader>
//                             <CardContent>
//                                 <div className="space-y-4">
//                                     {topReporters.map((reporter, index) => (
//                                         <div key={reporter.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
//                                             <div className="flex items-center space-x-3">
//                                                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${index === 0 ? "bg-yellow-500 text-white" : index === 1 ? "bg-gray-400 text-white" : index === 2 ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-600"}`}>{index + 1}</div>
//                                                 <Avatar className="w-10 h-10"><AvatarImage src={reporter.avatar} /><AvatarFallback>{reporter.name.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
//                                             </div>
//                                             <div className="flex-1">
//                                                 <h4 className="font-medium text-sm">{reporter.name}</h4>
//                                                 <p className="text-xs text-gray-500">{reporter.area}</p>
//                                             </div>
//                                             <div className="text-right">
//                                                 <p className="text-sm font-bold text-blue-600">{reporter.points} pts</p>
//                                                 <p className="text-xs text-gray-500">{reporter.reports} reports</p>
//                                             </div>
//                                             <div className="flex flex-wrap gap-1">
//                                                 {reporter.badges.slice(0, 2).map(badgeId => {
//                                                     const badge = getBadgeInfo(badgeId);
//                                                     return <div key={badgeId} title={badge?.name} className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">{badge?.icon}</div>;
//                                                 })}
//                                                 {reporter.badges.length > 2 && <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs">+{reporter.badges.length - 2}</div>}
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </CardContent>
//                         </Card>
//                         <Card>
//                             <CardHeader>
//                                 <CardTitle className="flex items-center justify-between"><span>Most Active Areas</span><Badge variant="secondary">Engagement Rate</Badge></CardTitle>
//                             </CardHeader>
//                             <CardContent>
//                                 <div className="space-y-4">
//                                     {topAreas.map((area, index) => (
//                                         <div key={area.area} className="space-y-2">
//                                             <div className="flex items-center justify-between">
//                                                 <div className="flex items-center space-x-3">
//                                                     <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? "bg-yellow-500 text-white" : index === 1 ? "bg-gray-400 text-white" : index === 2 ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-600"}`}>{index + 1}</div>
//                                                     <div>
//                                                         <h4 className="font-medium text-sm">{area.area}</h4>
//                                                         <p className="text-xs text-gray-500">{area.reports} reports • {area.residents} residents</p>
//                                                     </div>
//                                                 </div>
//                                                 <p className="text-sm font-bold text-green-600">{area.engagement}%</p>
//                                             </div>
//                                             <Progress value={area.engagement} className="h-2" />
//                                         </div>
//                                     ))}
//                                 </div>
//                             </CardContent>
//                         </Card>
//                     </div>
//                 </TabsContent>

//                 {/* --- Campaigns Tab --- */}
//                 <TabsContent value="campaigns" className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//                     {campaigns.map((c) => (
//                         <Card key={c.id} className={`cursor-pointer hover:shadow-lg transition-shadow ${selectedCampaign === c.id ? "ring-2 ring-blue-500" : ""}`} onClick={() => setSelectedCampaign(selectedCampaign === c.id ? null : c.id)}>
//                             <CardHeader>
//                                 <div className="flex justify-between items-start">
//                                     <CardTitle className="text-lg">{c.title}</CardTitle>
//                                     <Badge variant={c.status === "active" ? "default" : "secondary"}>{c.status}</Badge>
//                                 </div>
//                             </CardHeader>
//                             <CardContent className="space-y-4">
//                                 <p className="text-sm text-gray-500">{c.description}</p>
//                                 <div>
//                                     <div className="flex justify-between text-xs text-gray-500 mb-1"><span>Progress</span><span>{c.reportsGenerated}/{c.target}</span></div>
//                                     <Progress value={(c.reportsGenerated / c.target) * 100} className="h-2" />
//                                 </div>
//                                 <p className="text-xs text-gray-400 pt-2 border-t">{new Date(c.startDate).toLocaleDateString()} - {new Date(c.endDate).toLocaleDateString()}</p>
//                             </CardContent>
//                         </Card>
//                     ))}
//                 </TabsContent>

//                 {/* --- Badges Tab --- */}
//                 <TabsContent value="badges" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                     {badges.map((b) => (
//                         <Card key={b.id}>
//                             <CardContent className="p-6 text-center">
//                                 <div className="text-5xl mb-3 flex justify-center">{b.icon}</div>
//                                 <h3 className="font-semibold text-lg mb-2">{b.name}</h3>
//                                 <p className="text-sm text-gray-500 mb-4">{b.description}</p>
//                                 <Badge variant="outline" className={getRarityColor(b.rarity)}>{b.rarity}</Badge>
//                                 <p className="text-xs text-gray-400 mt-3">{b.holders} holders</p>
//                             </CardContent>
//                         </Card>
//                     ))}
//                 </TabsContent>

//                 {/* --- Insights Tab --- */}
//                 <TabsContent value="insights" className="space-y-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                         <Card><CardHeader><CardTitle className="text-sm font-medium">Active Users</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">1,247</p><p className="text-xs text-gray-500">+12% from last month</p></CardContent></Card>
//                         <Card><CardHeader><CardTitle className="text-sm font-medium">Community Reports</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">3,456</p><p className="text-xs text-gray-500">+8% from last month</p></CardContent></Card>
//                         <Card><CardHeader><CardTitle className="text-sm font-medium">Badges Awarded</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">892</p><p className="text-xs text-gray-500">+25% from last month</p></CardContent></Card>
//                         <Card><CardHeader><CardTitle className="text-sm font-medium">Engagement Rate</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">73%</p><p className="text-xs text-gray-500">+5% from last month</p></CardContent></Card>
//                     </div>
//                     <Card>
//                         <CardHeader><CardTitle>Community Impact Summary</CardTitle></CardHeader>
//                         <CardContent>
//                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                                 <div className="text-center p-4 bg-green-50 rounded-lg"><div className="text-3xl font-bold text-green-600 mb-2">2,847</div><p className="text-sm text-green-700">Issues Resolved</p><p className="text-xs text-gray-500 mt-1">Through community reports</p></div>
//                                 <div className="text-center p-4 bg-blue-50 rounded-lg"><div className="text-3xl font-bold text-blue-600 mb-2">156</div><p className="text-sm text-blue-700">Active Volunteers</p><p className="text-xs text-gray-500 mt-1">Regular contributors</p></div>
//                                 <div className="text-center p-4 bg-purple-50 rounded-lg"><div className="text-3xl font-bold text-purple-600 mb-2">89%</div><p className="text-sm text-purple-700">Satisfaction Rate</p><p className="text-xs text-gray-500 mt-1">Community feedback</p></div>
//                             </div>
//                         </CardContent>
//                     </Card>
//                 </TabsContent>
//             </Tabs>
//         </div>
//     );
// }


"use client";

import React, { useState, useEffect } from "react";
// Note: You may need to adjust these import paths to match your project, e.g., "@/components/ui/card"
import { Card, CardContent, CardHeader, CardTitle } from "../citizen/ui/card";
import { Button } from "../citizen/ui/button";
import { Badge } from "../citizen/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../citizen/ui/avatar";
import { Progress } from "../citizen/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../citizen/ui/tabs";

// --- API Utility (To fetch data) ---
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

export function CommunityEngagement() {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showBulkRewardModal, setShowBulkRewardModal] = useState(false);
  const [showAutomatedRulesModal, setShowAutomatedRulesModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  // --- DYNAMIC DATA STATE ---
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeAreas, setActiveAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- MODAL STATES (from your file) ---
  const [newCampaignData, setNewCampaignData] = useState({
    title: "",
    description: "",
    endDate: "",
    target: "",
  });
  const [rewardData, setRewardData] = useState({
    selectedUser: "",
    rewardType: "points",
    amount: "",
    reason: "",
  });
  const [bulkRewardData, setBulkRewardData] = useState({
    rewardType: "points",
    amount: "",
    reason: "",
  });
  const [automatedRuleData, setAutomatedRuleData] = useState({
    ruleName: "",
    criteria: "reports",
    threshold: "",
    rewardType: "points",
    rewardAmount: "",
  });

  // --- MOCK DATA (for tabs we haven't made dynamic yet) ---
  const [campaigns, setCampaigns] = useState([
    { id: "1", title: "Clean Streets Initiative", description: "Report overflowing bins and illegal dumping to keep our streets clean", startDate: "2024-01-01", endDate: "2024-03-31", status: "active", participants: 234, reportsGenerated: 567, target: 800, rewards: ["Clean Streets Badge", "50 Bonus Points", "City Recognition"] },
    { id: "2", title: "Green Neighborhood Challenge", description: "Promote recycling and proper waste segregation in residential areas", startDate: "2024-02-15", endDate: "2024-04-15", status: "active", participants: 189, reportsGenerated: 234, target: 400, rewards: ["Green Guardian Badge", "75 Bonus Points", "Eco-Friendly Kit"] },
    { id: "3", title: "Zero Waste Week", description: "Special campaign to minimize waste generation and maximize recycling", startDate: "2024-01-15", endDate: "2024-01-22", status: "completed", participants: 456, reportsGenerated: 123, target: 100, rewards: ["Zero Waste Warrior Badge", "100 Bonus Points"] },
  ]);

  const badges = [
    { id: "eco-warrior", name: "Eco Warrior", description: "Reported 25+ environmental issues", icon: "🌱", rarity: "common", holders: 45 },
    { id: "community-champion", name: "Community Champion", description: "Top reporter in your area for 3 months", icon: "🏆", rarity: "rare", holders: 12 },
    { id: "clean-streets", name: "Clean Streets", description: "Participated in Clean Streets Initiative", icon: "🧹", rarity: "common", holders: 234 },
    { id: "vigilant-citizen", name: "Vigilant Citizen", description: "Consistently reports issues within 24 hours", icon: "👁️", rarity: "uncommon", holders: 28 },
    { id: "green-guardian", name: "Green Guardian", description: "Focuses on recycling and waste segregation", icon: "♻️", rarity: "uncommon", holders: 67 },
    { id: "neighborhood-hero", name: "Neighborhood Hero", description: "Helped resolve 50+ community issues", icon: "🦸", rarity: "epic", holders: 8 },
  ];
  // --- END MOCK DATA ---

  // --- DYNAMIC DATA FETCH ---
  useEffect(() => {
    const loadCommunityData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch leaderboard and active areas data
        const [leaderboardResponse, areasResponse] = await Promise.all([
          fetchApi("/api/admin/community/leaderboard"),
          fetchApi("/api/admin/community/active-areas"),
        ]);

        if (leaderboardResponse.success) {
          setLeaderboard(leaderboardResponse.data);
        } else {
          throw new Error("Failed to fetch leaderboard");
        }

        if (areasResponse.success) {
          setActiveAreas(areasResponse.data);
        } else {
          throw new Error("Failed to fetch active areas");
        }
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch community data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCommunityData();
  }, []);

  // --- Helper Functions (from your file) ---
  const getBadgeInfo = (badgeId) => {
    return badges.find((b) => b.id === badgeId);
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case "common": return "bg-gray-100 text-gray-700 border-gray-300";
      case "uncommon": return "bg-green-100 text-green-700 border-green-300";
      case "rare": return "bg-blue-100 text-blue-700 border-blue-300";
      case "epic": return "bg-purple-100 text-purple-700 border-purple-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  // --- Modal Handlers (from your file) ---
  const handleCreateCampaign = () => { /* Your logic */ setShowNewCampaignModal(false); };
  const handleSendReward = () => { /* Your logic */ setShowRewardModal(false); };
  const handleBulkReward = () => { /* Your logic */ setShowBulkRewardModal(false); };
  const handleCreateAutomatedRule = () => { /* Your logic */ setShowAutomatedRulesModal(false); };

  // --- UPDATED MODAL LOGIC (to use dynamic 'leaderboard' state) ---
  const toggleUserSelection = (userId) => setSelectedUsers(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
  const selectAllUsers = () => setSelectedUsers(selectedUsers.length === leaderboard.length ? [] : leaderboard.map(r => r.id));

  // --- LOADING AND ERROR STATES ---
  if (loading) {
    return (
      <div className="text-center p-8 text-lg text-indigo-500 animate-pulse">
        Loading community engagement data...
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        {/* Left side: Title + subtitle */}
        <div className="text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Community Engagement
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Recognize active citizens and promote community participation
          </p>
        </div>

        {/* Right side: Buttons */}
        <div className="flex flex-wrap justify-center sm:justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowNewCampaignModal(true)}
            className="w-full sm:w-auto"
          >
            New Campaign
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowBulkRewardModal(true)}
            className="w-full sm:w-auto"
          >
            Bulk Rewards
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAutomatedRulesModal(true)}
            className="w-full sm:w-auto"
          >
            Auto Rules
          </Button>
          <Button
            size="sm"
            onClick={() => setShowRewardModal(true)}
            className="w-full sm:w-auto"
          >
            Send Reward
          </Button>
        </div>
      </div>


      {/* Modals */}
      {/* 🌟 New Campaign Modal */}
      {showNewCampaignModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="w-full max-w-md sm:max-w-lg bg-white rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle>Create New Campaign</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Campaign Title</label>
                <input
                  type="text"
                  placeholder="e.g., Clean Streets Initiative"
                  value={newCampaignData.title}
                  onChange={(e) =>
                    setNewCampaignData({ ...newCampaignData, title: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  placeholder="Describe the campaign goals and benefits"
                  value={newCampaignData.description}
                  onChange={(e) =>
                    setNewCampaignData({ ...newCampaignData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    value={newCampaignData.endDate}
                    onChange={(e) =>
                      setNewCampaignData({ ...newCampaignData, endDate: e.target.value })
                    }
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Target Reports</label>
                  <input
                    type="number"
                    placeholder="e.g., 500"
                    value={newCampaignData.target}
                    onChange={(e) =>
                      setNewCampaignData({ ...newCampaignData, target: e.target.value })
                    }
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowNewCampaignModal(false)}
                >
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleCreateCampaign}>
                  Create Campaign
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 🌟 Send Reward Modal */}
      {showRewardModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="w-full max-w-md sm:max-w-lg bg-white rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle>Send Reward</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Select User</label>
                <select
                  value={rewardData.selectedUser}
                  onChange={(e) =>
                    setRewardData({ ...rewardData, selectedUser: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a user...</option>
                  {leaderboard.map((reporter) => (
                    <option key={reporter.id} value={reporter.id}>
                      {reporter.name} ({reporter.points} pts)
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Reward Type</label>
                  <select
                    value={rewardData.rewardType}
                    onChange={(e) =>
                      setRewardData({ ...rewardData, rewardType: e.target.value })
                    }
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="points">Bonus Points</option>
                    <option value="badge">Badge</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Amount / Value</label>
                  <input
                    type="text"
                    placeholder="e.g., 100 or 'special-badge-id'"
                    value={rewardData.amount}
                    onChange={(e) =>
                      setRewardData({ ...rewardData, amount: e.target.value })
                    }
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Reason</label>
                <textarea
                  placeholder="Why are you giving this reward?"
                  value={rewardData.reason}
                  onChange={(e) =>
                    setRewardData({ ...rewardData, reason: e.target.value })
                  }
                  rows={2}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowRewardModal(false)}
                >
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleSendReward}>
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 🌟 Bulk Reward Modal */}
      {showBulkRewardModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="w-full max-w-2xl bg-white max-h-[90vh] flex flex-col rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle>Send Bulk Rewards</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-4 p-4 sm:p-6">
              <div className="flex items-center p-2 border rounded-md">
                <input
                  type="checkbox"
                  id="selectAll"
                  checked={selectedUsers.length === leaderboard.length && leaderboard.length > 0}
                  onChange={selectAllUsers}
                  className="w-4 h-4 mr-3"
                />
                <label htmlFor="selectAll" className="text-sm font-medium">
                  Select All / Deselect All
                </label>
              </div>
              <div className="space-y-2 border rounded-md p-2 max-h-60 overflow-y-auto">
                {leaderboard.map((reporter) => (
                  <div
                    key={reporter.id}
                    className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleUserSelection(reporter.id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(reporter.id)}
                      readOnly
                      className="w-4 h-4"
                    />
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={reporter.avatar || '/placeholder.svg'} />
                      <AvatarFallback>
                        {reporter.name.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{reporter.name}</p>
                      <p className="text-xs text-gray-500">
                        {reporter.points} pts • {reporter.reportCount} reports
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Reward Type</label>
                  <select
                    value={bulkRewardData.rewardType}
                    onChange={(e) =>
                      setBulkRewardData({ ...bulkRewardData, rewardType: e.target.value })
                    }
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="points">Bonus Points</option>
                    <option value="badge">Badge</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Amount / Value (per user)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 50 or 'campaign-badge'"
                    value={bulkRewardData.amount}
                    onChange={(e) =>
                      setBulkRewardData({ ...bulkRewardData, amount: e.target.value })
                    }
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Reason</label>
                <textarea
                  placeholder="e.g., End of quarter bonus"
                  value={bulkRewardData.reason}
                  onChange={(e) =>
                    setBulkRewardData({ ...bulkRewardData, reason: e.target.value })
                  }
                  rows={2}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </CardContent>
            <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-6 border-t">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowBulkRewardModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleBulkReward}
                disabled={selectedUsers.length === 0}
              >
                Send to {selectedUsers.length} Users
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* 🌟 Automated Rules Modal */}
      {showAutomatedRulesModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="w-full max-w-md sm:max-w-lg bg-white rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle>Create Automated Reward Rule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Rule Name</label>
                <input
                  type="text"
                  placeholder="e.g., Monthly Top Reporter"
                  value={automatedRuleData.ruleName}
                  onChange={(e) =>
                    setAutomatedRuleData({ ...automatedRuleData, ruleName: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Reward Criteria</label>
                  <select
                    value={automatedRuleData.criteria}
                    onChange={(e) =>
                      setAutomatedRuleData({ ...automatedRuleData, criteria: e.target.value })
                    }
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="reports">Reports Count</option>
                    <option value="points">Total Points</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Threshold ({'>='})
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 50"
                    value={automatedRuleData.threshold}
                    onChange={(e) =>
                      setAutomatedRuleData({ ...automatedRuleData, threshold: e.target.value })
                    }
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Reward Value</label>
                <input
                  type="text"
                  placeholder="e.g., 100 or 'top-reporter-badge'"
                  value={automatedRuleData.rewardAmount}
                  onChange={(e) =>
                    setAutomatedRuleData({
                      ...automatedRuleData,
                      rewardAmount: e.target.value,
                    })
                  }
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowAutomatedRulesModal(false)}
                >
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleCreateAutomatedRule}>
                  Create Rule
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}


      <Tabs defaultValue="leaderboard" className="space-y-6 w-full">
        <TabsList
          className="
      flex flex-wrap sm:grid sm:grid-cols-4 
      gap-2 sm:gap-0 
      w-full 
      overflow-x-auto
      scrollbar-hide
      justify-center sm:justify-between
    "
        >
          <TabsTrigger
            value="leaderboard"
            className="flex-1 min-w-[140px] text-sm sm:text-base text-center"
          >
            Leaderboards
          </TabsTrigger>

          <TabsTrigger
            value="campaigns"
            className="flex-1 min-w-[140px] text-sm sm:text-base text-center"
          >
            Campaigns
          </TabsTrigger>

          <TabsTrigger
            value="badges"
            className="flex-1 min-w-[140px] text-sm sm:text-base text-center"
          >
            Badges & Rewards
          </TabsTrigger>

          <TabsTrigger
            value="insights"
            className="flex-1 min-w-[140px] text-sm sm:text-base text-center"
          >
            Community Insights
          </TabsTrigger>
        </TabsList>



        {/* --- Leaderboards Tab (NOW DYNAMIC) --- */}
        <TabsContent value="leaderboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {/* 🏆 Top Reporters Card */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-sm sm:text-base">
                  <span>Top Reporters</span>
                  <Badge variant="secondary">This Month</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.length > 0 ? (
                    leaderboard.map((reporter, index) => (
                      <div
                        key={reporter.id}
                        className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        {/* Rank + Avatar */}
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${index === 0
                                ? "bg-yellow-500 text-white"
                                : index === 1
                                  ? "bg-gray-400 text-white"
                                  : index === 2
                                    ? "bg-orange-500 text-white"
                                    : "bg-gray-200 text-gray-600"
                              }`}
                          >
                            {index + 1}
                          </div>
                          <Avatar className="w-9 h-9">
                            <AvatarImage src={reporter.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {reporter.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        {/* Reporter Info */}
                        <div className="flex-1 min-w-[100px]">
                          <h4 className="font-medium text-sm sm:text-base truncate">
                            {reporter.name}
                          </h4>
                          <p className="text-xs text-gray-500 truncate">{reporter.area}</p>
                        </div>

                        {/* Points */}
                        <div className="text-right min-w-[80px]">
                          <p className="text-sm sm:text-base font-bold text-blue-600">
                            {reporter.points} pts
                          </p>
                          <p className="text-xs text-gray-500">
                            {reporter.reportCount} reports
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 text-sm">
                      No reporter data available.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 🌍 Most Active Areas Card */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-sm sm:text-base">
                  <span>Most Active Areas</span>
                  <Badge variant="secondary">Engagement Rate</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeAreas.length > 0 ? (
                    activeAreas.map((area, index) => (
                      <div key={area.name} className="space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index === 0
                                  ? "bg-yellow-500 text-white"
                                  : index === 1
                                    ? "bg-gray-400 text-white"
                                    : index === 2
                                      ? "bg-orange-500 text-white"
                                      : "bg-gray-200 text-gray-600"
                                }`}
                            >
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-medium text-sm sm:text-base truncate">
                                {area.name}
                              </h4>
                              <p className="text-xs text-gray-500 truncate">
                                {area.reportCount} reports • {area.residentCount} residents
                              </p>
                            </div>
                          </div>
                          <p className="text-sm sm:text-base font-bold text-green-600">
                            {area.engagement}%
                          </p>
                        </div>
                        <Progress value={area.engagement} className="h-2" />
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 text-sm">
                      No area data available.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>


        {/* --- Campaigns Tab (Still Mock Data) --- */}
        <TabsContent value="campaigns" className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {campaigns.map((c) => (
            <Card key={c.id} className={`cursor-pointer hover:shadow-lg transition-shadow ${selectedCampaign === c.id ? "ring-2 ring-blue-500" : ""}`} onClick={() => setSelectedCampaign(selectedCampaign === c.id ? null : c.id)}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{c.title}</CardTitle>
                  <Badge variant={c.status === "active" ? "default" : "secondary"}>{c.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-500">{c.description}</p>
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1"><span>Progress</span><span>{c.reportsGenerated}/{c.target}</span></div>
                  <Progress value={(c.reportsGenerated / c.target) * 100} className="h-2" />
                </div>
                <p className="text-xs text-gray-400 pt-2 border-t">{new Date(c.startDate).toLocaleDateString()} - {new Date(c.endDate).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* --- Badges Tab (Still Mock Data) --- */}
        <TabsContent value="badges" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {badges.map((b) => (
            <Card key={b.id}>
              <CardContent className="p-6 text-center">
                <div className="text-5xl mb-3 flex justify-center">{b.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{b.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{b.description}</p>
                <Badge variant="outline" className={getRarityColor(b.rarity)}>{b.rarity}</Badge>
                <p className="text-xs text-gray-400 mt-3">{b.holders} holders</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* --- Insights Tab (Still Mock Data) --- */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card><CardHeader><CardTitle className="text-sm font-medium">Active Users</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">1,247</p><p className="text-xs text-gray-500">+12% from last month</p></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm font-medium">Community Reports</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">3,456</p><p className="text-xs text-gray-500">+8% from last month</p></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm font-medium">Badges Awarded</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">892</p><p className="text-xs text-gray-500">+25% from last month</p></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm font-medium">Engagement Rate</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">73%</p><p className="text-xs text-gray-500">+5% from last month</p></CardContent></Card>
          </div>
          <Card>
            <CardHeader><CardTitle>Community Impact Summary</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg"><div className="text-3xl font-bold text-green-600 mb-2">2,847</div><p className="text-sm text-green-700">Issues Resolved</p><p className="text-xs text-gray-500 mt-1">Through community reports</p></div>
                <div className="text-center p-4 bg-blue-50 rounded-lg"><div className="text-3xl font-bold text-blue-600 mb-2">156</div><p className="text-sm text-blue-700">Active Volunteers</p><p className="text-xs text-gray-500 mt-1">Regular contributors</p></div>
                <div className="text-center p-4 bg-purple-50 rounded-lg"><div className="text-3xl font-bold text-purple-600 mb-2">89%</div><p className="text-sm text-purple-700">Satisfaction Rate</p><p className="text-xs text-gray-500 mt-1">Community feedback</p></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}