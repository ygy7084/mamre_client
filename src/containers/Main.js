import React from 'react';
import FileDownload from 'react-file-download';

import style from '../main.css';

import {
    Header,
    Body,
    Left,
    Right,
    SmallModal,
    Pre_ticket,
    Buyers,
    LoaderModal,
    modalSVG,
    SVGM
} from '../components';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            theater : null,
            show : null,
            showtime : null,
            seats : [],
            seats_picked : [],
            times : [],
            time_picked : null,
            price_picked: null,
            buyers:[],
            buyers_picked : [],
            smallModalOn : false,
            buyerModalOn : false,
            preTicketModalOn : false,
            loaderModalOn : false,
            loaderModalTitle : '',
            allTickets:false
        };
        this.datePick = this.datePick.bind(this);
        this.timePick = this.timePick.bind(this);
        this.loadSeats = this.loadSeats.bind(this);
        this.changePriceOn = this.changePriceOn.bind(this);
        this.changePrice = this.changePrice.bind(this);
        this.changePriceAll = this.changePriceAll.bind(this);
        this.findBuyers = this.findBuyers.bind(this);
        this.preTicketting = this.preTicketting.bind(this);
        this.preTickettingWithoutSeats = this.preTickettingWithoutSeats.bind(this);
        this.ticketting = this.ticketting.bind(this);
        this.pickSeat = this.pickSeat.bind(this);
        this.seats_reset = this.seats_reset.bind(this);
        this.chooseCustomer = this.chooseCustomer.bind(this);
        this.InfoOfSelectedSeats = this.InfoOfSelectedSeats.bind(this);
        this.preTicketOn = this.preTicketOn.bind(this);
        this.ticketExcel = this.ticketExcel.bind(this);
        this.getAllExcel = this.getAllExcel.bind(this);
    }
    componentDidMount() {
        let theater,show,showtime;
        this.setState({
            loaderModalOn:true,
            loaderModalTitle:'소월아트홀 - 옥토넛'
        });
        fetch('/api/theater/read',{
            method : 'GET'
        })
            .then(res =>{
                if(res.ok)
                    return res.json();
                else
                    return res.json().then(err => { throw err; })})
            .then(res => {
                for(let t of res.data)
                    if(t.name==='소월아트홀') {
                        theater = t;
                        break;
                    }

                fetch('/api/show/read',{
                    method : 'GET'
                })
                    .then(res =>{
                        if(res.ok)
                            return res.json();
                        else
                            return res.json().then(err => { throw err; })})
                    .then(res => {
                        for(let s of res.data)
                            if(s.name==='옥토넛') {
                                show = s;
                                break;
                            }

                        fetch('/api/showtime/read',{
                            method : 'GET'
                        })
                            .then(res =>{
                                if(res.ok)
                                    return res.json();
                                else
                                    return res.json().then(err => { throw err; })})
                            .then(res => {
                                for(let st of res.data)
                                    if(st.theater === theater._id && st.show === show._id) {
                                        showtime = st;
                                        break;
                                    }
                                this.setState({
                                    theater:theater,
                                    show:show,
                                    showtime:showtime,
                                    loaderModalOn:false
                                });
                            })
                            .catch((err) => {
                                let message = err;
                                if(err.message && err.message!=='')
                                    message = err.message;
                                console.log(message);
                            });
                    })
                    .catch((err) => {
                        let message = err;
                        if(err.message && err.message!=='')
                            message = err.message;
                        console.log(message);
                    });


            })
            .catch((err) => {
                let message = err;
                if(err.message && err.message!=='')
                    message = err.message;
                console.log(message);
            });
    }
    chooseCustomer(mode, customers) {
        if(mode==='preTicket')
            this.preTickettingWithoutSeats(customers);
        else
            this.setState({
                buyers_picked: customers,
            });
    }
    seats_reset() {
        if(this.state.seats_picked && this.state.seats_picked.length)
            this.setState({
                seats_picked : [],
                price_picked : null,
            });
        else
            this.setState({
                seats_picked: [],
                price_picked: null,
                buyers: [],
                buyers_picked: [],
            });
    }
    // groupTicketting() {
    //
    // }
    // preTicketting2() {
    //
    // }
    // pretickettingWithoutBuyer(){
    //
    // }
    // tickettingWithoutBuyer() {
    //
    // }
    preTicketting(source, group_name, price) {
        let data = [];
            for(let p of this.state.seats_picked) {
            let reservation = {
                input_date: new Date(),
                source : source,
                group_name: group_name ? group_name : undefined,
                customer_name:  null,
                customer_phone: null,
                show_date: this.state.time_picked,
                seat_class: p.seat_class,
                seat_position: {
                    floor : p.floor,
                    col : p.col,
                    num : p.num
                },
                ticket_quantity: 1,
                ticket_price: price ? parseInt(price) : parseInt(p.price),
                theater: this.state.theater._id,
                show: this.state.show._id
            };
            data.push(reservation);
        }
        this.setState({
            loaderModalOn:true,
            loaderModalTitle:'발권 중'
        });
        let wrapper = {
            data : data
        };
        return fetch('/api/reservation/createMany',{
            method : 'POST',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify(wrapper)
        })
            .then(res =>{
                if(res.ok)
                    return res.json();
                else
                    return res.json().then(err => { throw err; })})
            .then(res => {
                //
                let wrapper = {
                    data : data,
                    combine :false
                };
                // fetch('http://localhost:8081/ticket', {
                //     method:'POST',
                //     headers:{'Content-Type':'application/json'},
                //     body:JSON.stringify(wrapper)
                // })
                //     .then((res) => res.json())
                //     .then((res)=>{
                //         this.loadSeats(this.state.time_picked);
                // });
                //
                this.loadSeats(this.state.time_picked);
            })
            .catch((err) => {
                let message = err;
                if(err.message && err.message!=='')
                    message = err.message;
                console.log(message);
            });
    }
    preTickettingWithoutSeats(buyers_picked) {
        if(!buyers_picked)
            return null;
        else {
            // let buyers_picked = JSON.parse(JSON.stringify(buyers_picked));
            let data = [];

            for(let buyer of buyers_picked) {
                let reservation = {
                    _id:buyer._id,
                    printed: true
                };
                data.push(reservation);
            }

            this.setState({
                loaderModalOn: true,
                loaderModalTitle: '발권 중'
            });
            let wrapper = {
                data : data
            };
            return fetch('/api/reservation/ticketting', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(wrapper)
            })
                .then(res => {
                    if (res.ok)
                        return res.json();
                    else
                        return res.json().then(err => {
                            throw err;
                        })
                })
                .then(res => {
                    this.loadSeats(this.state.time_picked);
                })
                .catch((err) => {
                    let message = err;
                    if (err.message && err.message !== '')
                        message = err.message;
                    console.log(message);
                });
        }
    }
    ticketting(source) {
        let seats_picked = JSON.parse(JSON.stringify(this.state.seats_picked));
        let buyers_picked = JSON.parse(JSON.stringify(this.state.buyers_picked));
        let data = [];
        for (let seat of seats_picked) {
            for(let buyer of buyers_picked) {
                if(!buyer.seat_position && seat.seat_class===buyer.seat_class) {
                    buyer.seat_position = {
                        floor:seat.floor,
                        col:seat.col,
                        num:seat.num
                    };
                    break;
                }
            }
        }


        for(let buyer of buyers_picked) {
            let reservation = {
                _id:buyer._id,
                source:source,
                input_date: new Date(),
                seat_position: buyer.seat_position,
                printed: true,
                show_date:this.state.time_picked,
                seat_class:buyer.seat_class,
                seat_price:buyer.seat_price,
            };
            data.push(reservation);
        }

        this.setState({
            loaderModalOn: true,
            loaderModalTitle: '발권 중'
        });
        let wrapper = {
            data : data
        };
        return fetch('/api/reservation/ticketting', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(wrapper)
        })
            .then(res => {
                if (res.ok)
                    return res.json();
                else
                    return res.json().then(err => {
                        throw err;
                    })
            })
            .then(res => {
                this.loadSeats(this.state.time_picked);
            })
            .catch((err) => {
                let message = err;
                if (err.message && err.message !== '')
                    message = err.message;
                console.log(message);
            });
    }
    findBuyers(phoneNumber) {
        this.setState({
            seats_picked: [],
            price_picked: null,
            buyers: [],
            buyers_picked: [],
            loaderModalOn:true,
            loaderModalTitle:'검색 중'
        });
        fetch('/api/reservation/read/theater/'+this.state.theater._id+'/show/'+this.state.show._id+'/date/'+this.state.time_picked,{
            method : 'GET'
        })
            .then(res =>{
                if(res.ok)
                    return res.json();
                else
                    return res.json().then(err => { throw err; })})
            .then(res => {
                let buyers = [];
                console.log("BUYERS");
                console.log(res.data);
                for(let r of res.data) {
                    if (phoneNumber === r.customer_phone && !r.printed)
                        buyers.push(r);
                }
                this.setState({
                    buyers:buyers,
                    loaderModalOn:false,
                    buyerModalOn:true});
            })
            .catch((err) => {
                let message = err;
                if(err.message && err.message!=='')
                    message = err.message;
                console.log(message);
            });


    }
    changePriceOn(seat) {
        this.setState({
            price_picked:seat,
            smallModalOn:true
        });
    }
    changePrice(price) {
        let seats_picked = this.state.seats_picked;
        let price_picked = this.state.price_picked;
        for(let i in seats_picked) {
            if(seats_picked[i] === price_picked) {
                this.setState((state) => {
                    state.seats_picked[i].price = price;
                    state.smallModalOn = false;
                });
                return;
            }
        }
        this.setState({
            smallModalOn : false
        });
    }
    changePriceAll(ratio) {
        let seats_picked = JSON.parse(JSON.stringify(this.state.seats_picked));
        for(let seat of seats_picked) {
            if ( seat.seat_class === 'VIP')
                seat.price = 50000*ratio;
            else if(seat.seat_class === 'R')
                seat.price = 40000*ratio;
        }
        this.setState({
            seats_picked:seats_picked,
            smallModalOn:false
        });
    }
    preTicketOn(){
        if(this.state.seats_picked && this.state.seats_picked.length)
            this.setState({
                preTicketModalOn : true
            })
    }
    datePick(date) {
        /*
            날짜 선택
         */

        // 공연 스케쥴
        let schedules = this.state.showtime.schedule;

        // 선택한 날짜에 이뤄지는 공연의 스케쥴을 불러온다.
        // times에는 시간 정보 뿐 아니라 날짜 정보도 있는 Date 객체를 저장한다.
        let times = [];
        for(let s of schedules) {
            let schedule_date = new Date(s.date);
            if( schedule_date.toLocaleDateString() === date.toLocaleDateString())
                times.push(schedule_date);
        }

        // 공연 시간 로드 및 좌석, 구매자 정보 초기화
        this.setState({
            times : times,
            seats:[],
            seats_picked:[],
            time_picked : null,
            price_picked: null,
            buyers:[],
            buyers_picked : [],
        });

        //선택한 날짜와 시간에 공연 스케쥴 존재 시 첫째 공연 스케쥴 자동 선택
        if(times.length>0)
            this.timePick(times[0].getTime());
    }
    timePick(time) {
        this.loadSeats(time);
    }
    loadSeats(time) {

        this.setState({
            loaderModalOn:true,
            loaderModalTitle:new Date(time).toLocaleString()
        });

        return fetch('/api/seats/showtime/'+this.state.showtime._id+'/date/'+time,{
            method : 'GET'
        })
            .then(res =>{
                if(res.ok)
                    return res.json();
                else
                    return res.json().then(err => { throw err; })})
            .then(res => {
                /*
                가격 정보를 저장한다.
                 */
                for(let seat of res.data.not_reserved_seats) {
                    if(seat.seat_class==='VIP')
                        seat.price = 50000;
                    else if(seat.seat_class==='R')
                        seat.price = 40000;
                    else
                        throw new Error('좌석 등급을 식별할 수 없습니다. - '+seat.seat_class);
                }
                console.log(res);
                this.setState({
                    time_picked:time,
                    seats:res.data.not_reserved_seats,
                    seats_picked:[],
                    price_picked: null,
                    buyers: [],
                    buyers_picked: [],
                    loaderModalOn:false
                });
            })
            .catch((err) => {
                let message = err;
                if(err.message && err.message!=='')
                    message = err.message;
                console.log(message);
            });
    }
    pickSeat(seats) {
        let seats_picked = JSON.parse(JSON.stringify(this.state.seats_picked));

        if(Array.isArray(seats)) {
            let seats_cleaned = [];
            for(let s of seats) {
                let temp = true;
                for(let s2 of seats_picked) {
                    if (s.floor === s2.floor && s.col === s2.col && s.num === s2.num){
                        temp = false;
                        break;
                    }
                }
                if(temp===true)
                    seats_cleaned.push(s);
            }
            for(let i of seats_cleaned)
                seats_picked.push(i);

        }
        else {
            let seat = seats;
            let index = this.state.seats_picked.findIndex((s) => {
                if (s.x === seat.x && s.y === seat.y)
                    return true;
            });

            if(index>-1)
                seats_picked.splice(index,1);
            else {
                console.log('original seat');
                console.log(seat);
                seats_picked.push(seat);
            }
        }
        /*
        좌석의 기본 정보를 직접 변경하지 않는다.
        기본 정보는 보존한다.
         */
        this.setState({seats_picked:JSON.parse(JSON.stringify(seats_picked))});
    }
    InfoOfSelectedSeats(){

        /*
         좌석이 로드 되어 있지 않거나 사용가능한 좌석이 없을 경우
         */

        if( !this.state.seats ||
            !this.state.seats.length)
            return {
                OK: false
            };
        else {
            //옮겨야해
            let numOfVIP = 0;
            let numOfR = 0;
            for(let s of this.state.seats_picked) {
                if(s.seat_class==="VIP")
                    numOfVIP++;
                else if(s.seat_class==="R")
                    numOfR++;
            }

            if(this.state.buyers_picked && this.state.buyers_picked.length) {
                let numOfVIP_buyers = 0;
                let numOfR_buyers = 0;
                for(let s of this.state.buyers_picked) {
                    if(!s.seat_position) {
                        if (s.seat_class === "VIP")
                            numOfVIP_buyers++;
                        else if (s.seat_class === "R")
                            numOfR_buyers++;
                    }
                }
                let errOfVIP = numOfVIP_buyers-numOfVIP;
                let errOfR   = numOfR_buyers-numOfR;

                return {
                    numOfVIP : numOfVIP,
                    numOfR : numOfR,
                    numOfVIP_buyers : numOfVIP_buyers,
                    numOfR_buyers : numOfR_buyers,
                    errOfVIP : errOfVIP,
                    errOfR : errOfR,
                    OK : errOfVIP===0 && errOfR===0
                }
            }
            else
                return {
                    numOfVIP : numOfVIP,
                    numOfR : numOfR,
                    OK : this.state.seats_picked && this.state.seats_picked.length!==0
                };
        }
    }
    ticketExcel(source, price) {
        let data = [];
        for(let p of this.state.seats_picked) {
            let reservation = {
                source: source,
                show_date: this.state.time_picked,
                seat_class: p.seat_class,
                seat_position: {
                    col: p.col,
                    num: p.num
                },
                ticket_quantity: 1,
                ticket_price: price ? parseInt(price) : parseInt(p.price),
            };
            data.push(reservation);
        }
        let wrapper = {
            data : data
        };
        return fetch('/api/excel/ticketExcel',{
            method : 'POST',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify(wrapper)
        })  .then(res=> res.blob())
            .then((blob) => {
                FileDownload(blob, 'tickets.xlsx');
            })
            .catch((err) => {
                let message = err;
                if(err.message && err.message!=='')
                    message = err.message;
                console.log(message);
            });
    }
    getAllExcel() {
        return fetch('/api/excel/showtime/'+this.state.showtime._id+'/date/'+this.state.time_picked,{
            method : 'GET'
        })
            .then(res=> res.blob())
            .then((blob) => {
                FileDownload(blob, 'reservations.xlsx');
            })
            .catch((err) => {
                let message = err;
                if(err.message && err.message!=='')
                    message = err.message;
                console.log(message);
            });
    }
    render() {
        return (
            <div>
                <Header
                    title={'바다 탐험대 옥토넛'}
                    onDatePick={this.datePick}
                    onTimePick={this.timePick}
                    Times={this.state.times}/>
                <Body>
                    <Left
                        seats_picked={this.state.seats_picked}
                        seats = {this.state.seats}
                        pickSeat = {this.pickSeat}
                        backgroundSize = {{width:650,height:650}}/>
                    <Right
                        findBuyers={this.findBuyers}
                        buyers_picked={this.state.buyers_picked}
                        seats_picked={this.state.seats_picked}
                        changePriceOn={this.changePriceOn}
                        resetSeats={this.seats_reset}
                        ticketting={this.ticketting}
                        preTicketting={this.preTicketting}
                        seatsInfo={this.InfoOfSelectedSeats()}
                        preTicketOn={this.preTicketOn}
                        IsSeatsLoaded={this.state.seats}/>

                </Body>
                <Pre_ticket
                    preTicketting={this.preTicketting}
                    ticketExcel={this.ticketExcel}
                    on={this.state.preTicketModalOn}
                    onClose={(e) => {
                        this.setState({preTicketModalOn: false})
                    }}/>
                <Buyers
                    chooseCustomers={this.chooseCustomer}
                    data={this.state.buyers}
                    on={this.state.buyerModalOn}
                    onClose={(e)=>{this.setState({buyerModalOn:false})}}/>
                <SmallModal
                    on={this.state.smallModalOn}
                    onClose={(e)=>{this.setState({smallModalOn:false})}}
                    price_picked={this.state.price_picked}
                    changePrice={this.changePrice}
                    changePriceAll={this.changePriceAll}
                    basePrice={this.state.price_picked ?
                        this.state.price_picked.seat_class==='VIP' ? 50000 : 40000
                        : 0}/>
                <LoaderModal
                    on={this.state.loaderModalOn}
                    title={this.state.loaderModalTitle}/>





                <button className="btn btn-info" style={{position:'absolute',top:'800px'}} onClick={this.getAllExcel}>엑셀 전부 얻기 테스트</button>






            </div>
        )
    }
}

export default Main;