let moment = require('moment-timezone');
let zone = moment.tz.zone('Asia/Seoul');
console.log(zone.parse(Date.UTC(2017,7,23,11,0)));
let m = moment.tz('2017-07-23 11:00', 'Asia/Seoul');
console.log(new Date(m.format()).toLocaleString());

let m3 = moment.tz([2017,6,23,11,0], 'Asia/Seoul');
console.log(new Date(m3.format()));

let m2 = moment.tz('2017-07-23T11:00:00.000Z', 'Asia/Seoul');
console.log(new Date(m2.format()).getTime());

console.log(new Date(moment().tz("Asia/Seoul").format()).toLocaleString())