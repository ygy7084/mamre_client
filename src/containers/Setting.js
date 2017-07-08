import React from 'react';
import {
    Route,
    Switch
} from 'react-router-dom';


import {
    SideBar
} from '../components';

import {
    SettingReservation,
    SettingSeats,
    SettingShow,
    SettingShowtime,
    SettingTheater,
    SettingImage
} from './';

class Setting extends React.Component {
    render() {
        return (
                <div>
                    <SideBar/>
                    <Switch>
                        <Route exact path="/setting" component={null}/>
                        <Route path="/setting/reservation" component={SettingReservation}/>
                        <Route path="/setting/seats" component={SettingSeats}/>
                        <Route path="/setting/show" component={SettingShow}/>
                        <Route path="/setting/showtime" component={SettingShowtime}/>
                        <Route path="/setting/theater" component={SettingTheater}/>
                        <Route path="/setting/image" component={SettingImage}/>
                    </Switch>
                </div>
        )
    }
}

export default Setting;