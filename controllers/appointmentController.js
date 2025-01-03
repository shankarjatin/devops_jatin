const { getDb } = require('../connect');

// Book Appointment
exports.bookAppointment = async (req, res) => {
    try {
        const { professorId, date, slot } = req.body;

        if (!professorId || !date || !slot) {
            return res.status(400).send('All fields are required');
        }

        const db = getDb(); // Get the database instance

        const appointment = {
            studentId: req.user._id, // Assuming `req.user` contains the authenticated user's data
            professorId,
            date,
            slot,
        };

        await db.collection('appointments').insertOne(appointment);

        res.status(201).send('Appointment booked');
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).send('Error booking appointment');
    }
};
