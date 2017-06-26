import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';

import createHistory from 'history/createBrowserHistory';
const history = createHistory();
//Save history so that refresh works well

import { API_test } from '../components'


const APItest = () => (
    <Router history={history}>
        <div>
            <ul>
                <li><Link to="/">API test</Link></li>
            </ul>

            <hr/>

            <Route exact path="/" component={API_test}/>
        </div>
    </Router>
)

class App extends React.Component {
    render() {
        return (
            <div>
                <APItest />
            </div>
        )
    }
}

export default App;
