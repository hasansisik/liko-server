const express = require("express");
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories
} = require("../controllers/categories");
const { isAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getCategories);
router.get("/:categoryId", getCategory);

// Protected routes (Admin/Editor)
router.post("/", isAuthenticated, createCategory);
router.put("/:categoryId", isAuthenticated, updateCategory);
router.delete("/:categoryId", isAuthenticated, deleteCategory);
router.get("/admin/all", isAuthenticated, getAllCategories);

module.exports = router; 
 
 
 
 