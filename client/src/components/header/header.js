import React, {Component, Fragment} from 'react';
import {Link} from 'react-router-dom';

class Header extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div style={{marginBottom: 10, paddingBottom: 5, borderBottom: '1px solid black'}}>
            <strong>Genealogy Mapper</strong> | <Link to={'/'}>Map</Link> | <Link to={'/unhistorical'}>Unhistorical Figures</Link>
        </div>
    }
}

export default Header;