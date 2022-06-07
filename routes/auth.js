const express = require("express");

const { signUp } = require('../controllers/auth.js');

const router = express.Router();

router.post('/signUp', signUp);

module.exports = router;