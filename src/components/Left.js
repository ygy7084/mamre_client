import React from 'react';
import moment from 'moment';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

class Left extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            date:moment(),
            dragStart:{},
            seatMapCoords : []
        };
        this.datePicker_onChange = this.datePicker_onChange.bind(this);
        this.timePicker_onChange = this.timePicker_onChange.bind(this);
        this.canvas_onMouseDown  = this.canvas_onMouseDown.bind(this);
        this.canvas_onMouseUp    = this.canvas_onMouseUp.bind(this);
        this.canvas_onMouseOut   = this.canvas_onMouseOut.bind(this);
        this.canvasClick         = this.canvasClick.bind(this);
        this.collides            = this.collides.bind(this);
        this.clearSeats          = this.clearSeats.bind(this);
        this.drawSeats_picked    = this.drawSeats_picked.bind(this);
        this.drawSeats           = this.drawSeats.bind(this);

    }
    componentDidMount(){
        this.clearSeats().then(() => {
            this.drawSeats(this.props.seats);
        })
    }
    componentWillReceiveProps(nextProps){

        let added = true;
        for(let s of this.props.seats_picked) {
            let temp = false;
            for(let s2 of nextProps.seats_picked) {
                if(s.floor===s2.floor && s.col===s2.col && s.num===s2.num){
                    temp =true;
                    break;
                }
            }
            if(temp === false) {
                added = false;
                break;
            }
        }
        if(added && this.props.seats_picked.length && nextProps.seats_picked.length ) {
            this.drawSeats_picked(nextProps.seats_picked);
        }else {
            this.clearSeats().then(() => {
                this.drawSeats(nextProps.seats).then(() => {
                    this.drawSeats_picked(nextProps.seats_picked);
                });
            })
        }

    }
    datePicker_onChange(date) {
        this.props.onDatePick(date.toDate());
        this.setState({
            date:date
        })
    }
    timePicker_onChange(e) {
        this.props.onTimePick(e.target.value);
    }

    canvas_onMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.setState({
            dragStart:{
                x:Math.round((e.clientX - rect.left)/(rect.right-rect.left)*this.canvas.width), 
                y:Math.round((e.clientY - rect.top)/(rect.bottom-rect.top)*this.canvas.height)}

        });
    }
    canvas_onMouseUp(e) {
            const rect = this.canvas.getBoundingClientRect();
            let endCoords = {
                x: Math.round((e.clientX - rect.left) / (rect.right - rect.left) * this.canvas.width),
                y: Math.round((e.clientY - rect.top) / (rect.bottom - rect.top) * this.canvas.height)
            };
            if(!(Math.abs(endCoords.x-this.state.dragStart.x)<20 && Math.abs(endCoords.y-this.state.dragStart.y)<20)) {
                let draggedSeats = [];
                let dragStart = this.state.dragStart;
                let seats_picked = this.props.seats_picked;

                for (let s of this.state.seatMapCoords) {
                    let left = s.x;
                    let right = s.x + s.width;
                    let top = s.y;
                    let bottom = s.y + s.height;
                    let centerX = (left + right) / 2;
                    let centerY = (top + bottom) / 2;

                    if (( dragStart.x > centerX && centerX > endCoords.x &&
                        dragStart.y > centerY && centerY > endCoords.y )
                        ||
                        (dragStart.x > centerX && centerX > endCoords.x &&
                        dragStart.y < centerY && centerY < endCoords.y )
                        ||
                        (dragStart.x < centerX && centerX < endCoords.x &&
                        dragStart.y > centerY && centerY > endCoords.y )
                        ||
                        (dragStart.x < centerX && centerX < endCoords.x &&
                        dragStart.y < centerY && centerY < endCoords.y )) {

                        let index = seats_picked.findIndex((seat) => {
                            if (seat === s.seat)
                                return true;
                        });
                        if (index < 0)
                            draggedSeats.push(s.seat);
                    }
                }
                this.props.pickSeat(draggedSeats);

                this.setState({
                    dragStart:{},
                })
            }else {
                    let seat = this.collides(
                        endCoords.x,
                        endCoords.y);
                    if(seat)
                        this.props.pickSeat(seat.seat);
            }

    }
    canvas_onMouseOut(e) {
        this.setState({
            dragStart:{},
        })
    }
    canvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        let seat = this.collides(
            Math.round((e.clientX - rect.left)/(rect.right-rect.left)*this.canvas.width),
            Math.round((e.clientY - rect.top)/(rect.bottom-rect.top)*this.canvas.height));
        if(seat)
            this.props.pickSeat(seat.seat);
    }
    collides(x,y) {
        let collision = false;
        for(let s of this.state.seatMapCoords) {
            let left   = s.x;
            let right  = s.x+s.width;
            let top    = s.y;
            let bottom = s.y+s.height;
            if(right>x && left<x && bottom>y && top<y) {
                collision = s;
                break;
            }
        }
        return collision;
    }
    clearSeats() {
        return new Promise(
            (resolve, reject) => {
                const ctx = this.canvas.getContext('2d');
                ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
                resolve();
            });
    }

    drawSeats_picked(seats_picked) {
        return new Promise(
            (resolve, reject) => {
                if(this.state.seatMapCoords&& this.state.seatMapCoords.length) {
                    const ctx = this.canvas.getContext('2d');
                    const seat_R_select = new Image();
                    const seat_VIP_select = new Image();
                    seat_VIP_select.onload = () => {
                        seat_R_select.onload = () => {

                            let temps = this.state.seatMapCoords;
                            for (let seatMapCoord of temps)
                                for (let seat of seats_picked)
                                    if (seatMapCoord.seat.col === seat.col && seatMapCoord.seat.floor === seat.floor &&seatMapCoord.seat.num === seat.num) {
                                        if (seat.seat_class === 'VIP')
                                            ctx.drawImage(seat_VIP_select, seatMapCoord.x, seatMapCoord.y, seatMapCoord.width, seatMapCoord.height);
                                        else if (seat.seat_class === 'R')
                                            ctx.drawImage(seat_R_select, seatMapCoord.x, seatMapCoord.y, seatMapCoord.width, seatMapCoord.height);
                                        break;
                                    }
                            resolve();
                        };
                    };
                    seat_VIP_select.src = '/images/seat_VIP_select.png';
                    seat_R_select.src = '/images/seat_R_select.png';
                }
            });
    }
    drawSeats(seats) {

        return new Promise(
            (resolve, reject) => {
                const background = new Image();
                const ctx = this.canvas.getContext('2d');

                background.onload = () => {
                    ctx.drawImage(background, 0, 0, this.props.imageSize.width, this.props.imageSize.height);
                    if (!seats || seats.length === 0)
                        return;
                    else {
                        const seatMapCoords = [];

                        const Xratio = this.props.imageSize.width / background.width;
                        const Yratio = this.props.imageSize.height / background.height;

                        const seat_R_avail = new Image();
                        const seat_VIP_avail = new Image();
                        seat_VIP_avail.onload = () => {
                            seat_R_avail.onload = () => {
                            const newWidth = seat_VIP_avail.width * Xratio;
                            const newHeight = seat_VIP_avail.height * Yratio;

                            const ratio = this.props.imageSize.width / 670;
                            //670은 좌석 이미지 좌표잡을 때 기준으로 했던 배경 이미지 가로 사이즈

                            for (let seat of seats) {
                                let seatMapCoord = {
                                    x: seat.x * ratio,
                                    y: seat.y * ratio,
                                    width: newWidth,
                                    height: newHeight,
                                    seat: seat,
                                    // price : 50000
                                };
                                if (seat.seat_class === 'VIP')
                                    ctx.drawImage(seat_VIP_avail, seatMapCoord.x, seatMapCoord.y, newWidth, newHeight);
                                else if (seat.seat_class === 'R')
                                    ctx.drawImage(seat_R_avail, seatMapCoord.x, seatMapCoord.y, newWidth, newHeight);

                                seatMapCoords.push(seatMapCoord);
                            }

                            this.setState({
                                seatMapCoords : seatMapCoords
                            });
                            this.drawSeats_picked(seatMapCoords);
                            resolve();
                        };
                    };
                    seat_VIP_avail.src = '/images/seat_VIP_avail.png';
                    seat_R_avail.src = '/images/seat_R_avail.png';
                };
            };
            background.src = '/images/seats_base.png';
        })
    }
    render() {
        return (
            <div style={style.left}>
                <div style={style.leftWrapper}>
                    <div style={style.datetimeWrapper}>
                        <div style={style.dateLabel}>
                            <b>공연일자</b>
                        </div>
                        <div style={style.date}>
                            <DatePicker selected={this.state.date} onChange={this.datePicker_onChange}/>
                        </div>
                        <div style={style.timeLabel}>
                            <b>공연회차</b>
                        </div>
                        <div style={style.time}>
                            <select style={style.timeSelect} className='form-control' onChange={this.timePicker_onChange}>
                                {
                                    this.props.Times ?
                                    this.props.Times.map((t) => {
                                        return <option key={t.toString()}>{t.toLocaleTimeString()}</option>
                                    })
                                        :
                                    null
                                }
                            </select>
                        </div>
                    </div>
                    <div>
                        <div style={style.seatsLabel}>
                            <h4>좌석배치도</h4>
                        </div>
                        <canvas 
                            onSelect={(e) =>{e.preventDefault();return false;}} 
                            onMouseOut={this.canvas_onMouseOut}
                            onMouseUp={this.canvas_onMouseUp} 
                            onMouseDown={this.canvas_onMouseDown}
                            width='550' height='550'
                            ref={(canvas) => {this.canvas = canvas;}}/>
                    </div>
                </div>
            </div>
        )
    }
}

const style = {
    left:{
        float:'left',
        width:'60%'
    },
    leftWrapper:{
        textAlign:'center',
        width:'550px',
        margin:'auto'
    },
    right:{
        position:'relative',
        display:'inline-block',
        width:'40%'
    },
    img:{
        width:'550px'
    },
    datetimeWrapper:{
        textAlign:'left',
        marginBottom:'15px'
    },
    dateLabel:{
        marginTop:'4px',
        width:'70px',
        float:'left'
    },
    date:{
        width:'150px',
        display:'inline-block',
        float:'left'
    },
    dateInput:{
        width:'120px',
        float:'left'
    },
    time:{
        display:'inline-block',
        width:'30%'
    },
    timeLabel:{
        marginTop:'4px',
        width:'70px',
        float:'left',
        marginLeft:'50px'
    },
    timeSelect:{
        width:'140px',
        height:'28px',
        paddingTop:'2px',
        paddingBottom:'2px'
    },
    seatsLabel:{
        textAlign:'left',
        color:'white',
        padding:'10px',
        background:'rgb(74,83,109)'
    },
    h4:{
        margin:0
    }
};

export default Left;