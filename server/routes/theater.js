import express from 'express';
import {Theater} from '../models';

const router = express.Router();

//공연장을 만든다.
router.post('/create', (req, res) => {
    const theater = new Theater(req.body);
    theater.save((err, result) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Theater Create Error', err);
        }
        else {
            return res.json({
                success : true
            });
        }
    });
});

//공연장을 조회한다.
router.get('/read/:id', (req, res) => {

    //source 파라미터가 all일 경우 모든 데이터 조회
    let query;
    if(req.params.source==='all')
        query = {};
    else
        query = {_id:req.params.id};

    //lean() -> 조회 속도 빠르게 하기 위함
    Theater.find(query).lean().exec((err, theater) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Show Read Error', err);
        }
        else {
            return res.json({
                success : true,
                theater
            });
        }
    });
});

//공연장을 수정한다.
router.put('/modify', (req, res) => {
    Theater.update({_id:req.body._id}, {$set: req.body}, (err) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Theater Modify Error', err);
        }
        else {
            return res.json({
                success : true
            });
        }
    });
});

//공연장을 삭제한다.
router.delete('/delete', (req, res) => {
    Theater.remove({_id:req.body._id}, (err) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Theater Delete Error', err);
        }
        else {
            return res.json({
                success : true
            });
        }
    });
});

export default router;