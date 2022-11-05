const express = require("express");
const {
  getUser,
  getAllUsers,
  deleteUser,
} = require("../controllers/userController");
const {
  signup,
  login,
  protect,
  restrictTo,
} = require("../controllers/authController");

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);

router.use(protect);
router.use(restrictTo("admin"));

router.route("/").get(getAllUsers);
router.route("/:userId").get(getUser).delete(deleteUser);

module.exports = router;
