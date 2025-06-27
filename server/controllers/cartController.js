const CartItem = require("../models/CartItem");

exports.getCart = async (req, res) => {
  try {
    const cart = await CartItem.find({ user: req.user.id }).populate("product");
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addToCart = async (req, res) => {
  const { productId, quantity, selectedSize, selectedColor } = req.body;

  try {
    const existing = await CartItem.findOne({
      user: req.user.id,
      product: productId,
      selectedSize,
      selectedColor
    });

    if (existing) {
      existing.quantity += quantity;
      await existing.save();
      return res.status(200).json({ message: "Cart updated", item: existing });
    }

    const newItem = await CartItem.create({
      user: req.user.id,
      product: productId,
      quantity,
      selectedSize,
      selectedColor
    });

    res.status(201).json({ message: "Item added to cart", item: newItem });
  } catch (err) {
    console.error("❌ Cart add error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.updateCartItem = async (req, res) => {
  const { cartItemId, quantity, selectedSize, selectedColor } = req.body;

  try {
    const item = await CartItem.findOne({ _id: cartItemId, user: req.user.id });
    if (!item) return res.status(404).json({ message: "Cart item not found" });

    if (typeof quantity === "number") item.quantity = quantity;
    if (typeof selectedSize === "string") item.selectedSize = selectedSize;
    if (typeof selectedColor === "string") item.selectedColor = selectedColor;

    await item.save();
    res.status(200).json(item);
  } catch (err) {
    console.error("Update cart error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  const { cartItemId } = req.body;

  if (!cartItemId) return res.status(400).json({ message: "Missing cartItemId" });

  try {
    await CartItem.findOneAndDelete({ _id: cartItemId, user: req.user.id });
    res.sendStatus(200);
  } catch (err) {
    console.error("Remove cart error:", err);
    res.status(500).json({ message: err.message });
  }
};
