const Accessory = require("../models/Accessory");
const Product = require("../models/Product");

// Create Accessory
// Create Accessory
exports.createAccessory = async (req, res) => {
  try {
    const { title, images, price, stock, category } = req.body;

    if (stock < 0) {
      return res.status(400).json({ message: "Stock cannot be negative." });
    }

    const newAccessory = new Accessory({
      title,
      images,
      price,
      stock: stock || 0,  // Keep the provided stock value or default to 0
      category,
    });

    const savedAccessory = await newAccessory.save();
    res.status(201).json({ message: "Accessory created", accessory: savedAccessory });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get All Accessories (with optional limit)
exports.getAllAccessories = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 0; // 0 = no limit
    const accessories = await Accessory.find()
      .limit(limit)
      .populate("productId", "name");

    res.json(accessories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get Accessories by Product
exports.getAccessoriesByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const accessories = await Accessory.find({ productId });
    res.json(accessories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAccessoriesByIds = async (req, res) => {
  const { accessoryIds } = req.body;

  if (!accessoryIds || !Array.isArray(accessoryIds)) {
    return res.status(400).json({ message: "Invalid accessoryIds format" });
  }

  try {
    const accessories = await Accessory.find({ _id: { $in: accessoryIds } });

    if (!accessories.length) {
      return res.status(404).json({ message: "Accessories not found" });
    }

    res.json(accessories);
  } catch (err) {
    console.error("Error fetching accessories:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Accessory
exports.updateAccessory = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    if (stock < 0) {
      return res.status(400).json({ message: "Stock cannot be negative." });
    }

    const updatedAccessory = await Accessory.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedAccessory) {
      return res.status(404).json({ message: "Accessory not found" });
    }

    res.json({ message: "Accessory updated", accessory: updatedAccessory });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Accessory
exports.deleteAccessory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAccessory = await Accessory.findByIdAndDelete(id);
    if (!deletedAccessory) {
      return res.status(404).json({ message: "Accessory not found" });
    }

    res.json({ message: "Accessory deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Search Accessories by Title
exports.searchAccessories = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: "Missing search query" });

    const results = await Accessory.find({
      title: { $regex: new RegExp(q, 'i') }
    }).limit(20); // Limit results for performance

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Error searching accessories", error: err.message });
  }
};
