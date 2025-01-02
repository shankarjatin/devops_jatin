const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  studentId: mongoose.Schema.Types.ObjectId,
  professorId: mongoose.Schema.Types.ObjectId,
  slot: String,
  date: String,
});

module.exports = mongoose.model('Appointment', appointmentSchema);