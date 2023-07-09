import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector} from 'react-redux';
import { useHistory, Route } from "react-router-dom";
import { thunkGetCurrentUserSpots } from "../../store/spots";
import {UpdateSpot} from '../UpdateSpot';
import { useModal } from '../../context/Modal';
import OpenModalButton from "../OpenModalButton";
import { DeleteSpotModal } from "../DeleteSpotModal";

export const ManageSpots = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const userSpots = useSelector(state => state.spots.currentUserSpots);
    console.log('DATA: ', userSpots)

     useEffect(() => {
         dispatch(thunkGetCurrentUserSpots());
        }, []);

    if (!Object.values(userSpots)) return null;
    let spots = [...Object.values(userSpots)]

    return (
        <>
            <div className='header'>
                <h2>Manage Your Spots</h2>
                <button onClick={() => history.push('/spots/new')}>Create a New Spot</button>
            </div>
            <div className='spots-container'>
            {spots.map(spot => (
                <div className='spot' title={`${spot.name}`}  >
                    <div onClick={() => history.push(`/spots/${spot.id}`)}>
                        <img  className="spot-img" src={spot.previewImage ? `${spot.previewImage}` : 'https://clipart-library.com/img/1643520.jpg'} alt={spot.name}></img>
                        <div className="loc-price">
                            <p>{spot.city}, {spot.state}</p>
                            <h4 className='ratings'>
                                <i className="fa-sharp fa-solid fa-star"></i>
                                {spot.avgRating ? spot.avgRating : "No reviews yet"}
                            </h4>
                        </div>
                        <h4>${spot.price}/night</h4>
                    </div>
                    <button onClick={() => history.push(`/spots/${spot.id}/edit`)}>Update</button>
                    <OpenModalButton
                        buttonText="Delete"
                        modalComponent={<DeleteSpotModal id={spot.id}/>}
                    />
                </div>
            ))}
            </div>
        </>
    );
}
