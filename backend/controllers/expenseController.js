const catchAsync = require("../utils/catchAsync");
const { Expense } = require("../models/expenseModel");
const AppError = require("../utils/AppError");
const User = require("../models/userModel");

exports.getAllExpenses = catchAsync(async (request, response, next) => {
  let expenses;
  const { userId } = request.params;
  if (userId) {
    const usersExpenses = await User.findById(userId).populate({
      path: "expenses",
      select: "-__v",
    }); // czy ma byc id expensa wyslane?
    expenses = usersExpenses.expenses.reverse();
  } else expenses = await Expense.find();

  response.status(200).json({
    status: "success",
    expenses: expenses.length,
    data: {
      expenses,
    },
  });
});

exports.getExpense = catchAsync(async (request, response, next) => {
  const { expenseId } = request.params;

  const expense = await Expense.findById(expenseId);

  if (!expense) return next(new AppError("Could not find that user", 404));

  response.status(200).json({
    status: "success",
    data: {
      expense,
    },
  });
});

exports.createExpense = catchAsync(async (request, response, next) => {
  // do zrobienia: przypadek gdy to admin tworzy expense
  const { name, value, category } = request.body;
  // const expenseOwner = request;
  const expenseOwner = request.params.userId;

  const user = await User.findById(expenseOwner);

  if (!user) return next(new AppError("This user does not exist.", 400));

  const createdExpense = await Expense.create({
    name,
    value,
    category,
  });

  if (!createdExpense)
    return next(new AppError("Could not create expense.", 400));

  user.assignNewExpenseToUser(createdExpense.id);

  await user.save();

  response.status(200).json({
    message: "success",
    data: {
      createdExpense,
    },
  });
});

exports.deleteExpense = catchAsync(async (request, response, next) => {
  const { expenseId } = request.params;
  const expenseOwner = request.params.userId;

  const user = await User.findById(expenseOwner);

  if (!user) return next(new AppError("This user does not exist.", 400));

  await Expense.findByIdAndDelete(expenseId);

  user.deleteUsersExpense(expenseId);

  await user.save();

  response.status(204);
});

exports.updateExpense = catchAsync(async (request, response, next) => {});
