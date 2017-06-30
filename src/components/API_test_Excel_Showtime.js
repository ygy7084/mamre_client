import React from 'react';

class API_test_Excel_Show extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            theater_picked:null,
            show_picked:null,
            theater:[],
            show:[],
            parsed_excel:[]
        };
        this.uploadExcel = this.uploadExcel.bind(this);
        this.uploadExcel_change = this.uploadExcel_change.bind(this);
        this.saveExcel = this.saveExcel.bind(this);
    }
    uploadExcel(file) {
        let data = new FormData();
        data.append('file', file);

        return fetch('/api/excel/parse/showtime',{
            method : 'POST',
            body : data
        })
            .then(res => res.json())
            .then(res => {
                this.setState({
                    parsed_excel : res
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }
    uploadExcel_change(e) {
        this.uploadExcel(e.target.files[0]);
    }
    saveExcel() {
        let data = {
            theater : this.state.theater_picked._id,
            show : this.state.show_picked._id,
            schedule : this.state.parsed_excel
        };
        return fetch('/api/showtime/create',{
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
    componentWillMount() {
        fetch('/api/theater/read/all',{
            method : 'GET'
        })
            .then(res => res.json())
            .then(res => {
                this.setState({
                    theater:res.theater
                });
            })
            .catch((err) => {
                console.log(err);
            });
        fetch('/api/show/read/all',{
            method : 'GET'
        })
            .then(res => res.json())
            .then(res => {
                this.setState({
                    show:res.show
                });
            })
            .catch((err) => {
                console.log(err);
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
                            {properties.map((p) => {return <th>{p}</th>})}
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.parsed_excel.map((e) => {
                            return(
                                <tr>
                                    {properties.map((p)=> {return <td>{e[p]}</td>})}
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
                    <p>{this.state.theater_picked ? this.state.theater_picked.name+' '+this.state.theater_picked._id : null}</p>
                    <p>{this.state.show_picked ? this.state.show_picked.name+' '+this.state.show_picked._id : null}</p>
                </div>
                <form>
                    <label>
                        Showtime Excel을 통한 Create 테스트
                        <input type='file' onChange={this.uploadExcel_change}/>
                    </label>
                </form>
                {ExcelInput}
            </div>
        )
    }
}

export default API_test_Excel_Show;