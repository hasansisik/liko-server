const express = require("express");
const {
  getAbout,
  createAbout,
  updateAbout,
  deleteAbout,
  getAllAbout
} = require("../controllers/about");
const { isAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getAbout);
router.post("/", isAuthenticated, createAbout);
router.put("/:aboutId", isAuthenticated, updateAbout);
router.delete("/:aboutId", isAuthenticated, deleteAbout);
router.get("/all", isAuthenticated, getAllAbout);

module.exports = router; 