const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Theater = new Schema({
    name : String,
    seats_quantity : Number,
    seats : [
        {
            _id:false,
            floor:String,
            col:String,
            num:String
        }
    ]
});
const Reservation = new Schema({
    input_date : Date,
    source : String,
    customer_name : String,
    customer_phone : String,
    show_date : Date,
    seat_class : String,
    seat_position : {
        floor : String,
        col : String,
        num : String
    },
    ticket_quantity : Number,
    ticket_code : String,
    ticket_price : Number,
    theater : {type : Schema.Types.ObjectId, ref:'theater'},
    show : {type : Schema.Types.ObjectId, ref:'show'}
});
const Show = new Schema({
    name : String,
    schedule : [{
        _id:false,
        theater : {type : Schema.Types.ObjectId, ref:'theater'},
        date : Date,
        url : String,
        reservations:[{type : Schema.Types.ObjectId, ref:'reservation'}]
    }]
});
const Showtime = new Schema({
    theater : {type : Schema.Types.ObjectId, ref:'theater'},
    show : {type : Schema.Types.ObjectId, ref:'show'},
    schedule : [{
        _id:false,
        date : Date,
        url : String,
        reservations:[{type : Schema.Types.ObjectId, ref:'reservation'}]
    }]
});

const db = mongoose.connection;
mongoose.connect('mongodb://localhost:27017/rp');
mongoose.Promise = global.Promise;

db.on('error', console.error);
db.once('open', () => {console.log('Hi mongodb')});

const model_theater = mongoose.model('theater', Theater);
const model_show = mongoose.model('show', Show);
const model_reservation = mongoose.model('reservation', Reservation);
const model_showtime = mongoose.model('showtime', Showtime);

// new mongoose.mongo.ObjectId('56cb91bdc3464f14678934ca');
let theater_id = '5957c2cb9e66513f60930e41';
let show_id = '5957c2d29e66513f60930e42';
let date = new Date('2017-07-21 14:00:00');
// model_show.find({
//     schedule:{
//         $elemMatch: {theater:toMongoID(theater_id), date:new Date('2017-07-22 16:30:00')}
//     }}
//     ).exec((err,data)=>{
//     if(err)
//         console.error(err);
//     console.log(data[0]);
// });

function toMongoID(id) {
    return new mongoose.mongo.ObjectId(id);
}

// model_showtime.find({_id:'5957c4fb7131180454dfa565'},{theater:true})
//     .populate('theater')
//     .exec((err, results) => {
//     if(err) {
//         console.error(err);
//         return res.status(500).json({message:'Crawling Data Read Error - '+err.message});
//     }
//     if(!results||results.length<1) {
//         return res.status(500).json({message: 'Crawling Data Read Error - ' + '공연일정(Showtime)을 _id로 찾을 수 없습니다.'});
//     }
//     console.log(results[0]);
// });

/*
 input_date: new Date(),
 source: this.state.excel_picked.source,
 customer_name: p.customer_name,
 customer_phone: p.customer_phone,
 show_date: p.show_date,
 seat_class: p.seat_class,
 seat_position: p.seat_position,
 ticket_quantity: p.ticket_quantity,
 ticket_code: p.ticket_code,
 ticket_price: p.ticket_price,
 theater: this.state.theater_picked._id,
 show: this.state.show_picked._id
 */
const inputs = [
    {
        input_date: new Date(),
        source:"인터파크",
        customer_name: "김창숙",
        customer_phone: "5479",
        seat_class: "VIP",
        seat_position: {
            floor: "1",
            col: "O",
            num: "31"
        },
        show_date: "2017-07-21T02:00:00Z",
        ticket_code: "C09617-284",
        ticket_price: "19900",
        ticket_quantity: 1,
        theater:"5957c2cb9e66513f60930e41",
        show:'5957c2d29e66513f60930e42'
    },
    {
        input_date: new Date(),
        source:"인터파크",
        customer_name: "김형식",
        customer_phone: "5479",
        seat_class: "VIP",
        seat_position: null,
        show_date: "2017-07-21T02:00:00Z",
        ticket_code: "C09617-28094=",
        ticket_price: "19900",
        ticket_quantity: 1,
        theater:'5957c2cb9e66513f60930e41',
        show:'5957c2d29e66513f60930e42'
    },
    {
        input_date: new Date(),
        source:"인터파크",
        customer_name: "지민",
        customer_phone: "5479",
        seat_class: "VIP",
        seat_position: {
            floor: "1",
            col: "O",
            num: "31"
        },
        show_date: "2016-12-10T02:00:00Z",
        ticket_code: "C09617-28094sd=",
        ticket_price: "19900",
        ticket_quantity: 1,
        theater:'5957c2cb9e66513f60930e41',
        show:'5957c2d29e66513f60930e42'
    }
];


let bulk = [];
let theater = inputs[0].theater;
let show = inputs[0].show;

model_showtime.find({theater:theater, show:show}).exec((err, results) => {
    let temp = [];
    let schedule = results[0].schedule.map((e) => {
        return new Date(e.date).toLocaleString();
    });
    console.log(schedule);
    for(let o of inputs) {
        if(schedule.indexOf(new Date(o.show_date).toLocaleString())<0)
            temp.push(o);
        bulk.push({
            //source,show_date,show,theater,seat_position 없으면 insert 있으면 nothing
            updateOne : {
                filter:{
                    source:o.source,
                    show_date:new Date(o.show_date),
                    show : o.show,
                    theater:o.theater,
                    seat_position:o.seat_position
                },
                update:o,
                upsert:true},
        })
    }

//인터파크 제외
// for(let o of inputs) {
//     bulk.push({
//         //source,show_date,ticket_code 없으면 insert 있으면 nothing
//         updateOne : {
//             filter:{
//                 source:o.source,
//                 show_date:new Date(o.show_date),
//                 ticket_code:o.ticket
// _code
//             },
//             update:o,
//             upsert:true},
//
//     })
// }

    model_reservation.bulkWrite(bulk).then((a) => {
        const changed_index = Object.keys(a.upsertedIds);
        console.log(changed_index,a.upsertedIds);
        let bulk = [];
        for(let i of changed_index) {
            bulk.push({
                updateOne: {
                    filter: {
                        show: inputs[i].show, theater: inputs[i].theater,
                        'schedule.date': new Date(inputs[i].show_date)
                    },
                    update: {$addToSet: {"schedule.$.reservations": {_id: a.upsertedIds[i]}}}
                }
            });
        }
        for(let i of bulk)
            console.log(i);
        model_showtime.bulkWrite(bulk).then((a) => {
            if(a.modifiedCount !== bulk.length) {

            }
            console.log('---');
            console.log(a.toJSON());
            console.log(a.modifiedCount, bulk.length);
        });
    });
    console.log('떨거지 : ',temp);
});

