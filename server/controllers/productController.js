// controllers/productController.js
const Product = require("../models/Product");
const Accessory = require("../models/Accessory");
const calculateTotalPrice = require("../utils/priceCalculator");

// Create Product
exports.createProduct = async (req, res) => {
  try {
    const { accessories, isFullSet, price } = req.body;
    let basePrice = price;
    let totalPrice = price;

    if (isFullSet && accessories?.length) {
      const accessoryData = await Accessory.find({ _id: { $in: accessories } });
      const accessoryTotal = accessoryData.reduce((acc, accessory) => acc + accessory.price, 0);
      totalPrice += accessoryTotal;
    }

    const newProduct = new Product({
      ...req.body,
      basePrice: basePrice,  // Store the original price
      price: totalPrice
    });

    await newProduct.save();
    res.status(201).json({ message: "Product created", product: newProduct });

  } catch (err) {
    res.status(500).json({ message: "Error creating product", error: err.message });
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  try {
    const { accessories, isFullSet } = req.body;
    const { id } = req.params;

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    let updatedAccessories = accessories || existingProduct.accessories;

    // Remove accessories if isFullSet is false
    if (!isFullSet) {
      updatedAccessories = [];
    }

    // Calculate the new price
    const totalPrice = await calculateTotalPrice(existingProduct.basePrice, updatedAccessories, isFullSet);

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        ...req.body,
        accessories: updatedAccessories,
        price: totalPrice,
      },
      { new: true }
    );

    res.json({ message: "Product updated", product: updatedProduct });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product", error: err.message });
  }
};

exports.addAccessoryToProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { accessoryId } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const accessory = await Accessory.findById(accessoryId);
    if (!accessory) return res.status(404).json({ message: "Accessory not found" });

    if (accessory.stock <= 0) {
      return res.status(400).json({ message: "Accessory is out of stock" });
    }

    // Add accessory to product
    product.accessories.push(accessoryId);
    await product.save();

    res.json({ message: "Accessory added to product", product });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Products
exports.getAllProducts = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = category ? { category } : {};
    const products = await Product.find(filter).populate('accessories');

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
};


// Get Single Product
exports.getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("accessories");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product", error: err.message });
  }
};

// Search Products by Category
exports.searchProductsByCategory = async (req, res) => {
  try {
    const { category } = req.query;
    if (!category) return res.status(400).json({ message: "Category is required" });

    const products = await Product.find({
      category: { $regex: new RegExp(category, 'i') }
    }).populate("accessories");

    res.status(200).json(products);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

