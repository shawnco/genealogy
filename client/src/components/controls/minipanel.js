import React, {Component} from 'react';

class Minipanel extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div style={{marginTop: 20}}>
            <b>{this.props.title}</b><br />
            {this.props.children}
        </div>
    }
}

export default Minipanel;