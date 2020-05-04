let mongoose = require('mongoose');

let userschema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
    },
    username:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    messages:[{
        type:String,
    }]
});

module.exports = mongoose.model('user',userschema);