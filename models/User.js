const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userScheme = new Schema({
    surname: String,
    name: String,
    middleName: String,
    login: String,
    pass: String,
    role: String
});

module.exports = mongoose.model('User', userScheme);