import express from 'express';
import {Show} from '../models';

const router = express.Router();

//공연 일정을 만든다.
router.post('/create', (req, res) => {
    const show = new Show(req.body);
    show.save((err, result) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Show Create Error', err);
        }
        else {
            return res.json({
                success : true
            });
        }
    });
});

//공연 일정을 조회한다.
router.get('/read/:id', (req, res) => {

    //source 파라미터가 all일 경우 모든 데이터 조회
    let query;
    if(req.params.id==='all')
        query = {};
    else
        query = {_id:req.params.id};

    //lean() -> 조회 속도 빠르게 하기 위함
    Show.find(query).lean().exec((err, show) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Show Read Error', err);
        }
        else {
            return res.json({
                success : true,
                show
            });
        }
    });
});

//공연 일정을 수정한다.
router.put('/update', (req, res) => {
    Show.update({_id:req.body._id}, {$set: req.body}, (err) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Show Modify Error', err);
        }
        else {
            return res.json({
                success : true
            });
        }
    });
});

//공연 일정을 삭제한다.
router.delete('/delete', (req, res) => {
    Show.remove({_id:req.body._id}, (err) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Show Delete Error', err);
        }
        else {
            return res.json({
                success : true
            });
        }
    });
});

export default router;