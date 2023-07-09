import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkDeleteSpot } from "../../store/spots";
import { useHistory } from "react-router-dom";

export const DeleteSpotModal = ({id}) => {
    console.log('DELETE ID', id)
    const history = useHistory();
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const spot = useSelector(state => state.spots.singleSpot);
    console.log('SPOT', spot)

    const yes = async () => {
        await dispatch(thunkDeleteSpot(id));
        closeModal();
        history.push('/spots/current');
    };

    return (
        <div>
            <h2>Confirm Delete</h2>
            <h4>Are you sure you want to remove this spot from the listings?</h4>
            <button onClick={yes}>Yes (Delete Spot)</button>
            <button onClick={closeModal}>No (Keep Spot)</button>
        </div>
    )
}
