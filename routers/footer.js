const express = require("express");
const {
  getFooter,
  createFooter,
  updateFooter,
  deleteFooter,
  getAllFooter
} = require("../controllers/footer");
const { isAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getFooter);

// Protected routes
router.get("/all", isAuthenticated, getAllFooter);
router.post("/", isAuthenticated, createFooter);
router.put("/:footerId", isAuthenticated, updateFooter);
router.delete("/:footerId", isAuthenticated, deleteFooter);

module.exports = router; 