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
    console.log('LINE 17....', user)

    const [revText, setRevText] = useState('');
    const [stars, setStars] = useState(null)
    const [disabled, setDisabled] = useState(true);
    console.log('REVIWS - createModal: ', reviews)
    // useEffect(() => {
    //     revText.length >= 10 && stars > 0 ? setDisabled(false) : setDisabled(false);
    //     // reviews.find(el => el.)
    // }, [revText]);
    // if (!Object.values(spot).length || !Object.values(user).length) return null;
    spotId = +spotId;
    const handleSubmit = async () => {
        const reviewData = {userId, spotId, revText, stars};
        const res = await dispatch(thunkCreateReview(reviewData));
        if (res.id) {
            closeModal()
            await dispatch(thunkReviewsBySpot(spotId))
            history.push(`/spots/${spotId}`)
        }
    }

    const reset = () => {
        setRevText('');
        setStars(null);
        setDisabled(true);
    };

    const onChange = (number) => {
        setStars(parseInt(number));
      };

    return (
        <div className="wholemfthing">
            <h2>How was your stay?</h2>
            <input className='text-box'
                placeholder="Leave your review here..."
                type="text"
                value={revText}
                onChange={(e) => setRevText(e.target.value)}
            />
            <div className="rating-input">
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
                    <i className="fa-solid fa-star"> Stars</i>
            </div>
            </div>
            <button disabled={revText.length >= 10 && stars > 0 ? false : true} onClick={handleSubmit}>Submit Review</button>
        </div>
    )

}
