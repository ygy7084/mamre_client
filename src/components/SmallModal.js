import React from 'react';
import classNames from 'classnames';

class SmallModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected:'선택'
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onChange = this.onChange.bind(this);
        this.changePrice = this.changePrice.bind(this);
        this.changePriceAll = this.changePriceAll.bind(this);
    }

    componentDidMount() {
        this.props.on ? this.openModal() : this.closeModal()
    }
    componentWillReceiveProps(nextProps) {
        nextProps.on ? this.openModal() : this.closeModal()
    }
    openModal() {
        $('#SmallModal').modal('show');
    }
    closeModal() {
        this.setState({
            selected:'선택'
        });
        $('#SmallModal').modal('hide');
    }
    onChange(e) {
        this.setState({
            selected:e.target.value
        });
    }
    changePrice() {
        if(this.state.selected !== '선택')
            this.props.changePrice(this.state.selected*this.props.basePrice);
    }
    changePriceAll() {
        if(this.state.selected !== '선택')
            this.props.changePriceAll(this.state.selected);
    }
    render() {
        if(!this.props.price_picked)
            return null;
        return (
            <div className="modal" 
                 id='SmallModal'  
                 data-keyboard="false" //esc 금지
                 data-backdrop="static"//바깥 클릭 기본 프로시져 금지
                 tabIndex="-1">
                
                <div className="modal-dialog modal-sm" 
                     style={style.dialog}>
                    
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" 
                                    onClick={this.props.onClose} 
                                    className="close">
                                <span>&times;</span>
                            </button>
                            <h4 className="modal-title">
                                {   this.props.price_picked.col + '열 ' +
                                    this.props.price_picked.num + '번 좌석의 가격을 변경합니다.'}
                            </h4>
                        </div>
                        <div className="modal-body">
                            <div>
                                <h3>현재 해당
                                    좌석은 {this.props.price_picked.seat_class}, {this.props.price_picked.price}원입니다.</h3>
                                <select onChange={this.onChange} value={this.state.selected} className="form-control">
                                    <option value="선택">선택</option>
                                    <option value={1}>기본 가격 : {this.props.basePrice}</option>
                                    <option value={0.5}>50% 할인권 : {this.props.basePrice * 0.5}</option>
                                    <option value={0.5}>장애인, 국가 유공자 : {this.props.basePrice * 0.5}</option>
                                    <option value={0}>초대권 : 0</option>
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button"
                                    className={classNames({
                                        'btn': true,
                                        'btn-default' : true,
                                        'disabled' : this.state.selected==='선택'
                                    })}
                                    onClick={this.changePrice}>
                                적용
                            </button>
                            <button type="button"
                                    className={classNames({
                                        'btn': true,
                                        'btn-default' : true,
                                        'disabled' : this.state.selected==='선택'
                                    })}
                                    onClick={this.changePriceAll}>
                                일괄 적용
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
const style = {
    dialog:{
        margin:'auto',
        width:'500px',
        left:'360px',
        top:'250px'
    }
};

export default SmallModal;