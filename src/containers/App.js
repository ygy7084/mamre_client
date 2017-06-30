import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';

import createHistory from 'history/createBrowserHistory';
const history = createHistory();
// HISTORY 제대로 작동안한다

import {
    API_test_Excel_Reservation,
    API_test_Excel_Showtime,
    API_test_Excel_Theater,
    API_test_CRUD_Theater,
    API_test_CRUD_Show,
    API_test_CRUD_Showtime,
    API_test_CRUD_Excel
} from '../components'



const APItest = () => (
    <Router history={history}>
        <div>
            <ul>
                <li><Link to="/API_test_Excel_Reservation">API_test_Excel_Reservation</Link></li>
                <li><Link to="/API_test_Excel_Showtime">API_test_Excel_Showtime</Link></li>
                <li><Link to="/API_test_Excel_Theater">API_test_Excel_Theater</Link></li>
                <li><Link to="/API_test_CRUD_Theater">API_test_CRUD_Theater</Link></li>
                <li><Link to="/API_test_CRUD_Show">API_test_CRUD_Show</Link></li>
                <li><Link to="/API_test_CRUD_Showtime">API_test_CRUD_Showtime</Link></li>
                <li><Link to="/API_test_CRUD_Excel">API_test_CRUD_Excel</Link></li>
            </ul>

            <hr/>

            <Route exact path="/" component={null}/>
            <Route exact path="/API_test_Excel_Reservation" component={API_test_Excel_Reservation}/>
            <Route exact path="/API_test_Excel_Showtime" component={API_test_Excel_Showtime}/>
            <Route exact path="/API_test_Excel_Theater" component={API_test_Excel_Theater}/>
            <Route exact path="/API_test_CRUD_Theater" component={API_test_CRUD_Theater}/>
            <Route exact path="/API_test_CRUD_Show" component={API_test_CRUD_Show}/>
            <Route exact path="/API_test_CRUD_Showtime" component={API_test_CRUD_Showtime}/>
            <Route exact path="/API_test_CRUD_Excel" component={API_test_CRUD_Excel}/>
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
