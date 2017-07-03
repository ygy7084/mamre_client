import Crawler from 'crawler';

const crawler = (url) => {
    return new Promise(
        (resolve, reject) => {
            new Crawler({
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
                        resolve(array);
                    }
                }}).queue(url);
        });
};

export default crawler;


