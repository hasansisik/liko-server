const express = require("express");
const {
  getForm,
  createForm,
  updateForm,
  deleteForm,
  getAllForm
} = require("../controllers/form");
const { isAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getForm);

// Protected routes
router.get("/all", isAuthenticated, getAllForm);
router.post("/", isAuthenticated, createForm);
router.put("/:formId", isAuthenticated, updateForm);
router.delete("/:formId", isAuthenticated, deleteForm);

module.exports = router; 
 