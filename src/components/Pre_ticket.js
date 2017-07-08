import React from 'react';
import Radium from 'radium';

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
        this.props.preTicketting(this.state.sourceInput, this.state.priceInput);
        this.setState({
            sourceInput : '',
            priceInput : ''
        });
        $('#Pre_ticket').modal('hide');
    }
    render() {
        return (
            <div className="modal fade" id='Pre_ticket' tabIndex="-1" role="dialog">
                <div className="modal-dialog" style ={style.dialog} role="document">
                    <div className="modal-content" style={style.content}>
                        <div className="modal-header" style={style.header}>
                            <button type="button" className="close"  data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title">사전 발권</h4>
                        </div>
                        <div className="modal-body" style={style.body}>
                            <div>
                                <label>
                                    단체명
                                </label>
                                <input type='text' onChange={this.sourceInput_onChange} style={style.input}/>
                            </div>
                            <div>
                            <label>
                                판매가
                            </label>
                                <input type='text' onChange={this.priceInput_onChange} style={style.input}/>
                            </div>
                        </div>
                        <div style={style.footer}>
                            <button type="button" style={style.submit} className="btn btn-default" data-dismiss="modal" onClick={this.ticketting}>발권</button>
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
}
export default Radium(Pre_ticket);