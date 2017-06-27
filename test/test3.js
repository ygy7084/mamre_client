var Crawler = require("crawler");

var c = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            console.log($(".stySeat"));
        }
        done();
    }
});

// Queue just one URL, with default callback
c.queue('http://admin.ticketpark.com/tims/GoodsInfo/Booking/BookingSeatDetailMap.asp?GoodsCode=17007474&PlaceCode=13811094&PlaySeq=001&SeatGrade=&Block=RGN001&TmgsOrNot=D2006&LocOfImage=&Tiki=N&UILock=Y&FullSeatView=');