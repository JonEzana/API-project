import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkDeleteSpot } from "../../store/spots";
import { useHistory } from "react-router-dom";
import './DeleteSpotModal.css'

export const DeleteSpotModal = ({id}) => {
    const history = useHistory();
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const spot = useSelector(state => state.spots.singleSpot);

    const yes = async () => {
        await dispatch(thunkDeleteSpot(id));
        closeModal();
        history.push('/spots/current');
    };

    return (
        <div className="delete-modal">
            <p className="confirmation">Confirm Delete</p>
            <p className="double-conf">Are you sure you want to remove this spot from the listings?</p>
            <button className="delete btn" onClick={yes}>Yes (Delete Spot)</button>
            <button className="keep btn" onClick={closeModal}>No (Keep Spot)</button>
        </div>
    )
}
