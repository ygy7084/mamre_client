import mongoose from 'mongoose';

/* Show 스키마
 name,    // 공연 이름
 schedule :
    date,    // 공연 날짜 및 시각
    url      // 크롤링 url
 */
const Schema = mongoose.Schema;
const Show = new Schema({
    name : String,
    schedule : [{
        date : Date,
        url : String
    }]
});

Show.index({name:1}, {unique:true});

const model = mongoose.model('show', Show);

export default model;