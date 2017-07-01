import React from 'react';

class API_test_CRUD_Show extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            create_input : '',
            delete_input : '',
            excel_picked: null,
            excel_picked_update: null,
            excel : []
        };
        this.createChange = this.createChange.bind(this);
        this.create = this.create.bind(this);
        this.read = this.read.bind(this);
        this.deleteChange = this.deleteChange.bind(this);
        this.delete = this.delete.bind(this);
        this.setDefault = this.setDefault.bind(this);
        this.update = this.update.bind(this);
        this.updateChange_Code = this.updateChange_Code.bind(this);
        this.updateChange_Field = this.updateChange_Field.bind(this);
    }

    createChange(e) {
        this.setState({
            create_input:e.target.value
        });
    }
    create(e) {
        e.preventDefault();
        let data = {
            source : this.state.create_input
        };
        return fetch('/api/excel/create', {
            method : 'POST',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify(data)
        })
            .then(res =>{
                if(res.ok)
                    return res.json();
                else
                    return res.json().then(err => { throw err; })})
            .then(res => {
                console.log(res.data);
            })
            .catch((err) => {
                let message = err;
                if(err.message && err.message!=='')
                    message = err.message;
                console.log(message);
            });
    }
    deleteChange(e) {
        this.setState({
            delete_input:e.target.value
        });
    }
    delete(e) {
        e.preventDefault();
        let data = {
            _id : this.state.delete_input
        };
        return fetch('/api/excel/delete', {
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
                console.log(res.data);
            })
            .catch((err) => {
                let message = err;
                if(err.message && err.message!=='')
                    message = err.message;
                console.log(message);
            });
    }
    read() {
        return fetch('/api/excel/read', {
            method : 'GET'
        })
            .then(res =>{
                if(res.ok)
                    return res.json();
                else
                    return res.json().then(err => { throw err; })})
            .then(res => {
                console.log(res.data);
                this.setState({excel:res.data});
            })
            .catch((err) => {
                let message = err;
                if(err.message && err.message!=='')
                    message = err.message;
                console.log(message);
            });
    }
    update() {
        let data = {
            _id : this.state.excel_picked_update._id,
            update : {
                parsing_rule:this.state.excel_picked_update.parsing_rule
            }
        };
        return fetch('/api/excel/update', {
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
                console.log(res.data);
                this.setState({
                    excel_picked:null,
                    excel_picked_update:null});
            })
            .catch((err) => {
                let message = err;
                if(err.message && err.message!=='')
                    message = err.message;
                console.log(message);
            });
    }
    setDefault() {
        this.setState((state) => {
            state.excel_picked_update = JSON.parse(JSON.stringify(state.excel_picked));
        });
    }
    updateChange_Code(e) {
        let parsing_rule = this.state.excel_picked_update.parsing_rule;
        if(!parsing_rule)
            parsing_rule = {};
        if(!parsing_rule[e.target.name])
            parsing_rule[e.target.name] = {};

        parsing_rule[e.target.name]['code'] = e.target.value;
        this.setState((state) => {
            state.excel_picked_update.parsing_rule = parsing_rule
        });
    }
    updateChange_Field(e) {
        let parsing_rule = this.state.excel_picked_update.parsing_rule;
        if(!parsing_rule)
            parsing_rule = {};
        if(!parsing_rule[e.target.name])
            parsing_rule[e.target.name] = {};

        parsing_rule[e.target.name]['field'] = e.target.value;
        this.setState((state) => {
            state.excel_picked_update.parsing_rule = parsing_rule
        });
    }
    render() {
        let excel = null;
        if(this.state.excel && this.state.excel.length!==0) {
            excel =
                (
                <div>
                    {this.state.excel.map((e) => {
                        return <a href='#' key={e._id} onClick={()=>{this.setState({excel_picked:e, excel_picked_update:JSON.parse(JSON.stringify(e))})}}>{e.source}</a>;
                    })}
                </div>
                )
        }
        let excel_picked = null;
        if(this.state.excel_picked && this.state.excel_picked.length!==0) {
            const parsing_rule = [
                {
                    rule : 'customer_name',
                    desc : '고객 이름'
                },
                {
                    rule : 'customer_phone',
                    desc : '고객 핸드폰(뒷4자리)'
                },
                {
                    rule : 'show_date_year',
                    desc : '공연 날짜의 연도',
                    init : 'month가 현재 월보다 작으면 올해+1 아니면 올해'
                },
                {
                    rule : 'show_date_month',
                    desc : '공연 날짜의 월'
                },
                {
                    rule : 'show_date_day',
                    desc : '공연 날짜의 일'
                },
                {
                    rule : 'show_time_hour',
                    desc : '공연 시각의 시간'
                },
                {
                    rule : 'show_time_minute',
                    desc : '공연 시각의 분',
                    init : '0'
                },
                {
                    rule : 'seat_class',
                    desc : '좌석 등급'
                },
                {
                    rule : 'seat_position_floor',
                    desc : '좌석 층 수',
                    init : 'Null (미지정)'
                },
                {
                    rule : 'seat_position_col',
                    desc : '좌석 열',
                    init : 'Null (미지정)'
                },
                {
                    rule : 'seat_position_num',
                    desc : '좌석 번호',
                    init : 'Null (미지정)'
                },
                {
                    rule : 'ticket_quantity',
                    desc : '티켓 수량',
                    init : '1'
                },
                {
                    rule : 'ticket_code',
                    desc : '티켓 코드(예약번호,주문번호,티켓번호 등 각 사이트별 코드)'
                },
                {
                    rule : 'ticket_price',
                    desc : '티켓 가격'
                }
            ];
            excel_picked =
                (
                    <div>
                        <a href='#' onClick={this.setDefault}>초기화</a>
                        <a href='#' onClick={this.update}>수정</a>
                        <p>{this.state.excel_picked.source}</p>
                        {

                            parsing_rule.map((p) => {
                                const excel = this.state.excel_picked_update;
                                let field = '';
                                let code = '';
                                if(excel.parsing_rule && excel.parsing_rule[p.rule]) {
                                    if(excel.parsing_rule[p.rule].field)
                                        field = excel.parsing_rule[p.rule].field;
                                    if(excel.parsing_rule[p.rule].code)
                                        code = excel.parsing_rule[p.rule].code;
                                }
                                return (
                                    <div key={p.rule}>
                                        <p>{p.rule}</p>
                                        <p>{p.desc}</p>
                                        <p>{p.init ? '기본값 : '+p.init : '필수'}</p>
                                        <div>
                                            <input onChange={this.updateChange_Field} name={p.rule} type='text' value={field}/>
                                        </div>
                                        <div>
                                            <textarea onChange={this.updateChange_Code} name={p.rule} style={{width:'400px', height:'200px', overflowY: 'scroll'}} value={code}/>
                                        </div>

                                    </div>
                                )
                            })
                        }
                    </div>
                )
        }
        return (
            <div>
                <form onSubmit={this.create}>
                    <label>
                        Excel Create
                        <input type='text' value={this.state.create_input} onChange={this.createChange}/>
                    </label>
                    <input type='submit' value='Create'/>
                </form>
                <a href='#' onClick={this.read}>READ ALL</a>
                <form onSubmit={this.delete}>
                    <label>
                        Excel Delete
                        <input type='text' value={this.state.delete_input} onChange={this.deleteChange}/>
                    </label>
                    <input type='submit' value='Delete'/>
                </form>
                {excel}
                {excel_picked}
            </div>
        )
    }
}

export default API_test_CRUD_Show;