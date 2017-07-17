import React from 'react';
import classNames from 'classnames';

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
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }
    componentDidMount() {
        this.props.on ? this.openModal() : this.closeModal()
    }
    componentWillReceiveProps(nextProps) {
        nextProps.on ? this.openModal() : this.closeModal()
    }
    openModal() {
        $('#Buyers').modal('show');
    }
    closeModal() {
        this.setState({
            mode : null,
            customers : []
        });
        $('#Buyers').modal('hide');
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
            this.props.onClose();
        }
    }
    render() {
        return (
            <div
                className="modal fade"
                id='Buyers'
                data-keyboard="false" //esc 금지
                data-backdrop="static"//바깥 클릭 기본 프로시져 금지
                tabIndex="-1">

                <div className="modal-dialog" style ={style.dialog}>
                    <div className="modal-content" style={style.content}>
                        <div className="modal-header" style={style.header}>
                            <button type="button"
                                    onClick={this.props.onClose}
                                    className="close">
                                <span>&times;</span>
                            </button>
                            <h4 className="modal-title">구매자 조회</h4>
                        </div>
                        <div className="modal-body" style={style.body}>
                            <div>
                                <table>
                                    <thead style={style.buyersTable.thead}>
                                    <tr style={style.buyersTable.header}>
                                        <th style={style.buyersTable.header_th}>번호</th>
                                        <th style={style.buyersTable.header_th}>판매처</th>
                                        <th style={style.buyersTable.header_th}>티켓번호</th>
                                        <th style={style.buyersTable.header_th}>성명</th>
                                        <th style={style.buyersTable.header_th}>현장 발권</th>
                                        <th style={style.buyersTable.header_th}>사전 발권</th>
                                    </tr>
                                    </thead>
                                    <tbody style={style.buyersTable.tbody}>
                                    {
                                        this.props.data.map((customer, index) => {
                                            return (
                                                <tr style={style.buyersTable.body} key={customer._id}>
                                                    <td style={style.buyersTable.body_td} >{index+1}</td>
                                                    <td style={style.buyersTable.body_td}>{customer.source}</td>
                                                    <td style={style.buyersTable.body_td}>{customer.ticket_code}</td>
                                                    <td style={style.buyersTable.body_td}>{customer.customer_name}</td>
                                                    <td style={style.buyersTable.body_td}>
                                                        <input style={style.checkBox}
                                                               type='checkbox'
                                                               disabled={this.state.mode!=='ticket'&&this.state.customers.length!==0}
                                                               onChange={() => {this.ticket_onChange(customer)}}/>
                                                    </td>
                                                    <td style={style.buyersTable.body_td}>
                                                        <input style={style.checkBox}
                                                               type='checkbox'
                                                               disabled={this.state.mode!=='preTicket'&&this.state.customers.length!==0}
                                                               onChange={()=>{this.preTicket_onChange(customer)}}/>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div style={style.footer}>
                            <button type="button" style={style.submit}
                                    className={classNames({
                                        'btn':true,
                                        'btn-default':true,
                                        'disabled':!this.state.customers||!this.state.customers.length
                                    })} onClick={this.choose}>선택</button>
                            <button type="button" style={style.submit} className="btn btn-default" onClick={this.props.onClose} >닫기</button>
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
    },
    buyersTable:{
        thead:{
            display:'block'
        },
        tbody:{
            display:'block',
            maxHeight:'400px',
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
            padding:'3px',
            width:'120px'
        }
    },
    checkBox:{
        width:'15px',
        height:'15px'
    }
};
export default Buyers;