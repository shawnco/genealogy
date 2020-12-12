import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {getUnhistorical} from './../../actions/people';

class Unhistorical extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.getUnhistorical();
    }

    render() {
        const {unhistorical} = this.props;
        return <Fragment>
            <p>This page lists members of the genealogy who are considered not historical. Usually they are mythological or legendary figures. They may be based upon an actual person 
                such as an ancient king or other powerful figure. But it's also likely they were simply invented for some reason.</p>
            <span>{unhistorical.length} people</span>
            <table border='1'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Birth</th>
                        <th>Birth Location</th>
                        <th>Death</th>
                        <th>Death Location</th>
                    </tr>
                </thead>
                <tbody>
                    {unhistorical.map(person => <tr>
                        <td><Link to={`/person/${person.person_id}`}>{person.name}</Link></td>
                        <td>{person.birth}</td>
                        <td><Link to={`/location/${person.bl_id}`}>{person.bl_location}</Link></td>
                        <td>{person.death}</td>
                        <td><Link to={`/location/${person.dl_id}`}>{person.dl_location}</Link></td>
                    </tr>)}
                </tbody>
            </table>
        </Fragment>
    }
}

const mapStateToProps = ({people}) => {
    return {
        unhistorical: people.unhistorical
    };
}

export default connect(mapStateToProps, {getUnhistorical})(Unhistorical);