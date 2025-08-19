const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");
const Seller = require("../models/Seller");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-that-should-be-in-your-env-file';

// =============================
// Customer Signup
// Endpoint: POST /api/auth/customer/signup
// =============================
router.post("/customer/signup", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check for missing fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Please provide name, email, and password." });
    }

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ error: "A customer with this email already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new customer
    const customer = new Customer({
      name,
      email,
      phone,
      password: hashedPassword
    });
    await customer.save();

    // Create a token and log the user in automatically
    const token = jwt.sign({ id: customer._id, role: 'customer' }, JWT_SECRET, { expiresIn: "1d" });
    
    // Send back a success response with token and user info
    res.status(201).json({
      message: "Customer registered successfully",
      token,
      user: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        role: 'customer'
      }
    });

  } catch (err) {
    console.error("Customer Signup Error:", err);
    res.status(500).json({ error: "Server error during customer signup." });
  }
});

// =============================
// Customer Login
// Endpoint: POST /api/auth/customer/login
// =============================
router.post("/customer/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: customer._id, role: 'customer' }, JWT_SECRET, { expiresIn: "1d" });
    
    // Send back a success response with token and user info
    res.json({ 
      message: "Login successful", 
      token,
      user: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        role: 'customer'
      } 
    });
  } catch (err) {
    console.error("Customer Login Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// =============================
// Seller Signup
// Endpoint: POST /api/auth/seller/signup
// =============================
router.post("/seller/signup", async (req, res) => {
  try {
    const { businessName, contactPerson, email, phone, password } = req.body;

    if (!businessName || !contactPerson || !email || !phone || !password) {
      return res.status(400).json({ error: "Please fill in all required fields." });
    }

    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return res.status(400).json({ error: "A seller with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const seller = new Seller({
      businessName,
      contactPerson,
      email,
      phone,
      password: hashedPassword
    });
    await seller.save();

    // Create a token and log the seller in automatically
    const token = jwt.sign({ id: seller._id, role: 'seller' }, JWT_SECRET, { expiresIn: "1d" });
    
    // Send back a success response with token and user info
    res.status(201).json({
      message: "Seller registered successfully",
      token,
      user: {
        id: seller._id,
        businessName: seller.businessName,
        email: seller.email,
        role: 'seller'
      }
    });

  } catch (err) {
    console.error("Seller Signup Error:", err);
    res.status(500).json({ error: "Server error during seller signup." });
  }
});

// =============================
// Seller Login
// Endpoint: POST /api/auth/seller/login
// =============================
router.post("/seller/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: seller._id, role: 'seller' }, JWT_SECRET, { expiresIn: "1d" });
    
    // Send back a success response with token and user info
    res.json({ 
      message: "Login successful", 
      token,
      user: {
        id: seller._id,
        businessName: seller.businessName,
        email: seller.email,
        role: 'seller'
      }
    });
  } catch (err) {
    console.error("Seller Login Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
