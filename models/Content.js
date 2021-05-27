const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contentScheme = new Schema({
    title: String,
    desc: String,
    category: String,
    url: String,
    imgSrc: String,
    tests: Array,
    name: String,
    type: String
});

module.exports = mongoose.model('Content', contentScheme);