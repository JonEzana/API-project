import React, {useEffect} from "react";
import { thunkGetSpots } from "../../store/spots";
import { useSelector } from "react-redux";
import { useDispatch} from "react-redux";
import { Route, Switch, useHistory } from "react-router-dom";
import { SpotShow } from '../SpotShow';
import './SpotsIndex.css';
import { thunkRestoreUser } from "../../store/session";

export const SpotsIndex = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const rawSpots = useSelector(state => state.spots.allSpots);
    const currentUser = useSelector(state => state.session.user)
    console.log('RAW SPOTS', rawSpots)

    useEffect(() => {
        // if (!rawSpots) return null;
        dispatch(thunkRestoreUser())
        dispatch(thunkGetSpots())
    }, [dispatch]);

    const spots = [];
    Object.values(rawSpots).forEach(spot => spots.push(spot));
    const sortedSpots = spots.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    return (
        <>
            <div className='spots-container'>
                {sortedSpots.map(spot => (
                    <div className='spot' title={`${spot.name}`} onClick={() => history.push(`/spots/${spot.id}`)} key={spot.id} >

                        <span data-tooltip={spot.name} data-position="right">

                            <img  className="spot-img" src={spot.previewImage ? `${spot.previewImage}` : 'https://clipart-library.com/img/1643520.jpg'} ></img>
                            <div className="loc-price">
                                <p>{spot.city}, {spot.state}</p>
                                <h4 className='ratings'>
                                    <i className="fa-sharp fa-solid fa-star"></i>
                                    {spot.avgRating ? spot.avgRating : "New"}
                                </h4>
                            </div>
                            <h4>${spot.price}/night</h4>
                        </span>
                    </div>
                ))}
            </div>
            {/* <Switch>
                <Route exact path='/spots/:spotId'>
                    <SpotShow spots={spots} />
                </Route>
            </Switch> */}

        </>
    )
}
