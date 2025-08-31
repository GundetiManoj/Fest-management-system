import { UserProvider } from "../App";
import { useContext, useState, useEffect } from "react";
import axios from 'axios';
import './Profile.css'
import { Redirect } from "react-router-dom";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";


export default function Profile() {
    const { Loggedin, setLoggedin } = useContext(UserProvider);
    const [profileData, setProfileData] = useState({});
    const userId = localStorage.getItem('userId');
    const [loading, setLoading] = useState(true);
    const [registeredEvents, setRegisteredEvents] = useState([]);
    const Handlevol = () => {
        axios.post('http://localhost:5002/setasvolunteer', { userId: userId },{
            headers : {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('sessionID')}`
            }
          })
            .then(response => {
                alert('Registered for volunteer successfully');
                window.location.reload();
                })
            .catch(error => {
                alert(error.response.data);
            })
    };
    const HandleLogout = () => {
        localStorage.clear();
        setLoggedin(false);
        alert('Logged out successfully');
    };
    useEffect(() => {
        axios.get(`http://localhost:5002/getuserinfo/${userId}`,{
            headers : {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('sessionID')}`
            }
          })
            .then(response => {
                setProfileData(response.data[0]);
                console.log(response.data[0]);
                
            }).catch(error => {
                console.log(error);
            });
        axios.get(`http://localhost:5002/getalleventregistrations/${userId}`,{
            headers : {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('sessionID')}`
            }
          })
            .then((res) => {
                setRegisteredEvents(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    if(!Loggedin) {
        return <Redirect to='/signin' />
    }
    if(loading){
        return <h1>Loading...</h1>
    }

    if(userId > 1000 && userId <= 2000){
        return (
            <div className='Profile'>
                <h1>Profile</h1>
                <div>
                    <h2>Name: {profileData.firstname + ' ' + profileData.lastname}</h2>
                    <h3>Email: {profileData.emailid}</h3>
                    <h3>College: IIT Kharagpur</h3>
                    <h3>Role: Student</h3>
                    <h3>Events Registered: </h3>
                    <ul>
                        {registeredEvents.map((event) => (
                            <li key={event.id}>
                                <h4><a href={`/event/${event.id}`}>{event.name}</a></h4>
                            </li>
                        ))}
                    </ul>
                    <div className="buttons">
                        {profileData.isvolunteer ? (
                            <a href="/checkevents"><button className="check-events">Check events</button></a>
                        ) : (
                            <button className="register-button" onClick={Handlevol}>Register for volunteer</button>
                        )}
                        <button className="delete-button">Delete Account</button>
                        <button className="logout" onClick={HandleLogout}>Logout</button>
                    </div>
                </div>
            </div>
        )
    }
    else if(userId > 2000 && userId <= 3000){
        return (
            <div className='Profile'>
                <h1>Profile</h1>
                <div>
                    <h2>Name: {profileData.firstname + ' ' + profileData.lastname}</h2>
                    <h3>Email: {profileData.emailid}</h3>
                    <h3>College: {profileData.college}</h3>
                    <h3>Role: External Participant</h3>
                    <h3>Accommodation: {'Room Number '+profileData.roomnumber + ' in ' + profileData.guesthousename}</h3>
                    <h3>Events Registered: </h3>
                    <ul>
                        {registeredEvents.map((event) => (
                            <li key={event.id}>
                                <h4><a href={`/event/${event.id}`}>{event.name}</a></h4>
                            </li>
                        ))}
                    </ul>
                    <div className="buttons">
                        <button className="delete-button">Delete Account</button>
                        <button className="logout" onClick={HandleLogout}>Logout</button>
                    </div>
                </div>
            </div>
        )
    }
    else if(userId > 3000 && userId <= 4000){
        return (
            <div className='Profile'>
                <h1>Profile</h1>
                <div>
                    <h2>Name: {profileData.firstname + ' ' + profileData.lastname}</h2>
                    <h3>Email: {profileData.emailid}</h3>
                    <h3>Role: Organizer</h3>
                    <h3>Type: {profileData.organisertype}</h3>
                    <div className="buttons">
                        <button className="delete-button">Delete Account</button>
                        <button className="logout" onClick={HandleLogout}>Logout</button>
                    </div>
                </div>
            </div>
        )
    }
    else {
        return (
            <div className='Profile'>
                <h1>Profile</h1>
                <div>
                    <h2>Name: {profileData.firstname + ' ' + profileData.lastname}</h2>
                    <h3>Email: {profileData.emailid}</h3>
                    <h3>Role: Admin</h3>
                    <div className="buttons">
                        <button className="delete-button">Delete Account</button>
                        <button className="logout" onClick={HandleLogout}>Logout</button>
                    </div>
                </div>
            </div>
        )
    }
}
