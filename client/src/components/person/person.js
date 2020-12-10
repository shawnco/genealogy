import React, {Component, Fragment} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import _ from 'lodash';
import {getPersonFull, updatePerson} from '../../actions/people';
import Minipanel from './../controls/minipanel';
import {GoogleMap, Marker} from '@react-google-maps/api';
import PersonForm from './person_form';

const containerStyle = {
    width: '500px',
    height: '500px'
};

const center = {
    lat: 39.8283,
    lng: -28.6731
};

class Person extends Component {
    constructor(props) {
        super(props);
        this.toggleHistorical = this.toggleHistorical.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const id = _.get(this.props, 'match.params.id', null);
        if (id) {
            this.props.getPersonFull(id);
        }
    }

    handleSubmit(values) {
        const {id, ...rest} = values;
        this.props.updatePerson(id, rest);
    }

    toggleHistorical() {
        let {id, historical} = this.props.personFull.person;
        historical = !historical;
        this.props.updatePerson(id, {historical});
    }

    renderLocation(location) {
        if (!location) {
            return null;
        } else {
            return <Link to={`/location/${location.id}`}>{location.location}</Link>
        }
    }

    renderMarkers(birth_location, death_location) {
        console.log(birth_location, death_location)
        let output = [];
        if (birth_location.id) {
            output.push(<Marker 
                key={birth_location.id}
                position={{lat: birth_location.lat, lng: birth_location.lng}}
                title={`Born: ${birth_location.location}`}
            />);
        }
        if (death_location.id) {
            const {lat, lng} = birth_location;
            if (death_location.lat == lat && death_location.lng == lng) {
                output[0].title = `Born & Died: ${death_location.location}`;
            } else {
                output.push(<Marker 
                    key={death_location.id}
                    position={{lat: death_location.lat, lng: death_location.lng}}
                    title={`Died: ${death_location.location}`}
                />);
            }
        }
        return output;
    }

    render() {
        if (!this.props.personFull.person) {
            return null;
        } else {
            const {person, birth_location, death_location} = this.props.personFull;
            return <div style={{width: '100%'}}>
                <div style={{width: '20%', display: 'inline-block', float: 'left'}}>
                    <Minipanel title={'Person Details'}>
                        <PersonForm onSubmit={this.handleSubmit} />
                    </Minipanel>
                    <Minipanel title={'Person Locations'}>
                        Birth: {this.renderLocation(birth_location)}<br />
                        Death: {this.renderLocation(death_location)}
                    </Minipanel>
                </div>
                <div style={{width: '80%', display: 'inline-block'}}>
                    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={3}>
                        {this.renderMarkers(birth_location, death_location)}
                    </GoogleMap>
                </div>                
            </div>
        }
    }
}

const mapStateToProps = ({people}) => {
    return {
        personFull: people.personFull
    };
}

export default connect(mapStateToProps, {
    getPersonFull,
    updatePerson
})(Person);