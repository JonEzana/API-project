import React, {useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { thunkGetSingleSpot } from "../../store/spots";
import { CreateSpot } from "../CreateSpot";
import './UpdateSpot.css';

export const UpdateSpot = () => {
    const dispatch = useDispatch();
    const {spotId} = useParams();
    const spot = useSelector(state => state.spots.singleSpot);
    console.log('UPDATEFORM, SPOT STATE', spot)
    // useEffect(() => {
    //     // if (!Object.values(spot).length) return null;
    //     dispatch(thunkGetSingleSpot(spotId));
    // }, []);

    if (!Object.values(spot).length) return null;

    return (
        <CreateSpot spot={spot} formType={"Update your Spot"} />
    )
}
