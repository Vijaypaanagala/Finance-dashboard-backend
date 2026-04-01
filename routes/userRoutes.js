const express = require("express");
const {
  createUser,
  getAllUsers,
  updateUserRoleAndStatus,
} = require("../controllers/userController");
const checkRole = require("../middleware/checkRole");

const router = express.Router();

router.post("/", checkRole(["admin"]), createUser);
router.get("/", checkRole(["analyst", "admin"]), getAllUsers);
router.patch("/:id", checkRole(["admin"]), updateUserRoleAndStatus);

module.exports = router;
