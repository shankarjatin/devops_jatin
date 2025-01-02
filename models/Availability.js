const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  professorId: mongoose.Schema.Types.ObjectId,
  date: String,
  slots: [String],
});

module.exports = mongoose.model('Availability', availabilitySchema);