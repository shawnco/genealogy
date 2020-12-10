import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {getUnhistorical} from './../../actions/people';

class Unhistorical extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.getUnhistorical();
    }

    render() {
        return <Fragment>
            <p>This page lists members of the genealogy who are considered not historical. Usually they are mythological or legendary figures. They may be based upon an actual person 
                such as an ancient king or other powerful figure. But it's also likely they were simply invented for some reason.</p>
        </Fragment>
    }
}

const mapStateToProps = ({people}) => {
    return {
        unhistorical: people.unhistorical
    };
}

export default connect(mapStateToProps, {getUnhistorical})(Unhistorical);