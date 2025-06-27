const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const userController = require("../controllers/cartController");

router.post("/add", auth, userController.addToCart);
router.put("/update", auth, userController.updateCartItem);
router.delete("/remove/", auth, userController.removeFromCart); // ✅ Accept body with size/color
router.get("/", auth, userController.getCart);

module.exports = router;
