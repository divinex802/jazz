const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const userController = require("../controllers/userController");

router.post("/add", auth, userController.addToWishlist);
router.delete("/remove/:productId", auth, userController.removeFromWishlist);
router.get("/", auth, userController.getWishlist);

module.exports = router;
