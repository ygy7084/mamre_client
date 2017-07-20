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
                            printed:o.printed,
                            delivered:o.delivered
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

                const rollbackBulk = [];
                for(let i=0;i<errIndex;i++)
                    rollbackBulk.push({
                        deleteOne : {
                            filter : {
                                ticket_code:insertBulk[i].ticket_code
                            }
                        }
                    });

                Reservation.bulkWrite(rollbackBulk).then(() => {
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

router.post('/tickettingWithoutCustomer', (req, res) => {
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

                const rollbackBulk = [];
                for(let i=0;i<errIndex;i++)
                    rollbackBulk.push({
                        deleteOne : {
                            filter : {
                                ticket_code:insertBulk[i].ticket_code
                            }
                        }
                    });

                Reservation.bulkWrite(rollbackBulk).then(() => {
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

router.post('/tickettingWithCustomer', (req, res) => {

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
                        printed:o.printed,
                        delivered:o.delivered
                    }
                }
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
        }).catch((e) => {

            const errIndex = e.index;

            if (!errIndex)
                return res.status(500).json({message: '이미 예매 또는 발권된 좌석이 있어, 발권이 불가능합니다.'});

            const rollbackBulk = [];
            for (let i = 0; i < errIndex; i++)
                rollbackBulk.push({
                    updateOne: {
                        filter: {
                            _id: inputs[i]._id
                        },
                        update: {
                            $set: {
                                seat_position: undefined,
                                printed: false,
                                delivered: false
                            }
                        }
                    }
                });

            Reservation.bulkWrite(rollbackBulk).then(() => {
                return res.status(500).json({message: '이미 예매 또는 발권된 좌석이 있어, 발권이 불가능합니다.'});
            }).catch((e) => {
                return res.status(500).json({error: e, message: '알수없는오류'});
            });
        })
    }else {
        return res.status(500).json({message:'데이터가 서버로 전송되지 않았습니다.'});
    }


});

router.post('/preTicketting', (req, res) => {
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
                //임시 티켓 코드 (테이블 키 중복에 걸리지 않도록)

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

                const rollbackBulk = [];
                for(let i=0;i<errIndex;i++)
                    rollbackBulk.push({
                        deleteOne : {
                            filter : {
                                ticket_code:insertBulk[i].ticket_code
                            }
                        }
                    });

                Reservation.bulkWrite(rollbackBulk).then(() => {
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

                //인터파크
                if (o.seat_position)
                    bulk.push({
                        //source,show_date,show,theater,seat_position 없으면 insert 있으면 nothing
                        updateOne: {
                            filter: {
                                source: o.source,
                                show_date: new Date(o.show_date),
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


router.get('/interpark/showtime/:showtime/date/:date', (req, res) => {
    const input = {
        showtime: req.params.showtime,
        date: new Date(parseInt(req.params.date))
    };

    Showtime.find({_id:input.showtime})
        .populate('theater')
        .exec((err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({message: 'Data Read Error - ' + err.message});
            }
            if (!results || results.length < 1) {
                return res.status(500).json({message: 'Data Read Error - ' + '공연일정(Showtime)을 _id로 찾을 수 없습니다.'});
            }
            if (!results[0].theater) {
                return res.status(500).json({message: 'Data Read Error - ' + '공연장(Theater)을 _id로 찾을 수 없습니다.'});
            }

            const schedules = results[0].schedule;
            const theater_seats = results[0].theater.seats;
            const Arr = [];

            let i=0;
            for (let seat of theater_seats) {
                Arr.push({
                    num                      :++i,
                    show_date                :input.date.toLocaleString(),
                    ticket_quantity          :1, // 좌석 당 예약은 하나
                    seat_class               :seat.seat_class,
                    ticket_price             :seat.seat_class==='VIP' ? 50000 : (seat.seat_class==='R' ? 40000 : undefined),
                    seat_position            :{col : seat.col, num :seat.num},
                    source                   :undefined,
                    group_name               :undefined,
                    customer_name            :undefined,
                    customer_phone           :undefined
                });
            }

            let schedule;
            for (let s of schedules)
                if (new Date(s.date).getTime() === parseInt(req.params.date))
                    schedule = s;

            const wrapper = {
                data : input
            };
            fetch( `${req.protocol}://${req.get('Host')}`+'/api/showtime/crawl',{
                method : 'POST',
                headers : {'Content-Type' : 'application/json'},
                body : JSON.stringify(wrapper)
            })
                .then(response =>{
                    if(response.ok)
                        return response.json();
                    else
                        return response.json().then(err => { throw err; })})
                .then(response => {
                    const crawled_seats = response.data;

                    const reserved_seats = theater_seats.filter((ts) => {
                        return crawled_seats.filter((cs) => {
                                return ts.col===cs.col && ts.floor === cs.floor && ts.num === cs.num
                            }).length===0;
                    });

                    for(let c of reserved_seats) {
                        let obj = Arr.find((item) => {
                            if (
                                item.seat_position.col === c.col &&
                                item.seat_position.num === c.num
                            )
                                return true;
                        });
                        if(obj) {
                            obj.source = '인터파크';
                            obj.customer_name = '미확인';
                            obj.customer_phone = '미확인';
                        }
                        else {
                            console.log(c);
                        }
                    }

                    Reservation.populate(schedule.reservations, {path: '_id'}, (err, results) => {
                        results.forEach((r) => {
                            let reservation = r._id; // _id로 객체가 감싸여 있다,
                            //mongoose documnet to javascript object
                            if( reservation &&
                                reservation.seat_position &&
                                reservation.seat_position.col &&
                                reservation.seat_position.num) {

                                let obj = Arr.find((item) => {
                                    if(
                                        item.seat_position.col === reservation.seat_position.col &&
                                        item.seat_position.num === reservation.seat_position.num
                                    )
                                        return true;
                                });

                                if(obj) {
                                    obj.customer_name =  reservation.customer_name;
                                    obj.customer_phone = reservation.customer_phone;
                                    obj.group_name = reservation.group_name;
                                    obj.source = reservation.source;
                                    obj.ticket_price = reservation.ticket_price;
                                }
                                else {
                                    console.log(reservation.seat_position);
                                }
                            }
                        });


                        const interpark = [];

                        for(let r of Arr) {
                            for(let prop in r)
                                r[prop] = r[prop] ? r[prop] : '';
                            if(r.source==='인터파크')
                                interpark.push({
                                    show_date:new Date(r.show_date),
                                    seat_class:r.seat_class,
                                    seat_position:r.seat_position,
                                    ticket_quantity:1,
                                    ticket_price:r.ticket_price,
                                    source:r.source
                                });
                        }


                        return res.json({
                            data : interpark
                        });
                    });
                });
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