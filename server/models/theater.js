import mongoose from 'mongoose';

/* Reservation 스키마
 theater_name,    // 공연장 이름
 hall_name,       // 공연홀 이름
 seats_quantity,  // 좌석 수량
 seats            // 좌석
                  //ex)좌석 예제
 seats : [ {floor, row, column, x, y}, ...] //x,y는 필요시 화면상의 좌표
 */
const Schema = mongoose.Schema;
const Theater = new Schema({
    theater_name : String,
    hall_name : String,
    seats_quantity : Number,
    seats : Array
});

const model = mongoose.model('theater', Theater);

export default model;