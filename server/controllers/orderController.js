// ✅ controllers/orderController.js
const Order = require("../models/Order");
const CartItem = require("../models/CartItem");
const Product = require("../models/Product");
const Address = require("../models/Address");

// PLACE ORDER
exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.body;

    const cartItems = await CartItem.find({ user: userId }).populate("product");
    if (!cartItems.length) return res.status(400).json({ message: "Cart is empty" });

    const address = await Address.findOne({ _id: addressId, user: userId });
    if (!address) return res.status(404).json({ message: "Address not found" });

    const totalAmount = cartItems.reduce((acc, item) => {
      return acc + item.quantity * item.product.price;
    }, 0);

    const orderItems = cartItems.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor
    }));

    const order = await Order.create({
      user: userId,
      items: orderItems,
      address,
      totalAmount
    });

    await CartItem.deleteMany({ user: userId });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// USER: GET OWN ORDERS
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADMIN: GET ALL ORDERS
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADMIN: UPDATE ORDER STATUS
// Example snippet for order status update
exports.updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;
  try {
    const order = await Order.findById(orderId).populate('items.product');
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.status = status;
    await order.save();

    // 🔥 Add this logic when order is approved or shipped
    if (['approved', 'shipped'].includes(status)) {
      for (const item of order.items) {
        await Product.updateOne(
          { _id: item.product._id },
          { $inc: { stock: -item.quantity } }
        );
      }
    }

    res.json({ message: 'Order status updated', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

