import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector} from 'react-redux';
import { useHistory } from "react-router-dom";
import * as sessionActions from '../../store/session';
import { thunkGetCurrentUsersSpots } from "../../store/spots";
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './Navigation.css'

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.thunkLogout());
    closeMenu()
    history.push('/')
  };

  const manage = async (e) => {
    e.preventDefault();
    closeMenu();
    // await dispatch(thunkGetCurrentUsersSpots());
    history.push('/spots/current')
  }

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button onClick={openMenu} className='profile-button'>
          <i className="fa-solid fa-bars"></i>
          <i className="fas fa-user-circle" />
        </button>
      <div className="dropdown">
        <ul className={ulClassName} ref={ulRef}>
          { user ? (
            <div className="dropdown-content loggedin">
              <p className="hello">Hello, {user.firstName}!</p>
              <p className="email">{user.email}</p>
              <hr style={{background: "black", height: "1px", width: "100%" }}/>

              <button className="manage-btn" onClick={manage}>Manage Spots</button>
              <hr style={{background: "black", height: "1px", width: "100%" }}/>

              <button className="logout-btn" onClick={logout}>Log Out</button>
            </div>
          ) : (
            <div className="dropdown-content loggedout">
              <li className="li">
              <OpenModalMenuItem
                itemText="Log In"
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
                style={{border: "none", borderRadius: "5px", width: "90%"}}
                />
              </li>
              <li className="li">

              <OpenModalMenuItem
                itemText="Sign Up"
                onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
                style={{border: "none", borderRadius: "5px", width: "90%"}}
                />
                </li>
            </div>
        )}
        </ul>
      </div>
    </>
  );
}

export default ProfileButton;
