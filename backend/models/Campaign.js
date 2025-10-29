const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    target: { type: Number, required: true, default: 0 },
    status: { type: String, enum: ['active', 'completed'], default: 'active' },
    reportsGenerated: { type: Number, default: 0 },
    // This can store user IDs
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Campaign', CampaignSchema);