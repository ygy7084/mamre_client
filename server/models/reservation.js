import mongoose from 'mongoose';

/* Reservation 스키마
 source,              //공연 예매 출처
 customer_name,       //고객 성함
 customer_phone,      //고객 번호(뒷 4자리)
 show_date : '',      //공연 날짜 및 시간 (DATE 객체)
 seat_class : '',     //좌석 등급
 seat_position : {    //좌석 위치 -> 없을 시 null
 floor,
 row,
 column
 },
 ticket_quantity,     //티켓 수량
 ticket_code,         //예약 번호, 주문 번호, 티켓 번호 등 각 사이트별 코드
 ticket_price,        //티켓 가격
 theater,             //공연장 참조
 show                 //공연 참조
 */
const Schema = mongoose.Schema;
const Reservation = new Schema({
    source : String,
    customer_name : String,
    customer_phone : String,
    show_date : Date,
    seat_class : String,
    seat_position : {
        floor : Number,
        row : Number,
        colum : Number
    },
    ticket_quantity : Number,
    ticket_code : String,
    ticket_price : Number,
    theater : {type : Schema.Types.ObjectId, ref:'theater'},
    show : {type : Schema.Types.ObjectId, ref:'show'}
});

const model = mongoose.model('reservation', Reservation);

export default model;