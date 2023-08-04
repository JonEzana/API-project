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
  };

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
            style={{borderRadius: "10px"}}
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
            style={{borderRadius: "10px"}}
          />
        </label>
        {errors.credential && (
          <p className="valErr">{errors.credential}</p>
        )}
        <button disabled={disabled} className={disabled ? "submit" : "submit enabled"} type="submit" style={{borderRadius: "10px"}}>Log In</button>
        <button className="demoUser" onClick={handleDemo} style={{borderRadius: "10px"}}>Log in as Demo User</button>
        {/* <hr style={{backgroundColor: "black", width: "100%", height: "1px"}} dataContent="or"></hr> */}
        <p className="hrOr">or</p>
      </form>
      <div style={{display: "flex", flexDirection: "column", gap: "14px", textAlign: "center", marginTop: "5px"}}>
        <div className="externalLinksDiv" style={{display: "flex", flexDirection: "row", alignItems: "center", borderRadius: "8px", justifyContent: "center", gap: "10px"}}>
          <i className="fa-brands fa-facebook" style={{color: "#1361e7"}}></i>
          <a className="external-links" href="https://www.facebook.com/login/">Continue with Facebook</a>
        </div>
        <div className="externalLinksDiv" style={{display: "flex", flexDirection: "row", alignItems: "center", borderRadius: "8px", justifyContent: "center", gap: "10px"}}>
          <img src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-icon-png-transparent-background-osteopathy-16.png" style={{heigt: "15px", width: "15px"}}></img>
          <a className="external-links" href="https://accounts.google.com/v3/signin/identifier?ifkv=AXo7B7VEEcb1Ctp_uR-SAn5h10mreS4RHvlLTmx0tZaHiW2-MEOUfNcovW3HXcgW4itOPjZuNYgckA&flowName=GlifWebSignIn&flowEntry=ServiceLogin&dsh=S-653753290%3A1691081876573395">Continue with Google</a>
        </div>
        <div className="externalLinksDiv" style={{display: "flex", flexDirection: "row", alignItems: "center", borderRadius: "8px", justifyContent: "center", gap: "12px"}}>
          <i className="fa-brands fa-apple" style={{color: "#000000", marginLeft: "2px"}}></i>
          <a className="external-links" href="https://apple.com">Continue with Apple</a>
        </div>
      </div>
    </div>
  );
}

export default LoginFormModal;
