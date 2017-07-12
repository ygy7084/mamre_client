import React from 'react';

class LoaderModal extends React.Component {
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
        $('#LoaderModal').modal('show');
    }
    closeModal() {
        $('#LoaderModal').modal('hide');
    }

    render() {
        return (
            <div className="modal"
                 id='LoaderModal'
                 data-keyboard="false" //esc 금지
                 data-backdrop="static"//바깥 클릭 기본 프로시져 금지
                 tabIndex="-1"
                 role="dialog">

                <div className="modal-dialog modal-sm"
                     style={style.dialog}
                     role="document">

                    <h2 className="modal-title" style={style.title}>
                        {this.props.title}
                    </h2>

                    <div className="spinner-box">
                        <div className="spinner-axis">
                            <div className="spinner">
                                <div className="spinner-inner">
                                </div>
                            </div>
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
    }
};

export default LoaderModal;