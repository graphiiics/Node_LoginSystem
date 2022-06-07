const express = require("express");
const mongoose = require("mongoose");

const User = require("../models/user");

const router = express.Router();

const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


module.exports = {
    getUsers,
}