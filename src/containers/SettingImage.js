import React from 'react';

import {
    SideContents
} from '../components'

class SettingImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mouse : {
                x: 0,
                y: 0
            },
            canvas : {
                width : 670,
                height : 670,
                widthRatio : 0,
                heightRatio : 0,
                background : null,
                seat : null,
            },
            dragging : false,
            theater : null,
            seat_now : 0,
            Xinput : '',
            Yinput : ''
        };
        this.inputImage = this.inputImage.bind(this);
        this.inputImage2 = this.inputImage2.bind(this);
        this.mouseDown = this.mouseDown.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        this.mouseOut = this.mouseOut.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.drawImage = this.drawImage.bind(this);
        this.updateCoords = this.updateCoords.bind(this);
    }
    componentWillMount() {
        fetch('/api/theater/read',{
            method : 'GET'
        })
            .then(res =>{
                if(res.ok)
                    return res.json();
                else
                    return res.json().then(err => { throw err; })})
            .then(res => {
                //소월아트홀만 지원***
                for(let t of res.data) {
                    if(t.name==='소월아트홀')
                        this.setState({
                            theater:t,
                        });
                }
            })
            .catch((err) => {
                let message = err;
                if(err.message && err.message!=='')
                    message = err.message;
                console.log(message);
            });
    }
    componentDidMount() {
    }
    drawImage(image, x, y) {
        if(x && y)
            this.canvas.getContext('2d').drawImage(image, x, y, image.width*this.state.canvas.widthRatio, image.height*this.state.canvas.heightRatio);
        else
            this.canvas.getContext('2d').drawImage(image, 0, 0, image.width*this.state.canvas.widthRatio, image.height*this.state.canvas.heightRatio);
    }
    inputImage(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                const ctx = this.canvas.getContext('2d');
                this.setState({
                    canvas : {
                        width : 670,
                        height : 670,
                        widthRatio : 670/img.width,
                        heightRatio : 670/img.height,
                        background : img
                    }
                });
                ctx.drawImage(img, 0,0, 670,670);
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file)
    }
    inputImage2(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                const ctx = this.canvas.getContext('2d');
                this.setState((state) => {
                    return state.canvas.seat = img;
                });
                ctx.drawImage(img, 0,0, img.width*this.state.canvas.widthRatio,img.height*this.state.canvas.heightRatio);
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file)
    }
    mouseDown(e){
        this.setState({dragging : true, mouse : {x:parseInt(e.clientX - this.canvas.offsetLeft), y :parseInt(e.clientY - this.canvas.offsetTop)}})
    }
    mouseUp(e) {
        this.setState({dragging : false, mouse : {x:parseInt(e.clientX - this.canvas.offsetLeft), y :parseInt(e.clientY - this.canvas.offsetTop)}})
        console.log(this.state.mouse);
    }
    mouseMove(e) {
        if(this.state.dragging){
            this.setState({mouse : {x:parseInt(e.clientX - this.canvas.offsetLeft), y :parseInt(e.clientY - this.canvas.offsetTop)}})
            this.canvas.getContext('2d').clearRect(0,0,this.canvas.width,this.canvas.height);
            this.drawImage(this.state.canvas.background);
            this.drawImage(this.state.canvas.seat, this.state.mouse.x, this.state.mouse.y)
        }
    }
    mouseOut(e) {
        if(this.state.dragging) {

            this.setState({
                dragging:false,
                mouse: {
                    x: parseInt(e.clientX - this.canvas.offsetLeft),
                    y: parseInt(e.clientY - this.canvas.offsetTop)
                }
            })
        }
    }
    updateCoords() {
        let data = {
            _id : this.state.theater._id,
            floor : this.state.theater.seats[this.state.seat_now].floor,
            num : this.state.theater.seats[this.state.seat_now].num,
            col : this.state.theater.seats[this.state.seat_now].col,
            x : this.state.mouse.x,
            y : this.state.mouse.y
        };
        fetch('/api/theater/update/coords',{
            method : 'PUT',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify(data)
        })
            .then(res =>{
                if(res.ok)
                    return res.json();
                else
                    return res.json().then(err => { throw err; })})
            .then(res => {
                this.setState({
                    seat_now : this.state.seat_now+1
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
                        let theater;
                        for(let t of res.data) {
                            if(t.name==='소월아트홀') {
                                theater = t;
                                this.setState({
                                    theater: t,
                                });
                            }
                        }
                        this.canvas.getContext('2d').clearRect(0,0,this.canvas.width,this.canvas.height);
                        this.drawImage(this.state.canvas.background);
                        for(let s of theater.seats) {
                            this.drawImage(this.state.canvas.seat, s.x ,s.y)
                        }
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
    render() {
        let seatsInputter = null;
        if(this.state.theater && this.state.canvas.background && this.state.canvas.seat && this.state.seat_now<this.state.theater.seats.length) {
            let seat_now = this.state.theater.seats[this.state.seat_now];

            seatsInputter = (
                <div>
                    <p>{'X size : ' + this.state.canvas.seat.width * this.state.canvas.widthRatio
                        +'. Y size : '+ this.state.canvas.seat.height*this.state.canvas.heightRatio}
                    </p>
                    <p>{seat_now.floor+'층 '+seat_now.col+'열 '+seat_now.num}</p>
                    <p>{this.state.mouse.x+', '+this.state.mouse.y}</p>
                    <a href='#' onClick={this.updateCoords}>입력</a>
                    <input type='text' value={this.state.Xinput} onChange={(e)=>{this.setState({Xinput:e.target.value})}} placeholder='X'/>
                    <a href='#' onClick={(e) => {
                        this.canvas.getContext('2d').clearRect(0,0,this.canvas.width,this.canvas.height);
                        this.drawImage(this.state.canvas.background);
                        this.drawImage(this.state.canvas.seat, this.state.mouse.x + parseInt(this.state.Xinput), this.state.mouse.y + parseInt(this.state.Yinput))
                        this.setState((state)=> {state.mouse.x = state.mouse.x + parseInt(this.state.Xinput)})}}>X 합산</a>
                    <input type='text' value={this.state.Yinput} onChange={(e)=>{this.setState({Yinput:e.target.value})}} placeholder='Y'/>
                    <a href='#' onClick={(e) => {
                        this.canvas.getContext('2d').clearRect(0,0,this.canvas.width,this.canvas.height);
                        this.drawImage(this.state.canvas.background);
                        this.drawImage(this.state.canvas.seat, this.state.mouse.x + parseInt(this.state.Xinput), this.state.mouse.y + parseInt(this.state.Yinput))
                        this.setState((state)=> {state.mouse.y = state.mouse.y + parseInt(this.state.Yinput)})}}>Y 합산</a>
                    <a href='#' onClick={(e) => {
                        this.setState({seat_now:this.state.seat_now-1});
                    }}>돌아가기</a>
                    <a href='#' onClick={(e) => {
                        this.setState({seat_now:this.state.seat_now+1});
                    }}>앞으로가기</a>
                </div>
            );
        }
        return (
            <SideContents>
                {seatsInputter}
                <div>
                    <canvas onMouseDown={this.mouseDown} onMouseUp={this.mouseUp} onMouseMove={this.mouseMove} onMouseOut={this.mouseOut} width={this.state.canvas.width} height={this.state.canvas.height} ref={(canvas) => { this.canvas = canvas; }}/>
                </div>
                <div>
                    <p>배경</p>
                    <input type='file' onChange={this.inputImage}/>
                </div>
                <div>
                    <p>좌석</p>
                    <input type='file' onChange={this.inputImage2}/>
                </div>
            </SideContents>
        )
    }
}

export default SettingImage