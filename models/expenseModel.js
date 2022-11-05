const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Expense must have a name"],
    unique: true,
    trim: true,
    minLength: 3,
  },
  value: {
    type: Number,
    required: [true, "Expense must have a name"],
    min: 0.01,
  },
  dateCreated: Date,
});

expenseSchema.pre("save", function (next) {
  this.dateCreated = Date.now();
  next();
});

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
