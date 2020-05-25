const debug = require('debug')('app:debug');
const { Complaint } = require('../db/complaints');
const express = require('express');
const _ = require('lodash');


const router = express.Router();

router.post('/', async (req, res) => {
    debug('Inside the complaint post route.');
    const d = new Date();
    const dateTime = d.toLocaleDateString() + '(' +d.getHours() +':'+ d.getMinutes() + ')';
    debug(dateTime);
    let date = dateTime.substring(0, dateTime.indexOf('('));
    let time = dateTime.substring(dateTime.indexOf('(')+1, dateTime.length-1);
    let min = time.substring(time.indexOf(':')+1, time.length);
    if(min.length === 1){
        time = time.substring(0, time.indexOf(':')+1) + '0' + min;
        debug(time, 'after changed');
    } 
    req.body.date = date + '(' + time + ')';
    debug(req.body.date);
    const record = await new Complaint(_.pick(req.body, ["name", "comment", "fpdName", "date"]));        
    user = await record.save();
    res.send("Complaint post...");
});


router.post('/list', async (req, res) => {
    debug('Inside the complaint get route.');
    try {
        const record = await Complaint.find({fpdName : req.body.fpdName});
        for(let i=0;i<record.length;i++){
            let dateTime = record[i].date;
            let date = dateTime.substring(0, dateTime.indexOf('('));
            let time = dateTime.substring(dateTime.indexOf('(') + 1, dateTime.indexOf(')'));
            let d = new Date();
            const currDate = d.toLocaleDateString();
            let hr = parseInt(time.substring(0, time.indexOf(':')));
            let ap = '';
            // debug(hr);
            if( hr > 12 ){
                hr-=12;
                ap = 'PM'
            }
            else if(hr === 0){
                hr = 12;
                ap = 'AM';
            }
            else ap = 'AM';

            let dis;
            if(currDate === date){
                dis = 'Today at ';
                dis = dis + hr + time.substring(time.indexOf(':'), time.length) + ap;
            }
            else {
                dis = date + ' at ';
                dis = dis + hr + time.substring(time.indexOf(':'), time.length) + ap;
            }
            record[i].date = dis;
        }

        res.send({ record });
    } catch(e){
        res.status(400).send(e.message);
    }

});



module.exports = router;