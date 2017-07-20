import React from 'react';

class MultiPrintModal extends React.Component {
    constructor(props) {
        super(props);
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
        $('#MultiPrintModal').modal('show');
    }
    closeModal() {
        $('#MultiPrintModal').modal('hide');
    }
    render() {
        return (
            <div className="modal fade"
                 id='MultiPrintModal'
                 data-keyboard="false" //esc 금지
                 data-backdrop="static"//바깥 클릭 기본 프로시져 금지
                 tabIndex="-1">

                <div className="modal-dialog modal-sm"
                     style={style.dialog}>

                    <h2 className="modal-title" style={style.title}>
                        {this.props.seatNum+'개의 좌석을 하나의 티켓으로 출력합니까?'}
                    </h2>

                    <div className='modal-body' style={style.body}>
                        <div className="btn-group">
                            <button type="button" className="btn btn-primary btn-lg">예</button>
                            <button type="button" className="btn btn-default btn-lg">아니요</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const style = {
    title:{
        color:'white',
        textAlign:'center',
        marginTop:'125px'
    },
    body : {
        textAlign : 'center',
        marginTop : '50px'
    }
};

export default MultiPrintModal;