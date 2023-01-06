const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const AppError = require("../utils/AppError");

exports.getUser = catchAsync(async (request, response, next) => {
  const { userId } = request.params;

  const user = await User.findById(userId);

  if (!user) return next(new AppError("Could not find that user", 404));

  response.status(200).json({
    status: "success",
    message: "git",
    data: {
      user,
    },
  });
});

exports.getAllUsers = catchAsync(async (request, response, next) => {
  const users = await User.find().limit(100);

  response.status(200).json({
    status: "success",
    numOfUsers: users.length,
    data: {
      users,
    },
  });
});

exports.deleteUser = catchAsync(async (request, response, next) => {
  const { userId } = request.params;

  const deletedUser = await User.findByIdAndDelete(userId);

  if (!deletedUser) return next(new AppError("This user does not exist", 400));

  response.status(204).json();
});
