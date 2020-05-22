const mongoose = require('mongoose');
const config = require('config');
const debug = require('debug')('app:debug');


const complaintSchema = new mongoose.Schema({
    name : {type : String, required : true },
    comment : {type : String, required : true},
    date : { type : String, required : true },
    fpdName : { type : String, required : true },   
});

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports.Complaint = Complaint;