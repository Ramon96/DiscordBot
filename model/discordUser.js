const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    id: String,
    birthday: String,
});

module.exports = mongoose.model('User', userSchema);