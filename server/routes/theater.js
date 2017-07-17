import express from 'express';
import {Theater} from '../models';

const router = express.Router();

//공연장을 만든다.
router.post('/create', (req, res) => {
    const theater = new Theater(req.body.data);
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
router.get('/read/:key_name/:key_value', (req, res) => {
    const key_name = req.params.key_name;
    const key_value = req.params.key_value;

    const keys = ['_id'];

    if(keys.indexOf(key_name) < 0)
        return res.status(500).json({message:'Theater Read Error - '+'잘못된 key 이름을 입력하셨습니다 : '+key_name});

    let query = {};
    query[key_name] = key_value;

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
//공연장을 조회한다.
router.get('/read', (req, res) => {
    //lean() -> 조회 속도 빠르게 하기 위함
    Theater.find({}).lean().exec((err, results) => {
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

router.put('/update/coords', (req, res) => {
    Theater.update({
        _id:req.body.data._id,
        seats : {
            "$elemMatch" : {
                floor : req.body.data.floor,
                num : req.body.data.num,
                col : req.body.data.col
            }
        }
        }, {$set:{
            "seats.$.x":req.body.data.x,
            "seats.$.y":req.body.data.y}}, (err,results) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'Theater Modify Error - '+err.message});
        }
        else {
            return res.json({
                data : results
            });
        }
    })
});

//공연장을 수정한다.
router.put('/update', (req, res) => {
    //공연장의 좌석 배치를 수정한다.
    Theater.update({_id:req.body.data._id}, {$set: {seats_quantity : req.body.data.seats.length, seats : req.body.data.seats}}, (err, results) => {
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
    Theater.remove({_id:req.body.data._id}, (err, results) => {
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