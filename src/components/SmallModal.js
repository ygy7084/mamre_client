import React from 'react';
import Radium from 'radium';

class SmallModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.exit = this.exit.bind(this);
    }
    exit() {
    }
    render() {
        return (
            <div className="modal" id='SmallModal' tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-sm" style={style} role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title">{this.props.title}</h4>
                        </div>
                        <div className="modal-body">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
const style = {
    margin : 'auto',
    width : '500px',
    left : '360px',
    top : '250px'
};

export default Radium(SmallModal);