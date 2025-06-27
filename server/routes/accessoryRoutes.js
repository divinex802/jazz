const express = require("express");
const router = express.Router();
const accessoryController = require("../controllers/accessoryController");
const adminAuth = require("../middleware/adminAuth");

// Create Accessory (Admin Only)
router.post("/create", adminAuth, accessoryController.createAccessory);

// Get All Accessories (Public)
router.get("/", accessoryController.getAllAccessories);

router.get('/search', accessoryController.searchAccessories);



// Get Accessories by Product (Public)
router.get("/product/:productId", accessoryController.getAccessoriesByProduct);

router.post("/bulk", accessoryController.getAccessoriesByIds);

// Update Accessory (Admin Only)
router.put("/update/:id", adminAuth, accessoryController.updateAccessory);

// Delete Accessory (Admin Only)
router.delete("/delete/:id", adminAuth, accessoryController.deleteAccessory);

module.exports = router;
