import mongoose from 'mongoose';

/* Show 스키마
 name,    // 공연 이름
 schedule :[{
    theater, // 공연장 ID
    date,    // 공연 날짜 및 시각
    url,     // 크롤링 url
    reservations    // 예약 ID
    }]
 */
const Schema = mongoose.Schema;
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

Show.index({name:1}, {unique:true});

const model = mongoose.model('show', Show);

export default model;