import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  useEffect(() => {
    if (email.length && username.length >= 4 && firstName.length && lastName.length && password.length >= 6 && confirmPassword.length >= 6) setDisabled(false);
    else setDisabled(true);
  }, [email, username, password, firstName, lastName, confirmPassword]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.thunkSignUp({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };


  return (
    <div className="signup">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
      <label>
          <input
          placeholder="First Name"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            style={{width: "90%", height: "30px", borderRadius: "10px"}}
          />
        </label>
        {errors.firstName && <p className="errors">{errors.firstName}</p>}
        <label>
          <input
          placeholder="Last Name"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            style={{width: "90%", height: "30px", borderRadius: "10px"}}
          />
        </label>
        {errors.lastName && <p className="errors">{errors.lastName}</p>}
        <label>
          <input
          placeholder="Email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{width: "90%", height: "30px", borderRadius: "10px"}}
          />
        </label>
        {errors.email && <p className="errors">{errors.email}</p>}
        <label>
          <input
          placeholder="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{width: "90%", height: "30px", borderRadius: "10px"}}
          />
        </label>
        {errors.username && <p className="errors">{errors.username}</p>}

        <label>
          <input
          placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{width: "90%", height: "30px", borderRadius: "10px"}}
          />
        </label>
        {errors.password && <p className="errors">{errors.password}</p>}
        <label>
          <input
          placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{width: "90%", height: "30px", borderRadius: "10px"}}
          />
        </label>
        {errors.confirmPassword && (
          <p className="errors">{errors.confirmPassword}</p>
        )}
        <button disabled={disabled} type="submit" className={disabled ? "signup-btn" : "signup-enabled"} style={{borderRadius: "10px"}}>Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;
