import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import {LandingPage} from "./components/LandingPage"
import { SpotsIndex } from "./components/SpotsIndex";
import { SpotShow } from "./components/SpotShow";
import { CreateSpot } from "./components/CreateSpot";
import { UpdateSpot } from "./components/UpdateSpot";
import { ManageSpots } from './components/ManageSpots';
import { CreateReviewModal } from "./components/CreateReviewModal";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.thunkRestoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <React.Fragment>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Switch>
          <Route exact path='/'>
            <SpotsIndex />
          </Route>
          <Route exact path='/spots/new'>
            <CreateSpot />
          </Route>
          <Route exact path='/spots/current'>
            <ManageSpots />
          </Route>
          <Route exact path='/spots/:spotId'>
            <SpotShow/>
          </Route>
          <Route exact path='/spots/:spotId/edit'>
            <UpdateSpot />
          </Route>
          <Route exact path='/spots/:spotId/reviews'>
            <CreateReviewModal />
          </Route>
        </Switch>}
    </React.Fragment>
  );
}

export default App;
