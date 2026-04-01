const express = require("express");
const {
  getSummary,
  getCategoryWiseTotals,
  getRecentTransactions,
  getMonthlyTrends,
} = require("../controllers/dashboardController");
const checkRole = require("../middleware/checkRole");

const router = express.Router();

router.get("/summary", checkRole(["viewer", "analyst", "admin"]), getSummary);
router.get("/category", checkRole(["viewer", "analyst", "admin"]), getCategoryWiseTotals);
router.get("/recent", checkRole(["viewer", "analyst", "admin"]), getRecentTransactions);
router.get("/monthly", checkRole(["viewer", "analyst", "admin"]), getMonthlyTrends);

module.exports = router;
