import React from 'react';

class API_test_ExcelParsingRule extends React.Component {
    constructor(props){
        super(props);

        //how to save default code ? - parent?
        this.state = {};
        this.handleChange_code_input = this.handleChange_code_input.bind(this);
    }
    handleChange_code_input(e) {
        this.state = e.target.value;
    }

    render() {
        let code_input = (
            <textarea onChange={thi}>
                {this.state.code}
            </textarea>
        );
        return (
            <div>
                <code_input/>
            </div>
        )
    }
}

export default API_test_ExcelParsingRule;