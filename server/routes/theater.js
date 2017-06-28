import express from 'express';
import multer from 'multer';
import {Theater} from '../models';
import XLSX from 'xlsx';

const router = express.Router();

// 파일 업로드 모듈. 최대 사이즈 : 30MB
const upload = multer({
    storage : multer.memoryStorage(),
    limits : {fileSize : 1024 * 1024 * 30}
});

//공연장을 만든다.
router.post('/create', (req, res) => {
    const theater = new Theater(req.body);
    theater.save((err) => {
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
    if(req.params.id==='all')
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
router.put('/update', (req, res) => {
    //공연장의 좌석 배치를 수정한다.
    console.log(req.body._id);
    Theater.update({_id:req.body._id}, {$set: {seats_quantity : req.body.seats.length, seats : req.body.seats}}, (err) => {
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