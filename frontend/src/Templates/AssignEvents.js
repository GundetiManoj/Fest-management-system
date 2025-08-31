import "./AssignEvents.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { UserProvider } from "../App";
import { useContext } from "react";
import { Redirect } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function AssignEvents(props) {
    const userId = props.location.state.id;
    const { Loggedin, setLoggedin } = useContext(UserProvider);
    const [allData, setAllData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [assignData, setAssignData] = useState([]);
    const printDateTime = (date, time) => {
        //console.log(date.split('T')[0]);
        const eventDate = new Date(`${date.split('T')[0]}T${time}`);
        return eventDate.toLocaleString();
    }
    useEffect(() => {
        axios.get('http://localhost:5002/getallevents',{
            headers : {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('sessionID')}`
            }
          })
            .then(response => {
                setAllData(response.data);
            }).catch(error => {
                console.log(error);
            });
        axios.get(`http://localhost:5002/getassorg/${userId}`,{
            headers : {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('sessionID')}`
            }
          })
        .then(response => {
            setAssignData(response.data);
            console.log("assigndata:",response.data);
            setLoading(false);
        }).catch(error => {
            console.log(error);
        });
    }, []);
    if(!Loggedin) {
        return <a href='/signin'><button>Sign In</button></a>
    }
    if(localStorage.getItem('userType') !== 'admin'){
        console.log(localStorage.getItem('userType'));
        return <a href='/profile'><button>Profile</button></a>
    }
    if(loading || allData.length === 0){
        return <h1>Loading...</h1>
    }
    const HandleAssignEvent = (eventId,userId) => {
        axios.post('http://localhost:5002/setassevent', { eventId: eventId, userId: userId },{
            headers : {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('sessionID')}`
            }
          })
            .then(response => {
                alert('Event assigned successfully');
                window.location.reload();
            }).catch(error => {
                alert(error.response.data);
            })
    }
    const checkData = (eventarr,id) => {
        for(let i=0;i<eventarr.length;i++){
            if(eventarr[i].id === id){
                return false;
            }
        }
        return true;
    };
    return (
        <div className="AssignEvents">
            <h1>Assign Events</h1>
            <div className="AssignEvents-Options">
                {
                    allData.map((event) => {
                        return (
                            <div className="AssignEvent">
                                <h3>{event.name}</h3>
                                <h3>Date: {printDateTime(event.date,event.time)}</h3>
                                {checkData(assignData,event.id)? <button onClick={() => HandleAssignEvent(event.id,userId)}>Assign</button> : <button disabled={true}>Assigned</button>}
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}