const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");
const orderController = require("../controllers/orderController");

// ✅ User Routes
router.post("/place", auth, orderController.placeOrder);
router.get("/my-orders", auth, orderController.getUserOrders);

// ✅ Admin Routes
router.get("/", adminAuth, orderController.getAllOrders);
router.put("/status/:orderId", adminAuth, orderController.updateOrderStatus);

module.exports = router;
