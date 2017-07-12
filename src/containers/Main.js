import React from 'react';

import style from '../main.css';

import {
    Header,
    Body,
    Left,
    Right,
    SmallModal,
    Pre_ticket,
    Buyers,
    LoaderModal
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
            schedule_picked : null,
            price_picked: null,
            buyers:[],
            buyers_picked : [],
            buyers_picked_mode : null,
            smallModalOn : false,
            buyerModalOn : false,
            preTicketModalOn : false,
            loaderModalOn : false,
            loaderModalTitle : '',
        };
        this.datePick = this.datePick.bind(this);
        this.timePick = this.timePick.bind(this);
        this.loadSeats = this.loadSeats.bind(this);
        this.changePriceOn = this.changePriceOn.bind(this);
        this.changePrice = this.changePrice.bind(this);
        this.changePriceAll = this.changePriceAll.bind(this);
        this.findBuyers = this.findBuyers.bind(this);
        this.preTicketting = this.preTicketting.bind(this);
        this.ticketting = this.ticketting.bind(this);
        this.ticketting2 = this.ticketting2.bind(this);
        this.pickSeat = this.pickSeat.bind(this);
        this.seats_reset = this.seats_reset.bind(this);
        this.chooseCustomer = this.chooseCustomer.bind(this);
        this.InfoOfSelectedSeats = this.InfoOfSelectedSeats.bind(this);
        this.preTicketOn = this.preTicketOn.bind(this);
    }
    chooseCustomer(mode, customers) {
        if(mode==='preTicket') {
            this.ticketting2(customers);
        }
        this.setState({
            buyers_picked : customers,
            buyers_picked_mode : mode
        });
        console.log(mode, customers);
    }
    seats_reset() {
        if(this.state.seats_picked && this.state.seats_picked.length) {
            this.setState({
                seats_picked : [],
                price_picked : null,
            })
        }
        else {
            this.setState({
                seats_picked: [],
                price_picked: null,
                buyers: [],
                buyers_picked: [],
                buyers_picked_mode: null,
            });
        }
    }
    preTicketting(source, price) {
        console.log('프리티켓팅');
        let data = [];
        for(let p of this.state.seats_picked) {
            let reservation = {
                input_date: new Date(),
                source: source,
                customer_name: source? source : '현장발권' ,
                customer_phone: null,
                show_date: this.state.schedule_picked,
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
        return fetch('/api/reservation/createMany',{
            method : 'POST',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify(data)
        })
            .then(res =>{
                if(res.ok)
                    return res.json();
                else
                    return res.json().then(err => { throw err; })})
            .then(res => {
                this.loadSeats(this.state.schedule_picked);
            })
            .catch((err) => {
                let message = err;
                if(err.message && err.message!=='')
                    message = err.message;
                console.log(message);
            });
    }

    //인터파크, 쿠팡등 구매자들과 좌석을 연결해서 발권할 때
    ticketting() {
        console.log(this.InfoOfSelectedSeats());
        if( !this.InfoOfSelectedSeats().OK )
            return null;
        else {
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
                    input_date: new Date(),
                    seat_position: buyer.seat_position,
                    printed: true
                };
                data.push(reservation);
            }

            this.setState({
                loaderModalOn: true,
                loaderModalTitle: '발권 중'
            });
            return fetch('/api/reservation/ticketting', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
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
                    this.loadSeats(this.state.schedule_picked);
                })
                .catch((err) => {
                    let message = err;
                    if (err.message && err.message !== '')
                        message = err.message;
                    console.log(message);
                });
        }
    }

    //구매자 정하지 않거나 사전 발권시 입력한 정보로 구매할 때
    ticketting2(buyers_picked) {
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
            return fetch('/api/reservation/ticketting', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
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
                    this.loadSeats(this.state.schedule_picked);
                })
                .catch((err) => {
                    let message = err;
                    if (err.message && err.message !== '')
                        message = err.message;
                    console.log(message);
                });
        }
    }
    findBuyers(phoneNumber) {
        this.setState({
            seats_picked: [],
            price_picked: null,
            buyers: [],
            buyers_picked: [],
            buyers_picked_mode: null,
            loaderModalOn:true,
            loaderModalTitle:'검색 중'
        });
        fetch('/api/reservation/read/theater/'+this.state.theater._id+'/show/'+this.state.show._id+'/date/'+this.state.schedule_picked.getTime(),{
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
    datePick(date) {
        let schedule = this.state.showtime.schedule;
        let times = [];
        for(let s of schedule) {
            let schedule_date = new Date(s.date);
            if(
                schedule_date.getDate()===date.getDate() &&
                schedule_date.getFullYear()===date.getFullYear() &&
                schedule_date.getMonth()===date.getMonth()
            ) {
                times.push(schedule_date);
            }
        }
        this.setState({
            times : times,
        });
        if(times.length>0) {
            this.loadSeats(times[0]);
        }else {
            this.setState({
                seats:[],
                seats_picked:[],
            })
        }
    }
    timePick(time) {
        for(let t of this.state.times) {
            if(t.toLocaleTimeString() === time) {
                this.loadSeats(t);
                break;
            }
        }
    }
    loadSeats(date) {
        let data = {
            showtime : this.state.showtime._id,
            date : date
        };

        if(!this.state.loaderModalOn)
            this.setState({
                loaderModalOn:true,
                loaderModalTitle:date.toLocaleString()
            });

        return fetch('/api/seats/showtime/'+data.showtime+'/date/'+new Date(data.date).getTime(),{
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
                    schedule_picked:date,
                    seats:res.data.not_reserved_seats,
                    seats_picked:[],
                    price_picked: null,
                    buyers: [],
                    buyers_picked: [],
                    buyers_picked_mode: null,
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
        if(this.state.seats.length!==0) {
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
            else if(this.state.seats_picked && this.state.seats_picked.length)
                return {
                    numOfVIP : numOfVIP,
                    numOfR : numOfR,
                    OK : true
                };
            else
                return {
                    OK : false
                };
        } else
            return {
                OK : false
            }
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
                        ticketting2={this.ticketting2}
                        seatsInfo={this.InfoOfSelectedSeats()}
                        preTicketOn={this.preTicketOn}/>
                </Body>


                <Pre_ticket
                    preTicketting={this.preTicketting}
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


            </div>
        )
    }
}

export default Main;