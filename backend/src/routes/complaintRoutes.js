const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');

const Complaint = require('../models/Complaint');

// ⭐ 1) User submits a complaint
router.post('/submit', auth, role(['user']), async(req, res) => {
    try {
        const { title, description } = req.body;

        const complaint = new Complaint({
            userId: req.user.id,
            title,
            description
        });

        await complaint.save();

        res.json({ msg: 'Complaint submitted successfully', complaint });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// ⭐ 2) Admin views all complaints
router.get('/all', auth, role(['admin']), async(req, res) => {
    try {
        const complaints = await Complaint.find().populate('userId', 'name mobile');
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// ⭐ 3) Admin updates complaint status
router.put('/update/:id', auth, role(['admin']), async(req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const complaint = await Complaint.findById(id);
        if (!complaint) return res.status(404).json({ msg: 'Complaint not found' });

        complaint.status = status;
        complaint.updatedAt = new Date();

        await complaint.save();

        res.json({ msg: 'Complaint status updated', complaint });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// ⭐ 4) User views their complaints
router.get('/my', auth, role(['user']), async(req, res) => {
    try {
        const complaints = await Complaint.find({ userId: req.user.id });
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;