const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// Define the Admin and Customer schemas
const AdminSchema = new mongoose.Schema({
  email: String,
  password: String
}, { collection: 'adminlogin' }); // Ensure it uses the 'adminlogin' collection

const CustomerSchema = new mongoose.Schema({
  name: String,  // Add name field to customer schema
  email: String,
  password: String,
  address: String,
  phone: String
}, { collection: 'customerlogin' }); 
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

// Endpoint to get all customers data
router.get('/allCustomers', async (req, res) => {
  try {
    // Fetch all customers and store their data (name, email, password) in JSON format
    const customers = await CustomerLogin.find().lean();

    // Send the JSON data with the response
    console.log(customers);
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customer data:', error);
    res.status(500).json({ message: 'Internal server error' });
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
  // Debug: Log req.body to check if name, email, and password are received
  console.log(req.body);

  const { name, email, password, address, phone } = req.body; // Accept name in request body
  try {
    const existingCustomer = await CustomerLogin.findOne({ email }).lean();
    if (existingCustomer) {
      return res.status(400).json({ success: false, message: 'Customer already exists' });
    }
    const newCustomer = new CustomerLogin({ name, email, password, address, phone }); // Include name in new customer data
    await newCustomer.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
