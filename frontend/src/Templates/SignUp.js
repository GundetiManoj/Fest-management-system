import React from "react";
import "./SignUp.css";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { useContext } from "react";
import { UserProvider } from "../App";

export default function SignUp() {
  const possType = ["student", "organizer", "participant"];
  const { Loggedin } = useContext(UserProvider);
  const [flag, setflag] = React.useState(false);
  const [error1, seterror1] = React.useState(false);
  const [error2, seterror2] = React.useState(false);
  const [error3, seterror3] = React.useState(false);
  const [error4, seterror4] = React.useState(false);
  const [error5, seterror5] = React.useState(false);
  const [isDisabled, setIsDisabled] = React.useState(false);
  const [signUpData, setSignUpData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    college: "",
    userType: "",
  });

  async function HandleSubmit(event) {
    event.preventDefault();
    if (error1 || error2 || error3 || error4 || error5) {
      alert("Password does not match the requirements");
      return;
    }
    if (flag) {
      alert("Passwords do not match");
    } else {
        //console.log(signUpData);
      await axios
        .post("http://localhost:5002/register", signUpData,{
          headers : {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('sessionID')}`
          }
        })
        .then((response) => {
          console.log(response);
          alert("Registered Successfully , Please verify your email");
        })
        .catch((error) => {
          //console.log(error)
          alert(error.response.data);
        });
    }
    //console.log(signUpData);
  }

  function HandleChange(event) {
    const { name, value } = event.target;
    setSignUpData((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
    if (name === "userType"){
        if(value === "participant"){
            setIsDisabled(false);
            setSignUpData((prevValue) => {
              return {
                ...prevValue,
                college: "",
              };
            });
        }
        else if(value === "organizer"){
            setIsDisabled(true);
            setSignUpData((prevValue) => {
                return {
                  ...prevValue,
                  college: "",
                };
              });
        }
        else if(value === "student"){
            setIsDisabled(true);
            setSignUpData((prevValue) => {
                return {
                  ...prevValue,
                  college: "IIT Kharagpur",
                };
              });
        }
    }
    if (name === "password") {
      if (value.length < 8) {
        seterror1(true);
      } else {
        seterror1(false);
      }
      if (!value.match(/[A-Z]/)) {
        seterror2(true);
      } else {
        seterror2(false);
      }
      if (!value.match(/[a-z]/)) {
        seterror3(true);
      } else {
        seterror3(false);
      }
      if (!value.match(/[0-9]/)) {
        seterror4(true);
      } else {
        seterror4(false);
      }
      if (!value.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)) {
        seterror5(true);
      } else {
        seterror5(false);
      }
    }
    if (name === "confirmPassword" && value !== signUpData.password) {
      setflag(true);
    } else if (name === "confirmPassword" && value === signUpData.password) {
      setflag(false);
    }
  }
  if (Loggedin) {
    return <Redirect to="/" />;
  }

  return (
    <div className="wrapper">
      <form onSubmit={HandleSubmit} className="login-form">
        <h2 className="login-header">Register</h2>
        <div className="input-box">
          <span className="icon">
            <ion-icon name="happy"></ion-icon>
          </span>
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={signUpData.firstName}
            onChange={HandleChange}
            required
          />
        </div>
        <div className="input-box">
          <span className="icon">
            <ion-icon name="happy"></ion-icon>
          </span>
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={signUpData.lastName}
            onChange={HandleChange}
            required
          />
        </div>
        <div className="input-box">
          <span className="icon">
            <ion-icon name="mail"></ion-icon>
          </span>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={signUpData.email}
            onChange={HandleChange}
            required
          />
        </div>
        <div className="input-box">
            <span className="icon">
                <ion-icon name="people"></ion-icon>
            </span>
            <label>User Type</label>
            <select
                name="userType"
                value={signUpData.userType}
                onChange={HandleChange}
                required
            >
                <option value="" disabled>
                Select User Type
                </option>
                {possType.map((type) => {
                return <option value={type}>{type}</option>;
                }
                )}
            </select>
        </div>
        <div className="input-box">
            <span className="icon">
                <ion-icon name="school"></ion-icon>
            </span>
            <label>College</label>
            <input
                type="text"
                name="college"
                value={signUpData.college}
                onChange={HandleChange}
                disabled={isDisabled}
                required
            />
        </div>
        {error1 && (
          <p className="error">Password should be of minimum 8 characters</p>
        )}
        {error2 && (
          <p className="error">
            Password should contain atleast one uppercase character
          </p>
        )}
        {error3 && (
          <p className="error">
            Password should contain atleast one lowercase character
          </p>
        )}
        {error5 && (
          <p className="error">
            Password should contain atleast one special character
          </p>
        )}
        {error4 && (
          <p className="error">Password should contain atleast one number</p>
        )}
        <div className="input-box">
          <span className="icon">
            <ion-icon name="lock-closed"></ion-icon>
          </span>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={signUpData.password}
            onChange={HandleChange}
            required
          />
        </div>
        {flag && <p className="error">Passwords do not match</p>}
        <div className="input-box">
          <span className="icon">
            <ion-icon name="bag-check"></ion-icon>
          </span>
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={signUpData.confirmPassword}
            onChange={HandleChange}
            required
          />
        </div>
        <button type="submit" className="button">
          Sign Up
        </button>
      </form>
    </div>
  );
}
