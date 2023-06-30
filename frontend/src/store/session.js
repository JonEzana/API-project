import { csrfFetch } from "./csrf";

const SET_SESSION = 'api/setSession';
const REMOVE_SESSION = 'api/removeSession';
const SET_USER = 'api/getUser';

////////// ACTION CREATORS /////////

export const actionSetSession = (user) => ({
    type: SET_SESSION,
    payload: user
});

export const actionRemoveSession = () => ({
    type: REMOVE_SESSION
});

export const actionSetUser = (data) => ({
    type: SET_USER,
    payload: data
});

///////// THUNKS ////////

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
};

export const thunkRestoreUser = () => async (dispatch) => {
    const response = await csrfFetch("/api/session");
    const data = await response.json();
    dispatch(actionSetUser(data.user));
    return response;
};

export const thunkSignUp = (user) => async (dispatch) => {
    const {firstName, lastName, username, password, email} = user;
    const response = await csrfFetch('/api/users', {
        method: "POST",
        body: JSON.stringify({firstName, lastName, username, password, email})
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(actionSetUser(data.user));
        return data;
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
        case SET_USER: {
            const newState = {...state};
            newState['user'] = action.payload;
            return newState
        }
        default:
            return state;
    }
}
