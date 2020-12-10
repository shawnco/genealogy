import './App.css';

import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import {LoadScript} from '@react-google-maps/api';

import Location from './components/location/location';
import Map from './components/map/map';
import Person from './components/person/person';
import Unhistorical from './components/unhistorical/unhistorical';

class App extends Component {
    constructor() {
        super();
    }

    render() {
        return <div className='app' style={{ width: '100%' }}>
            <LoadScript googleMapsApiKey='AIzaSyCG7Pax7CvGW_uOPYz69eK5BjvUga0S6oM'>
                <Route path='/' component={Map} exact />
                <Route path='/location/:id' component={Location} exact />
                <Route path='/map' component={Map} exact />
                <Route path='/person/:id' component={Person} exact />
                <Route path='/unhistorical' component={Unhistorical} exact />
            </LoadScript>
        </div>
    }
}

export default App;