import React from 'react';
import classNames from 'classnames';

class Right extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            findCustomers_input :'',
        };
        this.findCustomers_onInput = this.findCustomers_onInput.bind(this);
        this.findCustomers = this.findCustomers.bind(this);
        this.ticketting = this.ticketting.bind(this);
        this.preTicketting = this.preTicketting.bind(this);
    }

    findCustomers_onInput(e) {
        this.setState({
            findCustomers_input : e.target.value
        });
    }
    findCustomers() {
        if(this.state.findCustomers_input!=='' && this.props.seatsInfo)
            this.props.findCustomers(this.state.findCustomers_input);
    }
    ticketting(flag) {
        if(this.props.reTickettingStart) {
            this.props.tickettingCenter((combine) => {
                this.props.reTicketting(combine);
            });
        }else {
            if(flag)
            //좌석만 티켓팅
                this.props.tickettingCenter((combine) => {
                    this.props.tickettingWithoutCustomer(combine);
                });
            else
            //구매자 선택 후 좌석 티켓팅
                this.props.tickettingCenter((combine) => {
                    this.props.tickettingWithCustomer(combine);
                });
        }

    }
    preTicketting() {
        this.props.tickettingCenter((combine) => {
            this.props.preTicketting(combine);
        });
    }
    render() {

        let tableFooter = null;

        if(this.props.seats_picked.length) {
            let sum = 0;
            for(let seat of this.props.seats_picked)
                sum += parseInt(seat.price);

            tableFooter = (
                <div style={style.priceTable.footer}>
                    {this.props.customers_picked.length ?
                        <div style={style.priceTable.footerLabel}>합계 (발권 시, 예매처의 예매 가격대로 발권)</div>
                        :
                        <div style={style.priceTable.footerLabel}>합계</div>
                    }
                    <div style={style.priceTable.footerValue}>{sum}</div>
                </div>
            )
        }
        return (
            <div style={style.right}>
                <div style={style.rightWrapper}>
                    <div style={style.phoneWrapper}>
                        <div style={style.phoneLabel}>
                            <strong>검색 (성명, 전화번호 4자리)</strong>
                        </div>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                onChange={this.findCustomers_onInput}
                                value={this.state.findCustomers_input} />
                            <span className="input-group-btn">
                                <button
                                    className={classNames({
                                        'btn':true,
                                        'btn-primary':true,
                                        'disabled':this.state.findCustomers_input==='' || !this.props.seatsInfo
                                    })}
                                    style={style.phoneButton}
                                    type="button"
                                    onClick={this.findCustomers}>검색</button>
                            </span>
                        </div>
                    </div>
                    {this.props.customers_picked.length!==0 ?
                        <div style={style.summary}>
                            <table>
                                <thead style={style.customersTable.thead}>
                                    <tr style={style.customersTable.header}>
                                        <th style={style.customersTable.header_th}>번호</th>
                                        <th style={style.customersTable.header_th}>구매처</th>
                                        <th style={style.customersTable.header_th}>이름</th>
                                        <th style={style.customersTable.header_th}>좌석등급</th>
                                        <th style={style.customersTable.header_th}>좌석번호</th>
                                    </tr>
                                </thead>
                                <tbody style={style.customersTable.tbody}>
                                {
                                    this.props.customers_picked.map((customer, index)=> {
                                        return(
                                            <tr style={style.customersTable.body} key={index}>
                                                <td style={style.customersTable.body_td}>{index+1}</td>
                                                <td style={style.customersTable.body_td}>{customer.source}</td>
                                                <td style={style.customersTable.body_td}>{customer.customer_name}</td>
                                                <td style={style.customersTable.body_td}>{customer.seat_class}</td>
                                                <td style={style.customersTable.body_td}>{customer.seat_position ?
                                                    customer.seat_position.col+'열 '+
                                                    customer.seat_position.num+'번' : '미배정'}</td>
                                            </tr>
                                        )
                                    })
                                }
                                </tbody>
                            </table>
                        </div>
                            :
                        null
                    }
                    {this.props.seats_picked.length ?
                        <div>
                            <div style={style.seatsNumWrapper}>
                                <div style={style.seatsNumLabel}>
                                    <h4 style={style.seatsNumLabel_h4}>좌석수</h4>
                                </div>
                                <div style={style.seatsNumOutput}>
                                    <h4 style={style.seatsNum_h4}>
                                        {this.props.seats_picked.length +
                                        "개 선택 ( VIP : " +
                                        parseInt(this.props.seatsInfo.numOfVIP) +
                                        "석 R : " +
                                        parseInt(this.props.seatsInfo.numOfR) + "석 )"}</h4>
                                </div>
                                <h6 style={style.seatsNum_h6}>
                                    {this.props.seatsInfo.errOfVIP > 0 ? 'VIP ' +
                                        this.props.seatsInfo.errOfVIP +
                                        '석 추가 필요, ' :
                                        this.props.seatsInfo.errOfVIP < 0 ?
                                            'VIP ' +
                                            Math.abs(this.props.seatsInfo.errOfVIP) +
                                            '석 초과' : null }

                                    {this.props.seatsInfo.errOfR > 0 ? 'R ' +
                                        this.props.seatsInfo.errOfR +
                                        '석 추가 필요, ' :
                                        this.props.seatsInfo.errOfR < 0 ?
                                            'R ' +
                                            Math.abs(this.props.seatsInfo.errOfR) +
                                            '석 초과' : null }
                                </h6>
                            </div>
                            <table>
                                <thead style={style.priceTable.thead}>
                                    <tr style={style.priceTable.header}>
                                        <th style={style.priceTable.header_th}>번호</th>
                                        <th style={style.priceTable.header_th}>고유번호</th>
                                        <th style={style.priceTable.header_th}>좌석등급</th>
                                        <th style={style.priceTable.header_th}>좌석번호</th>
                                        <th style={style.priceTable.header_th}>가격</th>
                                    </tr>
                                </thead>
                                <tbody style={style.priceTable.tbody}>
                                {
                                    this.props.seats_picked.map((seat, index)=> {
                                        return(
                                            <tr style={style.priceTable.body} key={index}>
                                                <td style={style.priceTable.body_td}>{index+1}</td>
                                                <td style={style.priceTable.body_td}>{seat.serialNum}</td>
                                                <td style={style.priceTable.body_td}>{seat.seat_class}</td>
                                                <td style={style.priceTable.body_td}>{seat.col+'열 '+seat.num+'번 '}</td>
                                                <td style={style.priceTable.body_td}>
                                                    <a href='#'
                                                       onClick={() => {this.props.changePriceOn(seat)}}>
                                                        {seat.price}
                                                    </a>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }

                                </tbody>
                            </table>
                            {tableFooter}
                        </div>
                        :
                        null
                    }
                    <button className={classNames({
                                'btn':true,
                                'btn-primary':true,
                                'disabled':!this.props.seatsInfo
                            })}
                            style={style.button1}
                            onClick={this.props.resetSeats}>다시선택</button>
                    <button className={classNames({
                        'btn':true,
                        'btn-primary':true,
                        'disabled':!this.props.seatsInfo
                    })}
                            style={style.button1}
                            onClick={()=>{this.props.extraFunctionModal(true)}}>기타선택</button>
                    <button className={classNames({
                                'btn':true,
                                'btn-primary':true,
                                'disabled':!this.props.seatsInfo.OK||this.props.customers_picked.length
                            })}
                            style={style.button1}
                            onClick={this.preTicketting}>사전발권</button>
                    <button className={classNames({
                                'btn':true,
                                'btn-primary':true,
                                'disabled':!this.props.seatsInfo.OK
                            })}
                            style={style.button2}
                            onClick={(e) => {
                                this.props.seatsInfo.OK ?
                                this.props.customers_picked.length? this.ticketting(false) : this.ticketting(true)
                            :null}}>발권</button>
                </div>
            </div>
        )
    }
}

const style = {
    right:{
        width:'40%',
        display:'inline-block',
        minWidth:'450px',
        position:'absolute'
    },
    rightWrapper:{
        textAlign:'center',
        width:'450px',
        margin:'0'
    },
    phoneWrapper:{
        textAlign:'right',
        marginBottom:'8px'
    },
    phoneLabel:{
        marginTop: '7px',
        width: '200px',
        float: 'left',
        textAlign: 'center'
    },
    phoneButton:{
        background:'rgb(35,57,119)'
    },
    summary:{
        background:'white'
    },
    seatsNumWrapper:{
        marginTop:'10px',
        marginBottom:'10px'
    },
    seatsNumLabel:{
        float:'left',
        width:'80px'
    },
    seatsNumLabel_h4:{
        margin:'5px'
    },
    seatsNum_h4:{
        margin:'5px'
    },
    seatsNum_h6:{
        margin:'5px',
        color:'red'
    },
    seatsNumOutput:{
        display:'inline-block',
        background:'rgb(245,245,245)',
        width:'370px'
    },

    customersTable:{
        thead:{
            display:'block'
        },
        tbody:{
            display:'block',
            maxHeight:'120px',
            overflowY:'auto',
            overflowX:'hidden'
        },
        header:{
            background:'rgb(74,83,109)',
            color:'white',
            textAlign:'center'
        },
        header_th:{
            textAlign:'center',
            fontWeight:'normal',
            padding:'3px',
            width:'120px'
        },
        body:{
            background:'rgb(245,245,245)',
            borderTop:'1px solid #ddd'
        },
        body_td:{
            width:'120px',
            padding:'3px',
        }
    },

    priceTable:{
        thead:{
            display:'block'
        },
        tbody:{
            display:'block',
            maxHeight:'320px',
            overflowY:'auto',
            overflowX:'hidden'
        },
        header:{
            background:'rgb(74,83,109)',
            color:'white',
            textAlign:'center'
        },
        header_th:{
            textAlign:'center',
            fontWeight:'normal',
            padding:'3px',
            width:'96px'
        },
        body:{
            background:'rgb(245,245,245)',
            borderTop:'1px solid #ddd'
        },
        body_td:{
            width:'96px',
            padding:'3px',
        }
        ,
        footer:{
            marginBottom:'5px',
            padding:'5px',
            background:'rgb(92,92,92)',
            color:'white'
        },
        footerLabel:{
            float:'left',
            margin:'auto',
            width:'70%'
        },
        footerValue:{
            display:'inline-block',
            width:'30%'
        },
    },

    button1:{
        marginRight:'5px',
        background:'rgb(35,57,119)',
        border:'0',
        width:'90px',
        height:'45px'
    },
    button2:{
        background:'rgb(146,39,143)',
        border:'0',
        width:'165px',
        height:'45px'
    }
};

export default Right;