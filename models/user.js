const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true,
    },
    password: String,
    createAt: {
        type: Date,
        default: new Date(),
    }
});

var User = mongoose.model('User', userSchema);

module.exports = User;