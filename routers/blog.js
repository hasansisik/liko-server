const express = require("express");
const {
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlog
} = require("../controllers/blog");
const { isAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getBlog);
router.post("/", isAuthenticated, createBlog);
router.put("/", isAuthenticated, updateBlog);
router.delete("/", isAuthenticated, deleteBlog);
router.get("/all", isAuthenticated, getAllBlog);

module.exports = router; 