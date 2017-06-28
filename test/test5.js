let fetch = require('isomorphic-fetch');
let data = {
    Flag : 'Blocking',
    GoodsCode : '17007474',
    PlaceCode : '13811094',
    PlaySeq : '002',
    SessionId :''
};
fetch('http://admin.ticketpark.com/tims/GoodsInfo/Booking/BookingSeatDetailMap.asp?GoodsCode=17007474&PlaceCode=13811094&PlaySeq=002&SeatGrade=&Block=RGN001&TmgsOrNot=D2006&LocOfImage=&Tiki=N&UILock=Y&FullSeatView=',{
    method : 'GET'
})
    .then(res => res)
    .then(res => {
        console.log(res.body);
    })
    .catch((err) => {
        console.log(err);
    });