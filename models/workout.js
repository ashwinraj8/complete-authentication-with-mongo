let mongoose = require('mongoose');

let WSchema = mongoose.Schema({

    equip: String,
    level: Number
});

module.exports = mongoose.model('Work',WSchema,'workout');