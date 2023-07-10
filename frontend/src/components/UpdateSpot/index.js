import React, {useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { thunkGetCurrentUserSpots, thunkGetSingleSpot } from "../../store/spots";
import { CreateSpot } from "../CreateSpot";
import './UpdateSpot.css';

export const UpdateSpot = () => {
    const dispatch = useDispatch();
    const {spotId} = useParams();

    useEffect(() => {
         dispatch(thunkGetCurrentUserSpots());
    }, []);

    const currentSpots = useSelector(state => state.spots.currentUserSpots)
    const spot = currentSpots[spotId];

    return (
        <CreateSpot spot={spot} formType={"Update your Spot"} />
    )
}
