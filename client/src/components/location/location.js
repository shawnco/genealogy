import React, {Component, Fragment} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {getLocationFull, dupeLocation} from './../../actions/location';
import _ from 'lodash';
import Minipanel from './../controls/minipanel';
import Autocomplete from './../common/autocomplete';
import {GoogleMap, Marker} from '@react-google-maps/api';

const containerStyle = {
    width: '500px',
    height: '500px'
};

class Location extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDupe: ''
        }
        this.addDuplicate = this.addDuplicate.bind(this);
        this.setDupe = this.setDupe.bind(this);
    }

    componentDidMount() {
        const id = _.get(this.props, 'match.params.id', null);
        if (id) {
            this.props.getLocationFull(id);
        }
    }

    addDuplicate(e) {
        // Compile array of locations this needs to not match
        const {id} = this.props.match.params;
        let locations = this.props.locationFull.duplicates;
        locations.push({id});
        const find = _.find(locations, l => this.state.selectedDupe == l.id);
        if (!find) {
            this.props.dupeLocation(this.props.match.params.id, this.state.selectedDupe);
        }
    }

    setDupe(e) {
        console.log(e);
        this.setState({ selectedDupe: e });
    }

    render() {
        if (!this.props.locationFull.location) {
            return null;
        } else {
            const {location, birth, death, duplicates} = this.props.locationFull;
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

                    <Minipanel title={'Locations matched to this'}>
                        {duplicates.map(dupe => <div>
                            <Link to={`/location/${dupe.id}`}>{dupe.location}</Link>
                        </div>)}
                        <Autocomplete
                            url={'location/search'}
                            formatDisplay={o => o.location}
                            onSelect={o => this.setDupe(o.id)}
                        />
                        <button onClick={this.addDuplicate}>Add</button>
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
    getLocationFull,
    dupeLocation
})(Location);