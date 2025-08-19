const express = require("express");
const multer = require("multer");
const path = require("path");
const Product = require("../models/Product");

const router = express.Router();

// --- Multer Setup for Image Uploads ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure you have an 'uploads' folder in your backend root
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

// =============================
// GET all products (for customer view)
// Endpoint: GET /api/products/
// =============================
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({}).populate('seller', 'businessName');
    res.json(products);
  } catch (err) {
    console.error("Fetch all products error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// =============================
// POST a new product (for seller dashboard)
// Endpoint: POST /api/products/
// =============================
router.post("/", upload.single('image'), async (req, res) => {
  try {
    const { title, description, price, originalPrice, quantity, category, brand, sellerId } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Product image is required." });
    }
    
    const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    const newProduct = new Product({
      title,
      description,
      price: parseFloat(price),
      originalPrice: parseFloat(originalPrice),
      quantity: parseInt(quantity),
      category,
      brand,
      seller: sellerId,
      image: req.file.path.replace(/\\/g, "/"), // Store the path and normalize slashes
      discount,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Add product error:", err);
    res.status(500).json({ error: "Server error while adding product." });
  }
});


// =======================================================
// GET all products for a specific seller (THIS IS THE NEW ROUTE)
// Endpoint: GET /api/products/my-products
// =======================================================
router.get("/my-products", async (req, res) => {
  try {
    // This temporary solution gets the seller's ID from a custom request header.
    // In a production app, you should use an authentication middleware to get the ID from a JWT.
    const sellerId = req.headers['x-seller-id'];

    if (!sellerId) {
      // 401 Unauthorized is the appropriate status code here.
      return res.status(401).json({ error: "Unauthorized: Seller ID is missing from headers." });
    }
    
    // Find all products where the 'seller' field matches the ID from the header
    const products = await Product.find({ seller: sellerId });
    
    if (!products) {
      return res.status(404).json({ message: "No products found for this seller." });
    }
    
    res.json(products);

  } catch (err) {
    console.error("Fetch seller products error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// =============================
// DELETE a product (for seller dashboard)
// Endpoint: DELETE /api/products/:id
// =============================
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    // Note: You might also want to delete the image file from the /uploads folder here
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ error: "Server error while deleting product." });
  }
});

module.exports = router;