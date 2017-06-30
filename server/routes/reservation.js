import express from 'express';
import {Reservation, Show, Theater} from '../models';
import {cralwer} from './module';

const router = express.Router();

// const getReverseOfCrawledData = (array, theater_id) => {
//     Theater.find({_id:theater_id}).lean().exec((err, results) => {
//         if(err) {
//             console.error(err);
//             return err;
//         }
//         let theater = results[0];
//
//         const diff = (A, B) => {
//             let arr = [];
//             for (l of A) {
//                 B.indexOf(l) < 0 ? arr.push(JSON.parse(l)) : null
//             }
//             return arr;
//         };
//         let tempA = [];
//         let tempB = [];
//         for(let i=0;i<theater.seats.length;i++) {
//             let obj = {
//                 floor : theater_id.
//             }
//         }
//
//     })
// };

//예매 내역을 만든다.
router.post('/create/crawler', (req, res) => {
    /*
    req.body : {
        show : ObjectID,
        theater : ObjectID,
        date : Date
    }
     */
    model_show.aggregate([
        {$match: {_id: toMongoID(show_id)}},
        {$project: {
            schedule: {$filter: {
                input: '$schedule',
                as: 'schedule',
                cond: { $and : [
                    {$eq: ['$$schedule.theater', toMongoID(theater_id)]},
                    {$eq: ['$$schedule.date', date]}]
                }},
            }}}
    ]).exec((err, data) => {
        if(err)
            console.error(err);
        console.log(data[0].schedule[0].url);
    });
    const reservation = new Reservation(req.body);
    reservation.save((err, result) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'Reservation Create Error', err:err.message});
        }
        else {
            return res.json({
                success : true
            });
        }
    });
});
router.post('/create', (req, res) => {
    const reservation = new Reservation(req.body);
    reservation.save((err, result) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'Reservation Create Error', err:err.message});
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
            return res.status(500).json({message:'Reservation Read Error', err:err.message});
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
router.put('/update', (req, res) => {
    Reservation.update({_id:req.body._id}, {$set: req.body}, (err) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'Reservation Modify Error', err:err.message});
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
            return res.status(500).json({message:'Reservation Delete Error', err:err.message});
        }
        else {
            return res.json({
                success : true
            });
        }
    });
});

export default router;