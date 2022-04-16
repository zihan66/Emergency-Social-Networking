const express = require("express");
const router = express.Router();
const provideMedicalSupplyController = require("../controllers/provideMedicalSupplyController");
const reserveMedicalSupplyController = require("../controllers/reserveMedicalSupplyController");
router.post("/", provideMedicalSupplyController.postMedicalSupply);
router.get("/:provider", provideMedicalSupplyController.getUserMedicalSupply);
router.delete("/:medicalSupplyId", provideMedicalSupplyController.deleteUserMedicalSupply);
//router.get("/all", provideMedicalSupplyController.getAllMedicalSupply);

router.get("/", reserveMedicalSupplyController.getAllMedicalSupply);

router.put("/:medicalSupplyId", reserveMedicalSupplyController.updateMedicalSupplyIsReserved);
//router.put("/cancel/:medicalSupplyId", reserveMedicalSupplyController.cancelReservation);
//router.get("/search/name", reserveMedicalSupplyController.searchMedicalSupply);


module.exports = router;
