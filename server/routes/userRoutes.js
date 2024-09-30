const express = require('express');
const User = require('../models/User'); // Assuming you have a Mongoose model named 'User'
const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    // Directly use the Mongoose model to fetch users
    const users = await User.find({});
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a single user by ID
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Fetch the user by ID using Mongoose
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
