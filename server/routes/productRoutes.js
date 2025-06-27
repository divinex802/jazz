// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const {
  createProduct,
  updateProduct,
  deleteProduct,
  addAccessoryToProduct,
  getAllProducts,
  getSingleProduct,
  searchProductsByCategory,
  
} = require("../controllers/productController");

router.post("/create", adminAuth, createProduct);
router.get('/search',searchProductsByCategory);
router.put("/update/:id", adminAuth, updateProduct);
router.delete("/delete/:id", adminAuth, deleteProduct);
router.get("/", getAllProducts); // can be public if needed
router.get("/:id", getSingleProduct); // can be public if needed
router.put("/add-accessory/:productId", adminAuth,addAccessoryToProduct);


module.exports = router;
