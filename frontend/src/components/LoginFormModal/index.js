import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const [disabled, setDisabled] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.thunkLogin({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const handleDemo = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.thunkLogin({ credential: "Demo-lition", password: "password" }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  }

  useEffect(() => {
    if (credential.length >= 4 && password.length >= 6) setDisabled(false);
    else setDisabled(true);
  }, [credential, password])

  return (
    <div className="loginmodal">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label className="label">
          <input
          className="input"
            type="text"
            placeholder="Username or Email"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label className="label">
          <input
          className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && (
          <p className="valErr">{errors.credential}</p>
        )}
        <button disabled={disabled} className={disabled ? "submit" : "submit enabled"} type="submit">Log In</button>
        <button className="demoUser" onClick={handleDemo}>Log in as Demo User</button>
      </form>
    </div>
  );
}

export default LoginFormModal;
