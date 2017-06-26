import express from 'express';
import {Reservation} from '../models';

const router = express.Router();

//예매 내역을 만든다.
router.post('/create', (req, res) => {
    const reservation = new Reservation(req.body);
    reservation.save((err, result) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Reservation Create Error', err);
        }
        else {
            return res.json({
                success : true
            });
        }
    });
});

//예매 내역을 조회한다.
router.get('/read/:id', (req, res) => {

    //source 파라미터가 all일 경우 모든 데이터 조회
    let query;
    if(req.params.source==='all')
        query = {};
    else
        query = {_id:req.params.id};

    //lean() -> 조회 속도 빠르게 하기 위함
    Reservation.find(query).lean().exec((err, reservation) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Reservation Read Error', err);
        }
        else {
            return res.json({
                success : true,
                reservation
            });
        }
    });
});

//예매 내역을 수정한다.
router.put('/modify', (req, res) => {
    Reservation.update({_id:req.body._id}, {$set: req.body}, (err) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Reservation Modify Error', err);
        }
        else {
            return res.json({
                success : true
            });
        }
    });
});

//예매 내역을 삭제한다.
router.delete('/delete', (req, res) => {
    Reservation.remove({_id:req.body._id}, (err) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Reservation Delete Error', err);
        }
        else {
            return res.json({
                success : true
            });
        }
    });
});

export default router;