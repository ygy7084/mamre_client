import express from 'express';
import mongoose from 'mongoose';
import {Reservation, Showtime} from '../models';
import PDFDocument from 'pdfkit';

const router = express.Router();

router.post('/create', (req, res) => {
    const reservation = new Reservation(req.body);
    reservation.save((err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'Reservation Create Error - '+err.message});
        }
        else {
            return res.json({
                data:results
            });
        }
    });
});

router.get('/print', (req, res) => {
    const doc = new PDFDocument();
});

router.post('/ticketting', (req, res) => {
    const inputs = req.body;
    const theater = inputs[0].theater;
    const show = inputs[0].show;
    //inputs 안의 모든 데이터의 theater 와 show는 각각 같은 값으로 이뤄져야 함

    let bulk = [];
    let wrong_data = [];

        for (let o of inputs) {
            bulk.push({
                updateOne: {
                    filter: {
                        _id : o._id
                    },
                    update: {
                        $set : {
                            seat_position:o.seat_position,
                            input_date:o.input_date,
                            printed:o.printed
                        }
                    },
                    upsert: true
                },
            });

        }
        if(bulk.length !== 0) {
            Reservation.bulkWrite(bulk).then((results) => {

                return res.json({
                    data: {
                        wrong_data : wrong_data
                    }
                })
            });
        }
});
router.post('/createMany', (req, res) => {
    const inputs = req.body;
    const theater = inputs[0].theater;
    const show = inputs[0].show;
    //inputs 안의 모든 데이터의 theater 와 show는 각각 같은 값으로 이뤄져야 함

    let bulk = [];
    let wrong_data = [];

    Showtime.find({theater:theater, show:show}).exec((err, results) => {
        const schedule = results[0].schedule.map((e) => {
            return new Date(e.date).toLocaleString();
        });

        for (let o of inputs) {
            if(schedule.indexOf(new Date(o.show_date).toLocaleString())<0)
                wrong_data.push(o);
            else {
                if (o.seat_position)
                    bulk.push({
                        //source,show_date,show,theater,seat_position 없으면 insert 있으면 nothing
                        updateOne: {
                            filter: {
                                source: o.source,
                                show_date: new Date(o.show_date),
                                show: o.show,
                                theater: o.theater,
                                seat_position: o.seat_position,
                                ticket_code: o.ticket_code ? o.ticket_code : mongoose.Types.ObjectId()
                            },
                            update: o,
                            upsert: true
                        },
                    });
                else
                    bulk.push({
                        //source,show_date,ticket_code 없으면 insert 있으면 nothing
                        updateOne: {
                            filter: {
                                source: o.source,
                                show_date: new Date(o.show_date),
                                ticket_code: o.ticket_code ? o.ticket_code : mongoose.Types.ObjectId()
                            },
                            update: o,
                            upsert: true
                        }
                    })
            }
        }

        if(bulk.length !== 0) {
            Reservation.bulkWrite(bulk).then((results) => {
                const changed_index = Object.keys(results.upsertedIds);

                let bulk = [];
                for (let i of changed_index) {
                    bulk.push({
                        updateOne: {
                            filter: {
                                show: inputs[i].show, theater: inputs[i].theater,
                                'schedule.date': new Date(inputs[i].show_date)
                            },
                            update: {$addToSet: {"schedule.$.reservations": {_id: results.upsertedIds[i]}}}
                        }
                    })
                }

                if(bulk.length!==0) {
                    Showtime.bulkWrite(bulk).then((results) => {
                        return res.json({
                            data: results
                        })
                    });
                }
                else
                    return res.json({
                        data: {
                            wrong_data: wrong_data
                        }
                    })
            });
        }
        else {
            return res.json({
                data: {
                    wrong_data : wrong_data
                }
            })
        }
    });
});

//예매 내역을 조회한다.
router.get('/read/theater/:theater/show/:show/date/:date', (req, res) => {
    const query = {
        theater : req.params.theater,
        show : req.params.show,
        show_date : new Date(parseInt(req.params.date))
    };
    Reservation.find(query).lean().exec((err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'Reservation Read Error - '+err.message});
        }
        else {
            return res.json({
                data : results
            });
        }
    });
});

//예매 내역을 조회한다.
router.get('/read/:key_name/:key_value', (req, res) => {
    const key_name = req.params.key_name;
    const key_value = req.params.key_value;

    const keys = ['_id'];

    if(keys.indexOf(key_name) < 0)
        return res.status(500).json({message:'Reservation Read Error - '+'잘못된 key 이름을 입력하셨습니다 : '+key_name});

    let query = {};
    query[key_name] = key_value;

    Reservation.find(query).lean().exec((err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'Reservation Read Error - '+err.message});
        }
        else {
            return res.json({
                data : results
            });
        }
    });
});
//예매 내역을 조회한다.
router.get('/read', (req, res) => {
    Reservation.find({}).lean().exec((err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'Reservation Read Error - '+err.message});
        }
        else {
            return res.json({
                data : results
            });
        }
    });
});

//예매 내역을 수정한다.
router.put('/update', (req, res) => {
    Reservation.update({_id:req.body._id}, {$set: req.body}, (err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'Reservation Modify Error - '+err.message});
        }
        else {
            return res.json({
                data : results
            });
        }
    });
});

//예매 내역을 삭제한다.
router.delete('/delete', (req, res) => {
    Reservation.remove({_id:req.body._id}, (err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'Reservation Delete Error - '+err.message});
        }
        else {
            return res.json({
                data : results.result
            });
        }
    });
});

export default router;