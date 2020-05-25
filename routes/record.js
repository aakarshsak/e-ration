const { Record } = require('../db/record');
const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const debug = require('debug')('app:debug');
const CustomError = require('../middlewares/custom_error');

const router = express.Router();

router.post('/verify', async (req, res) =>{
    debug('saving previous records...');
    try {
        const result = await Record.find({ ration : req.body.ration });
        debug(result);
        const date = new Date();
        const month = date.getMonth() + 1;
        debug(month);
        let totalRice = parseInt(req.body.rice);
        let totalWheat = parseInt(req.body.wheat);
        let totalArhad = parseInt(req.body.arhad);
        let totalKerosene = parseInt(req.body.kerosene);
        for(let i=0;i<result.length;i++){
            const rec = result[i];
            const locMonth = rec.date.substring(3, 5);
            if(parseInt(locMonth) !== month)
                continue;
            totalRice+=parseInt(rec.rice);
            totalWheat+=parseInt(rec.wheat);
            totalArhad+=parseInt(rec.arhad);
            totalKerosene+=parseInt(rec.kerosene);
        }

        let msg = '';
        let count = 0;
        if(totalRice > 5){
            msg = msg+"Rice";
            count++;
        }
        if(totalWheat > 5){
            msg = msg+", Wheat";
            if(count ===0)
                msg = 'Wheat'
            count++;
        }
        if(totalArhad > 5){
            msg = msg+", Arhad";
            if(count === 0)
                msg = 'Arhad'
            count++;
        }
        if(totalKerosene > 5){
            msg = msg+", Kerosene";
            if(count === 0)
                msg = 'Kerosene'
            count++;
        }
        if( count > 0){
            throw new CustomError(`You have already bought amount of ${msg} allowed per month from different shops.`);
        }

        debug(totalRice, totalWheat, totalArhad, totalKerosene);
        res.send('Verified Successfull...');
    } catch(e){
        res.status(400).send(e.message);
    }
});


router.post('/', async (req, res) =>{
    try {
        const record = await new Record(_.pick(req.body, ["ration", "date", "orderid", "rice", "wheat", "arhad", "kerosene", "fpdName"]));        
        user = await record.save();
        res.send("Payment Successful...");
    } catch(e) {
        res.status(400).send(e.message);
    }
    
});

router.post('/record_list', async (req, res) => {
    const result = await Record.find({ fpdName : req.body.fpdName });
    if(!result) {
        debug('') ;
        return res.status(400).send('No Data found...');
    }
    res.status(200).send({result});
});

router.post('/order_list', async (req, res) => {
    const result = await Record.find({ ration : req.body.ration });
    if(!result) {
        debug('no orders');
        return res.status(400).send('No Order found...');
    }
    res.status(200).send({result});
});


module.exports = router;