import React from 'react';

class ExtraFunctionModal extends React.Component {
    constructor(props) {
        super(props);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.getAllExcel = this.getAllExcel.bind(this);
        this.changePrintMode = this.changePrintMode.bind(this);
        this.changeCombineMode = this.changeCombineMode.bind(this);
        this.groupTickettingModal = this.groupTickettingModal.bind(this);
        this.interparkTicketting = this.interparkTicketting.bind(this);
        this.reTickettingStart = this.reTickettingStart.bind(this);
    }
    componentDidMount() {
        this.props.on ? this.openModal() : this.closeModal()
    }
    componentWillReceiveProps(nextProps) {
        nextProps.on ? this.openModal() : this.closeModal()
    }
    openModal() {
        $('#ExtraFunctionModal').modal('show');
    }
    closeModal() {
        $('#ExtraFunctionModal').modal('hide');
    }
    getAllExcel() {
        this.props.getAllExcel();
        this.props.extraFunctionModal(false);
    }
    changePrintMode() {
        this.props.changePrintMode(!this.props.autoPrint);
    }
    changeCombineMode() {
        this.props.changeCombineMode(!this.props.autoCombine);
    }
    groupTickettingModal() {
        this.props.groupTickettingModal(true);
        this.props.extraFunctionModal(false);
    }
    interparkTicketting() {
        this.props.interparkTicketting();
        this.props.extraFunctionModal(false);
    }
    reTickettingStart() {
        this.props.reTickettingStart(true);
        this.props.extraFunctionModal(false);
    }
    render() {
        return (
            <div className="modal fade"
                 id='ExtraFunctionModal'
                 data-keyboard="false" //esc 금지
                 data-backdrop="static"//바깥 클릭 기본 프로시져 금지
                 tabIndex="-1">

                <div className="modal-dialog modal-sm"
                     style={style.dialog}>

                    <h2 className="modal-title" style={style.title}>
                        기타 선택
                    </h2>

                    <div className='modal-body' style={style.body}>
                        <div style={style.buttons}>
                            <div className="btn-group">
                                <button type="button" className="btn btn-default" onClick={this.groupTickettingModal}>단체 발권</button>
                                <button type="button" className="btn btn-default" onClick={this.interparkTicketting}>인터파크 발권</button>
                                <button type="button" className="btn btn-default" onClick={this.getAllExcel}>전체 엑셀 출력</button>
                                <button type="button" className="btn btn-default" onClick={this.reTickettingStart}>재발권</button>
                            </div>
                        </div>
                        <div style={style.buttons}>
                            <button
                                type="button"
                                className={this.props.autoPrint ? "btn btn-info":"btn btn-danger"}
                                onClick={this.changePrintMode}>
                                {this.props.autoPrint ? "프린터 자동 출력 켜짐" : "프린터 자동 출력 꺼짐"}
                            </button>
                        </div>
                        <div style={style.buttons}>
                            <button
                                type="button"
                                className={this.props.autoCombine ? "btn btn-info":"btn btn-danger"}
                                onClick={this.changeCombineMode}>
                                {this.props.autoCombine ? "10개 이하 같은 등급 하나의 표로 출력 켜짐" : "10개 이하 같은 등급 하나의 표로 출력 꺼짐"}
                            </button>
                        </div>
                    </div>
                    <div style={style.close}>
                        <button
                            className='btn btn-warning btn-lg'
                            onClick={() => {this.props.extraFunctionModal(false);}}>닫기</button>
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
    },
    buttons: {
      marginBottom : '30px'
    },
    close : {
        textAlign:'center',
        marginTop:'50px'
    }
};

export default ExtraFunctionModal;