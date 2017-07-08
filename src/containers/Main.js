import React from 'react';

import style from '../main.css';

import {
    Header,
    Body,
    Left,
    Right,
} from '../components';
import {
    SmallModal,
    Pre_ticket,
    Buyers
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
            findBuyers_input :'',
            buyers:[],
            buyers_picked : [],
            buyers_picked_mode : null
        };
        this.datePick = this.datePick.bind(this);
        this.timePick = this.timePick.bind(this);
        this.loadSeats = this.loadSeats.bind(this);
        this.changePriceOn = this.changePriceOn.bind(this);
        this.changePrice = this.changePrice.bind(this);
        this.findBuyers = this.findBuyers.bind(this);
        this.findBuyers_onInput = this.findBuyers_onInput.bind(this);
        this.preTicketting = this.preTicketting.bind(this);
        this.ticketting = this.ticketting.bind(this);
        this.pickSeat = this.pickSeat.bind(this);
        this.seats_reset = this.seats_reset.bind(this);
        this.chooseCustomer = this.chooseCustomer.bind(this);
        this.checkSelectedSeats = this.checkSelectedSeats.bind(this);
    }
    chooseCustomer(mode, customers) {
        this.setState({
            buyers_picked : customers,
            buyers_picked_mode : mode
        })
        console.log(mode, customers);
    }
    seats_reset() {
        this.setState({
            seats_picked : [],
            price_picked : null,
            buyers : [],
            findBuyers_input :'',
            buyers_picked : [],
            buyers_picked_mode : null
        })
    }
    preTicketting(source, price) {
        let data = [];
        for(let p of this.state.seats_picked) {
            let reservation = {
                input_date: new Date(),
                source: source,
                customer_name: null ,
                customer_phone: null,
                show_date: this.state.schedule_picked,
                seat_class: p.seat_class,
                seat_position: {
                    floor : p.floor,
                    col : p.col,
                    num : p.num
                },
                ticket_quantity: 1,
                ticket_price: parseInt(price),
                theater: this.state.theater._id,
                show: this.state.show._id
            };
            data.push(reservation);
        }
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
    ticketting() {
        if(this.checkSelectedSeats()===false) {
            console.log('불합격');
            return
        }

        let data = [];
        for(let p of this.state.seats_picked) {
            let reservation = {
                input_date: new Date(),
                customer_name: p.customer_name ? p.customer_name : null ,
                customer_phone: p.customer_phone ? p.customer_phone : null,
                show_date: this.state.schedule_picked,
                seat_class: p.seat_class,
                seat_position: {
                    floor : p.floor,
                    col : p.col,
                    num : p.num
                },
                ticket_quantity: 1,
                ticket_price: p.price,
                theater: this.state.theater._id,
                show: this.state.show._id,
                print : true
            };
            data.push(reservation);
        }
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
                        console.log(res.data);
            })
            .catch((err) => {
                let message = err;
                if(err.message && err.message!=='')
                    message = err.message;
                console.log(message);
            });
    }
    findBuyers() {
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
                for(let r of res.data) {
                    if (this.state.findBuyers_input === r.customer_phone && !r.print)
                        buyers.push(r);
                }
                this.setState({buyers:buyers});
                $('#Buyers').modal('show');

            })
            .catch((err) => {
                let message = err;
                if(err.message && err.message!=='')
                    message = err.message;
                console.log(message);
            });


    }
    findBuyers_onInput(e) {
        this.setState({
            findBuyers_input : e.target.value
        });
    }
    changePriceOn(seat) {
        this.setState({
            price_picked:seat
        });
        $('#SmallModal').modal('show');
    }
    changePrice(e) {
        let price = e.target.value;
        if(e.target.value === '선택') {
            return;
        }
        let seats_picked = this.state.seats_picked;
        let price_picked = this.state.price_picked;
        for(let i in seats_picked) {
            if(seats_picked[i] === price_picked) {
                this.setState((state) => {
                    state.seats_picked[i].price = price;
                });
                $('#SmallModal').modal('hide');
                return;
            }
        }
    }
    componentWillMount() {
        let theater,show,showtime;

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
                                    showtime:showtime
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
    componentDidMount(){
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
            seats_picked :[]
        });
        if(times.length>0) {
            this.setState({schedule_picked:times[0]});
            this.loadSeats(times[0]);
        }
    }
    timePick(time) {
        this.setState({
            seats_picked :[]
        });
        for(let t of this.state.times) {
            if(t.toLocaleTimeString() === time) {
                this.setState({schedule_picked:t});
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
        return fetch('/api/seats/showtime/'+data.showtime+'/date/'+new Date(data.date).getTime(),{
            method : 'GET'
        })
            .then(res =>{
                if(res.ok)
                    return res.json();
                else
                    return res.json().then(err => { throw err; })})
            .then(res => {
                this.setState({
                    seats:res.data.not_reserved_seats,
                    seats_picked:[]
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
            console.log(seats);
            let seats_cleaned = [];
            for(let s of seats) {
                let temp = true;
                for(let s2 of seats_picked) {
                    if (s.floor === s2.floor && s.col === s2.col && s.num === s2.num){
                        temp = false;
                        break;
                        console.log('같아')
                        console.log(s2);
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
            else
                seats_picked.push(seat);
        }
        console.log('seats_picked')
        console.log(seats_picked);
        this.setState({seats_picked:seats_picked});
    }

    checkSelectedSeats(){

        let seatsNumber;
        let seatsNumber_moreInfo;
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
                    if(s.source!=='인터파크') {
                        if (s.seat_class === "VIP")
                            numOfVIP_buyers++;
                        else if (s.seat_class === "R")
                            numOfR_buyers++;
                    }
                }
                let VIP = numOfVIP_buyers-numOfVIP;
                let R   = numOfR_buyers-numOfR;
                if(VIP===0 && R===0)
                    return true;
                else
                    return false;
            }
        }
    }
    render() {
        let tableFooter = null;
        if(this.state.seats_picked.length) {
            let sum = 0;
            for(let i of this.state.seats_picked) {
                if(!i['price']){
                    if(i.seat_class==='VIP')
                        i['price'] = 50000;
                    else if(i.seat_class==='R')
                        i['price'] = 40000;
                }
                sum += parseInt(i['price']);
            }
            tableFooter = (
                <div className="finalrow">
                    <div className="finalrow_label" >합계</div>
                    <div className="finalrow_value" >{sum}</div>
                </div>
            )
        }

        let smallModal = <SmallModal/>
        if(this.state.price_picked) {
            let basePrice = this.state.price_picked.seat_class==='VIP' ? 50000 : 40000;
            smallModal = (
                <SmallModal title={
                    this.state.price_picked.col + '열 ' +
                    this.state.price_picked.num + '번 좌석의 가격을 변경합니다.'}>
                    <div>
                        <h3>현재 해당
                            좌석은 {this.state.price_picked.seat_class}, {this.state.price_picked.price}원입니다.</h3>
                        <select onChange={this.changePrice} defaultValue={'선택'} className="form-control">
                            <option>선택</option>
                            <option value={basePrice}>기본 가격 : {basePrice}</option>
                            <option value={basePrice * 0.5}>50% 할인권 : {basePrice * 0.5}</option>
                            <option value={basePrice * 0.5}>장애인, 국가 유공자 : {basePrice * 0.5}</option>
                            <option value={0}>초대권 : 0</option>
                        </select>
                    </div>
                </SmallModal>
            );
        }

        let summary = null;
        if(this.state.buyers_picked.length!==0) {
            summary = (
               <table className='table table-condensed table-hover'>
                     <thead>
                    <tr className='tableheader'>
                        <th>번호</th>
                        <th>구매처</th>
                        <th>이름</th>
                        <th>좌석등급</th>
                        <th>좌석번호</th>
                        <th>티켓번호</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.buyers_picked.map((buyer, index)=> {
                            return(
                                <tr key={index}>
                                    <td>{index+1}</td>
                                    <td>{buyer.source}</td>
                                    <td>{buyer.customer_name}</td>
                                    <td>{buyer.seat_class}</td>
                                    <td>{buyer.seat_position ?
                                        buyer.seat_position.col+'열 '+
                                        buyer.seat_position.num+'번' : '미배정'}</td>
                                    <td>{buyer.ticket_code}</td>
                                </tr>
                            )
                        })
                    }

                    </tbody>
                </table>
            );
        }

        let seatsNumber;
        let seatsNumber_moreInfo;
        if(this.state.seats.length!==0) {
            let numOfVIP = 0;
            let numOfR = 0;
            for(let s of this.state.seats_picked) {
                if(s.seat_class==="VIP")
                    numOfVIP++;
                else if(s.seat_class==="R")
                    numOfR++;
            }
            seatsNumber = (
                    <h4 style={{margin:'5px'}}>
                        {this.state.seats_picked.length+"개 선택 ( VIP : "+parseInt(numOfVIP)+"석 R : "+parseInt(numOfR)+"석 )"}</h4>
            );
            if(this.state.buyers_picked && this.state.buyers_picked.length) {
                let numOfVIP_buyers = 0;
                let numOfR_buyers = 0;
                for(let s of this.state.buyers_picked) {
                    if(s.source!=='인터파크') {
                        if (s.seat_class === "VIP")
                            numOfVIP_buyers++;
                        else if (s.seat_class === "R")
                            numOfR_buyers++;
                    }
                }
                let VIP = numOfVIP_buyers-numOfVIP;
                let R   = numOfR_buyers-numOfR;
                seatsNumber_moreInfo = (
                    <h6 style={{margin:'5px',color:'red'}}>
                        {VIP>0 ? 'VIP '+VIP+'석 추가 필요, ':VIP<0 ? 'VIP '+Math.abs(VIP)+'석 초과' : null }
                        {R>0 ? 'R '+R+'석 추가 필요, ':R<0 ? 'R '+Math.abs(R)+'석 초과' : null }
                    </h6> );
            }
        }
        return (
            <div>
                <Header title={'바다 탐험대 옥토넛'}/>
                <Body>
                    <Left
                        onDatePick={this.datePick}
                        onTimePick={this.timePick}
                        Times={this.state.times}
                        seats_picked={this.state.seats_picked}
                        seats = {this.state.seats}
                        pickSeat = {this.pickSeat}
                        imageSize = {{width:550,height:550}}/>

                    <div className='right' style={{width:'40%', display:'inline-block'}}>
                        <div className='right-wrapper'>
                            <div className='phone-wrapper'>
                                <div className='phonelabel'>
                                    <b>전화번호 뒷자리</b>
                                </div>
                                <div className="input-group">
                                    <input type="text" className="form-control phoneinput" onChange={this.findBuyers_onInput} value={this.state.findBuyers_input} />
                                    <span className="input-group-btn">
                                        <button className="btn btn-primary" style={{background: 'rgb(35,57,119)'}} type="button" onClick={this.findBuyers}>검색</button>
                                    </span>
                                </div>
                            </div>

                            <div className='summary'>
                                {summary}
                            </div>
                            <div className="seatnum_wrapper">
                                <div className="seatnum_label">
                                    <h4 style={{margin:'5px'}}>좌석수</h4>
                                </div>
                                <div className="seatnum_output">
                                    {seatsNumber}
                                    {seatsNumber_moreInfo}
                                </div>
                            </div>
                            <div>
                                <table className='table table-condensed table-hover'>
                                    <thead>
                                    <tr className='tableheader'>
                                        <th>번호</th>
                                        <th>좌석등급</th>
                                        <th>좌석번호</th>
                                        <th>가격</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        this.state.seats_picked.map((seat, index)=> {
                                            return(
                                                <tr key={index}>
                                                    <td>{index+1}</td>
                                                    <td>{seat.seat_class}</td>
                                                    <td>{seat.col+'열 '+seat.num+'번 '}</td>
                                                    <td><a href='#' onClick={() => {this.changePriceOn(seat)}}>{seat.price}</a></td>
                                                </tr>
                                            )
                                        })
                                    }

                                    </tbody>
                                </table>
                                {tableFooter}
                            </div>
                            <div>
                                <button style={{marginRight:'5px'}} className="btn btn-primary re" onClick={this.seats_reset}>다시선택</button>
                                <button style={{marginRight:'5px'}} className="btn btn-primary pre" onClick={(e) => {
                                    $('#Pre_ticket').modal('show');
                                }}>사전발권</button>
                                <button className="btn btn-primary now" onClick={this.ticketting}>발권</button>
                            </div>
                        </div>
                    </div>
                </Body>
                <Pre_ticket preTicketting={this.preTicketting} />
                <Buyers chooseCustomers={this.chooseCustomer} data={this.state.buyers}/>
                {smallModal}
            </div>
        )
    }
}

export default Main;