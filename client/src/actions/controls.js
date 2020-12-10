export const SET_START = 'set_start';
export const SET_END = 'set_end';
export const SET_BIRTH = 'set_birth';
export const SET_DEATH = 'set_death';
export const SET_HISTORICAL = 'set_historical';

export function setStart(year) {
    return dispatch => dispatch({
        type: SET_START,
        payload: year
    });
}

export function setEnd(year) {
    return dispatch => dispatch({
        type: SET_END,
        payload: year
    });
}

export function setBirth() {
    return dispatch => dispatch({
        type: SET_BIRTH
    });
}

export function setDeath() {
    return dispatch => dispatch({
        type: SET_DEATH
    });
}

export function setHistorical() {
    return dispatch => dispatch({
        type: SET_HISTORICAL
    });
}