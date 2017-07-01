import express from 'express';
import {Theater} from '../models';

const router = express.Router();

//공연장을 만든다.
router.post('/create', (req, res) => {
    const theater = new Theater(req.body);
    theater.save((err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'Theater Create Error - '+err.message});
        }
        else {
            return res.json({
                data : results
            });
        }
    });
});

//공연장을 조회한다.
router.get('/read/:id', (req, res) => {

    //source 파라미터가 all일 경우 모든 데이터 조회
    let query;
    if(req.params.id==='all')
        query = {};
    else
        query = {_id:req.params.id};

    //lean() -> 조회 속도 빠르게 하기 위함
    Theater.find(query).lean().exec((err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'Show Read Error - '+err.message});
        }
        else {
            return res.json({
                data : results
            });
        }
    });
});

//공연장을 수정한다.
router.put('/update', (req, res) => {
    //공연장의 좌석 배치를 수정한다.
    Theater.update({_id:req.body._id}, {$set: {seats_quantity : req.body.seats.length, seats : req.body.seats}}, (err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'Theater Modify Error - '+err.message});
        }
        else {
            return res.json({
                data : results
            });
        }
    });
});

//공연장을 삭제한다.
router.delete('/delete', (req, res) => {
    Theater.remove({_id:req.body._id}, (err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'Theater Delete Error - '+err.message});
        }
        else {
            return res.json({
                data : results.result
            });
        }
    });
});

export default router;