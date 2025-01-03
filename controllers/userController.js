const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../connect')
// User Registration
exports.register = async (req, res) => {
  try {
      const { username, password, role } = req.body;

      if (!username || !password || !role) {
          return res.status(400).send('All fields are required');
      }
      const db = getDb();
      const existingUser = await db.collection('users').findOne({ username });
      if (existingUser) {
          return res.status(400).send('User already exists');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = { username, password: hashedPassword, role };
      await db.collection('users').insertOne(newUser);

      res.status(201).send('User registered successfully');
  } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).send('Error registering user');
  }
};

// User Login
exports.login = async (req, res) => {
  try {
      const { username, password } = req.body;

      if (!username || !password) {
          return res.status(400).send('All fields are required');
      }

      const db = getDb(); // Get the database instance
      if (!db) {
          return res.status(500).send('Database connection not initialized');
      }

      // Find the user
      const user = await db.collection('users').findOne({ username });
      if (!user) {
          return res.status(400).send('User not found');
      }

      // Check if the password is valid
      const validPass = await bcrypt.compare(password, user.password);
      if (!validPass) {
          return res.status(400).send('Invalid password');
      }

      // Generate JWT token
      const token = jwt.sign(
          { _id: user._id, role: user.role },
          'SECRET_KEY', // Replace with your secret key
          { expiresIn: '1h' }
      );

      res.send({ token });
  } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).send('Error logging in user');
  }
};


// Connect to the database when the app starts
// connectToDatabase();
