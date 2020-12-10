import Request from './request';

export const GET_ALL_LOCATIONS = 'get_all_locations';
export const GET_LOCATION = 'get_location';
export const GET_LOCATION_FULL = 'get_location_full';

export function getAllLocations() {
    return dispatch => {
        Request.get('location/list').then(res => {
            dispatch({
                type: GET_ALL_LOCATIONS,
                payload: res.data
            });
        });
    }
}

export function getLocation(id) {
    return dispatch => {
        Request.get(`location/${id}`).then(res => {
            dispatch({
                type: GET_LOCATION,
                payload: res.data
            });
        });
    }
}

export function getLocationFull(id) {
    return dispatch => {
        Request.get(`location/${id}/full`).then(res => {
            dispatch({
                type: GET_LOCATION_FULL,
                payload: res.data
            });
        });
    }
}