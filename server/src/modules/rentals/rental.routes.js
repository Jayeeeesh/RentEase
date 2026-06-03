const express = require('express');
const router = express.Router();

router.get('/',       (req, res) => res.json({ message: 'Get all rentals' }));
router.post('/',      (req, res) => res.json({ message: 'Create rental' }));
router.get('/:id',    (req, res) => res.json({ message: `Get rental ${req.params.id}` }));
router.patch('/:id',  (req, res) => res.json({ message: `Update rental ${req.params.id}` }));

module.exports = router;