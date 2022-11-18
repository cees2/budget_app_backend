const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Expense must have a name"],
    trim: true,
    minLength: 3,
  },
  value: {
    type: Number,
    required: [true, "Expense must have a value"],
    min: 0.01,
    max: 999999999,
  },
  category: {
    type: String,
    required: [true, "Expense must have a category"],
    enum: ["entertainment", "transportation"], // do poprawy
    lowercase: true,
  },
  dateCreated: Date,
});

expenseSchema.pre("save", function (next) {
  this.dateCreated = Date.now();
  next();
});

const Expense = mongoose.model("Expense", expenseSchema);

module.exports.expenseSchema = expenseSchema;

module.exports.Expense = Expense;
