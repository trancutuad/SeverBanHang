let mongoose = require('mongoose');

var khSchame = new mongoose.Schema ({
    maKH :{
        type : String,
        required:true
    },
    username :{
        type : String,
        required:true
    },
    password :{
        type : String,
        required:true
    },
    hotenKH :{
        type : String,
        required:true
    },
    sdtKH :{
        type : String,
        required:true
    },
    image :{
        type : String,
        required:true
    }
})
module.exports = khSchame;