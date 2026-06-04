const express = require('express');
const router = express.Router();
const { register } = require('./auth.controller');

router.post('/register', register);

router.post('/login', (req, res) => {
    res.json({ message: 'User login endpoint' });
});

router.post('/refresh-token', (req, res) => {
    res.json({ message: 'Token refresh endpoint' });
});

router.post('/logout', (req, res) => {
    res.json({ message: 'User logout endpoint' });
});

module.exports = router;