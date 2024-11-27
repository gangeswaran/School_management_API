const pool = require('../config/db');
const haversine = require('haversine-distance');

// Add a new school
exports.addSchool = async (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    if (!name || !address || !latitude || !longitude) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
            [name, address, parseFloat(latitude), parseFloat(longitude)]
        );
        res.status(201).json({ message: 'School added successfully', schoolId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Database error', details: error.message });
    }
};

// List schools sorted by proximity
exports.listSchools = async (req, res) => {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    try {
        const [schools] = await pool.query('SELECT * FROM schools');
        const userLocation = { lat: parseFloat(latitude), lon: parseFloat(longitude) };

        const sortedSchools = schools.map((school) => {
            const schoolLocation = { lat: school.latitude, lon: school.longitude };
            return {
                ...school,
                distance: haversine(userLocation, schoolLocation)
            };
        }).sort((a, b) => a.distance - b.distance);

        res.status(200).json(sortedSchools);
    } catch (error) {
        res.status(500).json({ error: 'Database error', details: error.message });
    }
};
