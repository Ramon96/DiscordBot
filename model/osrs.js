const mongoose = require('mongoose');
const osrsSchema = mongoose.Schema({
    discordId: String,
    osrsName: String,
    stats: Object
});

module.exports = mongoose.model('Player', osrsSchema);