import { csrfFetch } from "./csrf";

const GET_CURRENT_USER_BOOKINGS = "api/getCurrentUserBookings";
const GET_SPOT_BOOKINGS = "api/getSpotBookings";
const CREATE_BOOKING = "api/createBooking";
const UPDTE_BOOKING = "api/updateBooking";
const DELETE_BOOKING = "api/deleteBooking";

///////---------GET CURRENT USER BOOKINGS---------//////
export const actionGetCurrentUserBookings = (bookings) => ({
    type: GET_CURRENT_USER_BOOKINGS,
    bookings
});
export const thunkGetCurrentUserBookings = () => async(dispatch, getState) => {
    const state = getState();
    const user = state.session.user;
    if (user) {
        const res = await csrfFetch('/api/bookings/current');
        if (res.ok) {
            const bookings = await res.json();
            dispatch(actionGetCurrentUserBookings(bookings));
        } else {
            const error = await res.json();
            return error.message;
        }
    }
};

///////---------GET SPOT BOOKINGS---------//////
export const actionBookingsBySpot = (data) => ({
    type: GET_SPOT_BOOKINGS,
    data
});
export const thunkBookingsBySpot = (id) => async(dispatch) => {
    const res = await csrfFetch(`/api/spots/${id}/bookings`);
    if (res.ok) {
        const bookingData = await res.json();
        dispatch(actionBookingsBySpot(bookingData));
    } else {
        const error = await res.json();
        return error.errors;
    }
};

///////---------CREATE BOOKING---------//////
