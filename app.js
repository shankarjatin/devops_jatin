const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const availabilityRoutes = require("./routes/availabilityRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const User = require("./models/User");
const port = process.env.PORT || 8000;

const MongoClient = require("mongodb").MongoClient;

const readlineSync = require("readline-sync");

dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Function to securely read password
const password = (query) => {
  return readlineSync.question(query, { hideEchoBack: true });
};

// Function to prompt for generic input
const question = (query) => {
  return readlineSync.question(query, { hideEchoBack: false });
};

// Build Connection URI
const buildConnection = (user, pass, server) => {
  return `mongodb://${user}:${pass}@${server}:27017/sample-database?tls=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false`;
};

// Default Connection URI
const defaultConnection = () => {
  const user = "adminuser";
  const pass = "Hanumanji10";
  const server =
    "docdb-2025-01-02-17-12-50.c7ooww4i43ft.ap-southeast-2.docdb.amazonaws.com";
  return buildConnection(user, pass, server);
};

// Allow minor overrides from user
const readConnectionFromUser = () => {
  console.log("\nUsing default connection details.");
  const override = question(
    "Do you want to override any details (yes/no)? "
  ).toLowerCase();

  if (override === "yes") {
    const user =
      question("Enter username (default: adminuser): ") || "adminuser";
    const pass =
      password("Enter password (default: Hanumanji10): ") || "Hanumanji10";
    const server =
      question(
        "Enter server (default: docdb-2025-01-02-17-12-50.c7ooww4i43ft.ap-southeast-2.docdb.amazonaws.com): "
      ) ||
      "docdb-2025-01-02-17-12-50.c7ooww4i43ft.ap-southeast-2.docdb.amazonaws.com";

    return buildConnection(user, pass, server);
  }

  return defaultConnection();
};

// MongoDB Client Connection
let db;

const connectToDatabase = async () => {
  try {
    const client = await MongoClient.connect(readConnectionFromUser(), {
      tlsCAFile: './global-bundle.pem',
      replicaSet: 'rs0',
      readPreference: 'primary',
      socketTimeoutMS: 30000,
      connectTimeoutMS: 30000,
    }).catch((err) => {console.error(err); process.exit(1);});

    console.log('Connected to Amazon DocumentDB!');
    db = client.db('sample-database'); // Assign the database instance to `db`
    
    // You can optionally verify the database connection by listing collections
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections);
  } catch (err) {
    console.error("Error connecting to Amazon DocumentDB:", err);
    process.exit(1);
  }
};

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

// Routes
app.use("/users", userRoutes);
app.use("/availability", availabilityRoutes);
app.use("/appointments", appointmentRoutes);

// Fetch Professors Endpoint
app.get("/users/professors", async (req, res) => {
  try {
    const professors = await User.find({ role: "professor" }, "_id username");
    res.send(professors);
  } catch (err) {
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

// Start the Server
connectToDatabase()
  .then(() => {
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => {
    console.error("Failed to start the server:", err);
    process.exit(1);
  });

// app.listen(port, () => console.log('Server running on port 8000'));
