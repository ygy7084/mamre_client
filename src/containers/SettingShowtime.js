import React from 'react';

import {
    SideContents,
    Table,
    ClickableTable,
    InfoModal,
    ExcelModal
} from '../components'

class SettingTheater extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shows : [],
            show_picked : null,
            theaters : [],
            theater_picked : null,
            showtimes : [],
            showtime_picked : null,
            parsed_excel : [],
            create : 0
        };
        this.theaterClick = this.theaterClick.bind(this);
        this.showClick = this.showClick.bind(this);
        this.showtimeClick = this.showtimeClick.bind(this);
        this.showtime_create = this.showtime_create.bind(this);
        this.showtime_delete = this.showtime_delete.bind(this);
        this.uploadExcel = this.uploadExcel.bind(this);
        this.saveExcel = this.saveExcel.bind(this);
        this.changeShowIdToName = this.changeShowIdToName.bind(this);
        this.changeTheaterIdToName = this.changeTheaterIdToName.bind(this);
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
        fetch('/api/showtime/read',{
            method : 'GET'
        })
            .then(res =>{
                if(res.ok)
                    return res.json();
                else
                    return res.json().then(err => { throw err; })})
            .then(res => {
                this.setState({
                    showtimes:res.data
                });
            })
            .catch((err) => {
                let message = err;
                if(err.message && err.message!=='')
                    message = err.message;
                console.log(message);
            });
    }
    theaterClick(Item_clicked) {
        this.setState({theater_picked: Item_clicked});
    }
    showClick(Item_clicked) {
        this.setState({show_picked: Item_clicked});
    }
    showtimeClick(Item_clicked) {
        if(this.state.showtime_picked && this.state.showtime_picked._id === Item_clicked._id)
            $('#InfoModal').modal('show');
        else {
            let sp_clicked;
            for(let sp of this.state.showtimes) {
                if(sp._id === Item_clicked._id) {
                    sp_clicked = sp;
                    break;
                }
            }
            this.setState({showtime_picked: sp_clicked});
        }
    }
    showtime_create() {
        let data = {
            theater : this.state.theater_picked._id,
            show : this.state.show_picked._id
        };
        let wrapper = {
            data : data
        };
        return fetch('/api/showtime/create', {
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

                this.setState({create:0, show_picked:null, theater_picked:null});
                fetch('/api/showtime/read',{
                    method : 'GET'
                })
                    .then(res =>{
                        if(res.ok)
                            return res.json();
                        else
                            return res.json().then(err => { throw err; })})
                    .then(res => {
                        this.setState({
                            showtimes:res.data
                        });
                    })
                    .catch((err) => {
                        let message = err;
                        if(err.message && err.message!=='')
                            message = err.message;
                        console.log(message);
                    });
            })
            .catch((err) => {
                let message = err;
                if(err.message && err.message!=='')
                    message = err.message;
                console.log(message);
            });
    }
    showtime_delete() {
        let data = {
            _id : this.state.showtime_picked._id
        };
        let wrapper = {
            data : data
        };
        return fetch('/api/showtime/delete', {
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

                this.setState({showtime_picked:null});
                fetch('/api/showtime/read',{
                    method : 'GET'
                })
                    .then(res =>{
                        if(res.ok)
                            return res.json();
                        else
                            return res.json().then(err => { throw err; })})
                    .then(res => {
                        this.setState({
                            showtimes:res.data
                        });
                    })
                    .catch((err) => {
                        let message = err;
                        if(err.message && err.message!=='')
                            message = err.message;
                        console.log(message);
                    });
            })
            .catch((err) => {
                let message = err;
                if(err.message && err.message!=='')
                    message = err.message;
                console.log(message);
            });
    }
    uploadExcel(e) {
        const file = e.target.files[0];
        let data = new FormData();
        data.append('file', file);

        return fetch('/api/excel/parse/showtime',{
            method : 'POST',
            body : data
        })
            .then(res =>{
                if(res.ok)
                    return res.json();
                else
                    return res.json().then(err => { throw err; })})
            .then(res => {
                this.setState({
                    parsed_excel : res.data
                });

                $('#ExcelModal').modal('show');
            })
            .catch((err) => {
                let message = err;
                if(err.message && err.message!=='')
                    message = err.message;
                console.log(message);
            });
    }
    saveExcel() {
        let data = {
            _id : this.state.showtime_picked._id,
            update : {
                schedule : this.state.parsed_excel
            }
        };
        let wrapper = {
            data : data
        };
        return fetch('/api/showtime/update',{
            method : 'PUT',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify(wrapper)
        })
            .then(res =>{
                if(res.ok)
                    return res.json();
                else
                    return res.json().then(err => { throw err; })})
            .then(res => {
                fetch('/api/showtime/read',{
                    method : 'GET'
                })
                    .then(res =>{
                        if(res.ok)
                            return res.json();
                        else
                            return res.json().then(err => { throw err; })})
                    .then(res => {
                        this.setState({
                            showtimes:res.data,
                            showtime_picked:null
                        });
                    })
                    .catch((err) => {
                        let message = err;
                        if(err.message && err.message!=='')
                            message = err.message;
                        console.log(message);
                    });            })
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
    render() {

        let Create;
        if(this.state.create===0) {
            Create =
                <div className='form-group'>
                    <a onClick={()=>{this.setState({create:1})}} className='btn btn-success' >공연 일정 생성</a>
                </div>
        }
        else if(this.state.create===1) {
            let create_button = (
                <div className='form-group'>
                    <a onClick={this.showtime_create} className='btn btn-success' >생성하기</a>
                </div>
            );
            Create =(
            <div>
                <div className="btn-group">
                    <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {this.state.theater_picked ? this.state.theater_picked.name : '공연장 선택'}
                        <span className="caret"/>
                    </button>
                    <ul className="dropdown-menu">
                        {this.state.theaters.map((t) => {
                            return <li key={t._id}><a onClick={(e)=>{this.setState({theater_picked:t})}}>{t.name}</a></li>
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
                        return <li key={s._id}><a onClick={(e)=>{this.setState({show_picked:s})}}>{s.name}</a></li>
                    })}
                </ul>
                </div>
                {this.state.theater_picked && this.state.show_picked ? create_button : null}
            </div>
            )
        }

        let ExcelInput = null;
        if(this.state.showtime_picked) {
            ExcelInput = (
                <div className='form-group'>
                    <label>엑셀 파일 입력</label>
                    <input type='file' onChange={this.uploadExcel}/>
                </div>
            );
        }


        let ExcelPopup = null;
        if(this.state.showtime_picked && this.state.parsed_excel && this.state.parsed_excel.length!==0) {
            let data = [];
            for(let pe of this.state.parsed_excel) {
                let d = {
                    date : new Date(pe.date).toLocaleString(),
                    url : pe.url
                };
                data.push(d);
            }
            ExcelPopup = (
                <ExcelModal title={this.changeTheaterIdToName(this.state.showtime_picked.theater)+'에서의 '+this.changeShowIdToName(this.state.showtime_picked.show)+'의 엑셀 입력'} onSave={this.saveExcel}>
                    <Table data={data}/>
                </ExcelModal>
            );

        }

        let InfoPopup = null;
        if(this.state.showtime_picked) {
            let data = [];
            for(let s of this.state.showtime_picked.schedule) {
                let d = {
                    date : new Date(s.date).toLocaleString(),
                    url : s.url
                };
                data.push(d);
            }
            InfoPopup = (
            <InfoModal title={this.changeTheaterIdToName(this.state.showtime_picked.theater)+'에서의 '+this.changeShowIdToName(this.state.showtime_picked.show)} onDelete={this.showtime_delete}>
                {this.state.showtime_picked ? <Table data={data}/> : null}
            </InfoModal>
            );
        }
        let showtimes_populated = [];
        for(let s of this.state.showtimes) {
            let o = {
                theater : this.changeTheaterIdToName(s.theater),
                show : this.changeShowIdToName(s.show),
                numOfSchedules : s.schedule ? s.schedule.length : 0,
                _id : s._id
            };
            showtimes_populated.push(o);
        }
        console.log(this.state);
        console.log(showtimes_populated);

        return (
            <SideContents>
                <h1>
                    공연 일정(Showtime)
                </h1>
                <p>
                    공연 일정 조회, 삭제를 하려면 리스트를 클릭 하십시요.
                </p>
                <p>
                    {"조회된 개수 : "+this.state.showtimes.length}
                </p>
                {Create}
                {ExcelInput}
                <div>
                    {this.state.showtimes.length ? <ClickableTable data={showtimes_populated} filters={['theater','show','numOfSchedules']} onClick={this.showtimeClick} clicked={this.state.showtime_picked}/> : null}
                </div>
                {ExcelPopup}
                {InfoPopup}
            </SideContents>
        )
    }
}

export default SettingTheater;