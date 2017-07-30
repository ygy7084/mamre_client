import React from 'react';

class PointSavingModal extends React.Component {
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
        $('#PointSavingModal').modal('show');
    }
    closeModal() {
        $('#PointSavingModal').modal('hide');
    }

    render() {
        return (
            <div className="modal"
                 id='PointSavingModal'
                 data-keyboard="false" //esc 금지
                 data-backdrop="static"//바깥 클릭 기본 프로시져 금지
                 tabIndex="-1"
                 role="dialog">

                <div className="modal-dialog modal-lg"
                     style={style.dialog}
                     role="document">

                    <h2 className="modal-title" style={style.title}>
                        {this.props.inputNumber+'님 1점이 적립되었습니다.'}
                    </h2>
                    <h2 style={style.point}>{'잔여 포인트 : '+this.props.point}</h2>
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
    point:{
        color:'white',
        textAlign:'center'
    }
};

export default PointSavingModal;