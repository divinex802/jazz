// server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const Admin = require('./models/Admin');
const accessoryRoutes = require("./routes/accessoryRoutes");

// Load environment variables
dotenv.config();

const userRoutes = require('./routes/userRoutes')



const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8080'], // add multiple allowed origins if needed
  credentials: true
}));


app.use(express.json());

app.use('/api/users', userRoutes);
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use("/api/accessories", accessoryRoutes);
app.use("/api/addresses", require("./routes/addressRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));





// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce111', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Routes placeholder
(async () => {
  const existingAdmin = await Admin.findOne({ email: 'demo1@gmail.com' });
  if (existingAdmin) {
    console.log("✅ Admin already exists. Skipping creation.");
    return;
  }

  const admin = new Admin({
    name: 'Main Admin',
    email: 'demo1@gmail.com',
    password: '12345678',
    superAdmin: true,
  });
  await admin.save();
  console.log("✅ Admin created!");
})();


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
