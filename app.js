const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const availabilityRoutes = require("./routes/availabilityRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const User = require("./models/User");
const { getDb } = require('./connect');


const PORT = process.env.PORT || 8000;


const { connectToDatabase } = require("./connect");

dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Function to securely read password


// MongoDB Client Connection
// let db;

// const connectToDatabase = async () => {
//   try {
//     const client = await MongoClient.connect(readConnectionFromUser(), {
//       tlsCAFile: './global-bundle.pem',
//       replicaSet: 'rs0',
//       readPreference: 'primary',
//       socketTimeoutMS: 30000,
//       connectTimeoutMS: 30000,
//     }).catch((err) => {console.error(err); process.exit(1);});

//     console.log('Connected to Amazon DocumentDB!');
//     db = client.db('sample-database'); // Assign the database instance to `db`
    
//     // You can optionally verify the database connection by listing collections
//     const collections = await db.listCollections().toArray();
//     console.log('Collections:', collections);
//   } catch (err) {
//     console.error("Error connecting to Amazon DocumentDB:", err);
//     process.exit(1);
//   }
// };


// MongoDB DocumentDB Connection
// const uri = 'mongodb://adminuser:Hanumanji10@docdb-2025-01-02-17-12-50.c7ooww4i43ft.ap-southeast-2.docdb.amazonaws.com:27017/sample-database?tls=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false';

// const options = {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     ssl: true,
//     tlsCAFile: './global-bundle.pem', // Path to the TLS certificate
//     replicaSet: 'rs0', // Replica set name
//     readPreference: 'secondaryPreferred', // Set read preference
//     serverSelectionTimeoutMS: 5000, // Timeout for server selection
// };

// mongoose.connect(uri, options)
//     .then(() => console.log('Connected to Amazon DocumentDB!'))
//     .catch(err => console.error('Error connecting to Amazon DocumentDB:', err));

const startServer = async () => {
    await connectToDatabase();

    // Define routes
   // Routes
app.use("/users", userRoutes);
app.use("/availability", availabilityRoutes);
app.use("/appointments", appointmentRoutes);

// Fetch Professors Endpoint
app.get("/users/professors", async (req, res) => {
    try {
        const db = getDb(); // Get the database instance

        // Fetch all users with the role "professor" and return only `_id` and `username`
        const professors = await db.collection('users').find(
            { role: "professor" },
            { projection: { _id: 1, username: 1 } } // Only include `_id` and `username`
        ).toArray();

        res.status(200).send(professors);
    } catch (err) {
        console.error("Error fetching professors:", err);
        res.status(500).send("Error fetching professors");
    }
});
app.get("/test", async (req, res) => {
  try {
    const dummyData = {
      message: "Welcome to the Appointment Booking System",
      features: [
        "User registration and login",
        "View available appointments",
        "Book and manage appointments",
        "Cancel bookings",
        "Admin dashboard",
      ],
      version: "1.0.0",
      developer: {
        name: "Your Name",
        email: "your.email@example.com",
      },
    };
    res.json(dummyData);
  } catch (err) {
    res.status(500).json({ error: "Error fetching data" });
  }
});

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();


// Start the Server
// connectToDatabase()
//   .then(() => {
//     app.listen(port, () => console.log(`Server running on port ${port}`));
//   })
//   .catch((err) => {
//     console.error("Failed to start the server:", err);
//     process.exit(1);
//   });

// app.listen(port, () => console.log('Server running on port 8000'));
