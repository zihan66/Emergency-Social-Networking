const mongoose = require('mongoose'),
Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {type: String, default: '', trim: true},
    password: {type: String, default: '', trim: true},
});

module.exports = { userSchema }





