import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkDeleteReview, thunkReviewsByUser } from "../../store/reviews";
import { thunkGetSingleSpot } from "../../store/spots";
import { useHistory } from "react-router-dom";

export const DeleteReviewModal = ({revId, spotId}) => {
    const history = useHistory();
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(thunkReviewsByUser())
    }, []);

    const yes = async () => {
        await dispatch(thunkDeleteReview(revId));
        await dispatch(thunkGetSingleSpot(spotId))
        closeModal();
        history.push(`/spots/${spotId}`);
    };

    return (
        <div className="delete-modal">
             <p className="confirmation">Confirm Delete</p>
             <p className="double-conf">Are you sure you want to delete this review?</p>
            <button className="delete btn" onClick={yes}>Yes (Delete Review)</button>
            <button className="keep btn" onClick={closeModal}>No (Keep Review)</button>
        </div>
    )
}
