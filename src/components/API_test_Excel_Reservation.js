import React from 'react';

class API_test_Excel_Reservation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            theater_picked:null,
            show_picked:null,
            excel_picked:null,
            theater:[],
            show:[],
            excel:[],
            parsed_excel:[]
        };
        this.uploadFile = this.uploadFile.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.saveExcel = this.saveExcel.bind(this);
    }
    uploadFile(file, url) {

        //make formdata
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
                console.log(res.data);
                this.setState({parsed_excel:res.data});
            })
            .catch((err) => {
                let message = err;
                if(err.message && err.message!=='')
                    message = err.message;
                console.log(message);
            });
    }
    handleChange(e) {
        this.uploadFile(e.target.files[0], '/api/excel/parse/reservation');
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
                console.log(res.data);
                this.setState({
                    theater:res.data
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
                console.log(res.data);
                this.setState({
                    show:res.data
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
                    excel:res.data
                });
            })
            .catch((err) => {
                let message = err;
                if(err.message && err.message!=='')
                    message = err.message;
                console.log(message);
            });
    }
    saveExcel() {
        let data = [];
        for(let p of this.state.parsed_excel) {
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
                show: this.state.show_picked._id
            };
            data.push(reservation);
        }
        return fetch('/api/reservation/createMany',{
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
    render() {
        let ExcelInput = null;
        if(this.state.parsed_excel && this.state.parsed_excel.length>0) {
            const properties = [];
            for(let i in this.state.parsed_excel[0])
                properties.push(i);
            ExcelInput =(
                <div>
                    <a href='#' onClick={this.saveExcel}>엑셀 저장</a>
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
                            return(
                                <tr>
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
                </div>
            )
        }
        return (
            <div>
                <div>
                    {this.state.theater.map((t) => {
                        return <a href='#' key={t._id} onClick={()=>{this.setState({theater_picked:t})}}>{t.name}</a>;
                    })}
                </div>
                <div>
                    {this.state.show.map((t) => {
                        return <a href='#' key={t._id} onClick={()=>{this.setState({show_picked:t})}}>{t.name}</a>;
                    })}
                </div>
                <div>
                    {this.state.excel.map((t) => {
                        return <a href='#' key={t._id} onClick={()=>{this.setState({excel_picked:t})}}>{t.source}</a>;
                    })}
                </div>
                <div>
                    <p>{this.state.theater_picked ? this.state.theater_picked.name+' '+this.state.theater_picked._id : null}</p>
                    <p>{this.state.show_picked ? this.state.show_picked.name+' '+this.state.show_picked._id : null}</p>
                    <p>{this.state.excel_picked ? this.state.excel_picked.source+' '+this.state.excel_picked._id : null}</p>
                </div>
                <form>
                    <label>
                        엑셀 예약 파싱 테스트
                        <input type='file' onChange={this.handleChange}/>
                    </label>
                    <input type='submit' value='업로드'/>
                </form>
                {ExcelInput}
            </div>
        )
    }
}

export default API_test_Excel_Reservation;