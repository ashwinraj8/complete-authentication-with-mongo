let mongoose = require('mongoose');

let Schema = mongoose.Schema({

    title:String
});

module.exports = mongoose.model('Posts',Schema,'posts');