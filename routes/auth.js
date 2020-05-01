const { User, validateAuth } = require('../db/user');
const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const debug = require('debug')('app:debug');
const auth = require('../middlewares/authenticate');


const router = express.Router();

router.get('/me', auth, async (req, res) => {
    debug('fetching user data...');
    let user = await User.findById(req.user.id);
    user = _.pick(user, ["_id", "name", "email", "aadhar", "address", "gender"]);
    res.send(user);
});

router.get('/me/name', async (req, res) => {
    debug('fetching user name...');
    let user = await User.findOne({ aadhar : req.body.aadhar });
    user = _.pick(user, ["name"]);
    res.send(user);
})


router.post('/',  async (req, res) => {

    debug('Getting to the user/login api');
    console.log(req.headers);
    console.log(req.body.password, req.body.email);

    const { error } = validateAuth(req.body);
    if(error) {
        debug(error.details[0].message) ;
        return res.status(400).send(error.details[0].message);
    }

    const user = await User.findOne({ email : req.body.email });
    if(!user) {
        debug('Invalid email') ;
        return res.status(400).send('Invalid email/password');
    }

    const match = await bcrypt.compare(req.body.password, user.password);
    if(!match) {
        debug('password does not match'); 
        return res.status(400).send('Invalid email/password');
    }

    const token = user.getUserToken();
   
    res.header('x-auth-token', token).send(token);

});

module.exports = router;