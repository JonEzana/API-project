import React, {useState, useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { thunkRestoreUser } from "../../store/session";
import { thunkGetSingleSpot } from "../../store/spots";
import { thunkReviewsBySpot, thunkReviewsByUser } from "../../store/reviews";
import OpenModalButton from "../OpenModalButton";
import { DeleteReviewModal } from "../DeleteReviewModal";
import { CreateReviewModal } from '../CreateReviewModal';
import './SpotShow.css';

export const SpotShow = () => {
    const dispatch = useDispatch();
    const {spotId} = useParams();
    const user = useSelector(state => state.session.user);
    const spot = useSelector(state => state.spots.singleSpot);
    const reviewData = useSelector(state => state.reviews.spot)
    console.log('SpotShow, user: ', user)
    console.log('SpotShow, spot: ', spot)
    console.log('SpotShow; reviewData: ', reviewData)

    useEffect(() => {
        dispatch(thunkGetSingleSpot(spotId));
        // dispatch(thunkRestoreUser());
        dispatch(thunkReviewsBySpot(spotId));
        dispatch(thunkReviewsByUser());
    }, [dispatch]);

    if (!Object.values(user).length || !Object.values(spot).length || !spotId) return null;

    let reviews = Object.values(reviewData).filter(rev => rev.spotId == spot.id);
    const userReviews = reviews.filter(rev => rev.userId == user.id).length;
    const {name, city, state, country, SpotImages, description, price, numReviews, avgStarRating, Owner} = spot;
    const {firstName, lastName, id} = Owner;

    return(
        <>
        <div className="main">

            <div className='spot-header'>
                <h2>{name}</h2>
                <h4>{city}, {state}, {country}</h4>
            </div>
            <div className='img-container'>
                {SpotImages.length && SpotImages.map(img => (
                    <img src={img.url ? `${img.url}` : 'https://clipart-library.com/img/1643520.jpg'} alt={img.url}></img>
                    ))}
            </div>
            <div className='spot-general-info'>
                <div className='host-desc'>
                    <h4>Hosted by {firstName} {lastName}</h4>
                    <p>{description}</p>
                </div>
            </div>
            <div className='price-rev-reserve'>
                    <h3>${price}/night</h3>
                    <i className="fa-sharp fa-solid fa-star">{avgStarRating}</i>
                    <h3>{numReviews} reviews</h3>
                </div>
                <hr />
            <div className="star-rev">
              { numReviews > 1 && <i className="fa-sharp fa-solid fa-star">{avgStarRating ? avgStarRating.toFixed(1) : "New"} • {numReviews} reviews </i>}
              { numReviews === 1 && <i className="fa-sharp fa-solid fa-star">{avgStarRating ? avgStarRating.toFixed(1) : "New"} • 1 review </i>}
              { numReviews === 0 && <i className="fa-sharp fa-solid fa-star">{avgStarRating ? avgStarRating.toFixed(1) : "New"} • New </i>}
            </div>
            <div className={(id == user.id || userReviews > 0) ? "hidden rev-btn" : "rev-btn"}>


                <OpenModalButton
                        buttonText='Post Your Review'
                        modalComponent={<CreateReviewModal spotId={spotId}/>}
                />
               <p className={reviews.length === 0 ? "encouragement" : "hidden"}>Be the first to post a review!</p>
            </div>
            <div className='reviews'>
                {reviews.map(rev => (
                    <div className='individual review' key={rev.id}>
                        <h2>{user.firstName}</h2>
                        <h4>{rev.createdAt.split('-').slice(-1)[0].split('').slice(0, 2).join('')}/{rev.createdAt.split('-').slice(0, 1)}</h4>
                        <h4>{rev.review}</h4>
                       <div className={userReviews > 0 ? "delete-btn" : "hidden"}>
                            <OpenModalButton
                                buttonText="Delete"
                                modalComponent={<DeleteReviewModal id={rev.id}/>}
                            />
                            {/* <p>I WROTE THIS!!!!!!!!</p> */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </>
    )
}
