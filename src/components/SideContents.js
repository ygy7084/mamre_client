import React from 'react';
import Radium from 'radium';

class SideContents extends React.Component {
    render() {
        return (
            <div style={style.wrapper}>
                {this.props.children}
            </div>
        )
    }
}

const style = {
    wrapper : {
        marginLeft : '200px'
    }
};

export default Radium(SideContents);