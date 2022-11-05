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
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = null;
  next();
});

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
