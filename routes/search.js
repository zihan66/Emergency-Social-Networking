const express = require("express");
const router = express.Router();
const searchController = require("../controllers/searchController");

router.get("/users", searchController.searchUsersByStatus);
router.get("/username", searchController.searchUsername);
router.get("/privateMessage", searchController.searchPrivateMessage);
router.get("/publicMessage", searchController.searchPublicMessage);
router.get("/status", searchController.searchStatus);
router.get("/announcement", searchController.searchAnnouncement);
<<<<<<< HEAD
router.get("/medicalSupplies",searchController.searchMedicalSupply)

=======
router.get("/blog", searchController.searchBlog);
>>>>>>> origin/iteration4-haichuanXu
module.exports = router;
