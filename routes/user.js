const express = require("express");
const joinController = require("../controllers/joinController");
const loginLogoutController = require("../controllers/loginLogoutController");
const shareStatusController = require("../controllers/shareStatusController");
const donorsController = require("../controllers/donorsController");
const administerUserProfileController= require("../controllers/administerUserProfileController");
const auth = require("../middlewares/auth");
const suspend = require("../middlewares/suspend");
const router = express.Router();

router.put("/:username/online", loginLogoutController.login);
router.put("/:username/offline", loginLogoutController.logout);
router.get("/donors", donorsController.getDonors);

router.get("/", loginLogoutController.getAllUsers);
router.post("/", joinController.join);
router.get("/:username", suspend, shareStatusController.getOneUserRecord);

router.put(
  "/:username/status/:lastStatusCode",
  suspend,
  shareStatusController.setStatus
);
router.put("/:username/acknowledgement", auth, joinController.acknowledge);

router.put("/:username/isDonor", suspend, donorsController.updateUserByDonor);

router.put(
  "/:username/updateBloodType",
  suspend,
  donorsController.updateBloodType
);

router.put("/:username/inactive", administerUserProfileController.ChangeToInactive);
router.put("/:username/active", administerUserProfileController.ChangeToActive);
router.put("/:username",administerUserProfileController.updateUserProfile)
router.get("/edit/:username", suspend, administerUserProfileController.renderOneUserRecord);
module.exports = router;
