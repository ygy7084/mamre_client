import express from 'express';
import {Show} from '../models';

const router = express.Router();

//공연을 만든다.
router.post('/create', (req, res) => {
    const show = new Show(req.body);
    show.save((err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'Show Create Error - '+err.message});
        }
        else {
            return res.json({
                data : results
            });
        }
    });
});

//공연을 조회한다.
router.get('/read/:id', (req, res) => {

    //source 파라미터가 all일 경우 모든 데이터 조회
    let query;
    if(req.params.id==='all')
        query = {};
    else
        query = {_id:req.params.id};

    //lean() -> 조회 속도 빠르게 하기 위함
    Show.find(query).lean().exec((err, results) => {
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

//공연을 수정한다.
router.put('/update', (req, res) => {
    Show.update({_id:req.body._id}, {$set: req.body}, (err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'Show Modify Error - '+err.message});
        }
        else {
            return res.json({
                data : results
            });
        }
    });
});

//공연을 삭제한다.
router.delete('/delete', (req, res) => {
    Show.remove({_id:req.body._id}, (err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'Show Delete Error - '+err.message});
        }
        else {
            return res.json({
                data : results
            });
        }
    });
});

export default router;