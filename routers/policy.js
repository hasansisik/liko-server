const express = require("express");
const {
  getPolicy,
  createPolicy,
  updatePolicy,
  deletePolicy,
  getAllPolicies
} = require("../controllers/policy");
const { isAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();

// Public route for getting policy data
router.get("/:type", getPolicy);

// Protected routes for admin
router.post("/", isAuthenticated, createPolicy);
router.put("/:policyId", isAuthenticated, updatePolicy);
router.delete("/:policyId", isAuthenticated, deletePolicy);
router.get("/", isAuthenticated, getAllPolicies);

module.exports = router; 