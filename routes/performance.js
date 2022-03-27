const express = require("express");
const router = express.Router();
const measurePerformanceController = require("../controllers/measurePerformanceController");

router.post("/", measurePerformanceController.startTest);
router.delete("/", measurePerformanceController.stopTest);
module.exports = router;
