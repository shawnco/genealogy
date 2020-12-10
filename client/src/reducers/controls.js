import {
    SET_START,
    SET_END,
    SET_BIRTH,
    SET_DEATH,
    SET_HISTORICAL
} from '../actions/controls';

var initial = {
    start: (new Date()).getFullYear() - 100,
    end: (new Date()).getFullYear(),
    birth: 1,
    death: 0,
    historical: 1
};

export default function(state = initial, action) {
    switch(action.type) {
        case SET_START:
            return {...state, start: action.payload};
        case SET_END:
            return {...state, end: action.payload};
        case SET_BIRTH:
            return {...state, birth: state.birth == 1 ? 0 : 1, death: state.death == 1 ? 0 : 1};
        case SET_DEATH:
            return {...state, birth: state.birth == 1 ? 0 : 1, death: state.death == 1 ? 0 : 1};
        case SET_HISTORICAL:
            return {...state, historical: state.historical == 1 ? 0 : 1};
    };
    return state;    
}