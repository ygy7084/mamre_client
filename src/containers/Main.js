import React from 'react';
import FileDownload from 'react-file-download';

import style from '../main.css';

import {
    Header,
    Body,
    Left,
    Right,
    PriceChangeModal,
    GroupTickettingModal,
    CustomerFindingModal,
    LoaderModal,
    ErrorModal
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
            customers:[],
            customers_picked : [],
            PriceChangeModal_on : false,
            CustomerFindingModal_on : false,
            GroupTickettingModal_on : false,
            LoaderModal_on : false,
            LoaderModal_title : '',
            ErrorModal_on : false,
            ErrorModal_title : '',
        };
        this.datePick = this.datePick.bind(this);
        this.timePick = this.timePick.bind(this);
        this.loadSeats = this.loadSeats.bind(this);
        this.changePriceOn = this.changePriceOn.bind(this);
        this.changePrice = this.changePrice.bind(this);
        this.changePriceAll = this.changePriceAll.bind(this);
        this.findCustomers = this.findCustomers.bind(this);
        this.preTicketting = this.preTicketting.bind(this);
        this.preTickettingWithoutSeats = this.preTickettingWithoutSeats.bind(this);
        this.ticketting = this.ticketting.bind(this);
        this.pickSeat = this.pickSeat.bind(this);
        this.seats_reset = this.seats_reset.bind(this);
        this.chooseCustomer = this.chooseCustomer.bind(this);
        this.InfoOfSelectedSeats = this.InfoOfSelectedSeats.bind(this);
        this.groupTickettingModal = this.groupTickettingModal.bind(this);
        this.ticketExcel = this.ticketExcel.bind(this);
        this.getAllExcel = this.getAllExcel.bind(this);
        this.groupTicketting = this.groupTicketting.bind(this);
    }
    componentDidMount() {
        let theater,show,showtime;
        this.setState({
            LoaderModal_on:true,
            LoaderModal_title:'소월아트홀 - 옥토넛'
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
                                    LoaderModal_on:false
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
                customers_picked: customers,
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
                customers: [],
                customers_picked: [],
            });
    }

    groupTicketting(group_name, price) {
        const data = [];
        const source = '단체';

        for(let p of this.state.seats_picked) {
            let reservation = {
                input_date: new Date(),
                source : source,
                group_name: group_name,
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
            LoaderModal_on:true,
            LoaderModal_title:'단체 발권 중'
        });
        let wrapper = {
            data : data
        };
        return fetch('/api/reservation/groupTicketting',{
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
                console.log(err);
                this.setState({
                    LoaderModal_on:false,
                    ErrorModal_on:true,
                    ErrorModal_title:message
                });
            });
    }
    // preTicketting2() {
    //
    // }
    // pretickettingWithoutCustomer(){
    //
    // }
    // tickettingWithoutCustomer() {
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
            LoaderModal_on:true,
            LoaderModal_title:'발권 중'
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
    preTickettingWithoutSeats(customers_picked) {
        if(!customers_picked)
            return null;
        else {
            // let customers_picked = JSON.parse(JSON.stringify(customers_picked));
            let data = [];

            for(let customer of customers_picked) {
                let reservation = {
                    _id:customer._id,
                    printed: true
                };
                data.push(reservation);
            }

            this.setState({
                LoaderModal_on: true,
                LoaderModal_title: '발권 중'
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
        let customers_picked = JSON.parse(JSON.stringify(this.state.customers_picked));
        let data = [];
        for (let seat of seats_picked) {
            for(let customer of customers_picked) {
                if(!customer.seat_position && seat.seat_class===customer.seat_class) {
                    customer.seat_position = {
                        floor:seat.floor,
                        col:seat.col,
                        num:seat.num
                    };
                    break;
                }
            }
        }


        for(let customer of customers_picked) {
            let reservation = {
                _id:customer._id,
                source:source,
                input_date: new Date(),
                seat_position: customer.seat_position,
                printed: true,
                show_date:this.state.time_picked,
                seat_class:customer.seat_class,
                seat_price:customer.seat_price,
            };
            data.push(reservation);
        }

        this.setState({
            LoaderModal_on: true,
            LoaderModal_title: '발권 중'
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
    findCustomers(phoneNumber) {
        this.setState({
            seats_picked: [],
            price_picked: null,
            customers: [],
            customers_picked: [],
            LoaderModal_on:true,
            LoaderModal_title:'검색 중'
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
                let customers = [];
                console.log("BUYERS");
                console.log(res.data);
                for(let r of res.data) {
                    if (phoneNumber === r.customer_phone && !r.printed)
                        customers.push(r);
                }
                this.setState({
                    customers:customers,
                    LoaderModal_on:false,
                    CustomerFindingModal_on:true});
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
            PriceChangeModal_on:true
        });
    }
    changePrice(price) {
        let seats_picked = this.state.seats_picked;
        let price_picked = this.state.price_picked;
        for(let i in seats_picked) {
            if(seats_picked[i] === price_picked) {
                this.setState((state) => {
                    state.seats_picked[i].price = price;
                    state.PriceChangeModal_on = false;
                });
                return;
            }
        }
        this.setState({
            PriceChangeModal_on : false
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
            PriceChangeModal_on:false
        });
    }
    groupTickettingModal(on){
        if(this.state.seats_picked && this.state.seats_picked.length && on)
            this.setState({
                GroupTickettingModal_on : true
            });
        else
            this.setState({
                GroupTickettingModal_on : false
            });
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
            customers:[],
            customers_picked : [],
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
            LoaderModal_on:true,
            LoaderModal_title:new Date(time).toLocaleString()
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
                    customers: [],
                    customers_picked: [],
                    LoaderModal_on:false
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

            if(this.state.customers_picked && this.state.customers_picked.length) {
                let numOfVIP_customers = 0;
                let numOfR_customers = 0;
                for(let s of this.state.customers_picked) {
                    if(!s.seat_position) {
                        if (s.seat_class === "VIP")
                            numOfVIP_customers++;
                        else if (s.seat_class === "R")
                            numOfR_customers++;
                    }
                }
                let errOfVIP = numOfVIP_customers-numOfVIP;
                let errOfR   = numOfR_customers-numOfR;

                return {
                    numOfVIP : numOfVIP,
                    numOfR : numOfR,
                    numOfVIP_customers : numOfVIP_customers,
                    numOfR_customers : numOfR_customers,
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
                        findCustomers={this.findCustomers}
                        customers_picked={this.state.customers_picked}
                        seats_picked={this.state.seats_picked}
                        changePriceOn={this.changePriceOn}
                        resetSeats={this.seats_reset}
                        ticketting={this.ticketting}
                        preTicketting={this.preTicketting}
                        seatsInfo={this.InfoOfSelectedSeats()}
                        groupTickettingModal={this.groupTickettingModal}
                        IsSeatsLoaded={this.state.seats}/>

                </Body>
                <GroupTickettingModal
                    groupTicketting={this.groupTicketting}
                    ticketExcel={this.ticketExcel}
                    on={this.state.GroupTickettingModal_on}
                    groupTickettingModal={this.groupTickettingModal}
                />
                <CustomerFindingModal
                    chooseCustomers={this.chooseCustomer}
                    data={this.state.customers}
                    on={this.state.CustomerFindingModal_on}
                    onClose={()=>{this.setState({CustomerFindingModal_on:false})}}/>
                <PriceChangeModal
                    on={this.state.PriceChangeModal_on}
                    onClose={()=>{this.setState({PriceChangeModal_on:false})}}
                    price_picked={this.state.price_picked}
                    changePrice={this.changePrice}
                    changePriceAll={this.changePriceAll}
                    basePrice={this.state.price_picked ?
                        this.state.price_picked.seat_class==='VIP' ? 50000 : 40000
                        : 0}/>
                <LoaderModal
                    on={this.state.LoaderModal_on}
                    title={this.state.LoaderModal_title}/>
                <ErrorModal
                    on={this.state.ErrorModal_on}
                    title={this.state.ErrorModal_title}
                    onClose={()=>{this.setState({ErrorModal_on:false})}}/>





                <button className="btn btn-info" style={{position:'absolute',top:'800px'}} onClick={this.getAllExcel}>엑셀 전부 얻기 테스트</button>






            </div>
        )
    }
}

export default Main;