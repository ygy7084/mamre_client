import React from 'react';
import Radium from 'radium';

class Buyers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mode : null,
            customers : []
        };
        this.ticket_onChange = this.ticket_onChange.bind(this);
        this.preTicket_onChange = this.preTicket_onChange.bind(this);
        this.choose = this.choose.bind(this);
    }
    ticket_onChange(customer) {
        let arr = this.state.customers;
        if(this.state.mode==='ticket') {
            let index = this.state.customers.findIndex((i) => {
                if(i._id === customer._id)
                    return true;
            });
            if(index<0)
                arr.push(customer);
            else
                arr.splice(index, 1);
            this.setState({
                customers: arr,
            })
        }else if(this.state.customers.length===0) {
            this.setState((state) => {
                state.mode = 'ticket';
                state.customers.push(customer);
                return state;
            })
        }
    }
    preTicket_onChange(customer) {
        let arr = this.state.customers;
        if(this.state.mode==='preTicket') {
            let index = this.state.customers.findIndex((i) => {
                if(i._id === customer._id)
                    return true;
            });
            if(index<0)
                arr.push(customer);
            else
                arr.splice(index, 1);
            this.setState({
                customers : arr,
            })
        }else if(this.state.customers.length===0) {
            this.setState((state) => {
                state.mode = 'preTicket';
                state.customers.push(customer);
                return state;
            })
        }
    }
    choose() {
        if(this.state.customers.length >0) {
            this.props.chooseCustomers(this.state.mode, this.state.customers);
            this.setState({
                mode : null,
                customers : []
            })
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            mode : null,
            customers : []
        })
    }
    render() {
        return (
            <div className="modal fade" id='Buyers' tabIndex="-1" role="dialog">
                <div className="modal-dialog" style ={style.dialog} role="document">
                    <div className="modal-content" style={style.content}>
                        <div className="modal-header" style={style.header}>
                            <button type="button" className="close"  data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title">구매자 조회</h4>
                        </div>
                        <div className="modal-body" style={style.body}>
                            <div>
                                <table className='table table-condensed table-hover'>
                                    <thead>
                                    <tr className='tableheader'>
                                        <th>번호</th>
                                        <th>판매처</th>
                                        <th>티켓번호</th>
                                        <th>성명</th>
                                        <th>현장 발권</th>
                                        <th>사전 발권</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        this.props.data.map((customer, index) => {
                                            return (
                                                <tr key={customer._id}>
                                                    <td>{index+1}</td>
                                                    <td>{customer.source}</td>
                                                    <td>{customer.ticket_code}</td>
                                                    <td>{customer.customer_name}</td>
                                                    <td>
                                                        <input type='checkbox' disabled={this.state.mode!=='ticket'&&this.state.customers.length!==0} onChange={(_id) => {this.ticket_onChange(customer)}} name={customer._id}/>
                                                    </td>
                                                    <td>
                                                        <input type='checkbox' disabled={this.state.mode!=='preTicket'&&this.state.customers.length!==0} onChange={(_id)=>{this.preTicket_onChange(customer)}} name={customer._id}/></td>
                                                </tr>
                                            );
                                        })
                                    }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div style={style.footer}>
                            <button type="button" style={style.submit} className="btn btn-default" data-dismiss="modal" onClick={this.choose}>선택</button>
                            <button type="button" style={style.submit} className="btn btn-default" data-dismiss="modal" >닫기</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
const style = {
    dialog : {
        width: '600px',
        top : '100px'
    },
    content : {
        background : 'rgb(218,218,218)',
        margin : 0,
        border : 0
    },
    header : {
        background : 'linear-gradient(to bottom , rgb(26,42,87), rgb(37,60,126))',
        padding : '10px',
        color :'white'
    },
    body : {
        textAlign : 'center',
    },
    footer : {
        textAlign : 'center'
    },
    submit : {
        marginTop : '10px',
        marginBottom : '10px',
        width:'150px',
        height:'50px',
        background:'rgb(146,39,143)',
        color:'white'
    }
}
export default Radium(Buyers);