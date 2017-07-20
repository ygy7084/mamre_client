import express from 'express';
import {ticketMaker} from './module';


const router = express.Router();

router.post('/print', (req, res) => {
    ticketMaker(req.body).then((file) => {
        res.download(file);
    });
});

export default router;