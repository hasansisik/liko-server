const express = require("express");
const {
  getHome,
  createHome,
  updateHome,
  deleteHome,
  getAllHome
} = require("../controllers/home");
const { isAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getHome);
router.post("/", isAuthenticated, createHome);
router.put("/", isAuthenticated, updateHome);
router.delete("/", isAuthenticated, deleteHome);
router.get("/all", isAuthenticated, getAllHome);

module.exports = router; 