const mongoose = require("mongoose")

const analyticsSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      unique: true,
    },
    // Daily metrics
    reportsReceived: {
      type: Number,
      default: 0,
    },
    reportsCompleted: {
      type: Number,
      default: 0,
    },
    tasksAssigned: {
      type: Number,
      default: 0,
    },
    tasksCompleted: {
      type: Number,
      default: 0,
    },
    // Performance metrics
    averageResponseTime: Number, // in hours
    averageCompletionTime: Number, // in hours
    customerSatisfactionRating: Number,
    // Worker metrics
    activeWorkers: Number,
    workerEfficiency: Number, // percentage
    // Waste type breakdown
    wasteTypeBreakdown: {
      household: { type: Number, default: 0 },
      construction: { type: Number, default: 0 },
      electronic: { type: Number, default: 0 },
      medical: { type: Number, default: 0 },
      industrial: { type: Number, default: 0 },
      organic: { type: Number, default: 0 },
      plastic: { type: Number, default: 0 },
      hazardous: { type: Number, default: 0 },
      other: { type: Number, default: 0 },
    },
    // Area-wise data
    areaStats: [
      {
        area: String,
        reportsCount: Number,
        completionRate: Number,
        averageRating: Number,
      },
    ],
    // Environmental impact
    environmentalImpact: {
      wasteCollected: Number, // in kg
      recycledWaste: Number, // in kg
      carbonFootprintReduced: Number, // in kg CO2
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Analytics", analyticsSchema)
