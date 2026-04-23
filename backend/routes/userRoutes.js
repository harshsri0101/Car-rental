const express = require("express");
const router = express.Router();

// ✅ Sahi import
const { verifyToken } = require("../middleware/auth");

const {
  getUsers,
  deleteUser
} = require("../controllers/userController");

// ✅ GET ALL USERS (Protected)
router.get("/", verifyToken, getUsers);

// ✅ DELETE USER (Protected)
router.delete("/:id", verifyToken, deleteUser);

module.exports = router;