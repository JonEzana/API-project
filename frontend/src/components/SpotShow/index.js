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
    const reviewData = useSelector(state => state.reviews.spot);
    const spot = useSelector(state => state.spots.singleSpot);

    useEffect(() => {
        dispatch(thunkGetSingleSpot(spotId));
        dispatch(thunkReviewsBySpot(spotId));
        if (user) {
            dispatch(thunkReviewsByUser());
        }
    }, [dispatch]);

    if ( !Object.values(spot).length || !spotId) return (<></>);

    let reviews = Object.values(reviewData).filter(rev => rev.spotId == spot.id);

    let userReviews;
    user ? userReviews = reviews.filter(rev => rev.userId == user.id).length : userReviews = [];

    const {name, city, state, country, SpotImages, description, price, numReviews, avgStarRating, Owner} = spot;
    const {firstName, lastName, id} = Owner;
    const sortedReviews = reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    let imgClass = 0;
    const feature = () => {
        window.alert('Feature Coming Soon...');
    };
    console.log("SpotImages....", SpotImages)
    return(
        <div className="_main_">

            <div className='spot-header'>
                <h2>{name}</h2>
                <h4>{city}, {state}, {country}</h4>
            </div>
            <div className='img-container'>
                {SpotImages.length && SpotImages.map(img => (
                    <img className={img.preview === true ? "previewImg" : "_" + ++imgClass + " img"} src={img.url} alt={img.url} key={img.id}></img>
                ))}
            </div>
            <div className='spot-general-info'>
                <div className='host-desc'>
                    <h4 className="hostName">Hosted by {firstName} {lastName}</h4>
                    <p>{description}</p>
                </div>
                <div className="reserve">
                    <div className="price-star-rev">
                        <h2 className="spotPrice">${price}/night</h2>
                        <div className="reserve-box-revCount_hasRev">
                            { numReviews > 1 && <><i className="fa-sharp fa-solid fa-star reviewCount"></i><p className="reserveBox-revCount-text">{avgStarRating ? avgStarRating.toFixed(1) : "New"} • {numReviews} reviews </p></>}
                        </div>
                        <div className="reserve-box-revCount_hasRev">
                            { numReviews === 1 && <><i className="fa-sharp fa-solid fa-star reviewCount"></i><p className="reserveBox-revCount-text">{avgStarRating ? avgStarRating.toFixed(1) : "New"} • 1 review</p></>}
                        </div>
                        <div className="reserve-box-revCount_new">
                            { numReviews === 0 && <><i className="fa-sharp fa-solid fa-star reviewCount"></i><p className="reserveBox-revCount-text">New</p></>}
                        </div>

                    </div>
                    <div className="reserve-btn">
                        <button className="BUTTON" onClick={feature}>Reserve</button>
                    </div>
                </div>
            </div>
            {/* <div className='price-rev-reserve'>
            </div> */}


            <hr style={{background: "black", height: "1px", width: "100%" }}/>

            <div className="review-portion">

                <div className="star-rev">
                    {numReviews > 1 && <div className="finalRevCountFinal">
                        <i className="finalStarReview fa-sharp fa-solid fa-star"></i>
                        <p className="finalRevWritten">
                            {avgStarRating ? avgStarRating.toFixed(1) : "New"} • {numReviews} reviews
                        </p>
                    </div>}
                    { numReviews === 1 && <div className="finalRevCountFinal">
                        <i className="finalStarReview fa-sharp fa-solid fa-star"></i>
                        <p className="finalRevWritten">
                            {avgStarRating ? avgStarRating.toFixed(1) : "New"} • 1 review
                        </p>
                    </div>}
                    { numReviews === 0 && <div className="finalRevCountFinal">
                        <i className="finalStarReview fa-sharp fa-solid fa-star"></i>
                        <p className="finalRevWritten">New</p>
                    </div>}
                </div>

                <div className={(!user || ((user && id == user.id) || (user && userReviews > 0))) ? "hidden rev-btn" : "rev-btn"}>
                    <OpenModalButton
                            style={{background: "#41bee6", color: "white", boxShadow: "3px 3px 3px black", borderRadius: "5px"}}
                            buttonText='Post Your Review'
                            modalComponent={<CreateReviewModal spotId={spotId}/>}
                    />
                </div>

                <p className={user && reviews.length === 0 && user.id !== id ? "encouragement" : "hidden"}>Be the first to post a review!</p>

                <div className='reviews'>
                    {sortedReviews.map(rev => (
                        <div className='individual review' key={rev.id}>
                            <p className="reviewer-name">{rev.User.firstName}</p>
                            <p className="date">{rev.createdAt.split('-').slice(1, 2)}/{rev.createdAt.split('-').slice(-1)[0].split('').slice(0, 2).join('')}/{rev.createdAt.split('-').slice(0, 1)}</p>
                            <p className="revtxt">{rev.review}</p>

                            <div className={rev?.User.id == user?.id ? "delete-btn" : "hidden"}>
                                    <OpenModalButton
                                        buttonText="Delete"
                                        modalComponent={<DeleteReviewModal revId={rev.id} spotId={spotId}/>}
                                        style={{backgroundColor: "#e66941", color: "white", width: "11%"}}
                                        />
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}
