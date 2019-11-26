const {User, validateUser} = require('../db/user');
const debug = require('debug')('app:debug');
const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('lodash');


const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validateUser(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email : req.body.email });
    if(user) return res.status(400).send('User already exist.');

    user = await new User(_.pick(req.body, ["name", "email", "password"]));

    const salt = await bcrypt.genSalt(2);
    user.password = await bcrypt.hash(user.password, salt);

    const token = user.getUserToken();

    user = await user.save();
    user = _.pick(user, ['name', 'email']);

    res.header('x-auth-token', token).send(user);

})

module.exports = router;


