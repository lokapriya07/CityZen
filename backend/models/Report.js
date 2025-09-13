const mongoose = require("mongoose")

const reportSchema = new mongoose.Schema(
  {
    reportId: {
      type: String,
      unique: true,
      required: true,
    },
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Location details
    location: {
      address: {
        type: String,
        required: [true, "Address is required"],
      },
      coordinates: {
        lat: {
          type: Number,
          required: [true, "Latitude is required"],
        },
        lng: {
          type: Number,
          required: [true, "Longitude is required"],
        },
      },
      landmark: String,
      area: String,
      city: String,
      pincode: String,
    },
    // Waste details
    wasteType: {
      type: String,
      required: [true, "Waste type is required"],
      enum: [
        "household",
        "construction",
        "electronic",
        "medical",
        "industrial",
        "organic",
        "plastic",
        "hazardous",
        "other",
      ],
    },
    wasteSize: {
      type: String,
      enum: ["small", "medium", "large", "very-large"],
      required: true,
    },
    urgency: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      required: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    // Media
    images: [
      {
        url: String,
        publicId: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // AI Analysis
    aiAnalysis: {
      wasteTypeDetected: String,
      confidence: Number,
      hazardLevel: String,
      estimatedVolume: String,
      recommendations: [String],
    },
    // Status tracking
    status: {
      type: String,
      enum: ["pending", "assigned", "in-progress", "completed", "rejected"],
      default: "pending",
    },
    priority: {
      type: Number,
      min: 1,
      max: 10,
      default: 5,
    },
    // Assignment
    assignedWorker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    assignedAt: Date,
    estimatedCompletionTime: Date,
    // Progress tracking
    timeline: [
      {
        status: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        notes: String,
      },
    ],
    // Completion details
    completedAt: Date,
    completionImages: [
      {
        url: String,
        publicId: String,
        uploadedAt: Date,
      },
    ],
    workerNotes: String,
    // Feedback
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: String,
      submittedAt: Date,
    },
    // Admin review
    adminReview: {
      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      reviewedAt: Date,
      approved: Boolean,
      notes: String,
    },
  },
  {
    timestamps: true,
  },
)

// Generate unique report ID
reportSchema.pre("save", function (next) {
  if (!this.reportId) {
    this.reportId = `WM-${Date.now().toString().slice(-6)}`
  }
  next()
})

// Calculate priority based on urgency and waste type
reportSchema.pre("save", function (next) {
  const urgencyWeights = { low: 2, medium: 5, high: 8, critical: 10 }
  const typeWeights = {
    hazardous: 3,
    medical: 3,
    electronic: 2,
    industrial: 2,
    construction: 1,
    household: 1,
    organic: 1,
    plastic: 1,
    other: 1,
  }

  this.priority = Math.min(10, urgencyWeights[this.urgency] + typeWeights[this.wasteType])
  next()
})

// Add timeline entry on status change
reportSchema.pre("save", function (next) {
  if (this.isModified("status") && !this.isNew) {
    this.timeline.push({
      status: this.status,
      timestamp: new Date(),
    })
  }
  next()
})

module.exports = mongoose.model("Report", reportSchema)
