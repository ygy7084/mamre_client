var page = require('webpage').create();
page.onConsoleMessage = function(msg) {
    console.log('Page title is ' + msg);
};
page.open('http://admin.ticketpark.com/tims/GoodsInfo/Booking/BookingSeatDetailMap.asp?GoodsCode=17007474&PlaceCode=13811094&PlaySeq=002&SeatGrade=&Block=RGN001&TmgsOrNot=D2006&LocOfImage=&Tiki=N&UILock=Y&FullSeatView=', function(status) {
    page.evaluate(function() {
        console.log(document);
    });
    phantom.exit();
});