// // models/Product.js
// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   description: {
//     type: String,
//     required: true
//   },
//   images: [
//     {
//       url: { type: String, required: true },
//       filename: { type: String } // optional if using Cloudinary or similar
//     }
//   ],
//   sizes: [String], // ["S", "M", "L", "XL"]
//   colors: [String], // ["Red", "Blue", "Green"]
//   price: {
//     type: Number,
//     required: true
//   },
//   stock: {
//     type: Number,
//     required: true,
//     default: 0
//   },
//   category: {
//     type: String,
//     required: true
//   },
//   brand: {
//     type: String
//   },
//   isFeatured: {
//     type: Boolean,
//     default: false
//   },
//   ratings: {
//     type: Number,
//     default: 0
//   },
//   numReviews: {
//     type: Number,
//     default: 0
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model("Product", productSchema);


const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  images: [
    {
      url: { type: String, required: true },
      filename: { type: String }
    }
  ],
  sizes: [String],
  colors: [String],
  basePrice: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    required: true
  },
  accessories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Accessory"
    }
  ],
  isFullSet: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Product", productSchema);
