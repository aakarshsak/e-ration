const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
const Joi = require('joi');
const debug = require('debug')('app:debug');



const userSchema = new mongoose.Schema({
    name : {  //type : String, required : true, minlength : 10, maxlength : 255 
       first : { required : true, minlength : 3, maxlength : 255, type : String }, 
       middle : { maxlength : 255, type : String }, 
       last : { required : true, minlength : 3, maxlength : 255, type : String }, 
    },
    email : { type : String, required : true, minlength : 10, maxlength : 255 },
    password : { type : String, required : true, minlength : 6, maxlength : 255 },
    ration : { type : String, required : true, minlength : 10, maxlength : 10 },
    gender : { type : String, required : true, minlength : 4, maxlength : 6 },
    address : {
        pin : {type : String, required : true, minlength : 6, maxlength : 6},
        house : {type : String, required : true, minlength : 3, maxlength : 255},
        area : {type : String, required : false, minlength : 3, maxlength : 255},
        district : {type : String, required : true, minlength : 3, maxlength : 255},
        state : { type : String, required : true, minlength : 4, maxlength : 255 },
        phone : {type : String, required : true, minlength : 7, maxlength : 10},
        country : { type : String, required : true, minlength : 3, maxlength : 255 }

    }
});


userSchema.methods.getUserToken = function (){
    const token = jwt.sign( { id : this._id } , config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = {
        name : {
            first : Joi.string().min(3).max(255).required(),
            middle : Joi.string().max(255),
            last : Joi.string().min(3).max(255).required(),
        },
        email : Joi.string().email().min(10).max(255).required(),
        password : Joi.string().min(6).max(255).required(),
        confirm_pass : Joi.string().min(6).max(255).required(),
        ration : Joi.string().min(10).max(10).required(),
        gender : Joi.string().min(4).max(6).required(),
        address : {
            pin : Joi.string().min(6).max(6).required(),
            house : Joi.string().min(3).max(255).required(),
            area : Joi.string().min(3).max(255).required(),
            district : Joi.string().min(3).max(255).required(),
            state : Joi.string().min(4).max(255).required(),
            phone : Joi.string().min(7).max(10).required(),
            country : Joi.string().min(3).max(255).required(),
        }
    }

    return Joi.validate(user, schema);;
}

function validateAuth(user) {
    const schema = {
        ration : Joi.string().min(10).max(10).required(),
        password : Joi.string().min(5).max(255).required()
    }

    return Joi.validate(user, schema);;
    
}

exports.User = User;
exports.validateUser = validateUser;
exports.validateAuth = validateAuth;