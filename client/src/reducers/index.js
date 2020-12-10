import { combineReducers } from 'redux';
import location from './location';
import controls from  './controls';
import people from './people';
import {reducer as formReducer} from 'redux-form';

export default combineReducers({
    location,
    controls,
    people,
    form: formReducer
});