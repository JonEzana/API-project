import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector} from 'react-redux';
import { useHistory } from "react-router-dom";
import * as sessionActions from '../../store/session';
import { thunkGetCurrentUsersSpots } from "../../store/spots";
import './Navigation.css'
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const history = useHistory();
  // const currUserSpots = useSelector(state => state.CurrentUserSpots)
  // useEffect(() => {
  //   dispatch(thunkGetCurrentUsersSpots());
  // }, [dispatch])
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

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.thunkLogout());
  };

  const manage = async (e) => {
    e.preventDefault();
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
      <ul className={ulClassName} ref={ulRef}>
        <li>{user.username}</li>
        <li>{user.firstName} {user.lastName}</li>
        <li>{user.email}</li>
        <button onClick={manage}>Manage Spots</button>
        <button onClick={logout}>Log Out</button>
      </ul>
    </>
  );
}

export default ProfileButton;
