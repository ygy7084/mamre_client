import React from 'react';

class API_test_Excel_Theater extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            theater_picked:{},
            theater:[],
            parsed_excel:[]
        };
        this.uploadExcel = this.uploadExcel.bind(this);
        this.uploadExcel_change = this.uploadExcel_change.bind(this);
        this.saveExcel = this.saveExcel.bind(this);
    }
    uploadExcel(file) {
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
                console.log(res.data);
                this.setState({
                    parsed_excel : res.data
                });
            })
            .catch((err) => {
                let message = err;
                if(err.message && err.message!=='')
                    message = err.message;
                console.log(message);
            });
    }
    uploadExcel_change(e) {
        this.uploadExcel(e.target.files[0]);
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
                console.log(res.data);
            })
            .catch((err) => {
                let message = err;
                if(err.message && err.message!=='')
                    message = err.message;
                console.log(message);
            });
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
                            let i=0;
                            return(
                            <tr>
                                {properties.map((p)=> {return <td key={i++}>{e[p]}</td>})}
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
                    <p>{this.state.theater_picked.name}</p>
                    <p>{this.state.theater_picked.seats_quantity}</p>
                    <p>{this.state.theater_picked._id}</p>
                </div>
                <form>
                    <label>
                        Theater Excel을 통한 Modify 테스트
                        <input type='file' onChange={this.uploadExcel_change}/>
                    </label>
                </form>
                {ExcelInput}
            </div>
        )
    }
}

export default API_test_Excel_Theater;