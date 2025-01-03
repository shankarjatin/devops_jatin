// const mongoose = require("mongoose");

// const connectDb = async() => {
// try {
// const connect = await mongoose.connect (process.env.MONGO_URI)
// console.log(
// "Database connected: ",
// connect.connection.host,
// connect.connection.name)
// } catch (err) {
// console.log(err);
// process.exit(1);
// };}
// module.exports = connectDb;

const fs = require('fs');
const mongoose = require('mongoose');

const cert = fs.readFileSync('./global-bundle.pem');

mongoose.connect('mongodb://shankarjatin:Hanumanji10@devops-jatin-908027412262.ap-southeast-2.docdb-elastic.amazonaws.com:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  sslCA: cert,
  replicaSet: 'rs0',
  serverSelectionTimeoutMS: 50000, // Optional: Increase timeout
})
  .then(() => console.log('Connected to DocumentDB!'))
  .catch((err) => console.error('Error connecting to DocumentDB:', err.message));
