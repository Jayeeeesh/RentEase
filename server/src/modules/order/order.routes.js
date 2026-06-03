const express = require('express');
const router = express.Router();

router.get('/',       (req, res) => res.json({ message: 'Get all orders' }));
router.post('/',      (req, res) => res.json({ message: 'Create order' }));
router.get('/:id',    (req, res) => res.json({ message: `Get order ${req.params.id}` }));
router.patch('/:id',  (req, res) => res.json({ message: `Update order ${req.params.id}` }));

module.exports = router;