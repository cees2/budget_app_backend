const catchAsync = require("../utils/catchAsync");
const Expense = require("../models/expenseModel");
const AppError = require("../utils/AppError");

exports.getAllExpenses = catchAsync(async (request, response, next) => {
  const expenses = await Expense.find();

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
  const { name, value } = request.body;

  const createdExpense = await Expense.create({
    name,
    value,
  });

  if (!createdExpense)
    return next(new AppError("Could not create expense.", 400)); // do poprawy status

  response.status(200).json({
    message: "success",
    data: {
      createdExpense,
    },
  });
});

exports.deleteExpense = catchAsync(async (request, response, next) => {});

exports.updateExpense = catchAsync(async (request, response, next) => {});
