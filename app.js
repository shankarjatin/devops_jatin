const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const User = require('./models/User');

dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// MongoDB DocumentDB Connection
const uri = 'mongodb://adminuser:Hanumanji10@docdb-2025-01-02-17-12-50.c7ooww4i43ft.ap-southeast-2.docdb.amazonaws.com:27017/sample-database?tls=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false';

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true, // Enable SSL
    tlsCAFile: './global-bundle.pem', // Path to the TLS certificate
    replicaSet: 'rs0', // Specify the replica set
    readPreference: 'secondaryPreferred', // Secondary preferred read preference
    serverSelectionTimeoutMS: 5000, // Timeout for server selection
};

mongoose.connect(uri, options)
    .then(() => console.log('Connected to Amazon DocumentDB!'))
    .catch(err => console.error('Error connecting to Amazon DocumentDB:', err.message));

// Routes
app.use('/users', userRoutes);
app.use('/availability', availabilityRoutes);
app.use('/appointments', appointmentRoutes);

// Fetch Professors Endpoint
app.get('/users/professors', async (req, res) => {
    try {
        const professors = await User.find({ role: 'professor' }, '_id username');
        res.send(professors);
    } catch (err) {
        res.status(500).send('Error fetching professors');
    }
});

// Start the Server
app.listen(3000, () => console.log('Server running on port 3000'));
