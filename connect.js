const { MongoClient } = require('mongodb');

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
