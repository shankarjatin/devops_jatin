const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// MongoDB DocumentDB Connection URI
const uri = 'mongodb://adminuser:Hanumanji10@docdb-2025-01-02-17-12-50.c7ooww4i43ft.ap-southeast-2.docdb.amazonaws.com:27017/sample-database?tls=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false';

// MongoDB Client Connection
let db; // To hold the database connection
MongoClient.connect(
    uri,
    {
        tlsCAFile: './global-bundle.pem', // Path to the TLS certificate
    },
    function (err, client) {
        if (err) {
            console.error('Error connecting to Amazon DocumentDB:', err);
            return;
        }

        console.log('Connected to Amazon DocumentDB!');
        db = client.db('sample-database'); // Specify the database to be used
    }
);

// Routes
app.get('/users', async (req, res) => {
    try {
        const users = await db.collection('users').find({}).toArray();
        res.send(users);
    } catch (err) {
        console.error('Error fetching users:', err.message);
        res.status(500).send('Error fetching users');
    }
});

app.post('/users', async (req, res) => {
    try {
        const newUser = req.body;
        const result = await db.collection('users').insertOne(newUser);
        res.status(201).send(result);
    } catch (err) {
        console.error('Error adding user:', err.message);
        res.status(500).send('Error adding user');
    }
});

app.get('/users/professors', async (req, res) => {
    try {
        const professors = await db.collection('users').find({ role: 'professor' }).toArray();
        res.send(professors);
    } catch (err) {
        console.error('Error fetching professors:', err.message);
        res.status(500).send('Error fetching professors');
    }
});

// Start the Server
app.listen(3000, () => console.log('Server running on port 3000'));
