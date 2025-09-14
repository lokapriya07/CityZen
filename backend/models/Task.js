const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema(
  {
    taskId: {
      type: String,
      unique: true,
      // required: true,
    },
    report: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
      required: true,
    },
    assignedWorker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      required: true,
    },
    status: {
      type: String,
      enum: ["assigned", "accepted", "on-the-way", "in-progress", "completed", "rejected"],
      default: "assigned",
    },
    estimatedDuration: {
      type: Number, // in minutes
      default: 60,
    },
    actualDuration: Number,
    // Scheduling
    scheduledDate: Date,
    startedAt: Date,
    completedAt: Date,
    // Location
    location: {
      address: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    // Resources needed
    resourcesRequired: [
      {
        item: String,
        quantity: Number,
        unit: String,
      },
    ],
    // Progress tracking
    checkpoints: [
      {
        name: String,
        completed: {
          type: Boolean,
          default: false,
        },
        completedAt: Date,
        notes: String,
      },
    ],
    // Worker updates
    workerUpdates: [
      {
        status: String,
        message: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        location: {
          lat: Number,
          lng: Number,
        },
        images: [String],
      },
    ],
    // Completion details
    completionNotes: String,
    completionImages: [String],
    qualityRating: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  },
)

// Generate unique task ID
taskSchema.pre("save", function (next) {
  if (!this.taskId) {
    this.taskId = `TASK-${Date.now().toString().slice(-6)}`
  }
  next()
})

module.exports = mongoose.model("Task", taskSchema)
