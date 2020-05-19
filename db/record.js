const mongoose = require('mongoose');
const config = require('config');
const debug = require('debug')('app:debug');

const recordSchema = new mongoose.Schema({
    ration : {type : String, required : true, minlength : 8, maxlength : 12},
    orderid : {type : String, required : true, minlength : 7, maxlength : 15},
    date : { type : String, required : true },
    rice : { type : String, required : true },
    wheat : { type : String, required : true },
    arhad : { type : String, required : true },
    kerosene : { type : String, required : true },
    fpdName : { type : String, required : true, minlength : 4},
});

const Record = mongoose.model('Record', recordSchema);

module.exports.Record = Record;