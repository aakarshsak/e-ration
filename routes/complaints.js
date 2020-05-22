const debug = require('debug')('app:debug');
const { Complaint } = require('../db/complaints');
const express = require('express');
const _ = require('lodash');


const router = express.Router();

router.post('/', async (req, res) => {
    debug('Inside the complaint post route.');
    const record = await new Complaint(_.pick(req.body, ["name", "date", "comment", "fpdName"]));        
    user = await record.save();
    res.send("Complaint post...");
});


router.post('/list', async (req, res) => {
    debug('Inside the complaint get route.');
    try {
        const record = await Complaint.find({fpdName : req.body.fpdName});
        res.send({ record });
    } catch(e){
        res.status(400).send(e.message);
    }
});



module.exports = router;