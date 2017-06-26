import mongoose from 'mongoose';

/* Reserved_Seat 스키마
 theater,    // theater 참조
 show,       // show 참조
 seats       // 예약된 좌석

             //ex)예약된 좌석 예제
 seats : [ {floor, row, column, ObjectID}, ...] //ObjectID는 reservation 참조
 */
const Schema = mongoose.Schema;
const Reserved_Seat = new Schema({
    theater : {type : Schema.Types.ObjectId, ref:'theater'},
    show : {type : Schema.Types.ObjectId, ref:'show'},
    date : Date,
    seats : []
});

const model = mongoose.model('reserved_seat', Reserved_Seat);

export default model;