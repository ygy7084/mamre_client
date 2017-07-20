import React from 'react';
import FileDownload from 'react-file-download';

class API_test_Excel_NaverReservation extends React.Component {
    constructor(props) {
        super(props);
        this.uploadFile = this.uploadFile.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    uploadFile(file, url) {
        //make formdata
        let data = new FormData();
        data.append('file', file);

        return fetch(url,{
            method : 'POST',
            body : data
        })
            .then(res=> res.blob())
            .then((blob) => {
                FileDownload(blob, 'naver.xlsx');
            })
            .catch((err) => {
                let message = err;
                if(err.message && err.message!=='')
                    message = err.message;
                console.log(message);
            });
    }
    handleChange(e) {
        this.uploadFile(e.target.files[0], '/api/excel/parse/naverReservation');
    }
    render() {
        return (
            <div>

                <form>
                    <label>
                        네이버 엑셀 예약 파싱 테스트
                        <input type='file' onChange={this.handleChange}/>
                    </label>
                </form>
            </div>
        )
    }
}

export default API_test_Excel_NaverReservation;