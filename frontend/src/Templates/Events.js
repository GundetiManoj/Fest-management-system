import React, { useContext, useState, useEffect } from 'react';
import './Events.css'
import { UserProvider } from '../App';
import { Redirect } from 'react-router-dom';

export default function Events() {
    const [events, setEvents] = useState([]);
    const { Loggedin , setLoggedin } = useContext(UserProvider);
    const printDateTime = (date, time) => {
        //console.log(date.split('T')[0]);
        const eventDate = new Date(`${date.split('T')[0]}T${time}`);
        return eventDate.toLocaleString();
    }
    useEffect(()=>{
        fetch('http://localhost:5002/getallevents',{
            headers : {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('sessionID')}`
            }
          })
        .then(response => response.json())
        .then(data => {
            setEvents(data)
            //console.log(data);
        })
    },[])
    return (
        <div className='Events'>
            <h1>Events</h1>
            {Loggedin == true ?<div className='Event-List'>
                {events.map((event) => {
                    return (
                        <a href={`/event/${event.id}`} key={event.id} className='Event-Card'>
                            <h2>{event.name}</h2>
                            <h3>Date: {printDateTime(event.date,event.time)}</h3>
                            {event.prize != null ? <h3>Prize Money: {event.prize} Rs.</h3> : null}
                            <p>{event.description}</p>
                            <button>More</button>
                        </a>
                    )
                })}
            </div>: < a href='/signin'><button>SignIn</button></a>}
        </div>
    );
}