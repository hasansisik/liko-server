const express = require("express");
const {
  getContact,
  createContact,
  updateContact,
  deleteContact,
  getAllContact
} = require("../controllers/contact");
const { isAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getContact);
router.post("/", isAuthenticated, createContact);
router.put("/:contactId", isAuthenticated, updateContact);
router.delete("/:contactId", isAuthenticated, deleteContact);
router.get("/all", isAuthenticated, getAllContact);

module.exports = router; 