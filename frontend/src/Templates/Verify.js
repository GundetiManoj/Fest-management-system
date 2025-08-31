import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Redirect } from "react-router-dom";

export default function Verify() {
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const a = useParams().id;

  useEffect(() => {
    axios
      .get(`http://localhost:5002/verify-email/${a}`,{
        headers : {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('sessionID')}`
        }
      })
      .then((res) => {
        setVerified(true);
      })
      .catch((err) => {
        setError(true);
        setErrorMessage(err.response.data);
      });
  }, [a]);
  if (verified === true && error === false) {
    return <Redirect to="/signin" />;
  }
  if (error === true) {
    return <h1>{errorMessage}</h1>;
  }
  return <h1>Verifying your email</h1>;
}
