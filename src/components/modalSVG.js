import React from 'react';

class modalSVG extends React.Component {
    constructor(props) {
        super(props);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openModal() {
        $('#modalSVG').modal('show');
    }
    closeModal() {
        $('#modalSVG').modal('hide');
    }

    render() {
        console.log(this.props.seats_picked);
        return (
            <div
                className="modal fade"
                id='modalSVG'
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
                            <h4 className="modal-title">티켓 조회(확인 용)</h4>
                        </div>
                        <div className="modal-body" style={style.body}>
                            fgf
                        </div>
                        <div style={style.footer}>
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
export default modalSVG;