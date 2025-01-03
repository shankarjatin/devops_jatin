const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let db;

const connectToDatabase = async () => {
    try {
        const client = await MongoClient.connect(readConnectionFromUser(), {
            tlsCAFile: './global-bundle.pem',
            replicaSet: 'rs0',
            readPreference: 'primary',
            socketTimeoutMS: 30000,
            connectTimeoutMS: 30000,
        });

        console.log('Connected to Amazon DocumentDB!');
        db = client.db('sample-database'); // Replace with your database name
    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1);
    }
};

// User Registration
exports.register = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        if (!username || !password || !role) {
            return res.status(400).send('All fields are required');
        }

        const existingUser = await db.collection('users').findOne({ username });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            username,
            password: hashedPassword,
            role,
        };

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

        const user = await db.collection('users').findOne({ username });
        if (!user) {
            return res.status(400).send('User not found');
        }

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) {
            return res.status(400).send('Invalid password');
        }

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
connectToDatabase();
