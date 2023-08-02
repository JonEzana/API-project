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

  return (
      <div className='nav-bar'>
          <NavLink exact to="/" style={{textDecoration: "none"}}>
            <div className="logo-btn" style={{display: "flex", flexDirection: "row", justifyContent: "center", marginLeft: "60px"}}>
              <i className="fa-brands fa-airbnb" style={{color: "#41BEE6", fontSize: "45px"}}></i>
              <div style={{color: "#41BEE6", textDecoration: "none", fontSize: "25px", alignSelf: "center", marginLeft: "5px"}}>fairdnd</div>
            </div>
          </NavLink>
          {sessionUser && <NavLink to="/spots/new" className="new-spot-link">
            Create a New Spot
          </NavLink>}
          {isLoaded && (
            <div className="prof-btn" style={{marginRight: "75px"}}>
              <ProfileButton user={sessionUser} />
            </div>
          )}
      </div>
  );
}

export default Navigation;
