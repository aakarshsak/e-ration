const { User, validateAuth } = require('../db/user');
const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const auth = require('../middlewares/authenticate');

const router = express.Router();

router.get('/me', auth, async (req, res) => {
    let user = await User.findById(req.user.id);
    user = _.pick(user, ["_id", "name", "email"]);
    res.send(user);
});

router.post('/', async (req, res) => {

    const { error } = validateAuth(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email : req.body.email });
    if(!user) return res.status(400).send('Invalid email/password');

    const match = await bcrypt.compare(req.body.password, user.password);
    if(!match) return res.status(400).send('Invalid email/password');

    const token = user.getUserToken();

    res.send(token);

});

module.exports = router;