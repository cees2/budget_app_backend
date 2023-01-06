const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User must have a name."],
    trim: true,
    minLength: 3,
  },
  email: {
    type: String,
    required: [true, "User must have an email"],
    trim: true,
    unique: true,
    validate: [validator.isEmail, "Please provide a correct email."],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    select: false,
    minLength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please provide a password"],
    select: false,
    validate: {
      validator: function (passConfirm) {
        return this.password === passConfirm;
      },
      message: "Passwords do not match.",
    },
  },
  role: {
    type: String,
    default: "user",
    enum: ["admin", "user"],
  },
  dateCreated: {
    type: Date,
    default: Date.now(),
  },
  passwordChangedAt: Date,
  expenses: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Expense",
    },
  ],
  plans: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Plan",
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = null;
  this.name = `${this.name.slice(0, 1).toUpperCase()}${this.name.slice(1)}`;
  next();
});

userSchema.methods.assignNewExpenseToUser = function (newExpenseId) {
  this.expenses.push(newExpenseId);
};

userSchema.methods.deleteUsersExpense = function (expenseId) {
  // const expenseIndex = this.expenses?.findIndex(
  //   (expense) => expense.valueOf() === expenseId
  // );
  // this.expenses = this.expenses?.map((expense, i) => {
  //   if (i !== expenseIndex) return expense;
  // });
};

userSchema.methods.assignNewPlanToUser = function (newPlanId) {
  this.plans.push(newPlanId);
};

userSchema.methods.deleteUsersPlan = function (planId) {
  // console.log("plans", this.plans);
  // const planIndex = this.plans?.findIndex((plan) => plan.valueOf() === planId);
  // console.log("index", planIndex);
  // this.plans = this.plans?.map((plan, i) => {
  //   if (i !== planIndex) return plan;
  // });
};

userSchema.methods.changedPasswordAfter = function (tokenIssueDate) {
  return this.passwordChangedAt > tokenIssueDate;
};

userSchema.methods.comparePasswords = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
