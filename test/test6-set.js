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
    source : String,
    customer_name : String,
    customer_phone : String,
    show_date : Date,
    seat_class : String,
    seat_position : {
        floor : Number,
        col : Number,
        num : Number
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

const db = mongoose.connection;
mongoose.connect('mongodb://localhost:27017/rp');
mongoose.Promise = global.Promise;

db.on('error', console.error);
db.once('open', () => {console.log('Hi mongodb')});

const model_theater = mongoose.model('theater', Theater);
const model_show = mongoose.model('show', Show);
const model_reservation = mongoose.model('reservation', Reservation);

// new mongoose.mongo.ObjectId('56cb91bdc3464f14678934ca');
let theater_id = '59531e8a0cc9782d34a4467e';
let show_id = '595322c66532f3188caeaa38';
let date = new Date('2017-07-22 16:30:00');
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

// model_show.aggregate([
//     {$match: {_id: toMongoID(show_id)}},
//     {$project: {
//         schedule: {$filter: {
//             input: '$schedule',
//             as: 'schedule',
//             cond: { $and : [
//                 {$eq: ['$$schedule.theater', toMongoID(theater_id)]},
//                 {$eq: ['$$schedule.date', date]}]
//             }},
//             }}}
// ]).exec((err, data) => {
//     if(err)
//         console.error(err);
//     console.log(data[0].schedule[0].url);
// });

let a = [JSON.stringify({a:1,b:2}),JSON.stringify({a:3,b:5}),JSON.stringify({a:2,b:7})];
let b = [JSON.stringify({a:1,b:4}),JSON.stringify({a:3,b:5}),JSON.stringify({a:2,b:7})];

let difference = (a, b) => {
    let arr = [];
    for (l of a) {
        b.indexOf(l) < 0 ? arr.push(JSON.parse(l)) : null
    }
    return arr;
};

console.log(difference(a,b));
