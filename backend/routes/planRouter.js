const express = require("express");
const {
  getAllPlans,
  getPlan,
  deletePlan,
  createPlan,
  updatePlan,
} = require("./../controllers/planController");

const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router.use(protect);

router.route("/").get(getAllPlans).post(createPlan);
router.route("/:planId").get(getPlan).delete(deletePlan).patch(updatePlan);

module.exports = router;
