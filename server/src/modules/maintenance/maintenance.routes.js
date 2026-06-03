const express = require('express');
const router = express.Router();

router.get('/',      (req, res) => res.json({ message: 'Get all maintenance requests' }));
router.post('/',     (req, res) => res.json({ message: 'Create maintenance request' }));
router.get('/:id',   (req, res) => res.json({ message: `Get request ${req.params.id}` }));
router.patch('/:id', (req, res) => res.json({ message: `Update request ${req.params.id}` }));

module.exports = router;