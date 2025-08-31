import "./EditAny.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { UserProvider } from "../App";
import { useContext } from "react";
import { Redirect } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function EditAny() {
    const { Loggedin, setLoggedin } = useContext(UserProvider);
    const {name} = useParams();

    if(!Loggedin) {
        return <a href='/signin'><button>Sign In</button></a>
    }
    if(localStorage.getItem('userType') !== 'admin'){
        console.log(localStorage.getItem('userType'));
        return <a href='/profile'><button>Profile</button></a>
    }
    return (
        <div className="EditAny">
            <h1>Edit {name}</h1>
            <div className="EditAny-Options">
                <a href={`/add/${name}`}><button>Add {name}</button></a>
                <a href={`/edit/${name}`}><button>Edit {name}</button></a>
            </div>
        </div>
    )
}