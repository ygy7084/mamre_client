import Crawler from 'crawler';

const makeCrawler = (cb) => {
    return new Crawler({
        maxConnections : 10,
        callback : function (error, res, done) {
            if(error){
                console.log(error);
            }else {
                const $ = res.$;
                let found = $(".stySeat");
                let array = [];
                for (let i in found) {
                    if(found[i].attribs && found[i].attribs.alt) {
                        let seatInfo = found[i].attribs.alt;
                        let seat = {
                            seat_class: new RegExp('[a-zA-Z]+(?=석)').exec(seatInfo)[0],
                            floor: new RegExp('[0-9](?=층)').exec(seatInfo)[0],
                            col: new RegExp('[가-힣](?=열)').exec(seatInfo)[0],
                            num: new RegExp('[0-9]+$').exec(seatInfo)[0]
                        };
                        array.push(seat);
                    }
                }
                done();
                return cb(array);
            }
        }});
};

let c;
const crawler = (url, cb) => {
    if(!c) c = makeCrawler(cb);
    c.queue(url);

};

export default crawler;


