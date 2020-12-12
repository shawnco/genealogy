import React, {Component, Fragment} from 'react';
import Request from './../../actions/request';

/**
 * Utility class for autocomplete.
 * Props:
 *  - url: the API endpoint which does the search. Will always be a POST
 *  - formatDisplay: a function that takes an object and returns how to display it
 *  - onSelect: a function which receives the selected object
 */


class Autocomplete extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: '',
            results: []
        };
        this.setSearch = this.setSearch.bind(this);
        this.selectOption = this.selectOption.bind(this);
    }

    setSearch(e) {
        this.setState({ search: e.target.value }, () => {
            if (this.state.search.length) {
                Request.post(this.props.url, {
                    query: this.state.search
                }).then(res => {
                    this.setState({ results: res.data });
                });
            } else {
                this.setState({ results: [] });
            }
        });
    }

    selectOption(e, item) {
        this.setState({
            search: this.props.formatDisplay(item),
            results: []       
        });
        this.props.onSelect(item);
    }

    render() {
        const {results, search} = this.state;
        return <div style={{position: 'relative'}}>
            <input
                type='text'
                value={search}
                onChange={this.setSearch}
            />
            {results.length > 0 ?
                <table border='1' style={{position: 'absolute', zIndex: 10, backgroundColor: 'white'}}>
                    <tbody>
                        {results.map(result => <tr key={result.id} onClick={e => this.selectOption(e, result)}><td>{this.props.formatDisplay(result)}</td></tr>)}
                    </tbody>
                </table>
            : null }
        </div>
    }
}

export default Autocomplete;