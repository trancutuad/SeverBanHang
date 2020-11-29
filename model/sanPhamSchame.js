let mongoose = require('mongoose');

const spSchame = new mongoose.Schema({
    maSP :{
        type : String,
        required:true
    },
    tenSP :{
        type : String,
        required:true
    },
    giaBan :{
        type : String,
        required:true
    },
    soLuong :{
        type: String,
        required:true
    },
    image :{
        type: String,
        required:true
    }
})

module.exports = spSchame;