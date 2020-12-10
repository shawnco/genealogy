import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import _ from 'lodash';
import Minipanel from './minipanel';

class LocationDetails extends Component {
    constructor(props) {
        super(props);
    }

    filterPeople(people, id, birth) {
        const key = (birth == 1 ? 'bl' : 'dl') + '_id';
        return people.filter(p => p[key] == id);
    }

    render() {
        const {location, people, show, birth, death}  = this.props;
        if (!location.id) {
            return null;
        } else {
            console.log(this.filterPeople(people, location.id, birth))
            return <Fragment> 
                <Minipanel title={'Location Details'}>
                    <Link to={`/location/${location.id}`}>{location.location}</Link>
                </Minipanel> 
                <Minipanel title={'People Here'}>
                    {this.filterPeople(people, location.id, birth).map(person => {
                        return <div>
                            <Link to={`/person/${person.person_id}`}>{person.name} ({person.birth} - {person.death})</Link>    
                        </div>
                    })}
                </Minipanel>
            </Fragment>
        }
    }
}

const mapStateToProps = ({location, people, controls}) => {
    return {
        location: location.location,
        people: people.people,
        birth: controls.birth,
        death: controls.death
    };
}

export default connect(mapStateToProps, {})(LocationDetails);