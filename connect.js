
const MongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");
const fs = require("fs");
const readlineSync = require("readline-sync");

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
        db = client.db('sample-database'); // Assign the database instance
    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1);
    }
};

module.exports = { connectToDatabase, getDb: () => db };
