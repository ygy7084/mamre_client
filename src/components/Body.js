import React from 'react';

class Body extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <div style={style.body}>
                {this.props.children}
            </div>
        )
    }
}

const style = {
    body:{
        paddingTop:'20px'
    }
};

export default Body