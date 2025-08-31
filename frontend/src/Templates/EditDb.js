import "./EditDb.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { UserProvider } from "../App";
import { useContext } from "react";
import { Redirect } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

export default function EditDb() {
    const { Loggedin, setLoggedin } = useContext(UserProvider);
    if(!Loggedin) {
        return <a href='/signin'><button>Sign In</button></a>
    }
    if(localStorage.getItem('userType') !== 'admin'){
        console.log(localStorage.getItem('userType'));
        return <a href='/profile'><button>Profile</button></a>
    }
    return (
        <div className="EditDb">
            <h1>Edit Database</h1>
            <div className="EditDb-Options">
                <a href="/manage/organizers"><button>Manage Organizers</button></a>
                <a href="/manage/students"><button>Manage Students</button></a>
                <a href="/manage/participants"><button>Manage Participants</button></a>
                <a href="/manage/events"><button>Manage Events</button></a>
                <a href="/manage/admins"><button>Manage Admins</button></a>
            </div>
        </div>
    )
}
