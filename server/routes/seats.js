import express from 'express';
import {Showtime, Reservation, Theater} from '../models';

const router = express.Router();

router.post('/available', (req, res) => {
    const input = {
        showtime : req.body.showtime,
        date : req.body.date,
        seats : req.body.seats
    };

});
router.get('/pre/showtime/:showtime/date/:date', (req, res) => {
    const input = {
        showtime: req.params.showtime,
        date: new Date(parseInt(req.params.date))
    };
    const wrapper = {
        data : input
    };
    Showtime.find({_id:input.showtime})
        .populate('theater')
        .exec((err, results) => {
            if(err) {
                console.error(err);
                return res.status(500).json({message:'Crawling Data Read Error - '+err.message});
            }
            if(!results||results.length<1) {
                return res.status(500).json({message:'Crawling Data Read Error - '+'공연일정(Showtime)을 _id로 찾을 수 없습니다.'});
            }
            if(!results[0].theater) {
                return res.status(500).json({message:'Crawling Data Read Error - '+'공연장(Theater)을 _id로 찾을 수 없습니다.'});
            }

            const schedules = results[0].schedule;
            const theater_seats = results[0].theater.seats;
            let schedule;
            for(let s of schedules)
                if(new Date(s.date).getTime()===parseInt(req.params.date))
                    schedule = s;

            Reservation.populate(schedule.reservations, { path: '_id' }, (err, results) => {

                let preTicketted_seats = [];
                results.forEach((excel_seat) => {
                    //mongoose documnet to javascript object
                    let o = JSON.parse(JSON.stringify(excel_seat._id));

                    if(o && o.seat_position && o.printed && !o.delivered) {
                        preTicketted_seats.push(o.seat_position);
                    }
                });


                //difference 연산
                let printed_seats = theater_seats.filter((ts) => {
                    return preTicketted_seats.filter((cs) => {
                            return ts.col===cs.col && ts.floor === cs.floor && ts.num === cs.num
                        }).length!==0;
                });
                return res.json({
                    data : {
                        printed_seats
                    }
                });
            });


        });

});
router.get('/showtime/:showtime/date/:date', (req, res) => {
    const input = {
        showtime: req.params.showtime,
        date: new Date(parseInt(req.params.date))
    };
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
            Showtime.find({_id:input.showtime})
                .populate('theater')
                .exec((err, results) => {
                if(err) {
                    console.error(err);
                    return res.status(500).json({message:'Crawling Data Read Error - '+err.message});
                }
                if(!results||results.length<1) {
                    return res.status(500).json({message:'Crawling Data Read Error - '+'공연일정(Showtime)을 _id로 찾을 수 없습니다.'});
                }
                if(!results[0].theater) {
                    return res.status(500).json({message:'Crawling Data Read Error - '+'공연장(Theater)을 _id로 찾을 수 없습니다.'});
                }

                const schedules = results[0].schedule;
                const theater_seats = results[0].theater.seats;
                let schedule;
                for(let s of schedules)
                    if(new Date(s.date).getTime()===parseInt(req.params.date))
                        schedule = s;

                Reservation.populate(schedule.reservations, { path: '_id' }, (err, results) => {
                    let excel_seats = [];
                    results.forEach((excel_seat) => {

                        //mongoose documnet to javascript object
                        let o = JSON.parse(JSON.stringify(excel_seat._id));

                        if(o && o.seat_position) {
                            excel_seats.push(o.seat_position);
                        }
                    });

                    const crawled_seats = response.data;

                    //difference 연산
                    let reserved_seats;
                    let not_reserved_seats;
                    reserved_seats = [];
                    // reserved_seats = theater_seats.filter((ts) => {
                    //     return crawled_seats.filter((cs) => {
                    //             return ts.col===cs.col && ts.floor === cs.floor && ts.num === cs.num
                    //         }).length===0;
                    // });
                    for(let es of excel_seats) {
                        if(!reserved_seats.find((rs) => {
                            return es.col===rs.col && es.floor===rs.floor && es.num===rs.num;
                        })) {
                            let es_added_coords = theater_seats.find((ts) => {
                                return es.col===ts.col && es.floor===ts.floor && es.num===ts.num;
                            });
                            reserved_seats.push(es_added_coords);
                        }
                    }

                    not_reserved_seats = theater_seats.filter((ts) => {
                        return reserved_seats.filter((rs) => {
                                return ts.col===rs.col && ts.floor === rs.floor && ts.num === rs.num
                            }).length===0;
                    });
                    return res.json({
                        data : {
                            reserved_seats,
                            not_reserved_seats
                        }
                    });
                });


            });
        })
        .catch((err) => {
            let message = err;
            if(err.message && err.message!=='')
                message = err.message;
            return res.status(500).json({message:message});
        });
});

export default router;