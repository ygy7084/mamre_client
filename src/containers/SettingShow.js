import React from 'react';

import {
    SideContents,
    Table,
    ClickableTable,
    InfoModal,

} from '../components'

class SettingShow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shows : [],
            show_picked : null,
            show_create_input : '',
            show_create_input_state : '공연 생성',
        };
        this.showClick = this.showClick.bind(this);
        this.show_create_input_onChange = this.show_create_input_onChange.bind(this);
        this.show_create_input_toggle = this.show_create_input_toggle.bind(this);
        this.show_delete = this.show_delete.bind(this);
    }
    componentWillMount() {
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
    }
    showClick(Item_clicked) {
        if(this.state.show_picked === Item_clicked)
            $('#InfoModal').modal('show');
        else
            this.setState({show_picked: Item_clicked});
    }
    show_create_input_onChange(e) {
        if(e.target.value==='')
            this.setState({show_create_input:e.target.value,show_create_input_state:'취소'});
        else
            this.setState({show_create_input:e.target.value,show_create_input_state:'생성하기'});
    }
    show_create_input_toggle() {
        if(this.state.show_create_input_state==='공연 생성')
            this.setState({show_create_input_state:'취소'});
        else if(this.state.show_create_input_state==='취소')
            this.setState({show_create_input_state:'공연 생성'});
        else if(this.state.show_create_input_state==='생성하기') {
            let data = {
                name : this.state.show_create_input
            };
            let wrapper = {
                data : data
            };
            return fetch('/api/show/create', {
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
                    this.setState({show_create_input:'',show_create_input_state:'공연 생성'});
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
                })
                .catch((err) => {
                    let message = err;
                    if(err.message && err.message!=='')
                        message = err.message;
                    console.log(message);
                });
        }
    }
    show_delete() {
        let data = {
            _id : this.state.show_picked._id
        };
        let wrapper = {
            data : data
        };
        return fetch('/api/show/delete', {
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


                this.setState({show_picked:null});
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
        if(this.state.show_create_input_state !=='공연 생성')
            create = (
                <div className="input-group">
                    <input type="text" className="form-control" placeholder="생성할 공연의 이름" value={this.state.show_create_input} onChange={this.show_create_input_onChange}/>
                </div>
            );

        let InfoPopup = null;
        if(this.state.show_picked) {
            InfoPopup = (
            <InfoModal title={this.state.show_picked ? this.state.show_picked.name : null} onDelete={this.show_delete}>
                <h1>
                    공연을 삭제합니까?
                </h1>
            </InfoModal>
            );
        }

        return (
            <SideContents>
                <h1>
                    공연(Show)
                </h1>
                <p>
                    {"조회된 개수 : "+this.state.shows.length}
                </p>
                <a onClick={this.show_create_input_toggle} className='btn btn-success' >{this.state.show_create_input_state}</a>
                {create}
                <div>
                    {this.state.shows.length ? <ClickableTable data={this.state.shows} filters={['name','seats_quantity']} onClick={this.showClick} clicked={this.state.show_picked}/> : null}
                </div>
                {InfoPopup}
            </SideContents>
        )
    }
}

export default SettingShow;