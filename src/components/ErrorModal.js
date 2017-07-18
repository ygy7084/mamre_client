import React from 'react';

class ErrorModal extends React.Component {
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
        $('#ErrorModal').modal('show');
    }
    closeModal() {
        $('#ErrorModal').modal('hide');
    }

    render() {
        return (
            <div className="modal"
                 id='ErrorModal'
                 data-keyboard="false" //esc 금지
                 data-backdrop="static"//바깥 클릭 기본 프로시져 금지
                 tabIndex="-1"
                 role="dialog">

                <div className="modal-dialog modal-sm"
                     role="document">

                    <div style={style.wrapper}>
                        <h2 className="modal-title" style={style.title}>
                            {this.props.title}
                        </h2>

                        <button className='btn btn-warning btn-lg' onClick={this.props.onClose}>확인</button>
                    </div>
                </div>
            </div>
        )
    }
}

const style = {
    wrapper:{
        textAlign:'center',
    },
    title:{
        color:'white',
        margin:'50px'
    }
};

export default ErrorModal;