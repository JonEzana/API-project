import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkDeleteReview, thunkReviewsByUser } from "../../store/reviews";
import { thunkGetSingleSpot } from "../../store/spots";
import { useHistory, useParams } from "react-router-dom";

export const DeleteReviewModal = ({id}) => {
    const {spotId} = useParams()
    const history = useHistory();
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const reviews = useSelector(state => state.reviews.user);
    console.log('DeleteReviewMOdal, reviews by user', reviews)

    useEffect(() => {
        dispatch(thunkReviewsByUser())
    }, []);

    const yes = async () => {
        await dispatch(thunkDeleteReview(id));
        await dispatch(thunkGetSingleSpot(spotId))
        closeModal();
        // history.push(`/spots/${spotId}`);
    };

    return (
        <div>
            <h2>Confirm Delete</h2>
            <h4>Are you sure you want to remove this spot from the listings?</h4>
            <button onClick={yes}>Yes (Delete Review)</button>
            <button onClick={closeModal}>No (Keep Review)</button>
        </div>
    )
}
