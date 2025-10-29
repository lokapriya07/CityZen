const mongoose = require('mongoose');

const AutomatedRuleSchema = new mongoose.Schema({
    ruleName: { type: String, required: true },
    criteria: { type: String, enum: ['reports', 'points'], required: true },
    threshold: { type: Number, required: true },
    rewardType: { type: String, enum: ['points', 'badge'], required: true },
    rewardAmount: { type: String, required: true }, // Stored as string to hold points (e.f. "100") or badge ID (e.g. "eco-warrior")
}, { timestamps: true });

module.exports = mongoose.model('AutomatedRule', AutomatedRuleSchema);