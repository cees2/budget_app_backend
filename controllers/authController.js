const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const { promisify } = require("util");

const createTokenSendResponse = (user, statusCode, status, response) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  response.status(statusCode).json({
    status,
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (request, response) => {
  const { name, email, password, passwordConfirm } = request.body;

  const addedUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });

  createTokenSendResponse(addedUser, 201, "success", response);
});

exports.login = catchAsync(async (request, response, next) => {
  const { email, password } = request.body;

  const user = await User.findOne({ email: email }).select("+password");

  if (!user || !(await user.comparePasswords(password, user.password)))
    return next(new AppError("Incorrect email or password", 401));

  user.password = null;

  createTokenSendResponse(user, 201, "success", response);
});

exports.protect = catchAsync(async (request, response, next) => {
  const { authorization } = request.headers;
  let token;
  // sparawdzanie czy jest token
  if (authorization && authorization.startsWith("Bearer"))
    token = authorization.split(" ")[1];

  if (!token) {
    return next(new AppError("You are not logged in.", 401));
  }

  // zwroci id usera, ms wygenerowania i ms przedawnienia
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id);

  if (user.changedPasswordAfter(decoded.iat))
    return next(new AppError("User has changed password. Log in again."), 401);

  if (!user)
    return next(
      new AppError("This user no longer exists. Please log in again", 401)
    );

  request.user = user;

  next();
});

exports.restrictTo =
  (...roles) =>
  (request, response, next) => {
    if (!roles.includes(request.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
