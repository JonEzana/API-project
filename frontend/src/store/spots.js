import { csrfFetch } from "./csrf";

const GET_SPOTS = 'api/getSpots';
const GET_ONE_SPOT = 'api/getOneSpot';
const GET_CURRENT_SPOTS = 'api/getCurrentSpots'
const CREATE_SPOT = 'api/createSpot'
const UPDATE_SPOT = 'api/updateSpot';
const DELETE_SPOT = 'api/deleteSpot';

const ADD_IMG = 'api/addImg'

////////////////////////////////////////////////////////////


///////---------GET ALL SPOTS---------//////
export const actionGetSpots = (spots) => ({
    type: GET_SPOTS,
    spots
});
export const thunkGetSpots = () => async (dispatch) => {
    const res = await fetch('/api/spots');
    if (res.ok) {
        const spots = await res.json();
        dispatch(actionGetSpots(spots));
        return spots;
    }
};

///////////-----GET SINGLE SPOT------/////////
export const actionGetSingleSpot = (spot) => ({
    type: GET_ONE_SPOT,
    spot
});
export const thunkGetSingleSpot = (spotId) => async (dispatch) => {
    const res = await fetch(`/api/spots/${spotId}`);
    if (res.ok) {
        const spot = await res.json();
        dispatch(actionGetSingleSpot(spot));
        return spot;
    } else {
        const error = await res.json();
        return error;
    }
};

/////----GET CURRENT USER SPOTS------//////
export const actionGetCurrentUserSpots = (spots) => ({
    type: GET_CURRENT_SPOTS,
    spots
});
export const thunkGetCurrentUserSpots = () => async (dispatch, getState) => {
    const state = getState();
    const user = state.session.user;
    if (user) {
        const res = await csrfFetch('/api/spots/current');
        if (res.ok) {
            const spots = await res.json();
            dispatch(actionGetCurrentUserSpots(spots));
        }
    }
}

////////------CREATE SPOT-------/////////
export const actionCreateSpot = (spot) => ({
    type: CREATE_SPOT,
    payload: spot
});
export const thunkCreateSpot = (spotFormData) => async (dispatch) => {
    const res = await csrfFetch('/api/spots', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(spotFormData)
    });
    if (res.ok) {
        const spot = await res.json();
        dispatch(actionCreateSpot(spot));
        return spot;
    } else {
        const errors = await res.json();
        return errors;
    }
};

////////------ ADD IMAGE TO SPOT--------/////////
export const actionAddImage = (image) => ({
    type: ADD_IMG,
    payload: image
});
export const thunkAddImage = (id, imgData) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${id}/images`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(imgData)
    });
    if (res.ok) {
        const img = await res.json();
        dispatch(actionAddImage(img));
        return img;
    } else {
        const error = await res.json();
        return error;
    }
};

/////////--------UPDATE SPOT---------/////////
export const actionUpdateSpot = (spot) => ({
    type: UPDATE_SPOT,
    payload: spot
});
export const thunkUpdateSpot = (spotData) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotData.id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(spotData)
    });
    if (res.ok) {
        const spot = await res.json();
        dispatch(actionUpdateSpot(spot));
        return spot;
    } else {
        const error = await res.json();
        return error.errors;
    }
};

////////-------DELETE SPOT-------///////
export const actionDeleteSpot = (id) => ({
    type: DELETE_SPOT,
    id
});
export const thunkDeleteSpot = (id) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${id}`, {
        method: "DELETE"
    });
    if (res.ok) {
        dispatch(actionDeleteSpot(id));
    } else {
        const error = await res.json();
        return error;
    }
};

////////////////////////////////////////////////////////////

const initialState = {allSpots: {}, singleSpot: {}, currentUserSpots: {}};

export default function spotsReducer(state = initialState, action) {
    switch(action.type) {
        case GET_SPOTS: {
            const newState = {...state, allSpots: {...state.allSpots}, singleSpot: {...state.singleSpot}, currentUserSpots: {...state.currentUserSpots}};
            const spots = action.spots;
            spots.Spots.forEach((spot) => {
                newState.allSpots[spot.id] = spot;
            });
            return newState
        }
        case GET_ONE_SPOT: {
            return {...state, singleSpot: {...action.spot}, allSpots: {...state.allSpots}, currentUserSpots: {}};
        }
        case GET_CURRENT_SPOTS: {
            const newState = {...state, allSpots: {...state.allSpots}, singleSpot: {...state.singleSpot}, currentUserSpots: {}};
            action.spots.Spots.forEach(spot => {
                newState.currentUserSpots[spot.id] = spot;
            });
            return newState;
        }
        case CREATE_SPOT: {
            return {
                ...state,
                allSpots: {...state.allSpots, [action.payload.id]: action.payload},
                singleSpot: {...action.payload},
                currentUserSpots: {...state.currentUserSpots, [action.payload.id]: action.payload}
            };
        }
        case ADD_IMG: {
            return {
                ...state,
                singleSpot: {...state.singleSpot, ...state.singleSpot.SpotImages, ...action.payload},
                allSpots: {...state.allSpots},
                currentUserSpots: {...state.currentUserSpots}
            };
        }
        case UPDATE_SPOT: {
            const newState = {
                ...state,
                allSpots: {...state.allSpots, [action.payload.id]: action.payload},
                singleSpot: {...action.payload},
                currentUserSpots: {...state.currentUserSpots, [action.payload.id]: action.payload}
            };
            return newState;
        }
        case DELETE_SPOT: {
            const newState = {...state, allSpots: {...state.allSpots}, singleSpot: {...state.singleSpot}, currentUserSpots: {...state.currentUserSpots}};
            delete newState.allSpots[action.id];
            delete newState.singleSpot;
            delete newState.currentUserSpots[action.id];
            return newState;
        }
        default:
            return state;
    }
}
