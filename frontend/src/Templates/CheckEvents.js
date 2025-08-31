import { UserProvider } from "../App";
import React, { useContext, useState, useEffect } from 'react';
import './CheckEvent.css';
import { Redirect } from 'react-router-dom';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import axios from 'axios';

export default function CheckEvent() {
    const { Loggedin, setLoggedin } = useContext(UserProvider);
    const [eventData, setEventData] = useState({});
    const [regevents, setRegevents] = useState([]);
    const [volevents, setVolevents] = useState([]);
    const [loading, setLoading] = useState(true);
    const printDateTime = (date, time) => {
        //console.log(date.split('T')[0]);
        const eventDate = new Date(`${date.split('T')[0]}T${time}`);
        return eventDate.toLocaleString();
    }
    const checkData = (eventarr,id) => {
        for(let i=0;i<eventarr.length;i++){
            if(eventarr[i].id === id){
                return true;
            }
        }
        return false;
    };
    const HandleClick = (eventId) => {
        axios.post('http://localhost:5002/registerasvolunteer', { eventId: eventId, userId: localStorage.getItem('userId') },{
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
    useEffect(() => {
        fetch(`http://localhost:5002/getallevents`,{
            headers : {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('sessionID')}`
            }
          })
            .then(response => response.json())
            .then(data => {
                //console.log(data);
                setEventData(data);
            }).catch(error => {
                console.log(error,'allev');
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
    if(!Loggedin) {
        return <button onClick={() => {window.location.href = '/signin'}}>Login to register</button>
    }
    if(Loggedin && (localStorage.getItem('userType') === 'admin' || localStorage.getItem('userType') === 'organizer')) {
        return <Redirect to='/'></Redirect>
    }
    if(loading || eventData.length === undefined){
        return <h1>Loading...</h1>
    }
    else{
        return (
            <div className='Event-check'>
                <h1>Events</h1>
                <div className="Event-List-check">
                    {eventData.map((event) => {
                        return (
                            <div className='Event-Card-check' key={event.id}>
                                <h2><a href={`/event/${event.id}`}>{event.name}</a></h2>
                                <h3>Date: {printDateTime(event.date,event.time)}</h3>
                                <div className="buttons">
                                    {checkData(regevents,event.id) ? <button disabled={true}>Registered as participant</button> : checkData(volevents,event.id) ? <button disabled={true}>Volunteering</button>: <button onClick={()=>HandleClick(event.id)}>Register as volunteer</button>}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }
}
