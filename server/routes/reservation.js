import express from 'express';
import mongoose from 'mongoose';
import {Reservation, Showtime} from '../models';

const router = express.Router();

router.post('/create', (req, res) => {
    const reservation = new Reservation(req.body.data);
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

router.post('/ticketting', (req, res) => {
    const inputs = req.body.data;
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

router.post('/groupTicketting', (req, res) => {
    const inputs = req.body.data;
    const theater = inputs[0].theater;
    const show = inputs[0].show;
    //inputs 안의 모든 데이터의 theater 와 show는 각각 같은 값으로 이뤄져야 함

    Showtime.find({theater:theater, show:show}).exec((err, results) => {
        const schedule = results[0].schedule.map((e) => {
            return new Date(e.date).getTime();
        });

        const insertBulk = [];
        const wrong_data = [];

        for (let o of inputs) {
            if(schedule.indexOf(new Date(o.show_date).getTime())<0)
                wrong_data.push(o);
            else {
                o.ticket_code = mongoose.Types.ObjectId();
                insertBulk.push(o);
            }
        }

        if(insertBulk.length !== 0) {
            Reservation.insertMany(insertBulk).then((results) => {
                const updateBulk = [];
                for (let inserted of results)
                    updateBulk.push({
                        updateOne: {
                            filter: {
                                show: inserted.show,
                                theater: inserted.theater,
                                'schedule.date': inserted.show_date
                            },
                            update: {$addToSet: {"schedule.$.reservations": {_id: inserted._id}}}
                        }
                    });

                if(updateBulk.length!==0) {
                    Showtime.bulkWrite(updateBulk).then((results) => {
                        return res.json({
                            data: results
                        })
                    }).catch((e) => {
                        return res.status(500).json({error:e,message:'발권 에러 : reservation을 showtime에 입력하는데 오류가 있습니다.'});
                    });
                }
                else
                    return res.json({
                        data: {
                            wrong_data: wrong_data
                        }
                    })
            }).catch((e) => {

                const errIndex = e.index;

                if(!errIndex)
                    return res.status(500).json({message:'이미 예매 또는 발권된 좌석이 있어, 발권이 불가능합니다.'});

                const deleteBulk = [];
                for(let i=0;i<errIndex;i++)
                    deleteBulk.push({
                        deleteOne : {
                            filter : {
                                ticket_code:insertBulk[i].ticket_code
                            }
                        }
                    });

                Reservation.bulkWrite(deleteBulk).then(() => {
                    return res.status(500).json({message:'이미 예매 또는 발권된 좌석이 있어, 발권이 불가능합니다.'});
                }).catch((e) => {
                    return res.status(500).json({error:e, message:'알수없는오류'});
                });
            });
        }
        else
            return res.json({
                data: {
                    wrong_data : wrong_data
                }
            })

    });
});

router.post('/createMany', (req, res) => {
    const inputs = req.body.data;
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
                if (o.seat_position) //단체구매
                    bulk.push({
                        //source,show_date,show,theater,seat_position 없으면 insert 있으면 nothing
                        updateOne: {
                            filter: {
                                group_name:o.group_name,
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

router.delete('/delete/source', (req, res) => {
    const data = req.body.data;

    Reservation.find({
        theater:data.theater,
        show:data.show,
        source:data.source}).exec((err, results) => {

        let bulk = [];
        let ids = [];
        for (let i of results) {
            bulk.push({
                updateOne: {
                    filter: {
                        show: i.show, theater: i.theater,'schedule.reservations._id':i._id
                    },
                    update: {$pull: {"schedule.$.reservations": {_id: i._id}}}
                }
            });
            ids.push(i._id);
        }
        if(bulk.length) {
            Showtime.bulkWrite(bulk).then((results) => {
                Reservation.remove({'_id': {'$in': ids}}, (err, results) => {
                    return res.json({
                        data: results
                    })
                });
            });
        }else
            return res.json({
                data: {}
            })
    });
});

router.delete('/delete/all', (req, res) => {
    const data = req.body.data;

    Reservation.find({
        theater:data.theater,
        show:data.show}).exec((err, results) => {

        let bulk = [];
        let ids = [];
        for (let i of results) {
            bulk.push({
                updateOne: {
                    filter: {
                        show: i.show, theater: i.theater,'schedule.reservations._id':i._id
                    },
                    update: {$pull: {"schedule.$.reservations": {_id: i._id}}}
                }
            });
            ids.push(i._id);
        }
        if(bulk.length) {
            Showtime.bulkWrite(bulk).then((results) => {
                Reservation.remove({'_id': {'$in': ids}}, (err, results) => {
                    return res.json({
                        data: results
                    })
                });
            });
        }else
            return res.json({
                data: {}
            })
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
    Reservation.update({_id:req.body.data._id}, {$set: req.body.data}, (err, results) => {
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
    Reservation.remove({_id:req.body.data._id}, (err, results) => {
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