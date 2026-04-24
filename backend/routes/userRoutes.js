const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/auth");
const { getUsers, deleteUser } = require("../controllers/userController");

router.get("/", verifyToken, getUsers);
router.delete("/:id", verifyToken, deleteUser);

module.exports = router;