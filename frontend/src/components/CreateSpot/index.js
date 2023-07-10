import React, {useEffect, useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { thunkAddImage, thunkCreateSpot, thunkGetCurrentUserSpots, thunkGetSingleSpot, thunkGetSpots, thunkUpdateSpot } from "../../store/spots";
import { useHistory } from "react-router-dom";
import './CreateSpot.css'

export const CreateSpot = ({spot, formType}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const allspots = useSelector(state => state.spots.allSpots);
    const currSpots = useSelector(state => state.spots.currentUserSpots);
    const singleSpot = useSelector(state => state?.spots?.singleSpot)
    const [address, setAddress] = useState(spot ? spot.address : '');
    const [city, setCity] = useState(spot ? spot.city : '');
    const [state, setState] = useState(spot ? spot.state : '');
    const [country, setCountry] = useState(spot ? spot.country : '');
    const [name, setName] = useState(spot ? spot.name : '');
    const [description, setDescription] = useState(spot ? spot.description : '');
    const [price, setPrice] = useState(spot ? spot.price : 0);
    const [preview, setPreview] = useState({url: '', status: true});
    const [img, setImg] = useState('');
    const [hidden, setHidden] = useState('')
    const [validationObj, setValidationObj] = useState({});

    useEffect(() => {
        const errObj = {};
        const extensions = ['png', 'jpg', 'jpeg'];

        if (address.length < 1) errObj.address = "Address is required";
        if (city.length < 3) errObj.city = "City is required";
        if (!state.length) errObj.state = "State is required";
        if (!country.length) errObj.country = "Country is required";
        if (!name.length || name.length > 49) errObj.name = "Name is required";
        if (description.length < 30) errObj.description = "Description needs a minimum of 30 characters";
        if (!price || price < 0) errObj.price = "Price per night is required";
        if (preview['url'].length < 1) errObj.previewImg = "At least one preview image is required";
        formType ? setHidden(true) : setHidden(false);
        if (!extensions.includes(preview['url'].split('.').slice(-1)[0])) errObj.previewUrl = "Image URLs must end in .png, .jpg, or .jpeg";
        if (!extensions.includes(img.split('.').slice(-1)[0])) errObj.img = "Image URLs must end in .png, .jpg, or .jpeg"

        setValidationObj(errObj);
    }, [address, city, state, country, name, description, price, preview])

    const handleSubmit = async(e) => {
        e.preventDefault();
        let previewImage;
        preview.url.length > 0 ? previewImage = preview.url : previewImage = null;
        let data = { address, city, state, country, name, description, price, previewImage};
        const imej = {url: img, preview: false}
        if (formType === "Update your Spot") {
            const oldSpot = await dispatch(thunkGetSingleSpot(spot.id));
            const currspots = await dispatch(thunkGetCurrentUserSpots());
            const allSpots = await dispatch(thunkGetSpots());
            const newData = {id: oldSpot.id};
            oldSpot.address === address ? newData.address = address : newData.address = oldSpot.address;
            oldSpot.city === city ? newData.city = city : newData.city = oldSpot.city;
            oldSpot.state === state ? newData.state = state : newData.state = oldSpot.state;
            oldSpot.country === country ? newData.country = country : newData.country = oldSpot.country;
            oldSpot.name === name ? newData.name = name : newData.name = oldSpot.name;
            oldSpot.description === description ? newData.description = description : newData.description = oldSpot.description;
            oldSpot.price === price ? newData.price = price : newData.price = oldSpot.price;
            oldSpot.previewImage === previewImage ? newData.previewImage = previewImage : newData.previewImage = oldSpot.previewImage;

            const nuSpot = await dispatch(thunkUpdateSpot({...newData}));
            if (nuSpot.id) {
                console.log('UPdate Spot Successful, heres nuSpot: ', nuSpot)
                await dispatch(thunkGetSingleSpot(nuSpot.id))
                history.push(`/spots/current`);
            }
        } else {
            const newSpot = await dispatch(thunkCreateSpot(data));
            const newnew = await dispatch(thunkGetSingleSpot(newSpot.id))
            if (newnew.id) {
                const nooo = await dispatch(thunkAddImage(imej, newnew));
                await dispatch(thunkGetSingleSpot(nooo.id))
                history.push(`/spots/${newnew.id}`);
            }
        }
    };

    // const onChangePrev = (e) => {
    //     setPreview({url: e.target.value, status: true})
    // };
    // const onChangeImg = (e) => {
    //     setImg(e.target.value)
    // };

    // const reset = () => {
    //     setAddress('');
    //     setCity('');
    //     setState('');
    //     setCountry('');
    //     setName('');
    //     setDescription('');
    //     setPrice(0);
    //     setPreview({url: '', status: false});
    //     setImg('');
    //     setValidationObj({});
    // };

    return (
        <div className="spot-form">
            <h2>{formType ? formType : "Create a new Spot"}</h2>
            <p className="top">Where's your place located?</p>
            <p className="bottom">Guests will only get your exact address once they've booked a reservation.</p>

        <form onSubmit={handleSubmit} className="form">
            <label for="country">
                Country
                <br />
                <input
                id="country"
                style={{width: "300px"}}
                    type='text'
                    value={country}
                    placeholder='Country'
                    onChange={e => setCountry(e.target.value)}
                />
            </label>
            {validationObj.country && <p className={!country.length && !address.length && !city.length && !state.length && !description.length && !name.length && !preview.url.length && !img.length ? "hidden errors" : "errors"}>{validationObj.country}</p>}

                <label for="stAddress">
                    Street Address
                    <br />
                    <input id="stAddress"
                        type='text'
                        style={{width: "300px"}}
                        value={address}
                        placeholder='Address'
                        onChange={e => setAddress(e.target.value)}
                    />
                {validationObj.address && <p className={!country.length && !address.length && !city.length && !state.length && !description.length && !name.length && !preview.url.length && !img.length ? "hidden errors" : "errors"}>{validationObj.address}</p>}
                </label>

                <label for="city">
                    City
                    <br />
                    <input id="city"
                        type='text'
                        style={{width: "300px"}}
                        value={city}
                        placeholder='City'
                        onChange={e => setCity(e.target.value)}
                    />
                </label>
                {validationObj.city && <p className={(!country.length && !address.length && !city.length && !state.length && !description.length && !name.length && !preview.url.length && !img.length) ? "hidden" : "errors"}>{validationObj.city}</p>}

                <label for="state">
                    State
                    <br />
                    <input className="state"
                        style={{width: "300px"}}
                        type='text'
                        value={state}
                        placeholder='STATE'
                        onChange={e => setState(e.target.value)}
                    />
                </label>
                {validationObj.state && <p className={!country.length && !address.length && !city.length && !state.length && !description.length && !name.length && !preview.url.length && !img.length ? "hidden errors" : "errors"}>{validationObj.state}</p>}

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
                        />
                </label>
                {validationObj.description && <p className={!country.length && !address.length && !city.length && !state.length && !description.length && !name.length && !preview.url.length && !img.length ? "hidden errors" : "errors"}>{validationObj.description}</p>}

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
                        />
                </label>
                {validationObj.name && <p className={!country.length && !address.length && !city.length && !state.length && !description.length && !name.length && !preview.url.length && !img.length ? "hidden errors" : "errors"}>{validationObj.name}</p>}

                <hr style={{background: "black", height: "1px", width: "100%" }}/>

                <label className="price">
                    <p className="top">Set a base price for your spot</p>
                    <p className="bottom">Competitive pricing can help your listing stand out and rank higher in search results.</p>
                <br />
                    <input className="input-box pricebox"
                        type='number'
                        value={price}
                        placeholder='Price per night (USD)'
                        onChange={e => setPrice(e.target.value)}
                        />
                </label>
                {validationObj.price && <p className={!country.length && !address.length && !city.length && !state.length && !description.length && !name.length && !preview.url.length && !img.length ? "hidden errors" : "errors"}>{validationObj.price}</p>}

                <hr style={{background: "black", height: "1px", width: "100%" }}/>
                <div className={hidden ? "hidden" : "imageurls"}>
                    <label className="img">
                        <p className="top">Liven up your spot with photos</p>
                        <p className="bottom">Submit a link to at least one photo to publish your spot.</p>
                    <br />
                        <input className="input-box"
                            type='text'
                            value={preview['url']}
                            placeholder='Preview Image URL'
                            onChange={(e) => setPreview({url: e.target.value})}
                            /><br/>
                        <input className="input-box"
                            type='text'
                            value={img}
                            placeholder='Image URL'
                            onChange={(e) => setImg(e.target.value)}
                            /> <br/>

                            <input className="input-box"
                            type='text'
                            value=""
                            placeholder='Image URL'
                            /> <br/>
                            <input className="input-box"
                            type='text'
                            value=""
                            placeholder='Image URL'
                            /> <br/>
                            <input className="input-box"
                            type='text'
                            value=""
                            placeholder='Image URL'
                            /> <br/>
                    </label>
                {validationObj.previewImg && <p className={!country.length && !address.length && !city.length && !state.length && !description.length && !name.length && !preview.url.length && !img.length ? "hidden errors" : "errors"}>{validationObj.previewImg}</p>}
                {(validationObj.previewUrl || validationObj.img) && <p className={!country.length && !address.length && !city.length && !state.length && !description.length && !name.length && !preview.url.length && !img.length ? "hidden errors" : "errors"}>{validationObj.previewUrl}</p>}
                <hr style={{background: "black", height: "1px", width: "100%" }}/>
                </div>
                <button className="finalizeBtn" type="submit">{formType ? "Update Spot" : "Create Spot"}</button>
            </form>
        </div>
    )
}
