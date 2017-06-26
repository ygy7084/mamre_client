import express from 'express';
import {Reserved_Seat} from '../models';

const router = express.Router();

//예약된 좌석 현황을 만든다.
router.post('/create', (req, res) => {
    const reserved_seat = new Reserved_Seat(req.body);
    reserved_seat.save((err, result) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Reserved_Seat Create Error', err);
        }
        else {
            return res.json({
                success : true
            });
        }
    });
});

//예약된 좌석 현황을 조회한다.
router.get('/read/:id', (req, res) => {

    //source 파라미터가 all일 경우 모든 데이터 조회
    let query;
    if(req.params.source==='all')
        query = {};
    else
        query = {_id:req.params.id};

    //lean() -> 조회 속도 빠르게 하기 위함
    Reserved_Seat.find(query).lean().exec((err, reserved_seat) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Reserved_Seat Read Error', err);
        }
        else {
            return res.json({
                success : true,
                reserved_seat
            });
        }
    });
});

//예약된 좌석 현황을 수정한다.
router.put('/modify', (req, res) => {
    Reserved_Seat.update({_id:req.body._id}, {$set: req.body}, (err) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Reserved_Seat Modify Error', err);
        }
        else {
            return res.json({
                success : true
            });
        }
    });
});

//예약된 좌석 현황을 삭제한다.
router.delete('/delete', (req, res) => {
    Reserved_Seat.remove({_id:req.body._id}, (err) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Reserved_Seat Delete Error', err);
        }
        else {
            return res.json({
                success : true
            });
        }
    });
});

export default router;