import React from 'react';
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';

import {
    API_test,
    Main,
    Setting
} from './'

import {
    Entry
} from '../components'

import createHistory from 'history/createBrowserHistory';
const history = createHistory();


class App extends React.Component {
    render() {
        return (
            <Router history={history}>
                <div>
                    <Route exact path="/" component={Entry}/>
                    <Route path="/test" component={API_test}/>
                    <Route path="/main" component={Main}/>
                    <Route path="/setting" component={Setting}/>
                </div>
            </Router>
        )
    }
}

export default App;
