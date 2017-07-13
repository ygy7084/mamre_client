import React from 'react';
import SVG from './'

class SVGM extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        // let svgs = [];
        // let seats_picked = this.props.seats_picked;
        // for(let seat of seats_picked) {
        //     if(seats_picked.length<=10) {
        //         let same = true;
        //         let first = seats_picked[0].seat_class;
        //         for(let seat of seats_picked) {
        //             if(first !== seat.seat_class){
        //                 break;
        //                 same = false;
        //             }
        //         }
        //     }
        // }

        return (
            <div className="modal fade" id='SVGM' tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title">{this.props.title}</h4>
                        </div>
                        <div className="modal-body">

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">종료</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SVGM;