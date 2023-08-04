import React, {useEffect, useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { thunkCreateReview, thunkReviewsBySpot } from "../../store/reviews";
import { thunkGetSingleSpot } from "../../store/spots";
import { useModal } from "../../context/Modal";
import './CreateReviewModal.css';

export const CreateReviewModal = ({spotId}) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const spot = useSelector(state => state.spots.singleSpot);
    const reviews = useSelector(state => state.reviews.spot);
    const user = useSelector(state => state.session.user);
    const userId = user.id;

    const [revText, setRevText] = useState('');
    const [stars, setStars] = useState(null)
    const [valObj, setValObj] = useState({});

    useEffect(() => {
        const errObj = {}
        if (revText.length < 10) errObj.review = "Reviews must be 10 characters or longer";
        setValObj(errObj)
    }, [revText]);

    spotId = +spotId;
    const handleSubmit = async () => {
        const reviewData = {userId, spotId, revText, stars};
        const res = await dispatch(thunkCreateReview(reviewData));
        if (res.id) {
            closeModal()
            await dispatch(thunkReviewsBySpot(spotId));
            await dispatch(thunkGetSingleSpot(spotId))
            history.push(`/spots/${spotId}`)
        }
    }

    // const reset = () => {
    //     setRevText('');
    //     setStars(null);
    //     setDisabled(true);
    // };

    const onChange = (number) => {
        setStars(parseInt(number));
      };

    return (
        <div className="wholemfthing" style={{marginTop: "4%", fontFamily: "Montserrat"}} >
            <h2>How was your stay?</h2>
            <input className='text-box'
                placeholder="Leave your review here..."
                type="text"
                value={revText}
                onChange={(e) => setRevText(e.target.value)}
            />
            {valObj.review && <p className="errorsForReview" style={{marginBottom: "10px", color: "red"}}>{valObj.review}</p>}
                <div className="rating-input" style={{display: "flex", flexDirection: "row", alignItems: "start"}}>
                    <div className={stars >= 1 ? "filled" : "empty"}
                        onMouseEnter={() => {  setStars(1)} }
                        onMouseLeave={() => {  setStars(stars)} }
                        onClick={() => {  onChange(1)} }
                    >
                        <i className="fa-solid fa-star"></i>
                    </div>
                    <div className={stars >= 2 ? "filled" : "empty"}
                        onMouseEnter={() => {  setStars(2)} }
                        onMouseLeave={() => {  setStars(stars)} }
                        onClick={() => {  onChange(2)} }
                    >
                        <i className="fa-solid fa-star"></i>
                    </div>
                    <div className={stars >= 3 ? "filled" : "empty"}
                        onMouseEnter={() => {  setStars(3)} }
                        onMouseLeave={() => {  setStars(stars)} }
                        onClick={() => {  onChange(3)} }
                    >
                        <i className="fa-solid fa-star"></i>
                    </div>
                    <div className={stars >= 4 ? "filled" : "empty"}
                        onMouseEnter={() => {  setStars(4)} }
                        onMouseLeave={() => {  setStars(stars)} }
                        onClick={() => {  onChange(4)} }
                    >
                        <i className="fa-solid fa-star"></i>
                    </div>
                    <div className={stars >= 5 ? "filled" : "empty"}
                        onMouseEnter={() => {  setStars(5)} }
                        onMouseLeave={() => {  setStars(stars)} }
                        onClick={() => {  onChange(5)} }
                    >
                        <i className="fa-solid fa-star"></i>
                    </div>
                    <p style={{margin: "0px 0 0 5px", fontSize: "17px"}}>Stars</p>
                </div>
        <button
            disabled={revText.length >= 10 && stars > 0 ? false : true}
            onClick={handleSubmit}
            style={{width: "60%", height: "40px", backgroundColor: "#41bee6", color: "white", borderRadius: "5px", boxShadow: "3px 3px 3px black"}}
            >
            Submit Review
        </button>
        </div>
    )

}
