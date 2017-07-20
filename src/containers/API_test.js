import React from 'react';
import {
    Route,
    Link
} from 'react-router-dom';

import {
    API_test_Excel_Reservation,
    API_test_Excel_NaverReservation,
    API_test_Excel_Showtime,
    API_test_Excel_Theater,
    API_test_CRUD_Theater,
    API_test_CRUD_Show,
    API_test_CRUD_Showtime,
    API_test_CRUD_Excel,
    API_test_CRUD_Reservation,
    API_test_Crawler,
} from '../components'


class API_test extends React.Component {
    render() {
        return (
            <div>
                <ul>
                    <li><Link to="/test/API_test_Excel_Reservation">API_test_Excel_Reservation</Link></li>
                    <li><Link to="/test/API_test_Excel_NaverReservation">API_test_Excel_NaverReservation</Link></li>
                    <li><Link to="/test/API_test_Excel_Showtime">API_test_Excel_Showtime</Link></li>
                    <li><Link to="/test/API_test_Excel_Theater">API_test_Excel_Theater</Link></li>
                    <li><Link to="/test/API_test_CRUD_Theater">API_test_CRUD_Theater</Link></li>
                    <li><Link to="/test/API_test_CRUD_Show">API_test_CRUD_Show</Link></li>
                    <li><Link to="/test/API_test_CRUD_Showtime">API_test_CRUD_Showtime</Link></li>
                    <li><Link to="/test/API_test_CRUD_Excel">API_test_CRUD_Excel</Link></li>
                    <li><Link to="/test/API_test_CRUD_Reservation">API_test_CRUD_Reservation</Link></li>
                    <li><Link to="/test/API_test_Crawler">API_test_Crawler</Link></li>
                </ul>

                <hr/>
                <Route path="/test/API_test_Excel_Reservation" component={API_test_Excel_Reservation}/>
                <Route path="/test/API_test_Excel_NaverReservation" component={API_test_Excel_NaverReservation}/>
                <Route path="/test/API_test_Excel_Showtime" component={API_test_Excel_Showtime}/>
                <Route path="/test/API_test_Excel_Theater" component={API_test_Excel_Theater}/>
                <Route path="/test/API_test_CRUD_Theater" component={API_test_CRUD_Theater}/>
                <Route path="/test/API_test_CRUD_Show" component={API_test_CRUD_Show}/>
                <Route path="/test/API_test_CRUD_Showtime" component={API_test_CRUD_Showtime}/>
                <Route path="/test/API_test_CRUD_Excel" component={API_test_CRUD_Excel}/>
                <Route path="/test/API_test_CRUD_Reservation" component={API_test_CRUD_Reservation}/>
                <Route path="/test/API_test_Crawler" component={API_test_Crawler}/>
            </div>
        )
    }
}

export default API_test;