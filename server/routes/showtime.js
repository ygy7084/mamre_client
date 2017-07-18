import express from 'express';
import mongoose from 'mongoose';
import {Showtime, R} from '../models';
import {cralwer} from './module';

const router = express.Router();

//크롤러
router.post('/crawl', (req, res) => {
    function toMongoID(id) {
        return new mongoose.mongo.ObjectId(id);
    }
    Showtime.aggregate([
        {$match: {_id: toMongoID(req.body.data.showtime)}},
        {$project: {
            theater: true,
            show: true,
            schedule: {$filter: {
                input: '$schedule',
                as: 'schedule',
                cond: { $and : [
                    {$eq: ['$$schedule.date', new Date(req.body.data.date)]}]
                }},
            }}}
    ])
        .exec((err, results) => {
        if(err){
            console.error(err);
            return res.status(500).json({message:'Showtime Crawler Error - '+err.message});
        }
        if(results[0] && results[0].schedule[0])
            cralwer(results[0].schedule[0].url).then((results) => {
                return res.json({
                    data : results
                });
            });
        else
            return res.json({
                data : null
            });
    });
});

//공연 일정을 만든다.
router.post('/create', (req, res) => {
    const show = new Showtime(req.body.data);
    show.save((err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'Showtime Create Error - '+err.message});
        }
        else {
            return res.json({
                data : results
            });
        }
    });
});
//공연 일정을 조회한다.
router.get('/read/theater/:theater/show/:show', (req, res) => {
    const query = {
        theater : req.params.theater,
        show : req.params.show
    };
    //lean() -> 조회 속도 빠르게 하기 위함
    Showtime.find(query).lean().exec((err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'Showtime Read Error - '+err.message});
        }
        else {
            return res.json({
                data : results
            });
        }
    });
});

router.get('/read/showtime/:showtime/date/:date/phone/:phone', (req, res) => {
    // Showtime.find({_id:input.showtime})
    //     .populate('theater')
    //     .exec((err, results) => {
    //         if (err) {
    //             console.error(err);
    //             return res.status(500).json({message: 'Crawling Data Read Error - ' + err.message});
    //         }
    //         if (!results || results.length < 1) {
    //             return res.status(500).json({message: 'Crawling Data Read Error - ' + '공연일정(Showtime)을 _id로 찾을 수 없습니다.'});
    //         }
    //         if (!results[0].theater) {
    //             return res.status(500).json({message: 'Crawling Data Read Error - ' + '공연장(Theater)을 _id로 찾을 수 없습니다.'});
    //         }
    //
    //         const schedules = results[0].schedule;
    //         const theater_seats = results[0].theater.seats;
    //         let schedule;
    //         for (let s of schedules)
    //             if (new Date(s.date).getTime() === parseInt(req.params.date))
    //                 schedule = s;
    //
    //         Reservation.populate(schedule.reservations, {path: '_id'}, (err, results) => {
    //             let excel_seats = [];
    //             results.forEach((excel_seat) => {
    //
    //                 //mongoose documnet to javascript object
    //                 let o = JSON.parse(JSON.stringify(excel_seat._id));
    //
    //                 if (o.seat_position) {
    //                     excel_seats.push(o.seat_position);
    //                 }
    //             });
    //         })
    //     }
});

//공연 일정을 조회한다.
router.get('/read/:key_name/:key_value', (req, res) => {

    const key_name = req.params.key_name;
    const key_value = req.params.key_value;

    const keys = ['_id'];

    if(keys.indexOf(key_name) < 0)
        return res.status(500).json({message:'Showtime Read Error - '+'잘못된 key 이름을 입력하셨습니다 : '+key_name});

    let query = {};
    query[key_name] = key_value;

    //lean() -> 조회 속도 빠르게 하기 위함
    Showtime.find(query).lean().exec((err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'Showtime Read Error - '+err.message});
        }
        else {
            return res.json({
                data : results
            });
        }
    });
});

router.get('/read', (req, res) => {
    //lean() -> 조회 속도 빠르게 하기 위함
    Showtime.find({}).lean().exec((err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'Showtime Read Error - '+err.message});
        }
        else {
            return res.json({
                data : results
            });
        }
    });
});

//공연 일정을 수정한다.
router.put('/update', (req, res) => {
    Showtime.update({_id:req.body.data._id}, {$set: req.body.data.update}, (err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'Showtime Modify Error - '+err.message});
        }
        else {
            return res.json({
                data : results
            });
        }
    });
});

//공연 일정을 삭제한다.
router.delete('/delete', (req, res) => {
    Showtime.remove({_id:req.body.data._id}, (err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'Showtime Delete Error - '+err.message});
        }
        else {
            return res.json({
                data : results.result
            });
        }
    });
});

export default router;