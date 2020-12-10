import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form';

class PersonForm extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {onSubmit, handleSubmit} = this.props;
        return <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor='name'>Name:</label> 
            <Field name='name' component='input' type='text' /><br />

            <label htmlFor='birth'>Birth:</label> 
            <Field name='birth' component='input' type='text' /><br />

            <label htmlFor='death'>Death:</label>
            <Field name='death' component='input' type='text' /><br />

            <label htmlFor='historical'>Historical:</label> 
            <Field name='historical' component='input' type='checkbox' /><br />

            <button type='submit'>Update</button>
        </form>
    }
}

const mapStateToProps = ({people}) => {
    return {
        initialValues: people.personFull.person
    };
}

PersonForm = reduxForm({
    form: 'person'
})(PersonForm);

export default connect(mapStateToProps, {})(PersonForm);