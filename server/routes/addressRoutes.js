// ✅ routes/addressRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const addressController = require("../controllers/addressController");

router.get("/", auth, addressController.getAddresses);
router.post("/add", auth, addressController.addAddress);
router.put("/update/:id", auth, addressController.updateAddress);
router.delete("/delete/:id", auth, addressController.deleteAddress);

module.exports = router;
