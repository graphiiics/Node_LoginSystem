const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');

const router = express.Router();

const signUp = async (req, res) => {
    console.log({body: req.body});
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

const getUserByEmail = async (email) => {
    try {
        const user =  await User.findOne({email : email});
        console.log({ userByEmail: user });
        return user;
    } catch (error) {
        console.log({error});
    }
}

const getUserById = async (id) => {
    try {
        const user =  await User.findById(id);
        console.log({ userById: user });
        return user;
    } catch (error) {
        console.log({error});
    }
}

module.exports = {
    signUp,
    getUserByEmail,
    getUserById,
}

