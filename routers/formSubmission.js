const express = require("express");
const {
  submitForm,
  getAllFormSubmissions,
  getFormSubmission,
  updateFormSubmission,
  deleteFormSubmission,
} = require("../controllers/formSubmission");
const { isAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();

// Public route for submitting a form
router.post("/", submitForm);

// Protected routes for admin/editor
router.get("/", isAuthenticated, getAllFormSubmissions);
router.get("/:submissionId", isAuthenticated, getFormSubmission);
router.put("/:submissionId", isAuthenticated, updateFormSubmission);
router.delete("/:submissionId", isAuthenticated, deleteFormSubmission);

module.exports = router; 