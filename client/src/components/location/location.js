import React, {Component, Fragment} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {getLocationFull} from './../../actions/location';
import _ from 'lodash';
import Minipanel from './../controls/minipanel';
import {GoogleMap, Marker} from '@react-google-maps/api';

const containerStyle = {
    width: '500px',
    height: '500px'
};

class Location extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const id = _.get(this.props, 'match.params.id', null);
        if (id) {
            this.props.getLocationFull(id);
        }
    }

    render() {
        if (!this.props.locationFull.location) {
            return null;
        } else {
            const {location, birth, death} = this.props.locationFull;
            const center = {lat: location.lat, lng: location.lng};
            return <div style={{width: '100%'}}>
                <div style={{width: '20%', display: 'inline-block', float: 'left'}}>
                    <Minipanel title={'Location'}>
                        {location.location}<br />
                        Coordinates: {location.lat}, {location.lng}
                    </Minipanel>

                    <Minipanel title={'People born here'}>
                        {birth.map(person => <Link to={`/person/${person.id}`}>
                            <div>{person.name} ({person.birth} - {person.death})</div>
                        </Link>)}
                    </Minipanel>

                    <Minipanel title={'People died here'}>
                        {death.map(person => <Link to={`/person/${person.id}`}> 
                            <div>{person.name} ({person.birth} - {person.death})</div>
                        </Link>)}
                    </Minipanel>
                </div>
                <div style={{width: '80%', display: 'inline-block'}}>
                    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={8}>
                        <Marker
                            position={{lat: location.lat, lng: location.lng}}
                            title={location.location}
                        />
                    </GoogleMap>
                </div>
            </div>
        }
    }
}

const mapStateToProps = ({location}) => {
    return {
        locationFull: location.locationFull
    };
}

export default connect(mapStateToProps, {
    getLocationFull
})(Location);