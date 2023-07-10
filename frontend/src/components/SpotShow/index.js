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
    console.log('SpotShow, spot.....', spot)
    const reviewData = useSelector(state => state.reviews.spot);

    useEffect(() => {
        dispatch(thunkGetSingleSpot(spotId));
        // dispatch(thunkRestoreUser());
        dispatch(thunkReviewsBySpot(spotId));
        dispatch(thunkReviewsByUser());
    }, [dispatch]);

    if ( !Object.values(spot).length || !spotId) return null;

    let reviews = Object.values(reviewData).filter(rev => rev.spotId == spot.id);
    const userReviews = reviews.filter(rev => rev.userId == user.id).length;
    console.log('LINE 29 USERREVIEWS.........SEFW>.....', userReviews)
    const {name, city, state, country, SpotImages, description, price, numReviews, avgStarRating, Owner} = spot;
    const {firstName, lastName, id} = Owner;
    const sortedReviews = reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    console.log('SORTED REVIEWS......', sortedReviews)
    let imgClass = 0;
    const feature = () => {
        window.alert('Feature Coming Soon...');
    };
    return(
        <div className="_main_">

            <div className='spot-header'>
                <h2>{name}</h2>
                <h4>{city}, {state}, {country}</h4>
            </div>
            <div className='img-container'>
                {SpotImages.length && SpotImages.map(img => (
                    <img className={"_" + ++imgClass + " img"} src={img.url ? `${img.url}` : 'https://clipart-library.com/img/1643520.jpg'} alt={img.url}></img>
                ))}
            </div>
            <div className='spot-general-info'>
                <div className='host-desc'>
                    <h4 className="hostName">Hosted by {firstName} {lastName}</h4>
                    <p>{description}</p>
                </div>
                <div className="reserve">
                    <div className="price-star-rev">
                        <h2>${price}/night</h2>
                        { numReviews > 1 && <i className="fa-sharp fa-solid fa-star">{avgStarRating ? avgStarRating.toFixed(1) : "New"} • {numReviews} reviews </i>}
                        { numReviews === 1 && <i className="fa-sharp fa-solid fa-star">{avgStarRating ? avgStarRating.toFixed(1) : "New"} • 1 review </i>}
                        { numReviews === 0 && <i className="fa-sharp fa-solid fa-star"> New </i>}
                    </div>
                    <div class="reserve-btn">
                        <button class="BUTTON" onClick={feature}>Reserve</button>
                    </div>
                </div>
            </div>
            {/* <div className='price-rev-reserve'>
            </div> */}
            <hr style={{background: "black", height: "1px", width: "100%" }}/>
            <div className="star-rev">
                { numReviews > 1 && <i className="hello fa-sharp fa-solid fa-star">{avgStarRating ? avgStarRating.toFixed(1) : "New"} • {numReviews} reviews </i>}
                { numReviews === 1 && <i className="hello fa-sharp fa-solid fa-star">{avgStarRating ? avgStarRating.toFixed(1) : "New"} • 1 review </i>}
                { numReviews === 0 && <i className="hello fa-sharp fa-solid fa-star">New</i>}
            <div className={(id == user.id || userReviews > 0) ? "hidden rev-btn" : "rev-btn"}>
                <OpenModalButton
                        style={{background: "grey", color: "white", boxShadow: "3px 3px 3px black"}}
                        buttonText='Post Your Review'
                        modalComponent={<CreateReviewModal spotId={spotId}/>}
                />
               <p className={reviews.length === 0 ? "encouragement" : "hidden"}>Be the first to post a review!</p>
            </div>
            </div>
            <div className='reviews'>
                {sortedReviews.map(rev => (
                    <div className='individual review' >
                        <h4 className="name">{rev.User.firstName}</h4>
                        <h4 className="date">{rev.createdAt.split('-').slice(-1)[0].split('').slice(0, 2).join('')}/{rev.createdAt.split('-').slice(1, 2)}/{rev.createdAt.split('-').slice(0, 1)}</h4>
                        <p className="revtxt">{rev.review}</p>
                       <div className={rev?.User.id == user?.id ? "delete-btn" : "hidden"}>
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
    )
}
