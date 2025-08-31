import "./SeeLogistics.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { UserProvider } from "../App";
import { useContext } from "react";
import { Redirect } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function SeeLogistics(props) {
    const {Loggedin, setLoggedin} = useContext(UserProvider);
    const eventId = props.location.state.id;
    const [participantdata, setParticipantdata] = useState([]);
    const [loading, setLoading] = useState(true);
    const [volunteerdata, setVolunteerdata] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:5002/getallparticipants/${eventId}`,{
            headers : {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('sessionID')}`
            }
          })
            .then(response => {
                setParticipantdata(response.data);
                console.log(response.data);
            }).catch(error => {
                console.log(error);
            });
        axios.get(`http://localhost:5002/getallvolunteers/${eventId}`,{
            headers : {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('sessionID')}`
            }
          })
            .then(response => {
                setVolunteerdata(response.data);
                console.log(response.data);
                setLoading(false);
            }).catch(error => {
                console.log(error);
            });
    }, []);
    if(!Loggedin) {
        return <a href='/signin'><button>Sign In</button></a>
    }
    if(localStorage.getItem('userType') !== 'organizer'){
        console.log(localStorage.getItem('userType'));
        return <a href='/profile'><button>Profile</button></a>
    }
    if(loading){
        return <h1>Loading...</h1>
    }
    //diplay in table format
    return (
        <div className='Logistics'>
            <h1>Logistics</h1>
            <div className='Participant-List'>
                <h2>Participants</h2>
                {participantdata.length === 0 ? <h3>No participants</h3> : 
                <table>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                    </tr>
                    {participantdata.map((participant) => {
                        return (
                            <tr>
                                <td>{participant.firstname + ' ' + participant.lastname}</td>
                                <td>{participant.emailid}</td>
                            </tr>
                        )
                    })}
                </table>
                }
            </div>
            <div className='Volunteer-List'>
                <h2>Volunteers</h2>
                {volunteerdata.length === 0 ? <h3>No volunteers</h3> :
                <table>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                    </tr>
                    {volunteerdata.map((volunteer) => {
                        return (
                            <tr>
                                <td>{volunteer.firstname + ' ' + volunteer.lastname}</td>
                                <td>{volunteer.emailid}</td>
                            </tr>
                        )
                    })}
                </table>
                }
            </div>
        </div>
    );
}