const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const AppError = require("./utils/AppError");
const globalErrorHandler = require("./controllers/errorController");
const cors = require("cors");

const userRouter = require("./routes/userRoutes");
const expenseRouter = require("./routes/expenseRouter");
const plansRouter = require("./routes/planRouter");

const app = express();

dotenv.config({ path: "./config.env" });

app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  app.use(cors());
}

app.use("/api/v1/users", userRouter);
app.use("/api/v1/expenses", expenseRouter);
app.use("/api/v1/plans", plansRouter);

app.all("*", (request, response, next) => {
  next(new AppError(`Can't find ${request.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
