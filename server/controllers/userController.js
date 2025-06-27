const User = require("../models/User");
const CartItem = require("../models/CartItem");
const Address = require("../models/Address");
const Product = require("../models/Product"); 
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");

const otpStore = {}; // temporary store

const generateOtp = () => Math.floor(100000 + Math.random() * 900000);

exports.register = async (req, res) => {
  const { email, phone } = req.body;

  try {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(400).json({ message: "Email already registered" });

    const existingPhone = await User.findOne({ phone });
    if (existingPhone) return res.status(400).json({ message: "Phone number already registered" });

    const otp = generateOtp();
    otpStore[email] = {
      code: otp,
      createdAt: Date.now(),
    };

    const emailResult = await sendMail({
      to: email,
      subject: "Verify Your Email",
      html: `<p>Your OTP is <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
    });

    console.log("📬 Email sent:", emailResult.messageId);
    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("🚨 OTP email error:", err.message);
    res.status(500).json({ message: "Failed to send OTP email", error: err.message });
  }
};


exports.verifyOtpAndCompleteRegistration = async (req, res) => {
  const { name, email, phone, otp, password } = req.body;

  try {
    if (!otpStore[email] || otpStore[email].code !== parseInt(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }    
    delete otpStore[email];

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      isVerified: true,
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { emailOrPhone, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    const [cart, addresses, wishlist , orders] = await Promise.all([
      CartItem.find({ user: req.user.id }).populate("product"),
      Address.find({ user: req.user.id }),
      Product.find({ _id: { $in: user.wishlist } })
    ]);

    res.status(200).json({ user, cart, addresses, wishlist,orders  });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updates = req.body;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    }).select("-password");

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.addToWishlist = async (req, res) => {
  const { productId } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }
    user.wishlist.push(productId);
    await user.save();
    res.status(200).json({ message: "Added to wishlist", wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  const { productId } = req.params;
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { wishlist: productId } },
      { new: true }
    );
    res.status(200).json({ message: "Removed from wishlist", wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("wishlist");
    res.status(200).json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
