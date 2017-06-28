const mongoose = require('mongoose');
const mongoose_function = require('mongoose-function');

//함수를 저장할 수 있도록
mongoose_function(mongoose);

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
const Excel = new Schema({
    source : String,
    parsing_rule : {
        customer_name : {
            field : String,
            code : Function
        },
        customer_phone : {
            field : String,
            code : Function
        },
        show_date_year : {
            field : String,
            code : Function
        },
        show_date_month : {
            field : String,
            code : Function
        },
        show_date_day : {
            field : String,
            code : Function
        },
        show_time_hour : {
            field : String,
            code : Function
        },
        show_time_minute : {
            field : String,
            code : Function
        },
        seat_class : {
            field : String,
            code : Function
        },
        seat_position_floor : {
            field : String,
            code : Function
        },
        seat_position_col : {
            field : String,
            code : Function
        },
        seat_position_num : {
            field : String,
            code : Function
        },
        ticket_quantity : {
            field : String,
            code : Function
        },
        ticket_code : {
            field : String,
            code : Function
        },
        ticket_price : {
            field : String,
            code : Function
        },

    }
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
const model_excel = mongoose.model('excel', Excel);
const model_show = mongoose.model('show', Show);
const model_reservation = mongoose.model('reservation', Reservation);

// new mongoose.mongo.ObjectId('56cb91bdc3464f14678934ca');
let theater_id = '59531e8a0cc9782d34a4467e';
let show_id = '595322c66532f3188caeaa38';
model_theater.find({_id:'59531e8a0cc9782d34a4467e'},{_id:true}).exec((err,data) => {
    console.log('theater id :',data[0]._id);
    model_show.find({_id:'595322c66532f3188caeaa38'},{_id:true}).exec((err,data) => {
        console.log('show id :',data[0]._id);
        // let rows = [
        //     {
        //         date:'2017-07-21 11:00:00',
        //         url:'http://admin.ticketpark.com/tims/GoodsInfo/Booking/BookingSeatDetailMap.asp?GoodsCode=17007474&PlaceCode=13811094&PlaySeq=001&SeatGrade=&Block=RGN001&TmgsOrNot=D2006&LocOfImage=&Tiki=N&UILock=Y&FullSeatView=',
        //     },
        //     {
        //         date:'2017-07-21 14:00:00',
        //         url:'http://admin.ticketpark.com/tims/GoodsInfo/Booking/BookingSeatDetailMap.asp?GoodsCode=17007474&PlaceCode=13811094&PlaySeq=002&SeatGrade=&Block=RGN001&TmgsOrNot=D2006&LocOfImage=&Tiki=N&UILock=Y&FullSeatView=',
        //     },
        //     {
        //         date:'2017-07-21 16:30:00',
        //         url:'http://admin.ticketpark.com/tims/GoodsInfo/Booking/BookingSeatDetailMap.asp?GoodsCode=17007474&PlaceCode=13811094&PlaySeq=003&SeatGrade=&Block=RGN001&TmgsOrNot=D2006&LocOfImage=&Tiki=N&UILock=Y&FullSeatView=',
        //     },
        //     {
        //         date:'2017-07-22 11:00:00',
        //         url:'http://admin.ticketpark.com/tims/GoodsInfo/Booking/BookingSeatDetailMap.asp?GoodsCode=17007474&PlaceCode=13811094&PlaySeq=004&SeatGrade=&Block=RGN001&TmgsOrNot=D2006&LocOfImage=&Tiki=N&UILock=Y&FullSeatView=',
        //     },
        //     {
        //         date:'2017-07-22 14:00:00',
        //         url:'http://admin.ticketpark.com/tims/GoodsInfo/Booking/BookingSeatDetailMap.asp?GoodsCode=17007474&PlaceCode=13811094&PlaySeq=005&SeatGrade=&Block=RGN001&TmgsOrNot=D2006&LocOfImage=&Tiki=N&UILock=Y&FullSeatView=',
        //     },
        //     {
        //         date:'2017-07-22 16:30:00',
        //         url:'http://admin.ticketpark.com/tims/GoodsInfo/Booking/BookingSeatDetailMap.asp?GoodsCode=17007474&PlaceCode=13811094&PlaySeq=006&SeatGrade=&Block=RGN001&TmgsOrNot=D2006&LocOfImage=&Tiki=N&UILock=Y&FullSeatView=',
        //     }
        // ];

        // show에서 공연장 이름 찾기
        // model_show.find({_id:show_id})
        //     .populate({
        //         path:'schedule.theater',
        //         select:'name'
        //     }).exec((err, result) => {
        //         if(err) console.error(err);
        //         console.log(result[0].schedule[0].theater);
        //     });

        // show의 seat 배열 초기화 하기
        // let array = [];
        // for(let i=0;i<rows.length;i++) {
        //     let obj = {
        //         theater : theater_id,
        //         date : new Date(rows[i].date),
        //         url : rows[i].url
        //     };
        //     console.log('array update : ',obj);
        //     array.push(obj);
        // }
        // model_show.update({_id:show_id}, {$set:{schedule:array}},(err) => {
        //     if(err)
        //         console.error(err);
        // });

        let sA = new Set();
        let sB = new Set();
        sA.add(JSON.stringify({a:1,b:1}));
        sA.add(JSON.stringify({a:2,b:1}));
        sA.add(JSON.stringify({a:3,b:1}));
        sB.add(JSON.stringify({a:1,b:1}));
        sB.add(JSON.stringify({a:2,b:1}));
        sB.add(JSON.stringify({a:1,b:4}));
        Set.prototype.difference = function(setB) {
            var difference = new Set(this);
            for (var elem of setB) {
                difference.delete(elem);
            }
            return difference;
        }
        console.log(sA.difference(sB));
    });
});

