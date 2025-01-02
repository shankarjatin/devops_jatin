const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require("dotenv")
const bodyParser = require('body-parser');
const connectDb = require("./config/dbConnection");
dotenv.config();
const userRoutes = require('./routes/userRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());

// MongoDB DocumentDB Connection
connectDb();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

  
    // mongoose.connect('mongodb://shankarjatin:Hanumanji10@devops-jatin-908027412262.ap-southeast-2.docdb-elastic.amazonaws.com:27017', {
    //     useNewUrlParser: true,
    //     ssl: true,
    //     sslValidate: false,
    //     sslCA: fs.readFileSync('./rds-combined-ca-bundle.pem')})
    // .then(() => console.log('Connection to DB successful'))
    // .catch((err) => console.error(err,'Error'));


    // mongoose.connect('mongodb://adminuser:Hanumanji@10@docdb-2025-01-02-17-12-50.cluster-c7ooww4i43ft.ap-southeast-2.docdb.amazonaws.com:27017/?tls=true&tlsCAFile=global-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false', {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true,
    //     ssl: true,
    //   });
// Models
// const User = require('./models/User');
// const Availability = require('./models/Availability');
// const Appointment = require('./models/Appointment');

// // Middleware for Authentication
// const authMiddleware = require('./middlewares/authMiddleware');

// // Controllers
// const userController = require('./controllers/userController');
// const availabilityController = require('./controllers/availabilityController');
// const appointmentController = require('./controllers/appointmentController');

// // Routes


app.use('/users', userRoutes);
app.use('/availability', availabilityRoutes);
app.use('/appointments', appointmentRoutes);

// Deploy on EC2
app.listen(3000, () => console.log('Server running on port 3000'));