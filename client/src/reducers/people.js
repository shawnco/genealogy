import {
    GET_PEOPLE,
    GET_PERSON,
    UPDATE_PERSON,
    GET_UNHISTORICAL
} from '../actions/people';

var initial = {
    people: [],
    personFull: {},
    unhistorical: []
};

export default function(state = initial, action) {
    switch(action.type) {
        case GET_PEOPLE:
            return { ...state, people: action.payload};
        case GET_PERSON:
            return {...state, personFull: action.payload};
        case UPDATE_PERSON:
            return {...state, personFull: {...state.personFull, person: action.payload}};
        case GET_UNHISTORICAL:
            return {...state, unhistorical: action.payload};
    };
    return state;    
}