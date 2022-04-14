const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");


const suspend = require("../middlewares/suspend");

router.post("/", blogController.createNewBlog);
router.get("/", blogController.getBlog);
router.get("/:blogID", blogController.getABlog);
router.get("/test", blogController.getBlog);
// router.get("/delete/:blogID", blogController.deleteABlog);
router.post("/delete/:blogID", blogController.deleteABlog);
router.post("/like/:blogID", blogController.likeABlog);
router.post("/dislike/:blogID", blogController.dislikeABlog);
// router.get("/:username", shareStatusController.getOneUserRecord);
// eslint-disable-next-line consistent-return

// router.put(
//   "/:messageId",
//   blogController.getBlogDetail
// );

module.exports = router;
