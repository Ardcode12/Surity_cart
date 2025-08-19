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
    // Populate the seller field with businessName and other fields
    const products = await Product.find({}).populate('seller', 'businessName contactPerson email phone');
    
    // Transform the data to match frontend expectations
    const transformedProducts = products.map(product => ({
      _id: product._id,
      title: product.title,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      quantity: product.quantity,
      category: product.category,
      brand: product.brand,
      image: `http://localhost:5000/${product.image}`, // Make sure image URL is complete
      rating: product.rating || 4.5, // Default rating
      reviews: product.reviews || 0,
      discount: product.discount || 0,
      seller: {
        name: product.seller?.businessName || 'Unknown Seller',
        verified: true, // You can add a verified field to your Seller model
        socialId: '@' + (product.seller?.businessName?.toLowerCase().replace(/\s/g, '') || 'seller')
      },
      isProtected: true, // Can be made dynamic
      isTrending: Math.random() > 0.7, // Random for demo
    }));
    
    res.json(transformedProducts);
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
      rating: 0,
      reviews: 0
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Add product error:", err);
    res.status(500).json({ error: "Server error while adding product." });
  }
});

// =============================
// GET all products for a specific seller
// Endpoint: GET /api/products/my-products
// =============================
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
    const products = await Product.find({ seller: sellerId }).populate('seller', 'businessName contactPerson email phone');
    
    // Transform products to include seller info in expected format
    const transformedProducts = products.map(product => ({
      ...product.toObject(),
      image: `http://localhost:5000/${product.image}`,
      seller: {
        name: product.seller?.businessName || 'Unknown Seller',
        verified: true,
        socialId: '@' + (product.seller?.businessName?.toLowerCase().replace(/\s/g, '') || 'seller')
      }
    }));
    
    res.json(transformedProducts);

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
