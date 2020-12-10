import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {
    setStart,
    setEnd,
    setBirth,
    setDeath,
    setHistorical
} from '../../actions/controls';
import {
    getPeople
} from '../../actions/people';
import _ from 'lodash';
import { compose } from 'redux';
import LocationDetails from './location_details';

class Controls extends Component {
    constructor(props) {
        super(props);
        this.setStart = this.setStart.bind(this);
        this.setEnd = this.setEnd.bind(this);
        this.setBirth = this.setBirth.bind(this);
        this.setDeath = this.setDeath.bind(this);
        this.setHistorical = this.setHistorical.bind(this);
        this.getPeople = this.getPeople.bind(this);
    }

    componentDidMount() {
        this.getPeople();
    }

    setStart(e) {
        this.props.setStart(e.target.value);
    }

    setEnd(e) {
        this.props.setEnd(e.target.value);
    }

    setBirth(e) {
        this.props.setBirth();
    }

    setDeath(e) {
        this.props.setDeath();
    }

    setHistorical(e) {
        this.props.setHistorical();
    }

    getPeople(e) {
        const {birth, death, start, end, historical} = this.props;
        const filter = {
            start,
            end,
            birth,
            death,
            historical
        };
        this.props.getPeople(filter);
    }

    render() {
        const {birth, death, start, end, historical} = this.props;
        return <Fragment>
            <b>Years:</b><br />
            From <input name='start' value={start} onChange={this.setStart} /><br />
            To <input name='end' value={end} onChange={this.setEnd} /><br />

            <b>Show:</b><br />
            Births <input name='birth' type='checkbox' onClick={this.setBirth} checked={birth} /><br />
            Deaths <input name='death' type='checkbox' onClick={this.setDeath} checked={death} /><br />
            Historical only: <input name='historical' type='checkbox' onClick={this.setHistorical} checked={historical} /><br />

            <button 
                onClick={this.getPeople}
                disabled={start == '' || end == '' || !(birth || death)}
            >Submit</button>

            <LocationDetails />
        </Fragment>
    }
}

const mapStateToProps = ({controls}) => {
    return {...controls} // im gonna regret this
}

export default connect(mapStateToProps, {
    setStart,
    setEnd,
    setBirth,
    setDeath,
    setHistorical,
    getPeople
})(Controls);