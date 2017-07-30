import React from 'react';

import {
    PointSavingModal
} from '../components';


class Customer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputNumber : '번호를 입력하십시요.',
            PointSavingModal_on : false,
            PointSavingModal_point : 0
        };
        this.postAddSaving = this.postAddSaving.bind(this);
        this.buttonClick   = this.buttonClick.bind(this);
        this.inputReset    = this.inputReset.bind(this);
    }
    postAddSaving(){
        if(this.state.inputNumber==='번호를 입력하십시요.')
            return null;
        fetch('http://220.230.112.62:3000/api/member/'+this.state.inputNumber+'/addpoint')
            .then(res => res.json())
            .then((data) => {
                this.setState({
                    PointSavingModal_on:true,
                    PointSavingModal_point:data.point
                });
                setTimeout(() => {
                    this.setState({
                        inputNumber :'번호를 입력하십시요.',
                        PointSavingModal_on:false
                    });
                },3000);
            })
            .catch((err) => {
                fetch('http://220.230.112.62:3000/member/add/',
                    {
                        method : 'POST',
                        headers : {'Content-Type' : 'application/x-www-form-urlencoded'},
                        body : JSON.stringify({phone:this.state.inputNumber})
                    })
                    .then(res => res.json())
                    .then((data) => {
                        this.setState({
                            PointSavingModal_on:true,
                            PointSavingModal_point:1
                        });
                        setTimeout(() => {
                            this.setState({
                                inputNumber :'번호를 입력하십시요.',
                                PointSavingModal_on:false
                            });
                        },3000);
                    })
                    .catch((err) => {

                        this.setState({
                            PointSavingModal_on:true,
                            PointSavingModal_point:1
                        });
                        setTimeout(() => {
                            this.setState({
                                inputNumber :'번호를 입력하십시요.',
                                PointSavingModal_on:false
                            });
                        },3000);
                    console.log('err');
                    })
        })
    }
    buttonClick(number) {
        if(this.state.inputNumber==='번호를 입력하십시요.'){
            this.setState({inputNumber : String(number)});
            return null;
        }
        if(this.state.inputNumber.length>=11)
            return null;

        this.setState({inputNumber : this.state.inputNumber + String(number)});
    }
    inputReset() {
        this.setState({inputNumber : '번호를 입력하십시요.'})
    }

    render() {
        return (
            <div className="table_div">
                <h1>{this.state.inputNumber}</h1>
                <table>
                    <tbody>
                    <tr>
                        <td><a href="#" onClick={()=>{this.buttonClick(1)}}>1</a></td>
                        <td><a href="#" onClick={()=>{this.buttonClick(2)}}>2</a></td>
                        <td><a href="#" onClick={()=>{this.buttonClick(3)}}>3</a></td>
                    </tr>
                    <tr>
                        <td><a href="#" onClick={()=>{this.buttonClick(4)}}>4</a></td>
                        <td><a href="#" onClick={()=>{this.buttonClick(5)}}>5</a></td>
                        <td><a href="#" onClick={()=>{this.buttonClick(6)}}>6</a></td>
                    </tr>
                    <tr>
                        <td><a href="#" onClick={()=>{this.buttonClick(7)}}>7</a></td>
                        <td><a href="#" onClick={()=>{this.buttonClick(8)}}>8</a></td>
                        <td><a href="#" onClick={()=>{this.buttonClick(9)}}>9</a></td>
                    </tr>
                    <tr>
                        <td/>
                        <td><a href="#" onClick={()=>{this.buttonClick(0)}}>0</a></td>
                        <td/>
                    </tr>
                    </tbody>
                </table>
                <div className="buttons">
                    <a href='#' onClick={this.postAddSaving}>적립하기</a>
                    <a href='#' onClick={this.inputReset}>지우기</a>
                </div>
                <PointSavingModal
                    on={this.state.PointSavingModal_on}
                    inputNumber={this.state.inputNumber}
                    point={this.state.PointSavingModal_point}
                />
            </div>
        )
    }
}


export default Customer;