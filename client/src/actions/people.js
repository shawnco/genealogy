import Request from './request';

export const GET_PEOPLE = 'get_people';
export const GET_PERSON = 'get_person';
export const UPDATE_PERSON = 'update_person';
export const GET_UNHISTORICAL = 'get_unhistorical' // dunno if unhistorical is a word, but it is now

export function getPeople(filter) {
    console.log('filta',filter)
    return dispatch => {
        Request.post('people', filter).then(res => {
            dispatch({
                type: GET_PEOPLE,
                payload: res.data
            });
        });
    }
}

export function getPersonFull(id) {
    return dispatch => {
        Request.get(`person/${id}`).then(res => {
            dispatch({
                type: GET_PERSON,
                payload: res.data
            });
        });
    }
}

export function updatePerson(id, data) {
    return dispatch => {
        Request.put(`person/${id}`, data).then(res => {
            dispatch({
                type: UPDATE_PERSON,
                payload: res.data
            });
        });
    }
}

export function getUnhistorical() {
    return dispatch => {
        Request.get(`person/unhistorical`).then(res => {
            dispatch({
                type: GET_UNHISTORICAL,
                payload: res.data
            });
        });
    }
}