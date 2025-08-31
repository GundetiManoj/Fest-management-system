import React, { useContext, useState, useEffect } from 'react';
import './Event.css';
import { UserProvider } from '../App';
import { Redirect } from 'react-router-dom';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import axios from 'axios';

export default function Event() {
    const { Loggedin, setLoggedin } = useContext(UserProvider);
    const [eventData, setEventData] = useState({});
    const [regevents, setRegevents] = useState([]);
    const [volevents, setVolevents] = useState([]);
    const eventId = useParams().id;
    const [loading, setLoading] = useState(true);
    const HandleClick = () => {
        axios.post('http://localhost:5002/registerforevent', { eventId: eventId, userId: localStorage.getItem('userId') },{
            headers : {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('sessionID')}`
            }
          })
            .then(response => {
                alert('Registered successfully');
                window.location.reload();
                })
            .catch(error => {
                alert(error.response.data);
            })
    }
    const checkData = (eventarr,id) => {
        for(let i=0;i<eventarr.length;i++){
            if(eventarr[i].id === id){
                return true;
            }
        }
        return false;
    };
    /*if(!Loggedin) {
        return <Redirect to='/login' />
    }
    if(Loggedin && (localStorage.getItem('role') === 'admin' || localStorage.getItem('role') === 'organizer')) {
        return <Redirect to='/'></Redirect>
    }*/
    useEffect(() => {
        fetch(`http://localhost:5002/geteventdetails/${eventId}`,{
            headers : {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('sessionID')}`
            }
          })
            .then(response => response.json())
            .then(data => {
                setEventData(data[0]);
            })
            .catch(error => {
                console.log(error);
            });
        fetch(`http://localhost:5002/getalleventregistrations/${localStorage.getItem('userId')}`,{
            headers : {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('sessionID')}`
            }
          })
            .then(response => response.json())
            .then(data => {
                setRegevents(data);
            }).catch(
                error => {
                    console.log(error,'regev');
                }
            );
        axios.get(`http://localhost:5002/viewalleventsforvolunteer/${localStorage.getItem('userId')}`,{
            headers : {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('sessionID')}`
            }
          })
            .then((data) => {
                setVolevents(data.data);
                //console.log(data.data);
                setLoading(false);
            }).catch((err) => {
                console.log(err,'volev');
            });
    }, []);

    const printDateTime = (date, time) => {
        const eventDate = new Date(`${date}T${time}`);
        return eventDate.toLocaleString();
    }
    if(loading || eventData.date === undefined){
        return <h1>Loading...</h1>
    }
    else{
        let leaderboardVisible = false;
        let registrationActive = false;
        console.log(eventData);
                const eventStartTime = new Date(`${eventData.date.split('T')[0]}T${eventData.time}`);

                const currentTime = new Date();

                const registrationEndTime = new Date(eventStartTime);
                registrationEndTime.setHours(registrationEndTime.getHours() - 1); 
                const leaderboardActivationTime = new Date(eventStartTime);
                leaderboardActivationTime.setHours(leaderboardActivationTime.getHours() + 1); 

                if (currentTime < registrationEndTime) {
                    leaderboardVisible = false;
                    registrationActive = true;
                } else if (currentTime >= registrationEndTime && currentTime < eventStartTime) {
                    leaderboardVisible = false;
                    registrationActive = false;
                } else if ( currentTime > leaderboardActivationTime) {
                    leaderboardVisible = true;
                    registrationActive = false;
                }
    return (
        <div className='Event'>
            <h1>{eventData.name}</h1>
            <h3>Time: {printDateTime(eventData.date.split('T')[0], eventData.time)}</h3>
            <h3>Location: {eventData.location}</h3>
            {eventData.prizeMoney && <h3>Prize Money: {eventData.prizeMoney} Rs.</h3>}
            <p>{eventData.description}</p>
            {registrationActive ? (
                checkData(regevents,eventData.id) ? <button disabled={true}>Registered as participant</button> : checkData(volevents,eventData.id) ? <button disabled={true}>Volunteering</button>: <button onClick={HandleClick}>Register</button>
            ) : (
                <p>Registration has closed.</p>
            )}
            {leaderboardVisible ? <a href={`/leaderboard/${eventData.id}`}><button>View Leaderboard</button></a> : <p>Leaderboard will be visible after the event ends.</p>}
        </div>
    );
            }
}
