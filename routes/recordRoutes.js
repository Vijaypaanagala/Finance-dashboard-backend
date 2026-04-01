const express = require("express");
const {
  createRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
} = require("../controllers/recordController");
const checkRole = require("../middleware/checkRole");

const router = express.Router();

router.post("/", checkRole(["admin", "analyst"]), createRecord);
router.get("/", checkRole(["admin", "analyst", "viewer"]), getAllRecords);
router.put("/:id", checkRole(["admin"]), updateRecord);
router.delete("/:id", checkRole(["admin"]), deleteRecord);

module.exports = router;
