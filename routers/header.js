const express = require("express");
const {
  getHeader,
  createHeader,
  updateHeader,
  deleteHeader,
  getAllHeader
} = require("../controllers/header");
const { isAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getHeader);

// Protected routes
router.get("/all", isAuthenticated, getAllHeader);
router.post("/", isAuthenticated, createHeader);
router.put("/:headerId", isAuthenticated, updateHeader);
router.delete("/:headerId", isAuthenticated, deleteHeader);

module.exports = router; 