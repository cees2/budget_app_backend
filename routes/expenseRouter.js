const express = require("express");
const {
  getAllExpenses,
  getExpense,
  deleteExpense,
  updateExpense,
  createExpense,
} = require("./../controllers/expenseController");

const router = express.Router();

router.route("/").get(getAllExpenses).post(createExpense);
router
  .route("/:expenseId")
  .get(getExpense)
  .delete(deleteExpense)
  .patch(updateExpense);

module.exports = router;
