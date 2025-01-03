const { getDb } = require('../connect');

// Add Availability
exports.addAvailability = async (req, res) => {
    try {
        const { date, slots } = req.body;

        if (!date || !slots || !Array.isArray(slots)) {
            return res.status(400).send('Invalid data. Date and slots are required.');
        }

        const db = getDb(); // Get the database instance

        const availability = {
            professorId: req.user._id, // Assuming `req.user` contains the authenticated user's data
            date,
            slots,
        };

        await db.collection('availability').insertOne(availability);

        res.status(201).send('Availability added');
    } catch (error) {
        console.error('Error adding availability:', error);
        res.status(500).send('Error adding availability');
    }
};

// Get Availability for a Professor
exports.getAvailability = async (req, res) => {
    try {
        const { professorId } = req.params;

        if (!professorId) {
            return res.status(400).send('Professor ID is required');
        }

        const db = getDb(); // Get the database instance

        const availability = await db.collection('availability').find({ professorId }).toArray();

        res.status(200).send(availability);
    } catch (error) {
        console.error('Error fetching availability:', error);
        res.status(500).send('Error fetching availability');
    }
};

// Get All Professors
exports.getProfessors = async (req, res) => {
    try {
        const db = getDb(); // Get the database instance

        const professors = await db.collection('users').find({ role: 'professor' }).toArray();

        res.status(200).send(professors);
    } catch (error) {
        console.error('Error fetching professors:', error);
        res.status(500).send('Error fetching professors');
    }
};
