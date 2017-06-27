let Crawler = require('crawler');

let c = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else {
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            let found = $(".stySeat");
            let array = [];
            for (let i in found) {
                if(found[i].attribs && found[i].attribs.alt) {
                    let seatInfo = found[i].attribs.alt;
                    let seat = {
                        seat_class: new RegExp('[a-zA-Z](?=석)').exec(seatInfo)[0],
                        seat_position_floor: new RegExp('[0-9](?=층)').exec(seatInfo)[0],
                        seat_position_column: new RegExp('[가-힣](?=열)').exec(seatInfo)[0],
                        seat_position_row: new RegExp('[0-9]+$').exec(seatInfo)[0]
                    };
                    array.push(seat);
                }
            }
            console.log(array);
            done();
        }
    }
});

// Queue just one URL, with default callback
c.queue('http://admin.ticketpark.com/tims/GoodsInfo/Booking/BookingSeatDetailMap.asp?GoodsCode=17007474&PlaceCode=13811094&PlaySeq=001&SeatGrade=&Block=RGN001&TmgsOrNot=D2006&LocOfImage=&Tiki=N&UILock=Y&FullSeatView=');