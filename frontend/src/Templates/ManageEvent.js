import "./ManageEvent.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { UserProvider } from "../App";
import { useContext } from "react";
import { Redirect } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

export default function ManageEvent() {
    const { Loggedin, setLoggedin } = useContext(UserProvider);
    const userId = localStorage.getItem('userId');
    const [assignData, setAssignData] = useState([]);
    const [loading, setLoading] = useState(true);
    const printDateTime = (date, time) => {
        //console.log(date.split('T')[0]);
        const eventDate = new Date(`${date.split('T')[0]}T${time}`);
        return eventDate.toLocaleString();
    }
    useEffect(()=>{
        axios.get(`http://localhost:5002/getassorg/${userId}`,{
            headers : {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('sessionID')}`
            }
          })
        .then(response => {
            setAssignData(response.data);
            console.log(response.data);
            setLoading(false);
        }).catch(error => {
            console.log(error);
        });
    },[]);
    const checkTime = (date,time) => {
        const eventDate = new Date(`${date.split('T')[0]}T${time}`);
        const currDate = new Date();
        eventDate.setHours(eventDate.getHours() + 1);
        return eventDate < currDate;
    }

    if(!Loggedin) {
        return <a href='/signin'><button>Sign In</button></a>
    }
    if(localStorage.getItem('userType') !== 'organizer'){
        console.log(localStorage.getItem('userType'));
        return <a href='/profile'><button>Profile</button></a>
    }
    if(loading || assignData.length === 0){
        return <h1>Loading...</h1>
    }
    return (
            <div className='Events'>
                <h1>Events</h1>
                <div className='Event-List'>
                    {assignData.map((event) => {
                        return (
                            <div className='Event-card'>
                                <h2>{event.name}</h2>
                                <h3>Date: {printDateTime(event.date,event.time)}</h3>
                                {event.prize != null ? <h3>Prize Money: {event.prize} Rs.</h3> : null}
                                <p>{event.description}</p>
                                <Link to={{pathname:"/seelogistics",state: {id:event.id}}}><button>See Logistics</button></Link>
                                {checkTime(event.date,event.time) ? <Link to={{pathname:"/addwinners",state: {id:event.id}}}><button>Add Winners</button></Link>: <p>Event not yet finished</p>}
                            </div>
                        )
                    })}
                </div>
            </div>
        );
}