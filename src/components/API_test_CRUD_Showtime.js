import React from 'react';

class API_test_CRUD_Show extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            create_input : '',
            delete_input : ''
        };
        this.createChange = this.createChange.bind(this);
        this.create = this.create.bind(this);
        this.read = this.read.bind(this);
        this.deleteChange = this.deleteChange.bind(this);
        this.delete = this.delete.bind(this);
    }

    createChange(e) {
        this.setState({
            create_input:e.target.value
        });
    }
    create(e) {
        e.preventDefault();
        let data = {
            name : this.state.create_input
        };
        return fetch('/api/showtime/create', {
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
        return fetch('/api/showtime/delete', {
            method : 'DELETE',
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
    read() {
        return fetch('/api/showtime/read/all', {
            method : 'GET'
        })
            .then(res => res.json())
            .then(res => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        return (
            <div>
                <form onSubmit={this.create}>
                    <label>
                        Showtime Create
                        <input type='text' value={this.state.create_input} onChange={this.createChange}/>
                    </label>
                    <input type='submit' value='Create'/>
                </form>
                <a href='#' onClick={this.read}>READ ALL</a>
                <form onSubmit={this.delete}>
                    <label>
                        Showtime Delete
                        <input type='text' value={this.state.delete_input} onChange={this.deleteChange}/>
                    </label>
                    <input type='submit' value='Delete'/>
                </form>
            </div>
        )
    }
}

export default API_test_CRUD_Show;