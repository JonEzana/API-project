import React, {useEffect, useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { thunkAddImage, thunkCreateSpot, thunkGetCurrentUserSpots, thunkGetSingleSpot, thunkGetSpots, thunkUpdateSpot } from "../../store/spots";
import { useHistory } from "react-router-dom";
import './CreateSpot.css'

export const CreateSpot = ({spot, formType}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const newData = {}
    if (spot && spot.id) {
        newData.id = spot.id;
    }

    const [address, setAddress] = useState(spot ? spot.address : '');
    const [city, setCity] = useState(spot ? spot.city : '');
    const [state, setState] = useState(spot ? spot.state : '');
    const [country, setCountry] = useState(spot ? spot.country : '');
    const [name, setName] = useState(spot ? spot.name : '');
    const [description, setDescription] = useState(spot ? spot.description : '');
    const [price, setPrice] = useState(spot ? spot.price : 0);
    const [preview, setPreview] = useState('');
    const [img, setImg] = useState('');
    const [img2, setImg2] = useState('');
    const [img3, setImg3] = useState('');
    const [img4, setImg4] = useState('');
    const [hidden, setHidden] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [validationObj, setValidationObj] = useState({});

    useEffect(() => {
        const errObj = {};
        const validExtensions = ['png', 'jpg', 'jpeg'];

        if (!address || address.length < 1) errObj.address = "Address is required";
        if (!city || city.length < 3) errObj.city = "City is required";
        if (!state || !state.length) errObj.state = "State is required";
        if (!country || !country.length) errObj.country = "Country is required";
        if (!name || (!name.length || name.length > 49)) errObj.name = "Name is required";
        if (!description || description.length < 30) errObj.description = "Description needs a minimum of 30 characters";
        if (!price || !price || price === 0) errObj.price = "Price per night is required";
        formType ? setHidden(true) : setHidden(false);
        if (!formType) {
            if (preview.length < 1) errObj.previewLength = "At least one preview image is required";
            if (preview && !validExtensions.includes(preview.split('.').slice(-1)[0])) errObj.previewExtension = "Image URLs must end in .png, .jpg, or .jpeg";
            if (img && !validExtensions.includes(img.split('.').slice(-1)[0])) errObj.imj = "Image URLs must end in .png, .jpg, or .jpeg";
            if (img2 && !validExtensions.includes(img2.split('.').slice(-1)[0])) errObj.imj = "Image URLs must end in .png, .jpg, or .jpeg";
            if (img3 && !validExtensions.includes(img3.split('.').slice(-1)[0])) errObj.imj = "Image URLs must end in .png, .jpg, or .jpeg";
            if (img4 && !validExtensions.includes(img4.split('.').slice(-1)[0])) errObj.imj = "Image URLs must end in .png, .jpg, or .jpeg";
        }
        Object.values(errObj).length ? setDisabled(true) : setDisabled(false);

        setValidationObj(errObj);
    }, [address, city, state, country, name, description, price, preview, img, img2, img3, img4]);
    const handleSubmit = async(e) => {
        e.preventDefault();
        if (formType === "Update your Spot") {
            const finalData = {...newData, address, city, state, country, name, description, price}
            const updatedSpot = await dispatch(thunkUpdateSpot(finalData));
            if (updatedSpot.id) {
                const updatedSpotDetails = await dispatch(thunkGetSingleSpot(updatedSpot.id))
                history.push(`/spots/${updatedSpotDetails.id}`);
            } else {
                const failure = await dispatch(thunkUpdateSpot(finalData));
            }
        } else {
            let data = { address, city, state, country, name, description, price };
            let prevImg = {["url"]: preview, ["preview"]: true};
            let image;
            let image2;
            let image3;
            let image4;
            img.length ? image = {["url"]: img, ["preview"]: false} : image = {["url"]: 'https://clipart-library.com/img/1643520.jpg', ["preview"]: false};
            img2.length ? image2 = {["url"]: img2, ["preview"]: false} : image2 = {["url"]: 'https://clipart-library.com/img/1643520.jpg', ["preview"]: false};
            img3.length ? image3 = {["url"]: img3, ["preview"]: false} : image3 = {["url"]: 'https://clipart-library.com/img/1643520.jpg', ["preview"]: false};
            img4.length ? image4 = {["url"]: img4, ["preview"]: false} : image4 = {["url"]: 'https://clipart-library.com/img/1643520.jpg', ["preview"]: false};

            const newSpot = await dispatch(thunkCreateSpot(data));

            if (newSpot.id) {
                await dispatch(thunkAddImage(newSpot.id, prevImg));
                await dispatch(thunkAddImage(newSpot.id, image));
                await dispatch(thunkAddImage(newSpot.id, image2));
                await dispatch(thunkAddImage(newSpot.id, image3));
                await dispatch(thunkAddImage(newSpot.id, image4));
                await dispatch(thunkGetSingleSpot(newSpot.id))
                history.push(`/spots/${newSpot.id}`);
            }
        }
    };

    return (
        <div className="spot-form">
            <h2>{formType ? formType : "Create a New Spot"}</h2>
            <p className="top">Where's your place located?</p>
            <p className="bottom">Guests will only get your exact address once they've booked a reservation.</p>

        <form onSubmit={handleSubmit} className="form">
            <label htmlFor="country">
                Country
                <br />
                <input
                id="country"
                style={{width: "99%", height: "35px"}}
                    type='text'
                    value={country}
                    placeholder='Country'
                    onChange={e => setCountry(e.target.value)}
                />
            </label>
            {validationObj.country && <p className="spotValErrors">{validationObj.country}</p>}

                <label htmlFor="stAddress">
                    Street Address
                    <br />
                    <input id="stAddress"
                        type='text'
                        style={{width: "99%", height: "35px"}}
                        value={address}
                        placeholder='Address'
                        onChange={e => setAddress(e.target.value)}
                    />
                {validationObj.address && <p className="spotValErrors">{validationObj.address}</p>}
                </label>

                <label htmlFor="city">
                    City
                    <br />
                    <input id="city"
                        type='text'
                        style={{width: "99%", height: "35px"}}
                        value={city}
                        placeholder='City'
                        onChange={e => setCity(e.target.value)}
                    />
                </label>
                {validationObj.city && <p className="spotValErrors">{validationObj.city}</p>}

                <label htmlFor="state">
                    State
                    <br />
                    <input className="state"
                        style={{width: "99%", height: "35px"}}
                        type='text'
                        value={state}
                        placeholder='STATE'
                        onChange={e => setState(e.target.value)}
                    />
                </label>
                {validationObj.state && <p className="spotValErrors">{validationObj.state}</p>}

                <hr style={{background: "black", height: "1px", width: "100%" }}/>

                <label className="description full">
                    <p className="top">Describe your place to guests</p>
                    <p className='bottom'>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
                    <br />
                    <textarea className="input-box descbox"
                        type='text'
                        value={description}
                        placeholder='Please write at least 30 characters'
                        onChange={e => setDescription(e.target.value)}
                        style={{width: "99%", height: "70px"}}
                        />
                </label>
                {validationObj.description && <p className="spotValErrors">{validationObj.description}</p>}

                <hr style={{background: "black", height: "1px", width: "100%" }}/>

                <label className="name">
                    <p className="top">Create a title for your spot</p>
                    <p className="bottom">Catch guests' attention with a spot title that highlights what makes your place special.</p>
                    <br />
                    <input className="input-box"
                        type='text'
                        value={name}
                        placeholder='Name of your spot'
                        onChange={e => setName(e.target.value)}
                        style={{width: "99%", height: "35px"}}
                        />
                </label>
                {validationObj.name && <p className="spotValErrors">{validationObj.name}</p>}

                <hr style={{background: "black", height: "1px", width: "100%" }}/>

                <label className="price">
                    <p className="top">Set a base price for your spot</p>
                    <p className="bottom">Competitive pricing can help your listing stand out and rank higher in search results.</p>
                <br />
                <div style={{display: "flex", flexDirection: "row", alignItems: "center", gap: '5px'}}>
                    <i style={{fontSize: "18px"}}>$</i>
                    <input className="input-box pricebox"
                        type='number'
                        value={price}
                        placeholder='Price per night (USD)'
                        onChange={e => setPrice(e.target.value)}
                        style={{width: "99%", height: "35px"}}
                        min={0}
                        step=".01"
                        />
                </div>
                </label>
                {validationObj.price && <p className="spotValErrors">{validationObj.price}</p>}

                <hr style={{background: "black", height: "1px", width: "100%" }}/>
                <div className={hidden ? "hidden" : "imageurls"}>
                    <label className="img">
                        <p className="top">Liven up your spot with photos</p>
                        <p className="bottom">Submit a link to at least one photo to publish your spot.</p>
                    <br />
                        <input className="input-box"
                            type='text'
                            value={preview}
                            placeholder='Preview Image URL'
                            onChange={(e) => setPreview(e.target.value)}
                            style={{width: "99%", height: "35px"}}
                            /><br/>
                        <input className="input-box"
                            type='text'
                            value={img}
                            placeholder='Image URL'
                            onChange={(e) => setImg(e.target.value)}
                            style={{width: "99%", height: "35px"}}
                            /> <br/>

                            <input className="input-box"
                            type='text'
                            value={img2}
                            placeholder='Image URL'
                            onChange={(e) => setImg2(e.target.value)}
                            style={{width: "99%", height: "35px"}}
                            /> <br/>
                            <input className="input-box"
                            type='text'
                            value={img3}
                            placeholder='Image URL'
                            onChange={(e) => setImg3(e.target.value)}
                            style={{width: "99%", height: "35px"}}
                            /> <br/>
                            <input className="input-box"
                            type='text'
                            value={img4}
                            placeholder='Image URL'
                            onChange={(e) => setImg4(e.target.value)}
                            style={{width: "99%", height: "35px"}}
                            /> <br/>
                    </label>
                {validationObj.previewLength && <p className={formType ? "hidden" : "imjErrors"}>{validationObj.previewLength}</p>}
                {validationObj.previewExtension && <p className={formType ? "hidden" : "imjErrors"}>{validationObj.previewExtension}</p>}
                {validationObj.imj && <p className={formType ? "hidden" : "imjErrors"}>{validationObj.imj}</p>}
                {/* {validationObj.imj && <p className={formType ? "hidden" : "imjErrors"}>{validationObj.imj}</p>}
                {validationObj.imj && <p className={formType ? "hidden" : "imjErrors"}>{validationObj.imj}</p>}
                {validationObj.imj && <p className={formType ? "hidden" : "imjErrors"}>{validationObj.imj}</p>} */}
                </div>
                {!formType && <hr style={{background: "black", height: "1px", width: "100%" }}/>}
                <button className={disabled ? "disabledBtn" : "finalizeBtn"} type="submit" disabled={disabled} style={{marginBottom: "5px", borderRadius: "10px"}}>{formType ? "Update Spot" : "Create Spot"}</button>
            </form>
        </div>
    )
}
