const {User, validateUser} = require('../db/user');
const debug = require('debug')('app:debug');
const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('lodash');


const router = express.Router();

router.post('/', async (req, res) => {

    debug('Getting to user/register...');

    if(req.body.first) {
        req.body.name = { first : req.body.first, middle : req.body.middle, last : req.body.last };
        delete req.body.first;
        delete req.body.middle;
        delete req.body.last;    
    
    }

    if(req.body.pin) {
        req.body.address = { 
            pin : req.body.pin,
            area : req.body.area,
            house : req.body.house,
            district : req.body.district,
            state : req.body.state,
            phone : req.body.phone,
            country : req.body.country
        };
        delete req.body.pin;
        delete req.body.area;
        delete req.body.house;
        delete req.body.district;
        delete req.body.state;
        delete req.body.phone;
        delete req.body.country;

    
    }

    const { error } = validateUser(req.body); 
    if (error) {
        debug(error.details[0].message) ;
        return res.status(400).send(error.details[0].message);
    }

    let user = await User.findOne({ ration : req.body.aadhar });
    if(user) {
        debug('User already exist...') ;
        return res.status(400).send('User already exist...');
    }

    let pass = req.body.password;
    let repass = req.body.confirm_pass;
    if(pass != repass) {
        debug('Password does not match.'); 
        return res.status(400).send('Password does not match.');
    }

    user = await new User(_.pick(req.body, ["name", "email", "password", "ration", "address", "gender"]));

    const salt = await bcrypt.genSalt(2);
    user.password = await bcrypt.hash(user.password, salt);

    const token = user.getUserToken();

    user = await user.save();
    user = _.pick(user, ['name', 'ration']);

    debug('Successfully posted...')
    res.send('Account Successfully Created...');

})

module.exports = router;


