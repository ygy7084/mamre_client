import React from 'react';

import {
    Link
} from 'react-router-dom';

class Entry extends React.Component {
    render() {
        return (
            <div className='container' style={style.vertical_center}>
                <div style={style.horizontal_center}>
                    <Link className='btn btn-primary btn-lg btn-block' to='/customer'>고객 사용 페이지</Link>
                    <Link className='btn btn-default btn-lg btn-block' to='/manager'>관리자 페이지</Link>
                </div>
            </div>
        )
    }
}

const style = {
    vertical_center : {
        height : '70vh',
        display : 'flex',
        alignItems : 'center'
    },
    horizontal_center : {
        margin : '0 auto',
        width : '40%'
    }
};

export default Entry;