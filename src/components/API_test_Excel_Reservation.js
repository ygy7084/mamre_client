import React from 'react';

class API_test_Excel_Reservation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status : ''//test
        };
        this.uploadFile = this.uploadFile.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    uploadFile(file, url) {
        //test
        let source = '쿠팡';

        //make formdata
        let data = new FormData();
        data.append('file', file);
        data.append('source', source);

        return fetch(url,{
            method : 'POST',
            body : data
        })
            .then(res => res.json())
            .then(res => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    }
    handleSubmit(e) {
        e.preventDefault();
        let data = {
            id : 'abc',
            number : 123
        };
        fetch('/api/excel/create',{
            method : 'POST',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify(data)
        })
            .then(res => res.json())
            .then(res => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });

    }
    handleChange(e) {
        this.uploadFile(e.target.files[0], '/api/excel/parse/reservation');
        this.setState({
            status:e.target.value
        });
    }
    render() {
        return (
            <div>
                <h1>{this.state.status}</h1>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        쿠팡 엑셀 예약 파싱 테스트
                        <input type='file' onChange={this.handleChange}/>
                    </label>
                    <input type='submit' value='업로드'/>
                </form>
            </div>
        )
    }
}

export default API_test_Excel_Reservation;