const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
const Joi = require('joi');
const debug = require('debug')('app:debug');



const userSchema = new mongoose.Schema({
    name:{  //type : String, required : true, minlength : 10, maxlength : 255 
       first : { required : true, minlength : 5, maxlength : 255, type : String }, 
       middle : { minlength : 5, maxlength : 255, type : String }, 
       last : { required : true, minlength : 5, maxlength : 255, type : String }, 
    },
    email : { type : String, required : true, minlength : 10, maxlength : 255 },
    password : { type : String, required : true, minlength : 6, maxlength : 255 }
});


userSchema.methods.getUserToken = function (){
    const token = jwt.sign( { id : this._id } , config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = {
        name : {
            first : Joi.string().min(5).max(255).required(),
            middle : Joi.string().min(5).max(255),
            last : Joi.string().min(5).max(255).required(),
        },
        email : Joi.string().email().min(5).max(255).required(),
        password : Joi.string().min(5).max(255).required()
    }

    return Joi.validate(user, schema);;
}

function validateAuth(user) {
    const schema = {
        email : Joi.string().email().min(5).max(255).required(),
        password : Joi.string().min(5).max(255).required()
    }

    return Joi.validate(user, schema);;
    
}

exports.User = User;
exports.validateUser = validateUser;
exports.validateAuth = validateAuth;