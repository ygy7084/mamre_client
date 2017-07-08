import React from 'react';

import {
    Link
} from 'react-router-dom';

class Header extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <div style={style.header}>
                <Link to='/' style={style.Link}>
                    <h2 style={style.h2}>{this.props.title}</h2>
                </Link>
            </div>
        )
    }
}

const style = {
    header:{
        paddingTop:'12px',
        paddingBottom:'10px',
        background:'linear-gradient(to bottom , rgb(26,42,87), rgb(37,60,126))',
        color:'white'
    },
    Link:{
        color:'white',
        textDecoration:'none'
    },
    h2:{
        marginTop:0,
        marginBottom:0,
        marginLeft:'30px'
    }
};

export default Header;