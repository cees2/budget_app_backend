const express = require("express");
const {
  getAllExpenses,
  getExpense,
  deleteExpense,
  updateExpense,
  createExpense,
} = require("./../controllers/expenseController");

const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router.use(protect);

router.route("/").get(getAllExpenses).post(createExpense); // do poprawy
router
  .route("/:expenseId")
  .get(getExpense)
  .delete(deleteExpense)
  .patch(updateExpense);

module.exports = router;
