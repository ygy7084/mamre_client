import React from 'react';
import classNames from 'classnames';

class Pre_ticket extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sourceInput:'',
            priceInput:''
        };
        this.sourceInput_onChange = this.sourceInput_onChange.bind(this);
        this.priceInput_onChange = this.priceInput_onChange.bind(this);
        this.ticketting = this.ticketting.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.ticketExcel = this.ticketExcel.bind(this);
    }
    componentDidMount() {
        this.props.on ? this.openModal() : this.closeModal()
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            sourceInput:'',
            priceInput:''
        });
        nextProps.on ? this.openModal() : this.closeModal()
    }
    openModal() {
        $('#Pre_ticket').modal('show');
    }
    closeModal() {
        this.setState({
            sourceInput:'',
            priceInput:''
        });
        $('#Pre_ticket').modal('hide');
    }

    sourceInput_onChange(e) {
        this.setState({
            sourceInput:e.target.value
        })
    }
    priceInput_onChange(e) {
        this.setState({
            priceInput:e.target.value
        })
    }
    ticketting() {
        if(this.state.sourceInput&&
            this.state.sourceInput.length&&
            this.state.priceInput&&
            this.state.priceInput.length) {
            this.props.preTicketting(this.state.sourceInput, this.state.priceInput);
            this.props.onClose();
        }
    }
    ticketExcel() {
        if(this.state.sourceInput&&
            this.state.sourceInput.length&&
            this.state.priceInput&&
            this.state.priceInput.length) {
            this.props.ticketExcel(this.state.sourceInput, this.state.priceInput);
        }
    }
    render() {
        return (
            <div
                className="modal fade"
                id='Pre_ticket'
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
                            <h4 className="modal-title">사전 발권</h4>
                        </div>
                        <div className="modal-body" style={style.body}>
                            <div>
                                <label>
                                    단체명
                                </label>
                                <input type='text'
                                       style={style.input}
                                       onChange={this.sourceInput_onChange}
                                       value={this.state.sourceInput}/>
                            </div>
                            <div>
                            <label>
                                판매가
                            </label>
                                <input type='number'
                                       style={style.input}
                                       onChange={this.priceInput_onChange}
                                       value={this.state.priceInput}/>
                            </div>
                        </div>
                        <div style={style.footer}>
                            <button type="button"
                                    style={style.submit}
                                    className={classNames({
                                        'btn':true,
                                        'btn-default':true,
                                        'disabled':!(this.state.sourceInput&&
                                                     this.state.sourceInput.length&&
                                                     this.state.priceInput&&
                                                     this.state.priceInput.length)
                                    })}
                                    onClick={this.ticketting}>
                                발권
                            </button>
                            <button type="button"
                                    style={style.submit}
                                    className={classNames({
                                        'btn':true,
                                        'btn-default':true,
                                        'disabled':!(this.state.sourceInput&&
                                        this.state.sourceInput.length&&
                                        this.state.priceInput&&
                                        this.state.priceInput.length)
                                    })}
                                    onClick={this.ticketExcel}>
                                엑셀 출력
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
const style = {
    dialog : {
        width: '500px',
        top : '150px'
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
        paddingTop : '25px'
    },
    input : {
        width : '300px',
        margin : '5px'
    },
    footer : {
        textAlign : 'center'
    },
    submit : {
        marginTop : '10px',
        marginBottom : '40px',
        width:'150px',
        height:'50px',
        background:'rgb(146,39,143)',
        color:'white'
    }
};
export default Pre_ticket;