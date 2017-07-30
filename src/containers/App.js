import React from 'react';

import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';

import {
    Entry
} from '../components'

import {
    Customer,
    Manager
} from './';

import createHistory from 'history/createBrowserHistory';
const history = createHistory();

class App extends React.Component {
    constructor(props) {
        super(props);
        this.postAddSaving     = this.postAddSaving.bind(this);
        this.getPhoneSaving    = this.getPhoneSaving.bind(this);
        this.getAllSavings     = this.getAllSavings.bind(this);
        this.putPhoneSaving    = this.putPhoneSaving.bind(this);
        this.deletePhoneSaving = this.deletePhoneSaving.bind(this);
    }
    postAddSaving(){
        fetch('/save', {
            method : 'POST',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify(undefined)
        })
            .then(res => res.json())
            .then((data) => {
                return data;
            })
    }
    getPhoneSaving() {
        fetch('/saving/')
            .then(res => res.json())
            .then((data) => {
                return data;
        })
    }
    getAllSavings() {
        fetch('/saving/all')
            .then(res => res.json())
            .then((data) => {
                return data;
            })
    }
    putPhoneSaving() {
        fetch('/saving/modify', {
            method : 'PUT',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify(undefined)
        })
            .then(res => res.json())
            .then((data) => {
                return data;
            })
    }
    deletePhoneSaving() {
        fetch('/saving/modify', {
            method : 'DELETE',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify(undefined)
        })
            .then(res => res.json())
            .then((data) => {
                return data;
            })
    }
    render() {
        return (
            <Router history={history}>
                <div>
                    <Route exact path='/' component={Entry}/>
                    <Route path='/customer' component={Customer}/>
                    <Route path='/manager' component={Manager}/>
                </div>
            </Router>
        )
    }
}

export default App;
