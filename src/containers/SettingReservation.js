import React from 'react';
import FileDownload from 'react-file-download';

import {
    SideContents,
    Table,

    ExcelModal
} from '../components'

class SettingReservation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shows : [],
            show_picked : null,
            theaters : [],
            theater_picked : null,
            excels : [],
            excel_picked : null,
            showtime :[],
            schedule_picked: null,
            parsed_excel : [],
            create : 0,
            uploaded_label :'',
            deleted_label : ''
        };

        this.uploadExcel = this.uploadExcel.bind(this);
        this.uploadNaver = this.uploadNaver.bind(this);
        this.saveExcel = this.saveExcel.bind(this);
        this.theater_and_show_click = this.theater_and_show_click.bind(this);

        this.changeShowIdToName = this.changeShowIdToName.bind(this);
        this.changeTheaterIdToName = this.changeTheaterIdToName.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeNaver = this.handleChangeNaver.bind(this);
        this.fetchSchedule = this.fetchSchedule.bind(this);
        this.deleteSource = this.deleteSource.bind(this);
        this.deleteAll = this.deleteAll.bind(this);
        this.deleteSource2 = this.deleteSource2.bind(this);
        this.deleteAll2 = this.deleteAll2.bind(this);
    }
    componentWillMount() {
        fetch('/api/theater/read',{
            method : 'GET'
        })
            .then(res =>{
                if(res.ok)
                    return res.json();
                else
                    return res.json().then(err => { throw err; })})
            .then(res => {
                this.setState({
                    theaters:res.data
                });
            })
            .catch((err) => {
                let message = err;
                if(err.message && err.message!=='')
                    message = err.message;
                console.log(message);
            });
        fetch('/api/show/read',{
            method : 'GET'
        })
            .then(res =>{
                if(res.ok)
                    return res.json();
                else
                    return res.json().then(err => { throw err; })})
            .then(res => {
                this.setState({
                    shows:res.data
                });
            })
            .catch((err) => {
                let message = err;
                if(err.message && err.message!=='')
                    message = err.message;
                console.log(message);
            });
        fetch('/api/excel/read',{
            method : 'GET'
        })
            .then(res =>{
                if(res.ok)
                    return res.json();
                else
                    return res.json().then(err => { throw err; })})
            .then(res => {
                console.log(res.data);
                this.setState({
                    excels:res.data
                });
            })
            .catch((err) => {
                let message = err;
                if(err.message && err.message!=='')
                    message = err.message;
                console.log(message);
            });
    }

    handleChange(e) {
        this.uploadExcel(e.target.files[0], '/api/excel/parse/reservation');
    }
    handleChangeNaver(e) {
        this.uploadNaver(e.target.files[0], '/api/excel/parse/naverReservation');
    }
    uploadNaver(file, url) {
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
    uploadExcel(file) {
        //make formdata
        const url = '/api/excel/parse/reservation';
        let data = new FormData();
        data.append('file', file);
        data.append('_id', this.state.excel_picked._id);


        return fetch(url,{
            method : 'POST',
            body : data
        })
            .then(res =>{
                if(res.ok)
                    return res.json();
                else
                    return res.json().then(err => { throw err; })})
            .then(res => {
                this.setState({parsed_excel:res.data});
                $('#ExcelModal').modal('show');

            })
            .catch((err) => {
                let message = err;
                if(err.message && err.message!=='')
                    message = err.message;
                console.log(message);
            });
    }
    fetchSchedule(obj) {
        if((obj.theater_picked||this.state.theater_picked) && (obj.show_picked||this.state.show_picked)) {

            const theater = (obj.theater_picked||this.state.theater_picked)._id
            const show =  (obj.show_picked||this.state.show_picked)._id;
            fetch('/api/showtime/read/theater/'+theater+'/show/'+show,{
                method : 'GET'
            })
                .then(res =>{
                    if(res.ok)
                        return res.json();
                    else
                        return res.json().then(err => { throw err; })})
                .then(res => {
                    console.log(res.data[0])
                    this.setState({showtime:res.data[0]});
                })
                .catch((err) => {
                    let message = err;
                    if(err.message && err.message!=='')
                        message = err.message;
                    console.log(message);
                });
        }
    }
    saveExcel() {

        let data = [];
        for(let p of this.state.parsed_excel) {

            if(this.state.schedule_picked) {
                if(new Date(p.show_date).getTime() === new Date(this.state.schedule_picked.date).getTime()) {
                    let reservation = {
                        input_date: new Date(),
                        source: this.state.excel_picked.source,
                        customer_name: p.customer_name,
                        customer_phone: p.customer_phone,
                        show_date: p.show_date,
                        seat_class: p.seat_class,
                        seat_position: p.seat_position,
                        ticket_quantity: p.ticket_quantity,
                        ticket_code: p.ticket_code,
                        ticket_price: p.ticket_price,
                        theater: this.state.theater_picked._id,
                        show: this.state.show_picked._id,
                        discount: p.discount
                    };
                    data.push(reservation);
                }else {}

            }else {
                let reservation = {
                    input_date: new Date(),
                    source: this.state.excel_picked.source,
                    customer_name: p.customer_name,
                    customer_phone: p.customer_phone,
                    show_date: p.show_date,
                    seat_class: p.seat_class,
                    seat_position: p.seat_position,
                    ticket_quantity: p.ticket_quantity,
                    ticket_code: p.ticket_code,
                    ticket_price: p.ticket_price,
                    theater: this.state.theater_picked._id,
                    show: this.state.show_picked._id,
                    discount: p.discount
                };
                console.log(reservation);
                data.push(reservation);
            }
        }

        let wrapper = {
            data : data
        };
        return fetch('/api/reservation/createMany',{
            method : 'POST',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify(wrapper)
        })
            .then(res =>{
                if(res.ok)
                    return res.json();
                else
                    return res.json().then(err => { throw err; })})
            .then(res => {
                this.setState({uploaded_label:this.state.excel_picked.source})
                console.log(res.data);
            })
            .catch((err) => {
                let message = err;
                if(err.message && err.message!=='')
                    message = err.message;
                console.log(message);
            });
    }
    changeTheaterIdToName(_id) {
        for (let t of this.state.theaters)
            if (t._id === _id)
                return t.name;
        return null;
    }
    changeShowIdToName(_id) {
        for (let s of this.state.shows)
            if (s._id === _id)
                return s.name;
        return null;
    }
    theater_and_show_click(data) {
        this.setState(data);
        if(this.state.theater_picked && this.state.show_picked) {
            const theater = this.state.theater_picked._id;
            const show = this.state.show_picked._id;
            fetch('/api/showtime/read/theater/'+theater+'/show/'+show,{
                method : 'GET'
            })
                .then(res =>{
                    if(res.ok)
                        return res.json();
                    else
                        return res.json().then(err => { throw err; })})
                .then(res => {
                    this.setState({showtimes:res.data[0]});
                })
                .catch((err) => {
                    let message = err;
                    if(err.message && err.message!=='')
                        message = err.message;
                    console.log(message);
                });
        }
    }
    deleteSource() {
        const wrapper = {
            data : {
                theater : this.state.theater_picked._id,
                show    : this.state.show_picked._id,
                source  : this.state.excel_picked.source
            }
        };
        return fetch('/api/reservation/delete/source', {
            method : 'DELETE',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify(wrapper)
        })
            .then(res =>{
                if(res.ok)
                    return res.json();
                else
                    return res.json().then(err => { throw err; })})
            .then(res => {
                console.log(res);
                this.setState({
                    deleted_label:'전체 소스 예매 삭제 완료'
                })
            })
    }
    deleteAll() {
        const wrapper = {
            data : {
                theater : this.state.theater_picked._id,
                show    : this.state.show_picked._id
            }
        };
        return fetch('/api/reservation/delete/all', {
            method : 'DELETE',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify(wrapper)
        })
            .then(res =>{
                if(res.ok)
                    return res.json();
                else
                    return res.json().then(err => { throw err; })})
            .then(res => {
                console.log(res);
                this.setState({
                    deleted_label:'전체 예매 삭제 완료'
                })
            })
    }

    deleteSource2() {
        const wrapper = {
            data : {
                theater : this.state.theater_picked._id,
                show    : this.state.show_picked._id,
                source  : this.state.excel_picked.source,
                show_date    : this.state.schedule_picked.date
            }
        };
        return fetch('/api/reservation/delete/source2', {
            method : 'DELETE',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify(wrapper)
        })
            .then(res =>{
                if(res.ok)
                    return res.json();
                else
                    return res.json().then(err => { throw err; })})
            .then(res => {
                console.log(res);
                this.setState({
                    deleted_label:'회차 소스 예매 삭제 완료'
                })
            })
    }
    deleteAll2() {
        const wrapper = {
            data : {
                theater : this.state.theater_picked._id,
                show    : this.state.show_picked._id,
                show_date : this.state.schedule_picked.date
            }
        };
        return fetch('/api/reservation/delete/all2', {
            method : 'DELETE',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify(wrapper)
        })
            .then(res =>{
                if(res.ok)
                    return res.json();
                else
                    return res.json().then(err => { throw err; })})
            .then(res => {
                console.log(res);
                this.setState({
                    deleted_label:'회차 예매 삭제 완료'
                })
            })
    }

    render() {


        let Create =(
            <div>
                <div className="btn-group">
                    <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {this.state.theater_picked ? this.state.theater_picked.name : '공연장 선택'}
                        <span className="caret"/>
                    </button>
                    <ul className="dropdown-menu">
                        {this.state.theaters.map((t) => {
                            return <li key={t._id}><a onClick={(e)=>{this.setState({theater_picked:t});this.fetchSchedule({theater_picked:t})}}>{t.name}</a></li>
                        })}
                    </ul>
                </div>
                <div className="btn-group">

                <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {this.state.show_picked ? this.state.show_picked.name : '공연 선택'}
                    <span className="caret"/>
                </button>
                <ul className="dropdown-menu">
                    {this.state.shows.map((s) => {
                        return <li key={s._id}><a onClick={(e)=>{this.setState({show_picked:s});this.fetchSchedule({show_picked:s})}}>{s.name}</a></li>
                    })}
                </ul>
                </div>
                <div className="btn-group">

                    <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {this.state.excel_picked ? this.state.excel_picked.source : '엑셀 선택'}
                        <span className="caret"/>
                    </button>
                    <ul className="dropdown-menu">
                        {this.state.excels.map((s) => {
                            return <li key={s._id}><a onClick={(e)=>{this.setState({excel_picked:s});}}>{s.source}</a></li>
                })}
                    </ul>
                </div>
                <div className="btn-group">

                    <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {this.state.schedule_picked ? new Date(this.state.schedule_picked.date).toLocaleString() : '일부 회차만 변경'}
                        <span className="caret"/>
                    </button>
                    <ul className="dropdown-menu">
                        {this.state.showtime.schedule && this.state.showtime.schedule.map((e) => {
                            let date = new Date(e.date).toLocaleString();
                            return (
                                <li key={date._id}>
                                    <a href='#' onClick={() => {
                                        this.setState({schedule_picked: e})
                                    }}>{date}</a>
                                </li>
                            )
                        })
                        }
                    </ul>
                </div>
                {this.state.schedule_picked ?
                    <div className="btn-group">
                        <button type="button" className="btn btn-default dropdown-toggle" onClick={()=>{this.setState({schedule_picked:undefined})}} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            전체 변경
                        </button>
                    </div>
                :
                    null
                }

            </div>
            );

        let ExcelInput = null;
        if(this.state.theater_picked && this.state.show_picked && this.state.excel_picked) {
            ExcelInput = (
                <div className='form-group'>
                    <label>엑셀 파일 입력</label>
                    <input type='file' onChange={this.handleChange}/>
                </div>
            );
        }


        let ExcelPopup = null;
        if(this.state.parsed_excel && this.state.parsed_excel.length>0) {
            const properties = [];
            for(let i in this.state.parsed_excel[0])
                properties.push(i);

            ExcelPopup = (
                <ExcelModal
                    title={this.changeTheaterIdToName(this.state.theater_picked._id)+'에서의 '+this.changeShowIdToName(this.state.show_picked._id)+'의 엑셀 입력'}
                    onSave={this.saveExcel}>
                    <p>{this.state.parsed_excel.length} rows</p>
                    <table>
                        <thead>
                        <tr>
                            {properties.map((p) => {return <th key={p}>{p}</th>})}
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.parsed_excel.map((e) => {
                            let i = 0;

                            let date;
                            if(this.state.schedule_picked) {
                                date = this.state.schedule_picked.date;
                                if(new Date(date).getTime() !== new Date(e.show_date).getTime())
                                    return null;
                            }
                                return(
                                    <tr key={Math.random()+i}>
                                        {properties.map((p)=> {
                                            let data = e[p];
                                            if(p==='show_date')
                                                data = new Date(data).toLocaleString();
                                            if(p==='seat_position' && (data && data!==''))
                                                data = data.floor+'층 '+data.col+'열 '+data.num+'번';
                                            if(!data || data==='')
                                                data = 'NULL';
                                            return <td key={i++}>{data}</td>
                                        })}
                                    </tr>
                                )
                        })}
                        </tbody>
                    </table>
                </ExcelModal>
            );

        }

        return (
            <SideContents>
                <h1>
                    예매 내역 엑셀 입력
                </h1>
                <p>
                    예매 내역 엑셀을 입력합니다.
                </p>
                <form>
                    <label>
                        네이버 엑셀은 이 곳을 통해 한번 포맷을 변환 시켜주시고 밑의 파싱을 진행하십시요.
                        <input type='file' onChange={this.handleChangeNaver}/>
                    </label>
                </form>
                {Create}
                {ExcelInput}
                {ExcelPopup}
                {this.state.uploaded_label.length ? this.state.uploaded_label+' 업로드 완료' :null}
                <h3>{this.state.deleted_label}</h3>
                <div style={{'marginTop':'150px'}}>
                    <button className='btn btn-info' onClick={this.deleteAll2}>회차 예매 삭제</button>
                    <p>위에서 선택한 회차의 예매 데이터를 전부 삭제합니다. 공연장과 공연과 회차를 선택하십시요.</p>
                </div>
                <div>
                    <button className='btn btn-info' onClick={this.deleteSource2}>회차 예매처 예매 삭제</button>
                    <p>위에서 선택한 회차에서의 선택한 예매처를 출처로 갖는 예매 데이터를 전부 삭제합니다. 공연장과 공연과 회차와 예매처를 선택하십시요.</p>
                </div>
                <div style={{'marginTop':'150px'}}>
                    <button className='btn btn-warning' onClick={this.deleteAll}>전체 예매 삭제</button>
                    <p>예매 데이터를 전부 삭제합니다. 공연장과 공연을 선택하십시요.</p>
                </div>
                <div>
                    <button className='btn btn-warning' onClick={this.deleteSource}>전체 예매처 예매 삭제</button>
                    <p>위에서 선택한 예매처의 예매 데이터를 전부 삭제합니다. 공연장과 공연과 예매처를 선택하십시요.</p>
                </div>

            </SideContents>
        )
    }
}

export default SettingReservation;