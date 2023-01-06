const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Plan must have a name"],
    trim: true,
    minLength: 3,
    unique: true,
  },
  priority: {
    type: String,
    required: [true, "Plan must have a priority"],
    enum: ["High", "Medium", "Low"],
  },
  completed: {
    type: Boolean,
    required: [true, "Plan must have a status"],
  },
  dateCreated: Date,
  dateCompleted: Date,
});

planSchema.pre("save", function (next) {
  this.dateCreated = Date.now();
  this.name = this.name.slice(0, 1).toUpperCase() + this.name.slice(1);
  next();
});

const Plan = mongoose.model("Plan", planSchema);

module.exports.planSchema = planSchema;

module.exports.Plan = Plan;
