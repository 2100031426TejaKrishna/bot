const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// Define the Admin and Customer schemas
const AdminSchema = new mongoose.Schema({
  email: String,
  password: String
}, { collection: 'adminlogin' }); // Ensure it uses the 'adminlogin' collection

const CustomerSchema = new mongoose.Schema({
  email: String,
  password: String
}, { collection: 'customerlogin' }); // Ensure it uses the 'customerlogin' collection

const AdminLogin = mongoose.model('AdminLogin', AdminSchema);
const CustomerLogin = mongoose.model('CustomerLogin', CustomerSchema);

// Admin login route
router.get('/adminLogin', async (req, res) => {
  const { email, password } = req.query;
  try {
    const admin = await AdminLogin.findOne({ email }).lean();
    if (!admin) {
      return res.status(400).json({ success: false, message: 'Admin not found' });
    }
    if (admin.password === password) {
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false, message: 'Invalid password' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Customer login route
router.get('/customerLogin', async (req, res) => {
  const { email, password } = req.query;
  try {
    const customer = await CustomerLogin.findOne({ email }).lean();
    if (!customer) {
      return res.status(400).json({ success: false, message: 'Customer not found' });
    }
    if (customer.password === password) {
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false, message: 'Invalid password' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Customer sign-up route
router.post('/customerSignup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingCustomer = await CustomerLogin.findOne({ email }).lean();
    if (existingCustomer) {
      return res.status(400).json({ success: false, message: 'Customer already exists' });
    }
    const newCustomer = new CustomerLogin({ email, password });
    await newCustomer.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
