const express = require("express");
const {
  getService,
  createService,
  updateService,
  deleteService,
  getAllService
} = require("../controllers/service");
const { isAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getService);
router.post("/", isAuthenticated, createService);
router.put("/", isAuthenticated, updateService);
router.delete("/", isAuthenticated, deleteService);
router.get("/all", isAuthenticated, getAllService);

module.exports = router; 