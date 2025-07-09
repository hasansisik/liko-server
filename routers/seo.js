const express = require("express");
const {
  getAllSEO,
  getSEOByPage,
  createSEO,
  updateSEO,
  deleteSEO,
  getPublicSEO
} = require("../controllers/seo");
const { isAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes (for frontend)
router.get("/public/:pageName", getPublicSEO);

// Protected routes (admin only)
router.get("/", isAuthenticated, getAllSEO);
router.get("/:pageName", isAuthenticated, getSEOByPage);
router.post("/", isAuthenticated, createSEO);
router.put("/:id", isAuthenticated, updateSEO);
router.delete("/:id", isAuthenticated, deleteSEO);

module.exports = router; 