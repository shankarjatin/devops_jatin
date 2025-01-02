const Availability = require('../models/Availability');

exports.addAvailability = async (req, res) => {
  const { date, slots } = req.body;
  const availability = new Availability({
    professorId: req.user._id,
    date,
    slots,
  });
  await availability.save();
  res.send('Availability added');
};

exports.getAvailability = async (req, res) => {
  const { professorId } = req.params;
  const availability = await Availability.find({ professorId });
  res.send(availability);
};
