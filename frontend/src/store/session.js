import { csrfFetch } from "./csrf";

const SET_SESSION = 'api/setSession';
const REMOVE_SESSION = 'api/removeSession';

export const actionSetSession = (user) => ({
    type: SET_SESSION,
    payload: user
});

export const actionRemoveSession = () => ({
    type: REMOVE_SESSION
});

export const thunkLogin = (data) => async (dispatch) => {
    const {credential, password} = data;
    const response = await csrfFetch("/api/session", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({credential, password})
    });

    if (response.ok) {
        const user = await response.json();
        dispatch(actionSetSession(user.user));
        return user;
    }
}
const initialState = {user: null};

export default function sessionReducer(state = initialState, action) {
    switch(action.type) {
        case SET_SESSION: {
            const newState = {...state};
            newState['user'] = action.payload;
            return newState;
        }
        case REMOVE_SESSION: {
            const newState = {...state};
            newState['user'] = null;
            return newState
        }
        default:
            return state;
    }
}
