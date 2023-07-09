import React, {useEffect} from "react";
import { thunkGetSpots } from "../../store/spots";
import { useSelector } from "react-redux";
import { useDispatch} from "react-redux";
import { Route, Switch, useHistory } from "react-router-dom";
import { SpotShow } from '../SpotShow';
import './SpotsIndex.css';

export const SpotsIndex = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const rawSpots = useSelector(state => state.spots.allSpots);
    console.log('RAW SPOTS', rawSpots)

    useEffect(() => {
        // if (!rawSpots) return null;
        dispatch(thunkGetSpots())
    }, [dispatch]);

    const spots = [];
    console.log('RAWSPOT AGAIN: ', rawSpots)
    Object.values(rawSpots).forEach(spot => spots.push(spot));
    console.log('SPOTS INDEX SPOTS: ', spots)

    return (
        <>
            <div className='spots-container'>
                {spots.map(spot => (
                    <div className='spot' title={`${spot.name}`} onClick={() => history.push(`/spots/${spot.id}`)} key={spot.id} >
                        {/* <span className='tooltip' data-text={`${spot.name}`}> */}
                        <img  className="spot-img" src={spot.previewImage ? `${spot.previewImage}` : 'https://clipart-library.com/img/1643520.jpg'} alt={spot.name}></img>
                        <div className="loc-price">
                            <p>{spot.city}, {spot.state}</p>
                            <h4 className='ratings'>
                                <i className="fa-sharp fa-solid fa-star"></i>
                                {spot.avgRating ? spot.avgRating : "No reviews yet"}
                            </h4>
                        </div>
                        <h4>${spot.price}/night</h4>
                        {/* </span> */}
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
