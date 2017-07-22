import express from 'express';
import {SeatsSerial} from '../models';


const router = express.Router();

router.get('/:date', (req, res) => {
    let date = new Date(parseInt(req.params.date));
    SeatsSerial.find({date:date}).lean().exec((err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'Excel Read Error - '+err.message});
        }
        else {
            return res.json({
                data : results
            });
        }
    });
});

export default router;