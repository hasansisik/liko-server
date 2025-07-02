const express = require("express");
const {
  getAllBlogPosts,
  getBlogPost,
  getBlogPostForAdmin,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  addComment,
  getAllComments,
  approveComment,
  deleteComment,
  getCategories
} = require("../controllers/blogPosts");
const { isAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getAllBlogPosts);
router.get("/categories", getCategories);
router.post("/:postId/comments", addComment);

// Protected routes - specific routes before parameterized ones
router.get("/comments", isAuthenticated, getAllComments);
router.get("/admin/:id", isAuthenticated, getBlogPostForAdmin);
router.post("/", isAuthenticated, createBlogPost);
router.put("/:postId", isAuthenticated, updateBlogPost);
router.delete("/:postId", isAuthenticated, deleteBlogPost);

// Public routes - parameterized routes at the end
router.get("/:id", getBlogPost);
router.get("/slug/:slug", getBlogPost);
router.put("/:postId/comments/:commentId/approve", isAuthenticated, approveComment);
router.delete("/:postId/comments/:commentId", isAuthenticated, deleteComment);

module.exports = router; 
 
 
 
 