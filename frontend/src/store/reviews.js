import { csrfFetch } from "./csrf";

const CREATE = 'api/create';
const DELETE = 'api/delete';
const SPOT_REVIEWS = 'api/spotReviews';
const USER_REVIEWS = 'api/userReviews';

//////----- CREATE ------////////
export const actionCreateReview = (review) => (console.log('IN ACTION CREATOR'), {
    type: CREATE,
    review
});
export const thunkCreateReview = (data) => async (dispatch, getState) => {
    const state = getState();
    const user = state.session.user;
    const {userId, spotId, revText, stars} = data;
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({review: revText, stars: stars})
    });
    if (res.ok) {
        const review = await res.json();
        if (review['User'] === undefined) {
            review['User'] = user;
        }
        dispatch(actionCreateReview(review));
        return review;
    } else {
        console.log('Create thunk - in error condtl')
        const error = await res.json();
        return error;
    }
}

/////// ------ DELETE ----- ////////
export const actionDeleteReview = (revId) => ({
    type: DELETE,
    revId
});
export const thunkDeleteReview = (revId) => async (dispatch) => {
    const res = await csrfFetch(`/api/reviews/${revId}`, {
        method: "DELETE"
    });
    if (res.ok) {
        const review = await res.json();
        dispatch(actionDeleteReview(revId));
        return review;
    } else {
        const error = await res.json();
        return error;
    }
};

///////// ------- BY SPOT ------- ////////
export const actionReviewsBySpot = (data) => ({
    type: SPOT_REVIEWS,
    data
});
export const thunkReviewsBySpot = (id) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${id}/reviews`);
    if (res.ok) {
        const reviewData = await res.json();
        dispatch(actionReviewsBySpot(reviewData));
    } else {
        const error = await res.json();
        return error.message;
    }
};

///////// ------- BY USER ------- ////////
export const actionReviewsByUser = (data) => ({
    type: USER_REVIEWS,
    data
});
export const thunkReviewsByUser = () => async (dispatch) => {
    const res = await csrfFetch('/api/reviews/current');
    if (res.ok) {
        const reviewData = await res.json();
        dispatch(actionReviewsByUser(reviewData));
        return reviewData;
    } else {
        const error = await res.json();
        return error;
    }
}

const initialState = {spot: {}, user: {}};

export default function reviewsReducer(state = initialState, action) {
    switch(action.type) {
        case CREATE: {
            console.log('IN REDUCER')
            const newState = {...state, spot: {}, user: {...state.user}};
            const review = action.review;
            newState.spot[review.id] = review;
            return newState;
        }
        case DELETE: {
            const newState = {...state, spot: {...state.spot}, user: {...state.user}};
            delete newState.spot[action.revId];
            return newState;
        }
        case SPOT_REVIEWS: {
            const newState = {...state, spot: {}, user: {...state.user}};
            const reviews = action.data.Reviews;
            reviews.forEach(rev => {
                newState.spot[rev.id] = rev;
            });
            return newState;
        }
        case USER_REVIEWS: {
            const newState = {...state, spot: {...state.spot}, user: {...state.user}};
            const reviews = action.data.Reviews;
            reviews.forEach(rev => {
                newState.user[rev.id] = rev;
            });
            return newState;
        }
        default:
            return state;
    }
}
