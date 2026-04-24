const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/auth");
const { addCar, getCars, deleteCar } = require("../controllers/carController");

router.post("/add", verifyToken, addCar);
router.get("/", getCars);
router.delete("/:id", verifyToken, deleteCar);

module.exports = router;