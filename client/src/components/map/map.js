import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {GoogleMap, Marker} from '@react-google-maps/api';
import {getAllLocations, getLocation} from '../../actions/location';
import Controls from './../controls/controls';
import _ from 'lodash';

const containerStyle = {
    width: '1000px',
    height: '1000px'
};

const center = {
    lat: 39.8283,
    lng: -28.6731
};

class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            points: []
        }
        this.getLocation = this.getLocation.bind(this);
    }

    getLocation(id) {
        console.log(id);
        this.props.getLocation(id);
    }

    concatSameLocation(points) {
        let groupedPoints = [];
        points.map(pt => {
            const find = _.find(groupedPoints, gp => gp.lat == pt.lat && gp.lng == gp.lng);
            if (find) {
                find.label += `${pt.name} (${pt.birth_year} - ${pt.death_year})\n`;
            } else {
                groupedPoints.push({
                    id: pt.location_id,
                    lat: pt.lat,
                    lng: pt.lng,
                    label: `${pt.name} (${pt.birth_year} - ${pt.death_year})\n`
                });
            }
        })
        return groupedPoints;
    }

    render() {
        const {points} = this.props;
        const filtered = points.filter(pt => pt.lat != null && pt.lng != null);
        return <div style={{width: '100%'}}>
            <div style={{width: '20%', display: 'inline-block', float: 'left'}}>
                <Controls />
            </div>
            <div style={{width: '80%', display: 'inline-block'}}>
                <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={3}>
                    {this.concatSameLocation(filtered).map(pt => <Marker
                        key={pt.id}
                        position={{lat: pt.lat, lng: pt.lng}}
                        title={pt.label}
                        clickable={true}
                        onClick={e => this.getLocation(pt.id)}
                    />)}
                </GoogleMap>
            </div>
        </div>
    }
}

const mapStateToProps = ({people}) => {
    return {
        points: people.people
    }
}

export default connect(mapStateToProps, {
    getAllLocations,
    getLocation
})(Map);