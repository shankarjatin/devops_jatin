const Appointment = require('../models/Appointment');

exports.bookAppointment = async (req, res) => {
  const { professorId, date, slot } = req.body;

  const appointment = new Appointment({
    studentId: req.user._id,
    professorId,
    date,
    slot,
  });
  await appointment.save();
  res.send('Appointment booked');
};
