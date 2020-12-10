import {
    GET_ALL_LOCATIONS,
    GET_LOCATION,
    GET_LOCATION_FULL
} from '../actions/location';

var initial = {
    locations: [],
    location: {},
    locationFull: {}
};

export default function(state = initial, action) {
    switch(action.type) {
        case GET_ALL_LOCATIONS:
            return {...state, locations: action.payload};
        case GET_LOCATION:
            return {...state, location: action.payload};
        case GET_LOCATION_FULL:
            return {...state, locationFull: action.payload};
    };
    return state;    
}