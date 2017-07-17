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
            theaters : [],
            theater_picked : null,
            theater_create_input : '',
            theater_create_input_state : '공연장 생성',
            parsed_excel : []
        };
        this.theaterClick = this.theaterClick.bind(this);
        this.theater_create_input_onChange = this.theater_create_input_onChange.bind(this);
        this.theater_create_input_toggle = this.theater_create_input_toggle.bind(this);
        this.theater_delete = this.theater_delete.bind(this);
        this.uploadExcel = this.uploadExcel.bind(this);
        this.saveExcel = this.saveExcel.bind(this);
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
    }
    theaterClick(Item_clicked) {
        if(this.state.theater_picked === Item_clicked)
            $('#InfoModal').modal('show');
        else
            this.setState({theater_picked: Item_clicked});
    }
    theater_create_input_onChange(e) {
        if(e.target.value==='')
            this.setState({theater_create_input:e.target.value,theater_create_input_state:'취소'});
        else
            this.setState({theater_create_input:e.target.value,theater_create_input_state:'생성하기'});
    }
    theater_create_input_toggle() {
        if(this.state.theater_create_input_state==='공연장 생성')
            this.setState({theater_create_input_state:'취소'});
        else if(this.state.theater_create_input_state==='취소')
            this.setState({theater_create_input_state:'공연장 생성'});
        else if(this.state.theater_create_input_state==='생성하기') {
            let data = {
                name : this.state.theater_create_input
            };
            let wrapper = {
                data : data
            };
            return fetch('/api/theater/create', {
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

                    //
                    this.setState({theater_create_input:'',theater_create_input_state:'공연장 생성'});
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
                })
                .catch((err) => {
                    let message = err;
                    if(err.message && err.message!=='')
                        message = err.message;
                    console.log(message);
                });
        }
    }
    theater_delete() {
        let data = {
            _id : this.state.theater_picked._id
        };
        return fetch('/api/theater/delete', {
            method : 'DELETE',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify(data)
        })
            .then(res =>{
                if(res.ok)
                    return res.json();
                else
                    return res.json().then(err => { throw err; })})
            .then(res => {


                this.setState({theater_picked:null});
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

        return fetch('/api/excel/parse/theater',{
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
            _id : this.state.theater_picked._id,
            seats : this.state.parsed_excel
        };
        return fetch('/api/theater/update',{
            method : 'PUT',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify(data)
        })
            .then(res =>{
                if(res.ok)
                    return res.json();
                else
                    return res.json().then(err => { throw err; })})
            .then(res => {
                this.setState({theater_picked:null, parsed_excel:[]});
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
            })
            .catch((err) => {
                let message = err;
                if(err.message && err.message!=='')
                    message = err.message;
                console.log(message);
            });
    }
    render() {
        let create = null;
        if(this.state.theater_create_input_state !=='공연장 생성')
            create = (
                <div className="input-group">
                    <input type="text" className="form-control" placeholder="생성할 공연장의 이름" value={this.state.theater_create_input} onChange={this.theater_create_input_onChange}/>
                </div>
            );

        let ExcelInput = null;
        if(this.state.theater_picked) {
            ExcelInput = (
                <div className='form-group'>
                    <label>엑셀 파일 입력</label>
                    <input type='file' onChange={this.uploadExcel}/>
                </div>
            );
        }

        let ExcelPopup = null;
        if(this.state.parsed_excel && this.state.parsed_excel.length!==0) {
            ExcelPopup = (
                <ExcelModal title={this.state.theater_picked.name+'의 엑셀 입력'} onSave={this.saveExcel}>
                    <Table data={this.state.parsed_excel}/>
                </ExcelModal>
            );

        }

        let InfoPopup = null;
        if(this.state.theater_picked) {
            InfoPopup = (
            <InfoModal title={this.state.theater_picked ? this.state.theater_picked.name : null} onDelete={this.theater_delete}>
                {this.state.theater_picked ? <Table data={this.state.theater_picked.seats} filters={['floor','col','num','seat_class']}/> : null}
            </InfoModal>
            );
        }

        return (
            <SideContents>
                <h1>
                    공연장(Theater)
                </h1>
                <p>
                    좌석 조회, 좌석 엑셀 입력, 삭제를 하려면 리스트를 클릭 하십시요.
                </p>
                <p>
                    {"조회된 개수 : "+this.state.theaters.length}
                </p>
                <a onClick={this.theater_create_input_toggle} className='btn btn-success' >{this.state.theater_create_input_state}</a>
                {create}
                {ExcelInput}
                <div>
                    {this.state.theaters.length ? <ClickableTable data={this.state.theaters} filters={['name','seats_quantity']} onClick={this.theaterClick} clicked={this.state.theater_picked}/> : null}
                </div>
                {ExcelPopup}
                {InfoPopup}
            </SideContents>
        )
    }
}

export default SettingTheater;