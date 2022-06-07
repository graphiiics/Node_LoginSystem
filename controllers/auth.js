const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');

const router = express.Router();

const signUp = async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const { name, email } = req.body;
    
    const newUser = new User({name, email, password: hashedPassword});
    try {
        await newUser.save();
        res.redirect('/login');
    } catch (error) {
        res.redirect('/register');
    }
}

module.exports = {
    signUp,
}

