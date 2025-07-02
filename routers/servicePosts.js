const express = require("express");
const {
  getAllServicePosts,
  getServicePost,
  createServicePost,
  updateServicePost,
  deleteServicePost,
  addComment,
  getCategories
} = require("../controllers/servicePosts");
const { isAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getAllServicePosts);
router.get("/categories", getCategories);
router.get("/:id", getServicePost);
router.post("/:postId/comments", addComment);

// Protected routes
router.post("/", isAuthenticated, createServicePost);
router.put("/:postId", isAuthenticated, updateServicePost);
router.delete("/:postId", isAuthenticated, deleteServicePost);

module.exports = router; 
 
 
 
 