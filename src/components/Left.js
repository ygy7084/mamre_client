import React from 'react';
import async from 'async';

class Left extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            dragStart:{},
            seatMapCoords : []
        };

        this.seatCanvas_onMouseDown  = this.seatCanvas_onMouseDown.bind(this);
        this.seatCanvas_onMouseUp    = this.seatCanvas_onMouseUp.bind(this);
        this.seatCanvas_onMouseOut   = this.seatCanvas_onMouseOut.bind(this);
        this.seatCanvasClick         = this.seatCanvasClick.bind(this);
        this.collides            = this.collides.bind(this);
        this.clearSeats          = this.clearSeats.bind(this);
        this.makeSeat_unpicked = this.makeSeat_unpicked.bind(this);
        this.drawSeats_picked    = this.drawSeats_picked.bind(this);
        this.drawSeats           = this.drawSeats.bind(this);
    }
    componentWillReceiveProps(nextProps){
        let added = true;
        if(nextProps.seats_picked.length<=this.props.seats_picked.length) {
            added = false;
        }else {
            for (let s of this.props.seats_picked) {
                let index = nextProps.seats_picked.findIndex((s2) =>{
                    if(s.floor === s2.floor && s.col === s2.col && s.num === s2.num)
                        return true;
                });
                if(index<0){
                    added = false;
                    break;
                }
            }
        }

        if(added)
            this.drawSeats_picked(nextProps.seats_picked);
        else if(!this.props.seats.length || JSON.stringify(this.props.seats) !== JSON.stringify(nextProps.seats)) {
            this.clearSeats().then(() => {
                console.log(nextProps.seats)
                this.drawSeats(nextProps.seats).then(() => {
                }).catch((e) => {console.log('error')});
            })
        }
        else {
            for (let this_seat of this.props.seats_picked) {
                let index = nextProps.seats_picked.findIndex((next_seat) =>{
                    if(next_seat.floor === this_seat.floor &&
                        next_seat.col === this_seat.col &&
                        next_seat.num === this_seat.num)
                        return true;
                });
                if(index<0){
                    let seatMapCoord = this.state.seatMapCoords.find((seatMapCoord) => {
                        if(seatMapCoord.seat.floor === this_seat.floor &&
                            seatMapCoord.seat.col === this_seat.col &&
                            seatMapCoord.seat.num === this_seat.num)
                            return true;
                    });
                    if(seatMapCoord)
                        this.makeSeat_unpicked(seatMapCoord).then(() => {});
                }
            }
        }

    }
    seatCanvas_onMouseDown(e) {
        e.preventDefault();
        const rect = this.seatCanvas.getBoundingClientRect();
        this.setState({
            dragStart:{
                x:Math.round((e.clientX - rect.left)/(rect.right-rect.left)*this.seatCanvas.width),
                y:Math.round((e.clientY - rect.top)/(rect.bottom-rect.top)*this.seatCanvas.height)}

        });
    }
    seatCanvas_onMouseUp(e) {
        e.preventDefault();
        const rect = this.seatCanvas.getBoundingClientRect();
        let endCoords = {
            x: Math.round((e.clientX - rect.left) / (rect.right - rect.left) * this.seatCanvas.width),
            y: Math.round((e.clientY - rect.top) / (rect.bottom - rect.top) * this.seatCanvas.height)
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
    seatCanvas_onMouseOut(e) {
        e.preventDefault();
        this.setState({
            dragStart:{},
        })
    }
    seatCanvasClick(e) {
        e.preventDefault();
        const rect = this.seatCanvas.getBoundingClientRect();
        let seat = this.collides(
            Math.round((e.clientX - rect.left)/(rect.right-rect.left)*this.seatCanvas.width),
            Math.round((e.clientY - rect.top)/(rect.bottom-rect.top)*this.seatCanvas.height));
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
                const ctx = this.seatCanvas.getContext('2d');
                ctx.clearRect(0,0,this.seatCanvas.width,this.seatCanvas.height);
                resolve();
            });
    }
    makeSeat_unpicked(seatMapCoord) {
        return new Promise(
            (resolve, reject) => {
                const ctx = this.seatCanvas.getContext('2d');
                ctx.clearRect(seatMapCoord.x, seatMapCoord.y, seatMapCoord.width, seatMapCoord.height);
                const image = new Image;
                if(seatMapCoord.seat.seat_class==='VIP')
                    image.src = 'https://storage.googleapis.com/red_printing/seat_VIP_avail.png';
                else
                    image.src = 'https://storage.googleapis.com/red_printing/seat_R_avail.png';
                image.onload = () => {
                    ctx.drawImage(image, seatMapCoord.x, seatMapCoord.y, seatMapCoord.width, seatMapCoord.height);

                    resolve();
                };
            });
    }
    drawSeats_picked(seats_picked) {
        return new Promise(
            (resolve, reject) => {
                if(this.state.seatMapCoords&& this.state.seatMapCoords.length) {
                    const seat_R_select = new Image();
                    const seat_VIP_select = new Image();
                    seat_VIP_select.src = 'https://storage.googleapis.com/red_printing/seat_VIP_select.png';
                    seat_R_select.src = 'https://storage.googleapis.com/red_printing/seat_R_select.png';

                    const ctx = this.seatCanvas.getContext('2d');
                    async.waterfall([
                            (callback) => {
                                const picked = [];
                                /*
                                선택된 좌석의 좌표를 찾는다.
                                 */
                                for (let seat of seats_picked) {
                                    let seatMapCoord = this.state.seatMapCoords.find((seatMapCoord) => {
                                        if (seatMapCoord.seat.col === seat.col
                                            && seatMapCoord.seat.floor === seat.floor
                                            && seatMapCoord.seat.num === seat.num)
                                            return true;
                                        });
                                    if(seatMapCoord)
                                        picked.push(seatMapCoord);
                                }
                                callback(null, picked);
                            },
                            (picked, callback) => {
                                /*
                                VIP 선택 그림을 로드
                                 */
                                seat_VIP_select.onload = () => {
                                    callback(null, picked)
                                }
                            },
                                /*
                                 R 선택 그림을 로드
                                 */
                            (picked, callback) => {
                                seat_R_select.onload = () => {
                                    callback(null, picked)
                                }
                            }
                        ],
                        (err, picked) => {
                            for(let seatMapCoord of picked) {
                                if (seatMapCoord.seat.seat_class === 'VIP')
                                    ctx.drawImage(seat_VIP_select, seatMapCoord.x, seatMapCoord.y, seatMapCoord.width, seatMapCoord.height);
                                else if (seatMapCoord.seat.seat_class === 'R')
                                    ctx.drawImage(seat_R_select, seatMapCoord.x, seatMapCoord.y, seatMapCoord.width, seatMapCoord.height);
                            }
                            resolve();
                        });
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

                }
            });
    }
    drawSeats(seats) {
        return new Promise((resolve, reject) => {
            const background = new Image();
            const seat_R_avail = new Image();
            const seat_VIP_avail = new Image();

            const ctx = this.seatCanvas.getContext('2d');

            const background_width = this.props.backgroundSize.width;
            const background_height = this.props.backgroundSize.height;

            async.waterfall([
                (callback) => {
                    background.onload = () => {
                        const ctx_background = this.backgroundCanvas.getContext('2d');
                        ctx_background.drawImage(background, 0, 0, background_width, background_height);
                        const Xratio = background_width / background.width;
                        const Yratio = background_height / background.height;
                        const seatMapCoords = [];
                        callback(null, Xratio, Yratio, seatMapCoords);
                    };
                    background.src = 'https://storage.googleapis.com/red_printing/seats_base.png';
                },
                (Xratio, Yratio, seatMapCoords, callback) => {
                    seat_VIP_avail.onload = () => {
                        const newWidth = seat_VIP_avail.width * Xratio;
                        const newHeight = seat_VIP_avail.height * Yratio;
                        const ratio = background_width / 670;

                        for (let seat of seats) {
                            if(seat.seat_class==='VIP') {
                                let seatMapCoord = {
                                    x: seat.x * ratio,
                                    y: seat.y * ratio,
                                    width: newWidth,
                                    height: newHeight,
                                    seat: seat
                                };
                                seatMapCoords.push(seatMapCoord);
                            }
                        }
                        callback(null, Xratio, Yratio, seatMapCoords);
                    };
                    seat_VIP_avail.src = 'https://storage.googleapis.com/red_printing/seat_VIP_avail.png';
                    seat_VIP_avail.onerror = (e) => {
                        console.log('error');
                        console.log(e);
                    }
                },
                (Xratio, Yratio, seatMapCoords, callback) => {
                    seat_R_avail.onload = () => {
                        const newWidth = seat_R_avail.width * Xratio;
                        const newHeight = seat_R_avail.height * Yratio;
                        const ratio = background_width / 670;

                        for (let seat of seats) {
                            if(seat.seat_class==='R') {
                                let seatMapCoord = {
                                    x: seat.x * ratio,
                                    y: seat.y * ratio,
                                    width: newWidth,
                                    height: newHeight,
                                    seat: seat
                                };
                                seatMapCoords.push(seatMapCoord);
                            }
                        }
                        callback(null, seatMapCoords);
                    };
                    seat_R_avail.src = 'https://storage.googleapis.com/red_printing/seat_R_avail.png';

                    seat_R_avail.onerror = (e) => {
                        console.log('error');
                        console.log(e);
                    }
                }
            ], (err, seatMapCoords) => {
                if(err)
                    console.log(err);
                else{
                    for(let seatMapCoord of seatMapCoords) {
                        if (seatMapCoord.seat.seat_class === 'VIP')
                            ctx.drawImage(seat_VIP_avail, seatMapCoord.x, seatMapCoord.y, seatMapCoord.width, seatMapCoord.height);
                        else if (seatMapCoord.seat.seat_class === 'R')
                            ctx.drawImage(seat_R_avail, seatMapCoord.x, seatMapCoord.y, seatMapCoord.width, seatMapCoord.height);
                    }
                    this.setState({
                        seatMapCoords : seatMapCoords
                    });
                    resolve();
                }
            });
        })
    }

    render() {
        /*
            change style from props
         */
        let leftWrapperStyle = style.leftWrapper;
        leftWrapperStyle.width = this.props.backgroundSize.width;

        return (
            <div style={style.left}>
                <div style={leftWrapperStyle}>
                    <div>
                        <div style={style.seatsLabel}>
                            <h4 style={style.seatsLabel_h4}>좌석배치도</h4>
                        </div>
                        <div style={{position:'relative'}}>
                            <canvas
                                onSelect={(e) =>{e.preventDefault();return false;}}
                                width={this.props.backgroundSize.width} height={this.props.backgroundSize.height}
                                ref={(canvas) => {this.backgroundCanvas = canvas;}}
                                style={style.backgroundCanvas}/>
                            <canvas
                                onSelect={(e) =>{e.preventDefault();return false;}}
                                onMouseOut={this.seatCanvas_onMouseOut}
                                onMouseUp={this.seatCanvas_onMouseUp}
                                onMouseDown={this.seatCanvas_onMouseDown}
                                width={this.props.backgroundSize.width} height={this.props.backgroundSize.height}
                                ref={(canvas) => {this.seatCanvas = canvas;}}
                                style={style.seatCanvas}/>
                        </div>
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
        margin:'auto'
    },
    right:{
        position:'relative',
        display:'inline-block',
        width:'40%'
    },
    seatsLabel:{
        textAlign:'left',
        color:'white',
        padding:'10px',
        background:'rgb(74,83,109)'
    },
    seatsLabel_h4:{
        margin:'0'
    },
    backgroundCanvas:{
        position:'absolute',
        left:'0',
        top:'0',
        zIndex:'0'
    },
    seatCanvas:{
        position:'absolute',
        left:'0',
        top:'0',
        zIndex:'1'
    }
};

export default Left;