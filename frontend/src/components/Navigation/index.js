import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
        <ProfileButton user={sessionUser} />
    );
  } else {
    sessionLinks = (
      <li>
        <OpenModalButton
          buttonText="Log In"
          modalComponent={<LoginFormModal />}
        />
        <OpenModalButton
          buttonText="Sign Up"
          modalComponent={<SignupFormModal />}
        />
      </li>
    );
  }

  return (
    <>
      <div className='nav-bar'>
          <NavLink exact to="/">
            <div className="logo-btn">
              <i className="fa-brands fa-airbnb"> fairdnd</i>
            </div>
          </NavLink>
          {sessionUser && <NavLink to="/spots/new" className="new-spot-link">
            Create a New Spot
          </NavLink>}
        {isLoaded && sessionLinks}
      </div>
    </>
  );
}

export default Navigation;
