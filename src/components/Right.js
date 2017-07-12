import React from 'react';
import classNames from 'classnames';

class Right extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            findBuyers_input :'',
        };
        this.findBuyers_onInput = this.findBuyers_onInput.bind(this);
        this.findBuyers = this.findBuyers.bind(this);
    }

    findBuyers_onInput(e) {
        this.setState({
            findBuyers_input : e.target.value
        });
    }

    findBuyers() {
        if(this.state.findBuyers_input!=='' && this.props.seatsInfo)
            this.props.findBuyers(this.state.findBuyers_input);
    }
    render() {

        let tableFooter = null;

        if(this.props.seats_picked.length) {
            let sum = 0;
            for(let seat of this.props.seats_picked)
                sum += parseInt(seat.price);

            tableFooter = (
                <div style={style.priceTable.footer}>
                    <div style={style.priceTable.footerLabel}>합계</div>
                    <div style={style.priceTable.footerValue}>{sum}</div>
                </div>
            )
        }
        return (
            <div style={style.right}>
                <div style={style.rightWrapper}>
                    <div style={style.phoneWrapper}>
                        <div style={style.phoneLabel}>
                            <strong>전화번호 뒷자리</strong>
                        </div>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                onChange={this.findBuyers_onInput}
                                value={this.state.findBuyers_input} />
                            <span className="input-group-btn">
                                <button
                                    className={classNames({
                                        'btn':true,
                                        'btn-primary':true,
                                        'disabled':this.state.findBuyers_input==='' || !this.props.seatsInfo
                                    })}
                                    style={style.phoneButton}
                                    type="button"
                                    onClick={this.findBuyers}>검색</button>
                            </span>
                        </div>
                    </div>
                    {this.props.buyers_picked.length!==0 ?
                        <div style={style.summary}>
                            <table>
                                <thead style={style.buyersTable.thead}>
                                    <tr style={style.buyersTable.header}>
                                        <th style={style.buyersTable.header_th}>번호</th>
                                        <th style={style.buyersTable.header_th}>구매처</th>
                                        <th style={style.buyersTable.header_th}>이름</th>
                                        <th style={style.buyersTable.header_th}>좌석등급</th>
                                        <th style={style.buyersTable.header_th}>좌석번호</th>
                                    </tr>
                                </thead>
                                <tbody style={style.buyersTable.tbody}>
                                {
                                    this.props.buyers_picked.map((buyer, index)=> {
                                        return(
                                            <tr style={style.buyersTable.body} key={index}>
                                                <td style={style.buyersTable.body_td}>{index+1}</td>
                                                <td style={style.buyersTable.body_td}>{buyer.source}</td>
                                                <td style={style.buyersTable.body_td}>{buyer.customer_name}</td>
                                                <td style={style.buyersTable.body_td}>{buyer.seat_class}</td>
                                                <td style={style.buyersTable.body_td}>{buyer.seat_position ?
                                                    buyer.seat_position.col+'열 '+
                                                    buyer.seat_position.num+'번' : '미배정'}</td>
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
                                'disabled':!this.props.seatsInfo.OK||this.props.buyers_picked.length
                            })}
                            style={style.button1}
                            onClick={this.props.preTicketOn}>사전발권</button>
                    <button className={classNames({
                                'btn':true,
                                'btn-primary':true,
                                'disabled':!this.props.seatsInfo.OK
                            })}
                            style={style.button2}
                            onClick={(e) => {
                                this.props.seatsInfo.OK ?
                                this.props.buyers_picked.length? this.props.ticketting() : this.props.preTicketting()
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

    buyersTable:{
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
        width:'130px',
        height:'45px'
    },
    button2:{
        background:'rgb(146,39,143)',
        border:'0',
        width:'180px',
        height:'45px'
    }
};

export default Right;