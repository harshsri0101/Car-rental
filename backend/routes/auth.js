const express = require("express");
const router = express.Router();

const {
  createUser,
  loginUser,
  getUsers,
  deleteUser
} = require("../controllers/userController");

// PUBLIC ROUTES
router.post("/register", createUser);
router.post("/login", loginUser);

// (optional protected routes)
router.get("/users", getUsers);
router.delete("/:id", deleteUser);

module.exports = router;