import React from "react";
import axios from "axios";
import { UserProvider } from "../App";
import { useContext } from "react";
import { Redirect } from "react-router-dom";
import "./SignIn.css";

export default function SignIn(props) {
  const possType = ["student", "organizer","admin", "participant"];
  const [signInData, setSignInData] = React.useState({
    emailId: "",
    password: "",
    userType: "",
  });
  const { Loggedin, setLoggedin } = useContext(UserProvider);
  //const [forgot, setForgot] = React.useState(false);
  async function HandleSubmit(event) {
    event.preventDefault();
    console.log(signInData);
    axios
      .post("http://localhost:5002/login", signInData,{
        headers : {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('sessionID')}`
        }
      })
      .then(async (response) => {
        const user = response.data;
        localStorage.setItem("userId", user.user.id);
        localStorage.setItem("token", user.session.cookie.expires);
        localStorage.setItem("userType", signInData.userType);
        localStorage.setItem("sessionID", user.sessionID);
        setLoggedin(true);
        alert("Logged in successfully");
      })
      .catch((error) => {
        console.log(error);
        alert(error.response.data);
      });
  }

  function HandleChange(event) {
    const { name, value } = event.target;
    setSignInData((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  }
  if (Loggedin) {
      return <Redirect to="/profile" />;
  }
  /*if (forgot) {
    return (
      <div className="wrapper">
        <h2 className="forgot-login-header">Forgot password</h2>
        <div className="input-box">
          <span className="icon">
            <ion-icon name="mail"></ion-icon>
          </span>
          <input
            type="text"
            name="email"
            value={signInData.email}
            onChange={HandleChange}
            required
          />
          <label>Email</label>
        </div>
        <button 
          className="forgot-button"
          onClick={() => {
            axios
              .get(`http://localhost:5002/forgotpassword/${signInData.email}`,{
            headers : {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('sessionID')}`
            }
          })
              .then((response) => {
                alert("Password reset link has been sent to your email");
                setForgot(false);
              });
          }}
        >
          Submit
        </button>
      </div>
    );
  }*/
  return (
    <div className="wrapper">
      <form onSubmit={HandleSubmit} className="login-form">
        <h2 className="login-header">Login</h2>
        <div className="input-box">
          <span className="icon">
            <ion-icon name="mail"></ion-icon>
          </span>
          <label>Email</label>
          <input
            type="text"
            name="emailId"
            value={signInData.emailId}
            onChange={HandleChange}
            required
          />
        </div>
        <div className="input-box">
          <span className="icon">
            <ion-icon name="lock-closed"></ion-icon>
          </span>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={signInData.password}
            onChange={HandleChange}
            required
          />
        </div>
        <div className="input-box">
          <span className="icon">
            <ion-icon name="person"></ion-icon>
          </span>
          <select
            name="userType"
            value={signInData.userType}
            onChange={HandleChange}
            required
          >
            <option value="" disabled>
              Select User Type
            </option>
            {possType.map((type) => {
              return <option value={type}>{type}</option>;
            })}
          </select>
        </div>
        <button type="submit" className="button">
          Sign In
        </button>
        <div className="login-register">
          <p>
            Don't have an acccount?
            <a href="/signup">
              <button type="button">Sign Up</button>
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
