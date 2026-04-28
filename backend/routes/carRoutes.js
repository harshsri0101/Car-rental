const express = require("express");
const router = express.Router();

const { verifyToken, isAdmin } = require("../middleware/auth");
const {
  addCar,
  getCars,
  updateCar,
  deleteCar,
} = require("../controllers/carController");

router.post("/", verifyToken, isAdmin, addCar);
router.post("/add", verifyToken, isAdmin, addCar);
router.get("/", getCars);
router.put("/:id", verifyToken, isAdmin, updateCar);
router.delete("/:id", verifyToken, isAdmin, deleteCar);

module.exports = router;
