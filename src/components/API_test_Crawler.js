import React from 'react';

class API_test_Excel_Show extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            theater_picked:null,
            show_picked:null,
            theater:[],
            show:[],
            showtime:null
        };
        this.theater_and_show_click = this.theater_and_show_click.bind(this);
        this.crawl = this.crawl.bind(this);
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
                    console.log(res.data);
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
    crawl(date) {
        let data = {
            showtime : this.state.showtime._id,
            date : date
        };
        return fetch('/api/seats/showtime/'+data.showtime+'/date/'+new Date(data.date).getTime(),{
            method : 'GET'
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
        let Schedule = null;
        if(this.state.showtime && this.state.showtime.schedule && this.state.showtime.schedule.length>0) {
            const properties = [];
            for(let i in this.state.showtime.schedule[i])
                properties.push(i);
            Schedule =(
                <div>
                    <p>{this.state.showtime.schedule.length} rows</p>
                    {this.state.showtime.schedule.map((e) => {
                        let date = new Date(e.date).toLocaleString();
                        return (
                            <div key={date}>
                                <a href='#' onClick={()=>{this.crawl(e.date)}}>{date}</a>
                            </div>
                        )})

                    })}
                </div>
            )
        }
        return (
            <div>
                <div>
                    {this.state.theater.map((t) => {
                        return <a href='#' key={t._id} onClick={()=>{this.theater_and_show_click({theater_picked:t})}}>{t.name}</a>;
                    })}
                </div>
                <div>
                    {this.state.show.map((t) => {
                        return <a href='#' key={t._id} onClick={()=>{this.theater_and_show_click({show_picked:t})}}>{t.name}</a>;
                    })}
                </div>
                <div>
                    <p>{this.state.theater_picked ? this.state.theater_picked.name+' '+this.state.theater_picked._id : null}</p>
                    <p>{this.state.show_picked ? this.state.show_picked.name+' '+this.state.show_picked._id : null}</p>
                </div>
                {Schedule}
            </div>
        )
    }
}

export default API_test_Excel_Show;