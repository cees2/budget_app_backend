const catchAsync = require("../utils/catchAsync");
const { Plan } = require("../models/PlanModel");
const AppError = require("../utils/AppError");
const User = require("../models/userModel");

exports.getAllPlans = catchAsync(async (request, response, next) => {
  let plans;
  const { userId } = request.params;
  if (userId) {
    const usersPlans = await User.findById(userId).populate({
      path: "plans",
      select: "-__v",
    }); // czy ma byc id expensa wyslane?
    plans = usersPlans.plans;
  } else plans = await Plan.find();

  response.status(200).json({
    status: "success",
    plans: plans.length,
    data: {
      plans,
    },
  });
});

exports.getPlan = catchAsync(async (request, response, next) => {
  const { planId } = request.params;

  const plan = await Plan.findById(planId);

  if (!plan) return next(new AppError("Could not find that plan", 404));

  response.status(200).json({
    status: "success",
    data: {
      plan,
    },
  });
});

exports.createPlan = catchAsync(async (request, response, next) => {
  const { name, priority, status } = request.body;
  const planOwner = request.params.userId;

  const user = await User.findById(planOwner);

  if (!user) return next(new AppError("This user does not exist.", 400));

  const createdPlan = await Plan.create({
    name,
    priority,
    status,
  });

  if (!createdPlan) return next(new AppError("Could not create plan.", 400));

  user.assignNewPlanToUser(createdPlan.id);

  await user.save();

  response.status(200).json({
    message: "success",
    data: {
      createdPlan,
    },
  });
});

exports.deletePlan = catchAsync(async (request, response, next) => {
  const { planId } = request.params;
  const planOwner = request.params.userId;

  const user = await User.findById(planOwner);

  if (!user) return next(new AppError("This user does not exist.", 400));

  await Plan.findByIdAndDelete(planId);

  user.deleteUsersPlan(planId);

  await user.save();

  response.status(200).json({
    status: "success",
  });
});

exports.updatePlan = catchAsync(async (request, response, next) => {
  const { planId } = request.params;
  const { body } = request;
  const plan = await Plan.findByIdAndUpdate(planId, body);

  if (!plan) return next(new AppError("Could not complete plan", 400));

  response.status(200).json({
    message: "success",
    data: {
      plan,
    },
  });
});
