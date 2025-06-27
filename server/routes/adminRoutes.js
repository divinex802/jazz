const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const adminAuth = require("../middleware/adminAuth");

router.post("/login", adminController.loginAdmin);
router.post("/create-admin", adminAuth, adminController.createAdmin);
router.get("/users", adminAuth, adminController.getAllUsers);
router.get('/notifications', adminAuth, adminController.getLowStockProducts);

module.exports = router;
